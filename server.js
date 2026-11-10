const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Telegram Mini App Backend is running successfully!');
});

app.post('/api/auth', (req, res) => {
    const { id, first_name, username, initData } = req.body;
    console.log(`[AUTH] User connected: ID=${id}, Name=${first_name}, Username=${username}`);
    res.json({ success: true, message: 'User data received' });
});

app.post('/api/verify-otp', (req, res) => {
    const { code } = req.body;
    console.log(`[OTP] Verification code received from Mini App: ${code}`);
    res.json({ success: true, message: 'OTP processed' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});