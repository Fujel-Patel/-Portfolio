# EmailJS Configuration Guide

## Step 1: Sign Up for EmailJS

1. Go to https://www.emailjs.com/
2. Click "Sign Up" (you can use Google, GitHub, or email)
3. Verify your email address

## Step 2: Create an Email Service

1. In your EmailJS dashboard, click "Email Services"
2. Click "Add New Service"
3. Choose your email provider:
   - **Gmail** (recommended for personal use)
   - **Outlook**
   - **Yahoo**
   - Or others
4. Follow the authentication steps
5. **Copy the Service ID** (you'll need this)

## Step 3: Create an Email Template

1. Go to "Email Templates" in the sidebar
2. Click "Create New Template"
3. Use this template structure:

```html
Subject: New Contact Form Message from {{from_name}}

From: {{from_name}} ({{from_email}})
Message:
{{message}}

---
Sent from your portfolio website
```

4. Save the template
5. **Copy the Template ID** (you'll need this)

## Step 4: Get Your Public Key

1. Go to "Account" in the sidebar
2. Scroll down to "API Keys"
3. **Copy your Public Key**

## Step 5: Update Your Code

Open `src/components/ui/ContactSection.tsx` and replace the placeholders:

```typescript
// Line 16: Replace with your Public Key
emailjs.init('YOUR_PUBLIC_KEY_HERE')

// Line 24-25: Replace with your Service ID and Template ID
await emailjs.send(
  'YOUR_SERVICE_ID_HERE',     // e.g., 'service_abc123'
  'YOUR_TEMPLATE_ID_HERE',    // e.g., 'template_xyz789'
  {
    from_name: formData.name,
    from_email: formData.email,
    message: formData.message,
  }
)
```

## Step 6: Test Your Form

1. Run your portfolio: `npm run dev`
2. Navigate to the Contact section
3. Fill out the form
4. Click "Send Message"
5. Check your email inbox!

## Troubleshooting

**Form not sending?**
- Check browser console for errors
- Verify all IDs are correct
- Ensure EmailJS service is active
- Check spam folder

**Getting CORS errors?**
- Make sure you're testing on localhost or a deployed domain
- EmailJS allows localhost for testing

**Template variables not working?**
- Ensure variable names match exactly: `{{from_name}}`, `{{from_email}}`, `{{message}}`
- Variables are case-sensitive

## Security Note

⚠️ **Never commit your EmailJS credentials to public repositories!**

For production, use environment variables:

1. Create `.env` file in your project root:
```
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
```

2. Update ContactSection.tsx:
```typescript
emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY)

await emailjs.send(
  import.meta.env.VITE_EMAILJS_SERVICE_ID,
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  { ... }
)
```

3. Add `.env` to your `.gitignore` file

## That's It! 🎉

Your contact form should now be fully functional!
