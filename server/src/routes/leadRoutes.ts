import express from "express";
import Lead from "../models/Lead";
import { sendWelcomeEmail } from "../utils/mailer";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Create Lead
router.post("/create", async (req, res) => {
  try {
    const lead = await Lead.create(req.body);

    const io = req.app.get('io');
    if (io) {
      io.emit('lead_created', lead);
    }

    // Send welcome email asynchronously
    sendWelcomeEmail(lead).catch(err => console.error("Email error:", err));

    res.status(201).json({
      success: true,
      lead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lead creation failed",
    });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      leads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch leads",
    });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);

    const io = req.app.get('io');
    if (io) {
      io.emit('lead_deleted', req.params.id);
    }

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lead delete failed",
    });
  }
});

router.put("/:id/status", protect, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    const io = req.app.get('io');
    if (io) {
      io.emit('lead_updated', lead);
    }

    res.status(200).json({
      success: true,
      lead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Status update failed",
    });
  }
});

export default router;