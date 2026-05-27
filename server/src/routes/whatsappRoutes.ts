import express from 'express';
import Settings from '../models/Settings';
import Lead from '../models/Lead';

const router = express.Router();

// WhatsApp Webhook Verification
router.get('/webhook', async (req, res) => {
  try {
    const settings = await Settings.findOne();
    const verifyToken = settings?.whatsappWebhookVerifyToken || process.env.WHATSAPP_VERIFY_TOKEN;

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
      if (mode === 'subscribe' && token === verifyToken) {
        console.log('[WhatsApp] Webhook verified successfully');
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);
      }
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    res.status(500).send('Error verifying webhook');
  }
});

// Receive WhatsApp Messages
router.post('/webhook', async (req, res) => {
  try {
    const body = req.body;

    if (body.object) {
      if (
        body.entry &&
        body.entry[0].changes &&
        body.entry[0].changes[0].value.messages &&
        body.entry[0].changes[0].value.messages[0]
      ) {
        const message = body.entry[0].changes[0].value.messages[0];
        const senderPhone = message.from;
        const text = message.text?.body;

        if (text) {
          console.log(`[WhatsApp] Message received from ${senderPhone}: ${text}`);

          // 1. Check if lead exists, if not create one
          let lead = await Lead.findOne({ phone: senderPhone });
          if (!lead) {
            lead = await Lead.create({
              name: `WhatsApp User (${senderPhone})`,
              phone: senderPhone,
              source: 'whatsapp',
              message: text,
            });

            const io = req.app.get('io');
            if (io) {
              io.emit('lead_created', lead);
            }
          }

          // 2. Mock AI Response (in a real app, call OpenAI/LLM here)
          const mockResponse = `Hi! I received your message: "${text}". How can Moto Monk help you today?`;

          // 3. (Optional) Send reply back via WhatsApp API using productionSecretKey
          // const settings = await Settings.findOne();
          // await fetch('https://graph.facebook.com/v17.0/.../messages', { ... });
          console.log(`[WhatsApp] Auto-replying to ${senderPhone}: ${mockResponse}`);
        }
      }
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('[WhatsApp] Error processing webhook:', error);
    res.sendStatus(500);
  }
});

export default router;
