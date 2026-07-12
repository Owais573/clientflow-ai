# ClientFlow AI
## Product Requirements Document (PRD)

**Version:** 1.0

**Status:** Draft

**Owner:** Owais Ansari

---

# 1. Executive Summary

ClientFlow AI is a production-grade AI-powered Client Onboarding & CRM Automation platform designed to streamline the entire customer onboarding lifecycle using AI, automation, and business workflow orchestration.

Instead of manually creating CRM records, researching companies, generating proposals, scheduling meetings, creating documents, and sending onboarding emails, ClientFlow AI automates the complete workflow while keeping humans in control.

The project demonstrates real-world AI Engineering, API integrations, workflow automation, and modern SaaS architecture.

The platform is intended primarily as a flagship portfolio project that showcases production-level engineering for freelance clients and AI Engineer interviews.

---

# 2. Vision

Build an AI-powered Business Operations Platform that automates client onboarding while integrating CRM, AI research, document generation, Google Workspace, and workflow automation into one unified system.

---

# 3. Mission

Reduce manual onboarding effort from hours to minutes by combining AI-powered business research with workflow automation.

---

# 4. Problem Statement

Client onboarding usually involves repetitive manual work.

Typical workflow:

Client Inquiry
↓

CRM Entry
↓

Company Research
↓

Proposal Writing
↓

Contract Creation
↓

Document Storage
↓

Meeting Scheduling
↓

Email Communication
↓

Internal Notifications

↓

CRM Updates

Business teams often switch between multiple applications:

- CRM
- Google Drive
- Gmail
- Calendar
- Slack
- AI tools
- Documents

This causes:

- Repetitive work
- Human errors
- Poor standardization
- Slow onboarding
- Context switching
- Inconsistent customer experience

---

# 5. Solution

ClientFlow AI automates the onboarding process through AI services and workflow automation.

Workflow:

Client Form
↓

FastAPI

↓

Zoho CRM

↓

n8n Workflow

↓

Company Research (Tavily)

↓

AI Analysis (OpenAI)

↓

Proposal Generation

↓

Google Workspace

↓

Notifications

↓

CRM Updates

↓

Dashboard

Humans review generated outputs whenever required.

---

# 6. Product Goals

## Business Goals

- Demonstrate production AI engineering
- Showcase CRM automation
- Build a strong Upwork portfolio project
- Learn Zoho CRM ecosystem
- Learn enterprise workflow automation

## Technical Goals

- API-first architecture
- Modular backend
- AI-powered services
- Production-grade integrations
- Local-first development
- Extensible automation workflows

---

# 7. Target Users

- Freelancers
- Digital Agencies
- Consulting Firms
- Marketing Agencies
- IT Service Providers
- AI Automation Agencies
- Small Businesses

---

# 8. MVP Scope

## Included

- Dashboard
- Client onboarding form
- Zoho CRM integration
- PostgreSQL database
- n8n automation
- Tavily research
- OpenAI company analysis
- Proposal generation
- Welcome email generation
- Google Drive folder creation
- Google Docs generation
- Google Calendar event creation
- Gmail integration
- Activity timeline
- Workflow history
- AI logs
- Retry handling

## Excluded

- Authentication
- Billing
- Multi-user support
- Teams
- Mobile app
- SaaS deployment
- Role permissions

---

# 9. High-Level Workflow

```
Client Submission
        │
        ▼
FastAPI Validation
        │
        ▼
Create Lead (Zoho CRM)
        │
        ▼
Store Local Database
        │
        ▼
Trigger n8n Webhook
        │
        ▼
Company Research (Tavily)
        │
        ▼
AI Analysis
        │
        ▼
Proposal Generation
        │
        ▼
Google Workspace
        │
 ┌──────┼───────────┐
 ▼      ▼           ▼
Docs   Gmail   Calendar
        │
        ▼
Slack Notification
        │
        ▼
Update Zoho CRM
        │
        ▼
Workflow Completed
```

---

# 10. Core Modules

## Dashboard

Responsibilities

- Workflow overview
- Recent clients
- Workflow history
- Activity feed
- Automation status
- AI usage statistics

---

## Client Management

Features

- Create client
- Edit client
- Delete client
- Search clients
- CRM synchronization

---

## CRM Integration

Platform

- Zoho CRM

Operations

- Create Lead
- Update Lead
- Search Lead
- Convert Lead
- Add Notes
- Update Status

---

## AI Research

Provider

- Tavily API

Purpose

Research

- Company
- Website
- Industry
- Technologies
- Latest News
- Business Summary

---

## AI Analysis

Provider

- gpt-4.1

Outputs

- Company Summary
- Business Opportunities
- Pain Points
- AI Recommendations
- Suggested Services
- Internal CRM Notes

---

## Proposal Generator

Generate

- Executive Summary
- Scope
- Timeline
- Deliverables
- Pricing Template

---

## Email Generator

Generate

- Welcome Email
- Follow-up Email
- Reminder Email

---

## Google Workspace

Integrations

- Gmail
- Drive
- Docs
- Calendar

Automation

- Create Drive Folder
- Generate Proposal Document
- Schedule Meeting
- Send Email

---

## Workflow Automation

Platform

n8n

Responsibilities

- Receive webhook
- Execute business workflow
- Trigger Google services
- Send notifications
- Retry failed tasks
- Update backend

---

# 11. Technical Architecture

```
                  Next.js Frontend
                         │
                         ▼
                   FastAPI Backend
                         │
       ┌─────────────────┼────────────────┐
       ▼                 ▼                ▼
 PostgreSQL         OpenAI API       Tavily API
       │
       ▼
      n8n
       │
 ┌─────┼───────────────┐
 ▼     ▼       ▼       ▼
Zoho  Gmail  Drive  Calendar
 CRM
```

---

# 12. Technology Stack

## Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui

## Backend

- FastAPI
- SQLAlchemy
- Pydantic
- Alembic

## Database

- PostgreSQL

## AI

- OpenAI gpt-4.1

## Search

- Tavily API

## Automation

- n8n (Docker)

## CRM

- Zoho CRM

## External APIs

- Gmail API
- Google Drive API
- Google Docs API
- Google Calendar API

---

# 13. Backend Architecture

```
backend/

api/
services/
integrations/
models/
schemas/
database/
core/
utils/
prompts/
workflows/
main.py
```

---

# 14. Frontend Architecture

```
frontend/

app/
components/
hooks/
services/
types/
lib/
utils/
```

---

# 15. Database Design

## clients

Stores

- Company
- Contact
- Email
- Phone
- Website

---

## workflows

Stores

- Workflow Status
- Started At
- Completed At
- Current Step

---

## research

Stores

- Tavily Results
- AI Summary

---

## proposals

Stores

- Proposal
- Deliverables
- Timeline

---

## activities

Stores

- Logs
- Errors
- Events

---

# 16. API Design

## Clients

```
POST   /api/clients
GET    /api/clients
GET    /api/clients/{id}
PUT    /api/clients/{id}
DELETE /api/clients/{id}
```

## Workflows

```
POST /api/workflows/start
GET  /api/workflows
GET  /api/workflows/{id}
```

## Research

```
POST /api/research/company
```

## Proposal

```
POST /api/proposal/generate
```

---

# 17. AI Pipeline

```
Company Name
       │
       ▼
Tavily Search
       │
       ▼
Clean Research
       │
       ▼
GPT Analysis
       │
       ▼
Company Summary
       │
       ▼
Proposal
       │
       ▼
Email
       │
       ▼
CRM Notes
```

---

# 18. Error Handling

- API retry
- n8n retry
- Tavily fallback
- OpenAI retry
- Validation errors
- Workflow logging
- Exception tracking

---

# 19. Logging & Observability

Track

- API requests
- Workflow execution
- AI token usage
- Tavily searches
- CRM synchronization
- Google API calls
- Errors
- Execution time

---

# 20. Local Development

Frontend

```
npm run dev
```

Backend

```
uv run uvicorn main:app --reload
```

Infrastructure

```
docker compose up -d
```

Services

- PostgreSQL
- n8n

External

- Zoho CRM
- Tavily
- OpenAI
- Google Workspace APIs

---

# 21. Future Enhancements

- OCR document processing
- PDF generation
- Digital signatures
- Stripe integration
- Client Portal
- Role-based access
- Multi-tenancy
- Analytics Dashboard
- AI Meeting Assistant
- Voice Notes
- WhatsApp integration
- Slack bot
- Microsoft 365 integration
- HubSpot integration
- Salesforce integration

---

# 22. Success Metrics

Business

- Onboarding time reduction
- Proposal generation time
- CRM synchronization success
- Automation completion rate

Technical

- API latency
- Workflow completion
- AI response time
- Tavily search accuracy
- Google API success rate
- CRM sync success rate

---

# 23. MVP Completion Criteria

The MVP will be considered complete when:

- Client can be created from the dashboard.
- Lead is automatically created in Zoho CRM.
- Tavily researches the company.
- GPT generates business analysis.
- Proposal is generated automatically.
- Google Drive folder is created.
- Google Docs proposal is generated.
- Calendar meeting is scheduled.
- Welcome email is drafted and sent.
- Workflow executes through n8n.
- CRM is updated with AI-generated insights.
- Dashboard displays workflow history and logs.