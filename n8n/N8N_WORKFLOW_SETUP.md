# n8n Client Onboarding Workflow Setup

This document explains how to import and configure the automated Client Onboarding workflow in your local n8n instance.

## 1. Import the Workflow

1. Start your Docker infrastructure (`docker compose up -d`).
2. Open the n8n UI in your browser: [http://localhost:5678](http://localhost:5678).
3. If this is your first time, create an owner account.
4. On the left sidebar, click **Workflows** → **Add Workflow**.
5. In the top right corner of the canvas, click the **Options menu (three dots)** → **Import from File**.
6. Select `n8n_client_onboarding_workflow.json` from this folder.
7. The workflow will appear on your canvas. **Save** it.

---

## 2. Configure Credentials

The workflow contains several nodes that interact with external services. You will see warning icons (⚠️) on these nodes until credentials are provided.

### A. Slack Notification Node
This node sends real-time alerts when a new client is onboarded.
1. Double-click the **Slack Notification** node.
2. Under "Credential to connect with", click **Create New Credential**.
3. You can use an **OAuth2 API** or a **Bot Token**. If you created a Slack App as per the `API_SETUP_GUIDE.md`, provide the Bot Token here.
4. Connect and save. The node is pre-configured to use the channel you defined in your backend `.env` (defaults to `#clientflow-alerts`).

### B. Google Drive & Docs Nodes
These nodes create a dedicated client folder and generate the initial proposal document.
1. Double-click the **Google Drive Folder** node.
2. Click **Create New Credential** → **Google Drive OAuth2 API**.
3. Use the `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` you generated in `API_SETUP_GUIDE.md` (Step 3d).
4. Click **Sign in with Google** and complete the OAuth flow.
5. Save the credential.
6. Open the **Google Docs Proposal** node and select the **exact same credential** you just created.

### C. Gmail Node
This node sends a welcome email to the client automatically.
1. Double-click the **Gmail Welcome** node.
2. Click **Create New Credential** → **Gmail OAuth2 API**.
3. You can reuse the exact same Google Client ID and Secret from above, since your OAuth consent screen includes the Gmail scopes.
4. Click **Sign in with Google**, accept the permissions, and save.

---

## 3. Verify the Webhook URL

1. Double-click the **Webhook Trigger** node.
2. Look at the **Test URL** and **Production URL**. It should end in `/webhook/client-onboarding`.
3. Verify that the URL matches the `N8N_WEBHOOK_URL` in your FastAPI `.env` file (e.g., `http://localhost:5678/webhook/client-onboarding`).

> **Note:** When testing from FastAPI, make sure to set the Webhook node to **"Listen for Test Event"** if you are testing manually, or activate the workflow (toggle in top right) to use the Production URL.

---

## 4. FastAPI Callback Node

The final node is an **HTTP Request** node named "FastAPI Callback".
- **Purpose:** After the proposal is generated and email sent, this node pings your FastAPI backend to update the workflow status to `completed` in your PostgreSQL database.
- **Configuration:** It is pre-configured to point to `http://host.docker.internal:8000/api/webhooks/n8n`.
- **Note:** `host.docker.internal` allows the n8n Docker container to reach your FastAPI server running locally on your host machine (via `uv run uvicorn`). If you are on Linux and this fails, you may need to use your machine's local IP address instead.

---

## 5. Activate the Workflow

Once all credentials are saved and warning icons disappear:
1. Toggle the switch in the top right corner of the n8n UI from **Inactive** to **Active**.
2. Your automated ClientFlow onboarding pipeline is now live and waiting for FastAPI to trigger it!
