# Email Service Setup Guide

## Gmail Setup (Recommended)

### 1. Enable 2-Factor Authentication
- Go to: https://myaccount.google.com/security
- Enable 2FA on your Google account

### 2. Generate App Password
- Go to: https://myaccount.google.com/apppasswords
- Select "Mail" from the app dropdown
- Click "Generate"
- Copy the 16-character password (this is your EMAIL_PASS)

### 3. Configure .env
```bash
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=xxxx-xxxx-xxxx-xxxx  # 16-char app password
```

## Other Email Services

### Outlook/Hotmail
```bash
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

### Yahoo Mail
```bash
EMAIL_USER=your-email@yahoo.com
EMAIL_PASS=your-app-password
```

## Testing Your Setup

1. Start your backend server
2. Go to Admin Dashboard → 2FA Settings
3. Enter your email in "Test Email Address"
4. Click "Send Test 2FA Code"
5. Check your email (and spam folder)

## Troubleshooting

### "Invalid credentials" error
- Double-check app password (not regular password)
- Ensure 2FA is enabled on Gmail
- Regenerate app password if needed

### Not receiving emails
- Check spam folder
- Verify email address is correct
- Check backend console for error messages

### Rate limiting
- Gmail has sending limits (100-500 emails/day)
- For production, consider services like SendGrid or Mailgun
