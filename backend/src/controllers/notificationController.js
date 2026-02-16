import Notification from "../models/Notification.js";
import UserNotification from "../models/UserNotification.js";
import User from "../models/User.js";

// ============================================
// ADMIN ENDPOINTS
// ============================================

/**
 * @desc    Create a new notification (admin)
 * @route   POST /api/notifications/admin
 * @access  Admin
 */
export async function createNotification(req, res) {
  try {
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: "Title and message are required" });
    }

    if (title.length > 200) {
      return res.status(400).json({ message: "Title cannot exceed 200 characters" });
    }
    if (message.length > 5000) {
      return res.status(400).json({ message: "Message cannot exceed 5000 characters" });
    }

    const notification = await Notification.create({
      title: title.trim(),
      message: message.trim(),
      createdBy: req.admin?.username || "admin",
      isActive: true,
    });

    // Create UserNotification records for all active (non-archived) users
    const users = await User.find({ isArchived: { $ne: true } }).select("_id");
    if (users.length > 0) {
      const userNotifications = users.map((u) => ({
        user: u._id,
        notification: notification._id,
        isRead: false,
      }));
      await UserNotification.insertMany(userNotifications, { ordered: false }).catch(() => {
        // Ignore duplicate key errors in case of race conditions
      });
    }

    // Emit real-time event to connected users via Socket.IO
    const io = req.app.get("io");
    if (io) {
      const room = io.sockets.adapter.rooms.get("authenticated_users");
      const socketCount = room ? room.size : 0;
      console.log(`[Notification] Emitting new_notification to authenticated_users room (${socketCount} socket(s))`);

      io.to("authenticated_users").emit("new_notification", {
        _id: notification._id,
        title: notification.title,
        message: notification.message,
        createdAt: notification.createdAt,
        createdBy: notification.createdBy,
        isActive: notification.isActive,
        isRead: false,
      });
    } else {
      console.warn("[Notification] Socket.IO instance not found on app – real-time emit skipped");
    }

    res.status(201).json(notification);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ message: "Error creating notification", error: error.message });
  }
}

/**
 * @desc    Get all notifications (admin)
 * @route   GET /api/notifications/admin
 * @access  Admin
 */
export async function getAllNotifications(req, res) {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications", error: error.message });
  }
}

/**
 * @desc    Toggle notification active status (admin)
 * @route   PATCH /api/notifications/admin/:id/toggle
 * @access  Admin
 */
export async function toggleNotification(req, res) {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.isActive = !notification.isActive;
    await notification.save();

    res.json(notification);
  } catch (error) {
    console.error("Error toggling notification:", error);
    res.status(500).json({ message: "Error toggling notification", error: error.message });
  }
}

/**
 * @desc    Delete a notification (admin)
 * @route   DELETE /api/notifications/admin/:id
 * @access  Admin
 */
export async function deleteNotification(req, res) {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Remove all related UserNotification records
    await UserNotification.deleteMany({ notification: notification._id });
    await notification.deleteOne();

    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Error deleting notification", error: error.message });
  }
}

// ============================================
// USER ENDPOINTS
// ============================================

/**
 * @desc    Get notifications for the current user (paginated)
 * @route   GET /api/notifications
 * @access  Protected (logged-in users)
 */
export async function getUserNotifications(req, res) {
  try {
    const userId = req.user._id;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(20, Math.max(1, parseInt(req.query.limit) || 5));
    const skip = (page - 1) * limit;

    // Ensure UserNotification records exist for any new notifications the user doesn't have yet
    const existingNotifIds = await UserNotification.find({ user: userId }).distinct("notification");
    const missingNotifications = await Notification.find({
      _id: { $nin: existingNotifIds },
      isActive: true,
    }).select("_id");

    if (missingNotifications.length > 0) {
      const newRecords = missingNotifications.map((n) => ({
        user: userId,
        notification: n._id,
        isRead: false,
      }));
      await UserNotification.insertMany(newRecords, { ordered: false }).catch(() => {});
    }

    // Fetch user notifications (only active ones)
    const total = await UserNotification.countDocuments({ user: userId })
      .populate ? undefined : undefined; // We'll count with a pipeline

    // Use aggregation to filter by active notifications
    const pipeline = [
      { $match: { user: userId } },
      {
        $lookup: {
          from: "notifications",
          localField: "notification",
          foreignField: "_id",
          as: "notificationData",
        },
      },
      { $unwind: "$notificationData" },
      { $match: { "notificationData.isActive": true } },
      { $sort: { "notificationData.createdAt": -1 } },
    ];

    const totalDocs = await UserNotification.aggregate([...pipeline, { $count: "total" }]);
    const totalCount = totalDocs.length > 0 ? totalDocs[0].total : 0;

    const results = await UserNotification.aggregate([
      ...pipeline,
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          isRead: 1,
          readAt: 1,
          createdAt: 1,
          notification: {
            _id: "$notificationData._id",
            title: "$notificationData.title",
            message: "$notificationData.message",
            createdAt: "$notificationData.createdAt",
            createdBy: "$notificationData.createdBy",
          },
        },
      },
    ]);

    // Count unread
    const unreadCount = await UserNotification.aggregate([
      ...pipeline,
      { $match: { isRead: false } },
      { $count: "total" },
    ]);

    res.json({
      notifications: results,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
      unreadCount: unreadCount.length > 0 ? unreadCount[0].total : 0,
    });
  } catch (error) {
    console.error("Error fetching user notifications:", error);
    res.status(500).json({ message: "Error fetching notifications", error: error.message });
  }
}

/**
 * @desc    Get unread notification count
 * @route   GET /api/notifications/unread-count
 * @access  Protected
 */
export async function getUnreadCount(req, res) {
  try {
    const userId = req.user._id;

    const pipeline = [
      { $match: { user: userId, isRead: false } },
      {
        $lookup: {
          from: "notifications",
          localField: "notification",
          foreignField: "_id",
          as: "notificationData",
        },
      },
      { $unwind: "$notificationData" },
      { $match: { "notificationData.isActive": true } },
      { $count: "total" },
    ];

    const result = await UserNotification.aggregate(pipeline);
    const count = result.length > 0 ? result[0].total : 0;

    res.json({ unreadCount: count });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    res.status(500).json({ message: "Error fetching unread count", error: error.message });
  }
}

/**
 * @desc    Mark a notification as read
 * @route   PATCH /api/notifications/:id/read
 * @access  Protected
 */
export async function markAsRead(req, res) {
  try {
    const userId = req.user._id;
    const userNotification = await UserNotification.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!userNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (!userNotification.isRead) {
      userNotification.isRead = true;
      userNotification.readAt = new Date();
      await userNotification.save();
    }

    res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Error marking notification", error: error.message });
  }
}

/**
 * @desc    Mark all notifications as read
 * @route   PATCH /api/notifications/read-all
 * @access  Protected
 */
export async function markAllAsRead(req, res) {
  try {
    const userId = req.user._id;

    await UserNotification.updateMany(
      { user: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all as read:", error);
    res.status(500).json({ message: "Error marking notifications", error: error.message });
  }
}
