<div align="center">

# ClientFlow AI

### Production-Grade AI-Powered Client Onboarding & CRM Automation Platform

*Automate the entire journey from first lead to signed proposal intelligently, reliably, and at scale.*

[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.139-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org)
[![n8n](https://img.shields.io/badge/n8n-2.28.6-EA4B71?style=flat-square&logo=n8n&logoColor=white)](https://n8n.io)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docker.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## Table of Contents

1. [Project Overview & Value Proposition](#1-project-overview--value-proposition)
2. [Architecture & Tech Stack](#2-architecture--tech-stack)
3. [Current Progress — What We Have Built](#3-current-progress--what-we-have-built)
4. [Getting Started & Installation](#4-getting-started--installation)
5. [Future Roadmap — What We Will Build Next](#5-future-roadmap--what-we-will-build-next)
6. [Contribution & Code Style Guidelines](#6-contribution--code-style-guidelines)

---

## 1. Project Overview & Value Proposition

### What Is ClientFlow AI?

ClientFlow AI is a **production-grade, AI-powered client onboarding and CRM automation platform** built for freelancers, agencies, and small-to-medium consulting firms. It transforms what is traditionally a slow, manual, error-prone onboarding process into an automated, intelligent pipeline — from the moment a new lead is captured to the delivery of a ready-to-send, personalized proposal document.

### The Problem It Solves

Modern sales and client management teams operate with a collection of disconnected tools — a CRM (Zoho, HubSpot), a calendar (Google Calendar), a communication tool (Gmail), a file storage system (Google Drive), and a project management dashboard. Connecting these tools manually for every new client is:

- **Time-consuming:** An average onboarding cycle can take 3–8 hours of manual effort per client.
- **Error-prone:** Copy-pasted emails, forgotten follow-ups, and missed research lead to unprofessional handoffs.
- **Not scalable:** What works for 5 clients per month breaks completely at 50.
- **Generic:** Proposals and communications sent without deep client research feel impersonal and fail to convert.

### How ClientFlow AI Solves It

The moment a new client is submitted through the platform, ClientFlow AI automatically:

1. **Ingests the lead** into the system and creates a corresponding record in Zoho CRM.
2. **Conducts AI-powered research** on the client's company using the Tavily web search API, gathering real-time news, industry context, and business intelligence.
3. **Analyzes the research** using GPT-4.1 (OpenAI) to identify business opportunities, pain points, and strategic recommendations specific to that client.
4. **Generates a personalized proposal** — structured, detailed, and contextually aware — using the research analysis as input to the AI.
5. **Sends a welcome email** to the new client via Gmail (triggered through n8n), formatted with their company-specific context.
6. **Creates a client folder** in Google Drive and exports the AI-generated proposal directly into a Google Doc.
7. **Sends a Slack notification** to the `#clientflow-alerts` channel in real time so the account team is always in the loop.
8. **Keeps a detailed activity log** for every event so the team can audit and track the entire onboarding timeline from a single dashboard.

### Target Audience

| Audience | Primary Use Case |
|---|---|
| Freelance Consultants | Automate client research and proposal writing to win more clients in less time |
| Digital Agencies | Scale onboarding pipelines without adding headcount |
| Small-to-Medium Firms | Standardize and professionalize the client intake process |
| Portfolio Showcase | Demonstrates production-grade, AI-integrated system architecture for technical recruiters |

---

## 2. Architecture & Tech Stack

### High-Level Architecture

```
┌────────────────────────────────────────────────────────────────────────────┐
│                          CLIENT BROWSER                                    │
│                    Next.js 15+ Frontend (Port 3000)                        │
│         Dashboard · Client Form · Workflow Status · Activity Feed          │
└───────────────────────────────┬────────────────────────────────────────────┘
                                │ HTTP / REST (JSON)
                                ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                         FastAPI Backend (Port 8000)                        │
│  /api/clients · /api/workflows · /api/research · /api/proposals            │
│  /api/dashboard · /api/webhooks · /health                                  │
│                                                                            │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐                   │
│  │  Services    │   │  Integrations│   │  API Layer   │                   │
│  │  Layer       │   │  (Stubs→Real)│   │  (Routers)   │                   │
│  └──────────────┘   └──────────────┘   └──────────────┘                   │
│           │                 │                                              │
│           └────────┬────────┘                                              │
│                    │                                                       │
│       ┌────────────▼─────────────┐                                         │
│       │   SQLAlchemy 2.0 (Async) │                                         │
│       │   Alembic Migrations     │                                         │
│       └────────────┬─────────────┘                                         │
└────────────────────┼───────────────────────────────────────────────────────┘
                     │
         ┌───────────▼───────────┐
         │  PostgreSQL 17        │
         │  ┌─────────────────┐  │
         │  │ DB: clientflow  │  │   ← Application data (clients, workflows,
         │  │  clients        │  │     research, proposals, activities)
         │  │  workflows      │  │
         │  │  research       │  │
         │  │  proposals      │  │
         │  │  activities     │  │
         │  └─────────────────┘  │
         │  ┌─────────────────┐  │
         │  │ DB: n8n         │  │   ← n8n internal state (auto-managed)
         │  └─────────────────┘  │
         └───────────────────────┘
                     ▲
                     │  Adminer UI (Port 8080)
                     │
┌────────────────────┼───────────────────────────────────────────────────────┐
│  n8n Workflow Engine (Port 5678)                                           │
│                                                                            │
│  Trigger: FastAPI Webhook ──► Zoho CRM Lead Creation                      │
│                          ──► Gmail Welcome Email (Google OAuth2)           │
│                          ──► Google Drive Folder Creation                  │
│                          ──► Google Docs Proposal Export                   │
│                          ──► Slack Notification → #clientflow-alerts       │
│  Callback: POST /api/webhooks/n8n ──► Status updates in PostgreSQL        │
└────────────────────────────────────────────────────────────────────────────┘
                     │
        ┌────────────┼──────────────┬──────────────┐
        ▼            ▼              ▼               ▼
  Zoho CRM      Gmail API     Google Drive    Slack Webhook
 (Python SDK)  (n8n Native)  (n8n Native)  (#clientflow-alerts)
```

### Tech Stack Breakdown

#### Backend

| Technology | Version | Role | Why Chosen |
|---|---|---|---|
| **Python** | 3.12 | Language | Mature async ecosystem; dominant in AI/ML tooling |
| **FastAPI** | 0.139 | API Framework | Native async, automatic OpenAPI/Swagger docs, Pydantic-first |
| **SQLAlchemy** | 2.0 | ORM | Industry-standard; full async support with `asyncio` extension |
| **asyncpg** | 0.31 | DB Driver | Fastest async PostgreSQL driver available for Python |
| **Alembic** | 1.18 | DB Migrations | Official SQLAlchemy migration tool; full autogenerate support |
| **Pydantic v2** | 2.13 | Validation | Extreme performance over v1; tightly integrated into FastAPI |
| **uv** | latest | Package Manager | 10–100× faster than pip; deterministic lockfiles; replaces venv+pip |
| **Uvicorn** | 0.51 | ASGI Server | Recommended production-grade server for FastAPI |

#### AI & Integrations

| Technology | Version | Role | Why Chosen |
|---|---|---|---|
| **OpenAI Python SDK** | 2.45 | GPT-4.1 AI Engine | Best-in-class language model for research analysis & proposal generation |
| **Tavily Python** | 0.7.26 | Web Search | Purpose-built AI search API returning structured results; faster than SerpAPI |
| **Zoho CRM SDK v7** | 6.0 | CRM Sync | Official Python SDK; handles OAuth2 token refresh automatically |
| **httpx** | 0.28 | Async HTTP Client | Used for n8n webhook calls and any direct REST API calls |

#### Infrastructure & DevOps

| Technology | Version | Role | Why Chosen |
|---|---|---|---|
| **Docker** | Desktop | Containerization | Reproducible local dev environment; mirrors production deployment |
| **Docker Compose** | v3 | Orchestration | Single-command startup for all 3 infrastructure services |
| **PostgreSQL** | 17 | Database | Battle-tested; JSONB native support for AI-generated structured data |
| **Adminer** | latest | DB Visualization | Lightweight web-based PostgreSQL UI; Dracula theme |
| **n8n** | 2.28.6 | Workflow Automation | Low-code node-based orchestrator for all external service integrations |

#### Frontend (Planned — Phase 4)

| Technology | Role |
|---|---|
| **Next.js 15+** | React framework for the dashboard UI |
| **Vanilla CSS** | Custom design system; no Tailwind dependency |
| **Google Fonts (Inter/Outfit)** | Premium typography |

#### External Service Integrations

| Service | Data Center | Integration Method | Channel |
|---|---|---|---|
| **Zoho CRM** | India (`zoho.in`) | Python SDK (`zohocrmsdk7-0`) | Direct from FastAPI backend |
| **OpenAI (GPT-4.1)** | US | Python SDK (`openai>=2.45`) | Direct from FastAPI backend |
| **Tavily Search** | US | Python SDK (`tavily-python`) | Direct from FastAPI backend |
| **Google Workspace** | Global | n8n native Google OAuth2 nodes | Triggered via n8n workflow |
| **Slack** | Cloud | n8n native Slack node | Webhook → `#clientflow-alerts` in `SupDevX` workspace |

---

## 3. Current Progress — What We Have Built

### Phase 0: Infrastructure ✅ Complete

- **Docker Compose stack** fully configured with 3 containers:
  - `clientflow-postgres` (PostgreSQL 17, port `5432`) — healthy with two initialized databases
  - `clientflow-adminer` (Adminer, port `8080`) — Dracula theme, connected to `postgres` service
  - `clientflow-n8n` (n8n v2.28.6, port `5678`) — backed by PostgreSQL; all internal tables auto-migrated
- **PostgreSQL dual-database setup** via `docker/init-db.sh` initialization script:
  - `clientflow` — Application data; owned by the `clientflow` user
  - `n8n` — n8n internal state; fully managed by n8n's own migration system (~110 tables)
- **All containers run on a shared Docker bridge network** (`clientflow-network`) enabling DNS resolution by service name
- **Named persistent volumes** for both `postgres_data` and `n8n_data` so data survives container restarts
- **Environment configuration** via `.env` at project root:
  - All external service credentials populated
  - PostgreSQL password and n8n encryption key cryptographically generated (32-byte secure random)
- **`.env.example`** as a committed, secrets-free template for onboarding new developers
- **`API_SETUP_GUIDE.md`** — step-by-step credential provisioning guide for all 4 external APIs

### Phase 1: Backend Foundation ✅ Complete

#### Project Structure

```
backend/
├── main.py                  # FastAPI application entrypoint
├── pyproject.toml           # uv-managed project metadata & dependencies
├── uv.lock                  # Deterministic lockfile (committed to version control)
├── alembic.ini              # Alembic configuration
├── alembic/
│   ├── env.py               # Async-configured migration environment
│   └── versions/
│       └── 923cf8c9a210_initial_migration.py  # Initial schema (applied ✅)
├── core/
│   ├── config.py            # Pydantic Settings — loads & validates all env vars
│   └── database.py          # Async SQLAlchemy engine, session factory, get_db()
├── models/
│   ├── __init__.py
│   ├── client.py
│   ├── workflow.py
│   ├── research.py
│   ├── proposal.py
│   └── activity.py
├── schemas/
│   ├── __init__.py
│   ├── client.py
│   ├── workflow.py
│   ├── research.py
│   ├── proposal.py
│   └── activity.py
├── api/
│   ├── __init__.py
│   ├── clients.py
│   ├── workflows.py
│   ├── research.py
│   ├── proposals.py
│   ├── dashboard.py
│   └── webhooks.py
├── services/
│   ├── __init__.py
│   ├── client_service.py
│   ├── workflow_service.py
│   ├── research_service.py
│   ├── proposal_service.py
│   └── email_service.py
└── integrations/
    ├── __init__.py
    ├── zoho_crm.py          # Stub → Real in Phase 3
    ├── openai_client.py     # Stub → Real in Phase 3
    ├── tavily_client.py     # Stub → Real in Phase 3
    └── n8n_client.py        # Stub → Real in Phase 3
```

#### Database Schema (Applied to PostgreSQL `clientflow` database)

All 5 tables are live in PostgreSQL 17 via Alembic migration `923cf8c9a210`.

**`clients`** — Core entity for all onboarded clients
| Column | Type | Notes |
|---|---|---|
| `id` | `INTEGER PK` | Auto-increment |
| `company_name` | `VARCHAR(255)` | Not null |
| `contact_name` | `VARCHAR(255)` | Not null |
| `email` | `VARCHAR(255)` | Not null |
| `phone` | `VARCHAR(50)` | Optional |
| `website` | `VARCHAR(255)` | Optional; used for Tavily research |
| `industry` | `VARCHAR(255)` | Optional |
| `budget` | `VARCHAR(100)` | Optional |
| `service_interest` | `VARCHAR(255)` | Optional |
| `notes` | `TEXT` | Optional free-form notes |
| `zoho_lead_id` | `VARCHAR(100) UNIQUE` | Populated after Zoho CRM sync |
| `status` | `VARCHAR(50)` | Default: `new` |
| `created_at` | `DATETIME` | Auto-set |
| `updated_at` | `DATETIME` | Auto-updated |

**`workflows`** — Tracks per-client onboarding pipeline execution
| Column | Type | Notes |
|---|---|---|
| `id` | `INTEGER PK` | Auto-increment |
| `client_id` | `INTEGER FK → clients.id` | Cascade delete |
| `status` | `VARCHAR(50)` | `pending`, `running`, `completed`, `failed` |
| `current_step` | `VARCHAR(100)` | Current pipeline step name |
| `started_at` | `DATETIME` | When workflow execution began |
| `completed_at` | `DATETIME` | When workflow finished |
| `n8n_execution_id` | `VARCHAR(100)` | Execution ID returned by n8n |

**`research`** — AI-enriched company intelligence per client (one-to-one with client)
| Column | Type | Notes |
|---|---|---|
| `id` | `INTEGER PK` | |
| `client_id` | `INTEGER FK UNIQUE → clients.id` | One research record per client |
| `tavily_raw_results` | `JSONB` | Full Tavily API response payload |
| `ai_summary` | `TEXT` | GPT-4.1 generated company summary |
| `ai_opportunities` | `JSONB` | Structured list of business opportunities |
| `ai_pain_points` | `JSONB` | Structured list of identified pain points |
| `ai_recommendations` | `JSONB` | Structured strategic recommendations |
| `tokens_used` | `INTEGER` | OpenAI token consumption for cost tracking |
| `created_at` | `DATETIME` | |

**`proposals`** — AI-generated proposal content per client (one-to-one with client)
| Column | Type | Notes |
|---|---|---|
| `id` | `INTEGER PK` | |
| `client_id` | `INTEGER FK UNIQUE → clients.id` | One proposal per client |
| `executive_summary` | `TEXT` | AI-written executive summary |
| `scope` | `TEXT` | Defined project scope |
| `timeline` | `TEXT` | Proposed delivery timeline |
| `deliverables` | `JSONB` | Structured list of deliverables |
| `pricing_template` | `JSONB` | Structured pricing breakdown |
| `google_doc_url` | `VARCHAR(500)` | Link to exported Google Doc |
| `google_drive_folder_url` | `VARCHAR(500)` | Link to client Google Drive folder |
| `created_at` | `DATETIME` | |

**`activities`** — Immutable event log for the dashboard timeline
| Column | Type | Notes |
|---|---|---|
| `id` | `INTEGER PK` | |
| `client_id` | `INTEGER FK → clients.id` | Cascade delete |
| `workflow_id` | `INTEGER FK → workflows.id` | Optional; cascade delete |
| `event_type` | `VARCHAR(100)` | e.g., `workflow_started`, `n8n_completed` |
| `message` | `TEXT` | Human-readable event description |
| `metadata` | `JSONB` | Optional structured event payload |
| `level` | `VARCHAR(20)` | `info`, `warning`, `error` |
| `created_at` | `DATETIME` | |

### Phase 2: API Endpoints & Services ✅ Complete

#### REST API Endpoints

**Clients — `/api/clients`**
| Method | Path | Description |
|---|---|---|
| `POST` | `/api/clients` | Create a new client; auto-starts an onboarding workflow |
| `GET` | `/api/clients` | List all clients (paginated via `skip` / `limit`) |
| `GET` | `/api/clients/{id}` | Get a single client by ID |
| `PUT` | `/api/clients/{id}` | Update a client record |
| `DELETE` | `/api/clients/{id}` | Delete a client and all related records (CASCADE) |

**Workflows — `/api/workflows`**
| Method | Path | Description |
|---|---|---|
| `POST` | `/api/workflows/start` | Manually trigger a new onboarding workflow for a client |
| `GET` | `/api/workflows` | List all workflows (paginated) |
| `GET` | `/api/workflows/{id}` | Get details for a single workflow |

**Research — `/api/research`**
| Method | Path | Description |
|---|---|---|
| `POST` | `/api/research/company` | Trigger AI research for a given `client_id` |

**Proposals — `/api/proposals`**
| Method | Path | Description |
|---|---|---|
| `POST` | `/api/proposals/generate` | Generate AI proposal based on existing research for a `client_id` |

**Dashboard — `/api/dashboard`**
| Method | Path | Description |
|---|---|---|
| `GET` | `/api/dashboard/stats` | Returns aggregate stats: total clients, active/completed/failed workflow counts, last 10 activities |
| `GET` | `/api/dashboard/activities` | Paginated activity log feed |

**Webhooks — `/api/webhooks`**
| Method | Path | Description |
|---|---|---|
| `POST` | `/api/webhooks/n8n` | Receives status callbacks from n8n during workflow execution; updates `workflows` and logs to `activities` |

**Health — `/`**
| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Returns `{"status": "ok", "environment": "development"}` |

#### Services Layer

| Service | File | Responsibility |
|---|---|---|
| `ClientService` | `services/client_service.py` | CRUD operations; Zoho CRM sync hook |
| `WorkflowService` | `services/workflow_service.py` | Creates workflow records; logs activity; triggers n8n |
| `ResearchService` | `services/research_service.py` | Orchestrates Tavily search + OpenAI analysis pipeline |
| `ProposalService` | `services/proposal_service.py` | Calls OpenAI with research context to generate structured proposals |
| `EmailService` | `services/email_service.py` | Generates contextual email copy for welcome, follow-up, and reminder flows |

#### Active Integrations (Replaced Stubs)

| File | Integrates With | Status |
|---|---|---|
| `integrations/zoho_crm.py` | Zoho CRM | ✅ Complete — Fully authenticates and pushes Leads |
| `integrations/openai_client.py` | OpenAI GPT-4.1 | ✅ Complete — Analyzes research and generates structured proposals |
| `integrations/tavily_client.py` | Tavily Search API | ✅ Complete — Fetches real-time company business intelligence |
| `integrations/n8n_client.py` | n8n Webhook | ✅ Complete — Triggers onboarding workflow via `httpx` POST |

### Phase 3: External API Integrations ✅ Complete

All major external API integrations have been implemented using official SDKs or asynchronous HTTP clients.

#### 3A — OpenAI Integration (`integrations/openai_client.py`)
- Implemented `analyze_company()` using GPT-4.1 with a structured system prompt and JSON-mode response to extract opportunities, pain points, and strategic recommendations from Tavily research data.
- Implemented `generate_proposal()` using GPT-4.1 with the analysis output as context, producing a complete, structured proposal with executive summary, scope, timeline, deliverables, and pricing.
- Added basic token tracking for `tokens_used`.

#### 3B — Tavily Integration (`integrations/tavily_client.py`)
- Implemented `search_company()` using the Tavily Python SDK (`AsyncTavilyClient`) with domain-specific search queries targeting company news, financial health, technology stack, and industry trends.

#### 3C — Zoho CRM Integration (`integrations/zoho_crm.py`)
- Completed the OAuth2 initialization sequence using `zohocrmsdk7-0` — configuring `INDataCenter`, `OAuthToken`, and `FileStore` via FastAPI lifespan `init_zoho()`.
- Implemented `create_lead()` to push new clients to Zoho CRM as `Leads` mapping all form fields accurately.

#### 3D — n8n Workflow Trigger (`integrations/n8n_client.py`)
- Implemented `trigger_workflow()` using `httpx` to send a structured `POST` payload to the n8n webhook URL (`/webhook/client-onboarding`).

#### 3E — n8n Workflow Design (n8n UI / Export)
- Created a complete, production-ready n8n workflow export (`n8n/n8n_client_onboarding_workflow.json`).
- Workflow automatically handles: Slack alerts, Google Drive folder creation, Google Docs proposal generation, and a Gmail welcome email.
- Provided a dedicated setup guide (`n8n/N8N_WORKFLOW_SETUP.md`) for seamless configuration of OAuth credentials and webhooks.

### Phase 4: Frontend Dashboard (Next.js) ✅ Complete

- **Initialized a Next.js 15+ App Router application** in `frontend/` using TypeScript.
- **Premium Vanilla CSS Design System**: Built a custom design system (`globals.css` and `layout.css`) utilizing HSL color tokens, dark mode with deep space blue backgrounds, and glassmorphism accents.
- **Core Pages Built:**
  - **`/` (Dashboard Overview)**: Live KPI cards (total clients, active/completed workflows), real-time activity feed visualization.
  - **`/clients` (Client List)**: A clean data table showing all clients, statuses (using custom color-coded badges), and quick action links.
  - **`/clients/new` (Client Intake Form)**: Multi-step form for adding a new client; wired to `POST /api/clients`.
  - **`/clients/[id]` (Client Detail)**: Full client profile, workflow timeline, AI research summary insights (Opportunities/Pain Points), proposal preview, and Google Doc link.
  - **`/workflows` (Workflow Monitor)**: Real-time status board showing all onboarding pipelines and their current steps.
- **API Integration**: Implemented `frontend/src/services/api.ts` to fetch data from the FastAPI backend securely.

### Phase 5: Error Handling, Logging & Polish ✅ Complete

- **Structured JSON Logging (`backend/core/logging.py`)**: Configured Python's native `logging` module to output strict JSON formatting (including timestamps, log levels, and stack traces) ideal for modern log aggregators.
- **Custom Exception Hierarchy (`backend/core/exceptions.py`)**: Created `ClientFlowException` and specific error types (`ZohoCRMError`, `OpenAIError`, `TavilyError`, `N8nError`, `WorkflowError`) to fail gracefully when third-party services encounter issues.
- **Global Exception Handler & Middleware (`backend/main.py`)**: 
  - Intercepts `ClientFlowException` and translates it into clean JSON HTTP responses.
  - Added timing middleware that calculates exact execution time (`process_time`) and injects an `X-Process-Time` header.
- **Exponential Backoff Retry (`backend/utils/retry.py`)**: Implemented an `async_retry` decorator to gracefully handle transient failures from flaky external APIs (like OpenAI or Tavily).

---

## 4. Getting Started & Installation

### Prerequisites

Ensure the following are installed on your machine before proceeding:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows/macOS/Linux)
- [Python 3.12+](https://www.python.org/downloads/)
- [uv](https://docs.astral.sh/uv/getting-started/installation/) — Python package manager

```powershell
# Verify installations
docker --version       # Docker version 27.x.x or higher
python --version       # Python 3.12.x
uv --version           # uv 0.x.x
```

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/clientflow-ai.git
cd clientflow-ai
```

### 2. Configure Environment Variables

Copy the provided template and fill in your actual credentials.

```powershell
# Windows (PowerShell)
Copy-Item .env.example .env
```

Open `.env` in your editor and populate the following values:

```env
# Database (will be auto-configured by Docker; set a secure password)
POSTGRES_USER=clientflow
POSTGRES_PASSWORD=<your-secure-password>
POSTGRES_DB=clientflow

# OpenAI — https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-proj-...

# Tavily — https://app.tavily.com/
TAVILY_API_KEY=tvly-...

# Zoho CRM — https://api-console.zoho.in/
ZOHO_CLIENT_ID=1000.XXXXXXXX
ZOHO_CLIENT_SECRET=XXXXXXXX
ZOHO_GRANT_TOKEN=        # Leave blank for now; fill right before first run
ZOHO_USER_EMAIL=you@example.com

# Slack — your Incoming Webhook URL from Slack App configuration
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...

# n8n Encryption Key — generate with:
# python -c "import secrets; print(secrets.token_hex(32))"
N8N_ENCRYPTION_KEY=<64-char-hex-string>
```

> See **`API_SETUP_GUIDE.md`** for detailed, step-by-step instructions on obtaining each credential.

> **Important — Zoho Grant Token:** The `ZOHO_GRANT_TOKEN` expires within ~2 minutes of generation. Generate it from [api-console.zoho.in](https://api-console.zoho.in) and paste it into `.env` immediately before starting the backend for the first time.

### 3. Start the Docker Infrastructure

```powershell
docker compose up -d
```

This command pulls images (first run only), creates the `clientflow-network`, and starts all 3 services:

| Service | URL | Login |
|---|---|---|
| **PostgreSQL** | `localhost:5432` | User: `clientflow` / Pass: (from `.env`) |
| **Adminer (DB UI)** | [http://localhost:8080](http://localhost:8080) | System: `PostgreSQL`, Server: `postgres` |
| **n8n** | [http://localhost:5678](http://localhost:5678) | Create owner account on first visit |

Verify all containers are running and healthy:

```powershell
docker compose ps
```

Expected output:
```
NAME                  IMAGE                     STATUS
clientflow-adminer    adminer:latest            Up (healthy)
clientflow-n8n        docker.n8n.io/n8nio/n8n  Up
clientflow-postgres   postgres:17               Up (healthy)
```

### 4. Install Backend Dependencies

```powershell
cd backend
uv sync
```

`uv sync` reads `uv.lock` and installs all pinned dependencies into a local `.venv` — no manual virtual environment activation required.

### 5. Run Database Migrations

Migrations are already applied if you're restoring from a clone. If the database is fresh:

```powershell
# From the backend/ directory
uv run alembic upgrade head
```

Verify the 5 application tables were created:

```powershell
docker exec clientflow-postgres psql -U clientflow -d clientflow -c "\dt"
```

Expected output:
```
           List of relations
 Schema |    Name    | Type  |   Owner
--------+------------+-------+------------
 public | activities | table | clientflow
 public | clients    | table | clientflow
 public | proposals  | table | clientflow
 public | research   | table | clientflow
 public | workflows  | table | clientflow
```

### 6. Run the Backend Server

```powershell
# From the backend/ directory
uv run uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The server will start with hot-reload enabled. Verify it is running:

```powershell
curl http://localhost:8000/health
# {"status":"ok","environment":"development"}
```

### 7. Explore the Interactive API Documentation

FastAPI automatically generates interactive Swagger UI documentation. Open in your browser:

- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **OpenAPI JSON:** [http://localhost:8000/openapi.json](http://localhost:8000/openapi.json)

### Quick Smoke Test — Create Your First Client

```bash
curl -X POST http://localhost:8000/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Acme Corp",
    "contact_name": "Jane Doe",
    "email": "jane@acme.com",
    "website": "https://acme.com",
    "industry": "Technology",
    "budget": "$10,000",
    "service_interest": "Web Development"
  }'
```

Then check the dashboard stats:

```bash
curl http://localhost:8000/api/dashboard/stats
```

### Stopping All Services

```powershell
docker compose down        # Stop containers, preserve volumes
docker compose down -v     # Stop containers AND delete all data volumes (destructive)
```

---

## 5. Future Roadmap — What We Will Build Next

### Phase 6: Zoho CRM Bidirectional Sync — *Next*

- Implement a Zoho CRM webhook listener (`/api/webhooks/zoho`) to receive real-time lead status updates from Zoho.
- On status change in Zoho (e.g., Lead → Qualified), automatically update the client record in PostgreSQL and trigger corresponding n8n actions (e.g., send a follow-up email).

### Phase 7: Authentication & Multi-User Support

- Implement JWT-based authentication (`python-jose`) with user login, registration, and session management.
- Add a `users` table and associate clients and workflows with a specific user/team.
- Implement role-based access control (RBAC): `admin` (full access), `manager` (read-write), `viewer` (read-only).
- Add middleware to protect all `/api/*` endpoints.

### Phase 8: Real-Time Updates via WebSocket

- Add a WebSocket endpoint (`/ws/activity`) to the FastAPI backend using `fastapi.WebSocket`.
- Frontend subscribes and receives real-time activity events as they happen — no polling.
- Activity feed, workflow status board, and KPI cards all update live without page refresh.

### Phase 9: AI-Powered Follow-Up Automation

- Implement a scheduled task (APScheduler or Celery with Redis) to scan for clients who have been in onboarding for more than 48 hours without progression.
- Automatically generate contextual follow-up emails using GPT-4.1 and queue them for delivery via n8n's Gmail node.
- Add a manual "Send Follow-Up" button on the Client Detail page.

### Phase 10: Proposal Approval & Signing Flow

- Integrate with an e-signature service (DocuSign or PandaDoc API) to convert AI-generated proposals into signable documents.
- Add a `signed_at` column and `signed_doc_url` to the `proposals` table.
- Trigger a Slack notification when a proposal is signed.

### Phase 11: Analytics & Reporting Dashboard

- Add a dedicated analytics page showing:
  - Client conversion funnel (lead → onboarded → active)
  - Average time-to-proposal per industry
  - OpenAI token consumption and cost tracking over time
  - Workflow failure rate and most common failure points
- Export reports as PDF or CSV.

### Phase 12: Production Deployment

- **Containerize backend:** Create a production `Dockerfile` for the FastAPI application.
- **Compose for production:** Add a production `docker-compose.prod.yml` with PostgreSQL, Redis, backend, and reverse proxy.
- **Reverse proxy:** Configure Nginx or Traefik for SSL termination, routing, and load balancing.
- **CI/CD pipeline:** GitHub Actions workflow for automated testing, linting, and deployment.
- **Secrets management:** Move from `.env` files to a secrets management service (HashiCorp Vault or AWS Secrets Manager).
- **Monitoring:** Integrate Prometheus + Grafana for application metrics; Sentry for error tracking.

---

## 6. Contribution & Code Style Guidelines

### Branching Strategy

This project follows a **GitHub Flow** branching model:

```
main              ← Production-ready code only. Never commit directly.
  └─ feature/...  ← All new features and phases
  └─ fix/...      ← Bug fixes
  └─ chore/...    ← Tooling, dependency updates, documentation
```

**Examples:**
```bash
git checkout -b feature/zoho-crm-integration
git checkout -b fix/dashboard-stats-null-count
git checkout -b chore/update-openai-sdk
```

### Commit Message Convention

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

| Type | When to use |
|---|---|
| `feat` | A new feature or capability |
| `fix` | A bug fix |
| `refactor` | Code change that neither adds a feature nor fixes a bug |
| `chore` | Tooling, config, or dependency changes |
| `docs` | Documentation only changes |
| `test` | Adding or updating tests |
| `perf` | Performance improvements |

**Examples:**
```
feat(clients): add Zoho CRM lead sync on client creation
fix(research): handle Tavily API rate limit with exponential backoff
docs(readme): add Phase 5 bidirectional sync roadmap section
chore(deps): upgrade openai sdk to 2.50.0
```

### Code Style

- **Formatter:** `ruff format` — configured via `pyproject.toml`
- **Linter:** `ruff check` — PEP 8 compliant with additional rules
- **Type hints:** All function signatures must include full type annotations
- **Docstrings:** Public functions and classes require Google-style docstrings
- **No bare `except`:** Always catch specific exception types

```powershell
# Run formatter
uv run ruff format .

# Run linter
uv run ruff check .
```

### Pull Request Process

1. Create a feature branch from `main` following the naming convention above.
2. Write your code with proper type hints and docstrings.
3. Run `ruff format .` and `ruff check .` — the PR must pass both with zero warnings.
4. Write or update tests for any new business logic in `services/`.
5. Open a PR against `main` with a clear title and description explaining the *what* and *why* of the change.
6. At least one code review approval is required before merging.
7. Squash-merge into `main` with a clean, conventional commit message.

### Security Guidelines

- **Never commit `.env`** to version control. It is in `.gitignore`.
- **Never hardcode credentials.** All secrets must be loaded through `core/config.py` via `pydantic-settings`.
- **Rotate API keys immediately** if they are accidentally exposed in logs, PR diffs, or chat.
- The `ZOHO_GRANT_TOKEN` is a one-time-use token. Do not commit it; it expires in 2 minutes.

### File & Module Conventions

```
backend/
├── api/         ← FastAPI routers. One file per resource. No business logic here.
├── core/        ← Application infrastructure. Config, database engine, dependencies.
├── integrations/← External API clients. One file per external service.
├── models/      ← SQLAlchemy ORM models. One file per table.
├── schemas/     ← Pydantic schemas (request/response). One file per resource.
└── services/    ← Business logic. One file per domain. Called from api/ routers.
```

**Rule:** API routers call services. Services call integrations. Integration files are the only place that external SDK/HTTP calls are made. This separation ensures testability — services can be unit tested by mocking integration modules.

---

<div align="center">

**Built with ❤️ by the Owais Ansari**

[PRD Document](PRD.md) · [API Setup Guide](API_SETUP_GUIDE.md) · [Environment Template](.env.example)

</div>
