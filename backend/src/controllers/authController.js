import jwt from "jsonwebtoken";

export async function adminLogin(req, res) {
  const { username, password } = req.body;

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const jwtSecret = process.env.JWT_SECRET;

  if (!adminUsername || !adminPassword || !jwtSecret) {
    console.error("Admin credentials or JWT_SECRET not configured in .env");
    return res.status(500).json({ message: "Server configuration error" });
  }

  if (username !== adminUsername || password !== adminPassword) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { username: adminUsername, role: "admin" },
    jwtSecret,
    { expiresIn: "24h" }
  );

  res.json({
    message: "Login successful",
    token,
    admin: { username: adminUsername }
  });
}

export async function verifyToken(req, res) {
  // If we get here, the token is valid (middleware already verified)
  res.json({ valid: true, admin: req.admin });
}
