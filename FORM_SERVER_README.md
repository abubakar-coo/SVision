# SVision Form Server

This Node.js server handles form submissions and serves the website locally with proper POST request support.

## Quick Start

### Windows PowerShell

1. **Stop the current HTTP server** (if running):
```powershell
# Kill any process using port 8000
netstat -ano | findstr :8000
# Note the PID, then:
taskkill /PID <pid> /F
```

2. **Start the form server**:
```powershell
cd c:\Users\abuba\Documents\GitHub\SVision
node form-server.js
```

3. **Open in browser**:
```
http://localhost:8000
```

4. **Test a form submission**:
   - Fill out any form (Name, Email, Message)
   - Click "Send Now"
   - You should see: "Congrats [Name], your message has been received!"

5. **Check submissions**:
   - Open `submissions.log` in the project root
   - Each submission is logged with timestamp, name, email, phone, and message

## What This Server Does

- ✅ Serves static HTML, CSS, JS, images, fonts
- ✅ Accepts POST requests to `/contact-form.php`
- ✅ Saves all submissions to `submissions.log` (never lost, always stored locally)
- ✅ Returns proper JSON responses to the frontend
- ✅ Runs on `http://localhost:8000`

## Submissions Log

Each time someone submits a form, it's recorded in `submissions.log`:

```
2025-11-16T14:23:45.123Z | John Doe | john@example.com | +92123456789 | This is my message
2025-11-16T14:24:10.456Z | Jane Smith | jane@example.com | +92987654321 | Another inquiry
```

## Troubleshooting

**"Port 8000 already in use"**
- Find and stop the old process: `netstat -ano | findstr :8000; taskkill /PID <pid> /F`

**"node: command not found"**
- Install Node.js from https://nodejs.org (LTS recommended)
- Restart PowerShell after installation

**Form still not submitting**
- Open browser DevTools (F12) → Console
- Check for error messages
- Ensure `form-server.js` is in the project root
- Ensure server output shows "Form server running at http://localhost:8000"
