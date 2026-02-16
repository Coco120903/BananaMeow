import Order from "../models/Order.js";
import { sendOrderReceipt } from "../utils/emailService.js";

export async function getOrders(req, res) {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
}

export async function createOrder(req, res) {
  const order = await Order.create(req.body);
  res.status(201).json(order);
}

// Admin: update order status
export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Status is required" });

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    // If marking as completed, attempt to send receipt
    if (status === "completed" && order.email) {
      try {
        await sendOrderReceipt(order.email, order.email, order);
      } catch (err) {
        console.error("Failed to send order receipt after status update:", err);
      }
    }

    res.json(order);
  } catch (err) {
    console.error("Update order status error:", err);
    res.status(500).json({ message: "Unable to update order status" });
  }
}

// Admin: send a receipt for an order (manual trigger)
export async function sendOrderReceiptHandler(req, res) {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (!order.email) return res.status(400).json({ message: "Order has no email to send to" });

    const result = await sendOrderReceipt(order.email, order.email, order);
    if (result.success) return res.json({ message: "Receipt sent" });
    return res.status(500).json({ message: "Failed to send receipt", error: result.error });
  } catch (err) {
    console.error("Send order receipt error:", err);
    res.status(500).json({ message: "Unable to send receipt" });
  }
}
