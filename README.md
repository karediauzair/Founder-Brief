# FounderBrief

**Know Any Company in 30 Seconds.**

FounderBrief is an AI-powered meeting intelligence platform designed to help founders, investors, operators, and business professionals prepare for important conversations faster.

Instead of spending hours jumping between LinkedIn, company websites, news articles, Crunchbase, and search results, users can simply enter a company name along with their research objective and receive a structured intelligence brief tailored to their needs.

Whether you're preparing for an investor meeting, partnership discussion, competitor analysis, vendor evaluation, or sales conversation, FounderBrief helps you walk into the meeting informed and prepared.

---

## Problem Statement

Before important business meetings, professionals often spend significant time researching companies from multiple sources.

This process is:

* Time-consuming
* Repetitive
* Fragmented across multiple platforms
* Difficult to organize
* Easy to miss critical information

Founders, investors, and operators frequently spend 1–3 hours researching a single company before an important discussion.

FounderBrief solves this problem by transforming hours of manual research into a concise, actionable intelligence brief generated in seconds.

---

## Project Overview

FounderBrief combines live web research with AI-powered analysis to generate company intelligence reports tailored to a user's specific objective.

Users provide:

* Company Name or Website URL
* Research Purpose

The platform then:

1. Collects relevant public information from trusted online sources.
2. Analyzes and synthesizes the information using AI.
3. Generates a structured business intelligence brief.
4. Provides goal-specific insights and meeting preparation recommendations.

The result is a focused report that helps users quickly understand a company and prepare for meaningful conversations.

---

## Key Features

### Company Intelligence Brief

Generate a structured overview of any company including:

* Company Snapshot
* Business Overview
* Recent Developments
* Risks & Considerations
* Source References

### Goal-Based Research

Research results adapt based on the user's objective, such as:

* Investor Meetings
* Partnership Discussions
* Vendor Evaluations
* Competitor Research
* Sales Preparation
* Strategic Collaborations

### Meeting Strategy

FounderBrief doesn't stop at company research.

Each report includes practical meeting preparation guidance:

* Focus Areas
* Potential Risks
* Suggested Questions
* Strategic Opportunities

### Source Transparency

Reports include source references to improve trust and provide additional context.

### Copy Brief

Quickly copy generated intelligence reports for notes, meetings, documentation, or sharing.

---

## Example Use Cases

### Founder Preparing for an Investor Meeting

Understand company background, growth signals, recent developments, and key discussion points before a pitch.

### Business Development Team

Identify partnership opportunities and strategic alignment before outreach.

### Product Manager

Research competitors, market positioning, and industry developments.

### Startup Operator

Evaluate vendors, partners, and service providers more effectively.

---

## Tech Stack

### Frontend

* Next.js
* TypeScript
* Tailwind CSS

### Backend

* Next.js API Routes

### AI

* Claude API (Anthropic)

### Research

* Tavily Search API

### Deployment

* Vercel

---

## Setup Instructions

### Clone the Repository

```bash
git clone <repository-url>
cd founderbrief
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env.local` file and add:

```env
ANTHROPIC_API_KEY=your_api_key
TAVILY_API_KEY=your_api_key
```

### Run Locally

```bash
npm run dev
```

Application will be available at:

```text
http://localhost:3000
```

### Production Build

```bash
npm run build
npm start
```

---

## Demo

Live Demo:

https://founder-brief-lime.vercel.app/


---

## Future Improvements

Potential future enhancements include:

* PDF Export
* Report History
* Shareable Reports
* Team Collaboration
* CRM Integrations
* Meeting Notes Integration
* Personalized Research Templates

---

## Team

### thefirewallcrew

* Karedia Uzair
* Chougle Talha
* Shaikh Amr
* Shaikh Abdurrahman


---

## Vision

Our goal is simple:

**Stop spending hours researching companies. Start preparing for conversations that matter.**

FounderBrief helps professionals move from information gathering to informed decision-making in minutes instead of hours.

---


