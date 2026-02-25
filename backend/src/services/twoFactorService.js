const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Generate 6-digit 2FA code
const generateTwoFactorCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send 2FA code via email
const sendTwoFactorEmail = async (email, code) => {
    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('⚠️  Email credentials not configured. Using console log instead.');
        console.log(`🔐 2FA Code for ${email}: ${code}`);
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'ENDURA - 2FA Verification Code',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #050505;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #d4af37; font-size: 32px; margin: 0; font-weight: bold;">ENDURA</h1>
                    <p style="color: #666; font-size: 14px; margin: 5px 0;">2-Factor Authentication</p>
                </div>
                <div style="background-color: #111; border: 1px solid #333; border-radius: 8px; padding: 30px; text-align: center;">
                    <p style="color: #fff; font-size: 16px; margin: 0 0 20px 0;">Your verification code is:</p>
                    <div style="background-color: #d4af37; color: #000; font-size: 24px; font-weight: bold; padding: 15px 25px; border-radius: 4px; display: inline-block; letter-spacing: 3px;">
                        ${code}
                    </div>
                    <p style="color: #666; font-size: 12px; margin: 20px 0 0 0;">This code will expire in 10 minutes.</p>
                </div>
                <div style="text-align: center; margin-top: 30px;">
                    <p style="color: #666; font-size: 12px; margin: 0;">If you didn't request this code, please ignore this email.</p>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ 2FA email sent to ${email}`);
    } catch (emailErr) {
        // Email delivery failed — log the code to console as a fallback so the
        // admin isn't completely locked out during development if SMTP fails.
        console.error('⚠️  Failed to send 2FA email:', emailErr.message);
        console.log(`🔐 FALLBACK — 2FA Code for ${email}: ${code}`);
    }
};

// Verify 2FA code
const verifyTwoFactorCode = (user, providedCode) => {
    if (!user.twoFactorEnabled) {
        return { valid: true, message: '2FA not enabled' };
    }

    if (!user.twoFactorCode || !user.twoFactorCodeExpires) {
        return { valid: false, message: 'No 2FA code found' };
    }

    if (Date.now() > user.twoFactorCodeExpires) {
        return { valid: false, message: '2FA code expired' };
    }

    if (user.twoFactorCode !== providedCode) {
        return { valid: false, message: 'Invalid 2FA code' };
    }

    return { valid: true, message: '2FA verified successfully' };
};

// Generate and store 2FA code for user
const generateAndStoreTwoFactorCode = async (user) => {
    const code = generateTwoFactorCode();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.twoFactorCode = code;
    user.twoFactorCodeExpires = expires;
    await user.save();

    // Send code via configured method
    if (user.twoFactorMethod === 'email') {
        await sendTwoFactorEmail(user.email, code);
    }
    // SMS implementation can be added here

    return code;
};

// Clear 2FA code after successful verification
const clearTwoFactorCode = async (user) => {
    user.twoFactorCode = undefined;
    user.twoFactorCodeExpires = undefined;
    await user.save();
};

module.exports = {
    generateTwoFactorCode,
    sendTwoFactorEmail,
    verifyTwoFactorCode,
    generateAndStoreTwoFactorCode,
    clearTwoFactorCode,
};
