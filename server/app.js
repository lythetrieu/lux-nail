require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Resend } = require('resend');

const app = express();
const port = process.env.PORT || 3000;

// Initialize Resend with API Key from .env
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Main Booking Endpoint
app.post('/api/book', async (req, res) => {
    const { name, email, service, date, message } = req.body;

    console.log(`[AURORA LAB] New booking request from: ${name}`);

    try {
        // 1. Send Email to Salon Owner
        await resend.emails.send({
            from: 'Aurora Salon <onboarding@resend.dev>',
            to: process.env.OWNER_EMAIL || 'your-email@example.com',
            subject: `✨ New Appointment: ${name}`,
            html: `
                <div style="font-family: serif; padding: 40px; background: #FDFCFB; color: #1C1C1C;">
                    <h1 style="color: #8E735B;">New Appointment Request</h1>
                    <p><strong>Client:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Service:</strong> ${service}</p>
                    <p><strong>Date:</strong> ${date}</p>
                    <p><strong>Message:</strong> ${message || 'No additional notes.'}</p>
                    <hr style="border: 0; border-top: 1px solid #EEEAE5; margin: 20px 0;">
                    <p style="font-size: 12px; color: #6B6B6B;">Sent from Aurora Luxury Collective Dashboard.</p>
                </div>
            `
        });

        // 2. Mock Confirmation Email to Client
        // In a real scenario, you'd send an email to the client here too.

        res.status(200).json({
            success: true,
            message: 'Appointment request captured. Our collective will reach out shortly.'
        });

    } catch (error) {
        console.error('Error processing booking:', error);
        res.status(500).json({
            success: false,
            message: 'A technical interference occurred. Please reach us via signal (+84...).'
        });
    }
});

app.listen(port, () => {
    console.log(`
    -------------------------------------------
    ✨ AURORA BACKEND ACTIVE
    ⚡️ Port: ${port}
    🚀 Vibe: High-End Minimalist
    -------------------------------------------
    `);
});
