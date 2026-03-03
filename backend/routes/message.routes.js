const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Message = require("../models/message.model");

// Middleware: protect
const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET || "secret");
        next();
    } catch {
        res.status(401).json({ message: "Invalid token" });
    }
};

// ─── GET /api/messages/:userId ────────────────────────────────────────────────
// Get conversation between logged-in user and another user
router.get("/:userId", protect, async (req, res) => {
    try {
        const myId = req.user.id;
        const otherId = req.params.userId;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: otherId },
                { senderId: otherId, receiverId: myId },
            ],
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ─── POST /api/messages/send/:userId ─────────────────────────────────────────
// Send a message
router.post("/send/:userId", protect, async (req, res) => {
    try {
        const senderId = req.user.id;
        const receiverId = req.params.userId;
        const { text, image } = req.body;

        if (!text && !image) {
            return res.status(400).json({ message: "Message cannot be empty" });
        }

        const message = await Message.create({ senderId, receiverId, text, image });
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
