# ClientFlow AI — API Setup Guide

> This guide walks you through obtaining all the external API credentials required for ClientFlow AI.
> **OpenAI and Tavily API keys are excluded** — you already have those.

---

## Table of Contents

1. [Zoho CRM — OAuth2 Client Credentials](#1-zoho-crm--oauth2-client-credentials)
2. [Zoho CRM — Generate Grant Token](#2-zoho-crm--generate-grant-token)
3. [Google Cloud — OAuth2 Credentials (for n8n)](#3-google-cloud--oauth2-credentials-for-n8n)
4. [Slack — Incoming Webhook URL](#4-slack--incoming-webhook-url)

---

## 1. Zoho CRM — OAuth2 Client Credentials

You need a **Client ID** and **Client Secret** to connect FastAPI to your Zoho CRM account.

### Steps:

1. **Go to Zoho API Console:**
   - Open: https://api-console.zoho.in/ (use `.in` since your account is on the Indian data center)
   - Log in with the same Zoho account you use for CRM

2. **Create a new Client (Server-based Application):**
   - Click **"Add Client"** (or **"GET STARTED"** if first time)
   - Select **"Server-based Applications"**

3. **Fill in the details:**
   | Field | Value |
   |---|---|
   | Client Name | `ClientFlow AI` |
   | Homepage URL | `http://localhost:3000` |
   | Authorized Redirect URI | `http://localhost:8000/api/zoho/callback` |

4. **Click "CREATE"**

5. **Copy your credentials:**
   - You'll see **Client ID** and **Client Secret**
   - Save these — you'll paste them into your `.env` file as:
     ```
     ZOHO_CLIENT_ID=1000.XXXXXXXXXXXXXXXXXXXX
     ZOHO_CLIENT_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
     ```

> [!WARNING]
> The **Client Secret** is shown only once during creation. Copy it immediately. If you lose it, you'll need to regenerate it.

---

## 2. Zoho CRM — Generate Grant Token

After creating the OAuth client, you need a one-time **Grant Token** (authorization code) to bootstrap the authentication.

### Steps:

1. **Build the authorization URL:**

   Replace `YOUR_CLIENT_ID` with your actual Client ID from Step 1, then open this URL in your browser:

   ```
   https://accounts.zoho.in/oauth/v2/auth?scope=ZohoCRM.modules.ALL,ZohoCRM.settings.ALL,ZohoCRM.users.ALL&client_id=YOUR_CLIENT_ID&response_type=code&access_type=offline&redirect_uri=http://localhost:8000/api/zoho/callback
   ```

2. **Accept the permissions:**
   - Log in if prompted
   - Click **"Accept"** to grant access

3. **Grab the Grant Token:**
   - You'll be redirected to `http://localhost:8000/api/zoho/callback?code=XXXXXXXX`
   - Since the backend isn't running yet, you'll get an error page — **that's fine!**
   - Copy the `code` parameter from the URL bar
   - This is your **Grant Token**

4. **Save it in your `.env` file:**
   ```
   ZOHO_GRANT_TOKEN=1000.XXXXXXXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXX
   ```

> [!IMPORTANT]
> The Grant Token **expires in ~2 minutes** and can only be used **once**. You'll generate this just before running the backend for the first time. The app will automatically exchange it for long-lived access + refresh tokens and persist them.

> [!TIP]
> **Your Zoho User Email** is also needed. Based on your screenshot, save this:
> ```
> ZOHO_USER_EMAIL=your-zoho-email@example.com
> ```

---

## 3. Google Cloud — OAuth2 Credentials (for n8n)

Since we're handling all Google Workspace operations (Drive, Docs, Calendar, Gmail) through **n8n's built-in nodes**, you need to create Google OAuth credentials that n8n will use.

### Step 3a: Create a Google Cloud Project

1. **Go to Google Cloud Console:**
   - Open: https://console.cloud.google.com/
   - Sign in with the Google account you want to use for Drive/Gmail/Calendar

2. **Create a new project:**
   - Click the project dropdown at the top → **"New Project"**
   - Project name: `ClientFlow AI`
   - Click **"Create"**

3. **Select the project** from the dropdown

### Step 3b: Enable the Required APIs

1. Go to **"APIs & Services" → "Library"** (left sidebar)
2. Search for and **Enable** each of these APIs (click each one → click "Enable"):
   - ✅ **Gmail API**
   - ✅ **Google Drive API**
   - ✅ **Google Docs API**
   - ✅ **Google Calendar API**

### Step 3c: Configure OAuth Consent Screen

1. Go to **"APIs & Services" → "OAuth consent screen"**
2. Select **"External"** user type → Click **"Create"**
3. Fill in the form:
   | Field | Value |
   |---|---|
   | App name | `ClientFlow AI` |
   | User support email | Your Gmail address |
   | Developer contact email | Your Gmail address |
4. Click **"Save and Continue"**
5. **Scopes page:** Click **"Add or Remove Scopes"** and add:
   - `https://www.googleapis.com/auth/gmail.send`
   - `https://www.googleapis.com/auth/drive`
   - `https://www.googleapis.com/auth/documents`
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/calendar.events`
6. Click **"Save and Continue"**
7. **Test users page:** Click **"Add Users"** → add your own Gmail address → **"Save and Continue"**
8. Click **"Back to Dashboard"**

### Step 3d: Create OAuth2 Credentials

1. Go to **"APIs & Services" → "Credentials"**
2. Click **"+ CREATE CREDENTIALS" → "OAuth client ID"**
3. Application type: **"Web application"**
4. Name: `ClientFlow AI - n8n`
5. **Authorized redirect URIs:** Add this URL:
   ```
   http://localhost:5678/rest/oauth2-credential/callback
   ```
   _(This is n8n's OAuth callback URL)_
6. Click **"Create"**
7. **Copy the credentials:**
   ```
   GOOGLE_CLIENT_ID=XXXXXXXXXXXX.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-XXXXXXXXXXXXXXXXXXXX
   ```

> [!NOTE]
> These Google credentials will be entered directly into **n8n's credential manager** (not in the `.env` file). When you set up n8n's Google nodes, it will ask for Client ID + Secret and handle the OAuth flow itself.

> [!WARNING]
> **Test Mode Limitation:** In test mode (unverified app), OAuth tokens expire every **7 days**. You'll need to re-authorize in n8n periodically. This is fine for a portfolio/dev project.

---

## 4. Slack — Incoming Webhook URL

You need a webhook URL to send notifications to your `#clientflow-alerts` channel.

### Option A: Quick Setup via Slack App (Recommended)

1. **Go to Slack API:**
   - Open: https://api.slack.com/apps
   - Click **"Create New App"**
   - Choose **"From scratch"**

2. **Fill in the details:**
   | Field | Value |
   |---|---|
   | App Name | `ClientFlow AI` |
   | Workspace | `SupDevX` |
   - Click **"Create App"**

3. **Enable Incoming Webhooks:**
   - In the left sidebar, click **"Incoming Webhooks"**
   - Toggle **"Activate Incoming Webhooks"** to **ON**

4. **Create a webhook for #clientflow-alerts:**
   - Click **"Add New Webhook to Workspace"** (at the bottom)
   - Select channel: **`#clientflow-alerts`**
   - Click **"Allow"**

5. **Copy the Webhook URL:**
   - You'll see a URL like:
     ```
     https://hooks.slack.com/services/YOUR_WORKSPACE/YOUR_BOT/YOUR_TOKEN
     ```
   - Save it in your `.env` file:
     ```
     SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR_WORKSPACE/YOUR_BOT/YOUR_TOKEN
     ```

6. **Test it (optional):**
   You can test the webhook by running this in PowerShell:
   ```powershell
   Invoke-RestMethod -Uri "YOUR_WEBHOOK_URL" -Method POST -ContentType "application/json" -Body '{"text":"ClientFlow AI webhook test!"}'
   ```
   You should see the message appear in `#clientflow-alerts`.

> [!TIP]
> **For n8n:** This webhook URL will also be entered in n8n's Slack node credentials. You can use the same webhook, or create a separate Slack App credential in n8n using a Bot Token (n8n supports both methods).

---

## Summary — What to Collect

After completing all steps above, you should have these credentials ready:

| Credential | Where It Goes | Status |
|---|---|---|
| `ZOHO_CLIENT_ID` | `.env` file | ⬜ Get from Step 1 |
| `ZOHO_CLIENT_SECRET` | `.env` file | ⬜ Get from Step 1 |
| `ZOHO_GRANT_TOKEN` | `.env` file (one-time) | ⬜ Get from Step 2 (do this last, right before first run) |
| `ZOHO_USER_EMAIL` | `.env` file | ⬜ Your Zoho login email |
| `GOOGLE_CLIENT_ID` | n8n credential manager | ⬜ Get from Step 3d |
| `GOOGLE_CLIENT_SECRET` | n8n credential manager | ⬜ Get from Step 3d |
| `SLACK_WEBHOOK_URL` | `.env` file + n8n credential | ⬜ Get from Step 4 |

> [!IMPORTANT]
> **Do Steps 1, 3, and 4 now.** Step 2 (Zoho Grant Token) should be done **right before the first backend run** since it expires in ~2 minutes.
