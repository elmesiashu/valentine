require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000; // You can change this if needed

app.use(cors());
app.use(bodyParser.json());

app.post('/send-email', async (req, res) => {
    const { selections } = req.body;

    // Ensure selections exist
    if (!selections || selections.length === 0) {
        return res.status(400).json({ message: 'No selections provided' });
    }

    // Nodemailer transporter using Gmail SMTP
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Your Gmail
            pass: process.env.EMAIL_PASS  // App Password (NOT regular password)
        }
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'fuentesmelodyann@gmail.com',
        subject: "Valentine's Day Activity Selections",
        text: `Here are the selected activities for Valentine's Day:\n\n${selections.join('\n')}`
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: 'Failed to send email' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
