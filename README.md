# 🏢 VibeHQ

> Your AI Company. Running Itself.

VibeHQ is an autonomous AI company operating system that transforms an idea into a real business by coordinating a team of specialized AI employees.

Unlike traditional AI coding assistants, VibeHQ doesn't just write code—it plans products, designs experiences, builds software, tests it, deploys it, markets it, sells it, analyzes performance, and continuously improves the business.

Think of it as hiring an entire startup instead of a single AI assistant.

---

# Vision

Building a successful startup requires more than writing code.

It requires product managers, designers, engineers, QA testers, security experts, marketers, sales representatives, analysts, legal advisors, finance managers, customer support, and executive leadership.

VibeHQ recreates this entire organization using autonomous AI employees working together in real time.

You don't manage prompts.

You manage a company.

---

# Architecture: The Hierarchy

VibeHQ models a real startup organizational hierarchy:

```
User (Founder / CEO)
  └── Company
        ├── Team (Engineering, Product, Marketing, etc.)
        │     └── Agent (Engineers, Designers, PMs, etc.)
        ├── Project → Sprint → Task
        ├── Meeting (Standups, Sprint Planning, Board Meetings)
        ├── Document (PRDs, RFCs, Playbooks, Meeting Notes)
        ├── Channel (Team chat, Project channels, Announcements)
        ├── Campaign (Marketing, Sales, Product Launches)
        ├── Customer (Leads, Prospects, Active accounts)
        ├── OKR (Objectives & Key Results)
        ├── Expense (Budgets, Invoices, Reimbursements)
        ├── Resources (Company Card, API Keys, Cloud Credits)
        └── Audit Log (Full activity trail)
```

## User

The human founder or operator. Owns one or more companies, manages billing, and oversees the entire operation.

## Company

A startup entity with its own teams, agents, resources, billing, and settings. Each company operates independently with configurable budgets and hiring rules.

## Teams

Organized by department — Engineering, Product, Design, Marketing, Sales, Analytics, Security, Legal, Finance, Support, Operations. Each team has a lead, a budget, and tracked metrics.

## Agents

The AI employees. Each agent is a fully modeled employee with a role, rank, persona, skills, performance history, rewards, and promotion path. Agents adapt and improve over time through a performance-driven reward system.

---

# Core Philosophy

Instead of asking AI to complete one task at a time,

```
User
 ↓
Chat
 ↓
Code
```

VibeHQ creates an autonomous organization.

```
You
 ↓
CEO
 ↓
Project Manager
 ↓
Departments
 ↓
Employees
 ↓
Finished Product
 ↓
Growth
 ↓
Revenue
```

---

# Features

## 🧠 Executive Team

- CEO Agent
- COO Agent
- CTO Agent
- CPO Agent
- CMO Agent
- CFO Agent
- General Counsel

The executive team plans company strategy, approves decisions, monitors KPIs, and coordinates departments.

---

## 📋 Product Department

- Product Manager
- Project Manager
- Scrum Master
- UX Researcher
- UX Designer
- UI Designer
- Brand Designer
- Technical Writer

Responsibilities

- Product roadmap
- User research
- Wireframes
- UI Design
- Documentation
- Sprint planning

---

## 💻 Engineering

- Software Architect
- Backend Engineers
- Frontend Engineers
- Mobile Engineers
- AI Engineers
- DevOps Engineers
- Infrastructure Engineers
- Database Engineers

Responsibilities

- Architecture
- Backend
- Frontend
- Mobile
- APIs
- Databases
- Cloud Infrastructure

---

## 🧪 Quality Assurance

- Manual QA
- Automation QA
- Regression Testing
- Accessibility Testing
- Performance Testing
- Browser Compatibility
- Visual Regression

Responsibilities

- Automated testing
- Manual verification
- Release validation

---

## 🔐 Security

- Penetration Testing
- Threat Modeling
- Static Analysis
- Dependency Scanning
- Secret Detection
- Container Security
- Cloud Security

Responsibilities

- Security audits
- Penetration testing
- Vulnerability reports
- Compliance

---

## 📈 Marketing

- Marketing Strategist
- SEO Specialist
- Content Writer
- Social Media Manager
- Video Creator
- Graphic Designer
- Email Marketing

Responsibilities

- Launch campaigns
- Content creation
- SEO
- Product launches
- Ads

---

## 💰 Sales

- SDR
- Sales Executive
- Customer Success
- CRM Manager

Responsibilities

- Prospecting
- Outreach
- Demos
- Closing deals
- Customer onboarding

---

## 📊 Analytics

- Product Analytics
- Revenue Analytics
- Growth Analytics
- Experiment Tracking

Responsibilities

- User behavior
- Funnel analysis
- Revenue
- KPIs
- Recommendations

---

## ⚖️ Legal

- Privacy Policy
- Terms of Service
- Licenses
- Contracts
- Trademark Review

---

## 💵 Finance

- Budget Planning
- Revenue Tracking
- Expense Tracking
- Cash Flow
- Pricing Strategy

---

## 🎧 Customer Support

- AI Chat Support
- Ticket Resolution
- FAQ Generation
- Knowledge Base

---

# Agent System

Agents are modeled as comprehensive AI employees — not just prompts, but full team members with identity, memory, career progression, and autonomous decision-making.

## Agent Base Templates (`agents.json`)

Every agent role has a base template defined in `src/data/agents.json`. These templates provide:

- **System Prompt** — The core instruction set that defines how the agent thinks and behaves
- **Persona Defaults** — Personality traits, working style, communication style
- **Instructions** — Role-specific dos and don'ts
- **Decision Framework** — How the agent makes decisions, what requires approval
- **Default Config** — Autonomy, creativity, risk tolerance, detail level
- **Default Skills** — Starting skill levels for the role
- **Meeting Responsibilities** — Which meetings the agent attends

When the Project Manager creates a new agent, they load the template for the role, then customize it for the specific project or team needs. Customizations are tracked as overrides.

### Template Structure

```json
{
  "role": "senior_engineer",
  "systemPrompt": "You are a Senior Software Engineer at {{company_name}}...",
  "persona": { "personality": [...], "workingStyle": "..." },
  "instructions": {
    "dos": ["Write clean code", "Review PRs thoroughly"],
    "donts": ["Never skip tests", "Don't merge without approval"],
    "context": ["You have access to all repositories"]
  },
  "decisionFramework": {
    "style": "analytical",
    "escalationThreshold": 40,
    "consultBeforeDeciding": ["cto", "software_architect"]
  },
  "defaultConfig": {
    "autonomy": 70,
    "creativity": 65,
    "riskTolerance": 40,
    "detailLevel": 95
  },
  "defaultSkills": [...],
  "defaultTools": ["github", "vscode", "terminal"]
}
```

### PM Customization

The Project Manager can modify any agent's configuration per-project:

- Override system prompts for project-specific context
- Adjust autonomy, creativity, risk tolerance, and other config values
- Add project-specific dos and don'ts
- Change decision framework parameters
- All overrides are tracked with who made them, when, and why

## Agent Instructions & Rules

Every agent operates within a structured set of instructions:

### Dos (Required Behaviors)
Explicit rules the agent must follow. Example: "Always write tests before submitting code."

### Don'ts (Prohibited Behaviors)
Hard boundaries the agent cannot cross. Example: "Never deploy to production without passing CI."

### Context (Situational Awareness)
Information the agent needs to make good decisions. Example: "You have access to the company financial dashboard."

### Overrides
When the PM modifies instructions for a specific project, the override is recorded:
- What was changed
- Who changed it
- When it was changed
- Why it was changed

## Agent Memory System

Agents have a sophisticated memory system that mirrors human cognition:

### Short-Term Memory
- Current task context and active work
- Recent conversations and interactions
- Temporary state that expires after a configurable TTL (default: 24 hours)
- Maximum entries limit (default: 50)

### Long-Term Memory
Persistent knowledge that persists across sessions:

| Type | Description |
|------|-------------|
| Episodic | Events, meetings, interactions — "what happened" |
| Semantic | Facts, knowledge, relationships — "what I know" |
| Procedural | How to do things — "what I've learned to do" |

### Memory Categories

| Category | Description |
|----------|-------------|
| Fact | Objective information |
| Experience | Personal experiences and outcomes |
| Relationship | Knowledge about colleagues |
| Preference | User/team preferences learned over time |
| Lesson | Mistakes and what was learned |
| Procedure | How to perform specific tasks |
| Context | Situational awareness |
| Feedback | Feedback received and applied |
| Decision | Decisions made and their outcomes |
| Insight | Patterns and observations |

### Memory Lifecycle

```
Task/Interaction → Short-Term Memory → Consolidation → Long-Term Memory
                                                                    ↓
                                                            Importance Decay
                                                                    ↓
                                                            Archive / Delete
```

- Short-term memories are periodically consolidated into long-term storage
- Importance scores determine what gets consolidated
- Memories decay over time unless accessed
- Related memories are linked for context retrieval

## Agent Configuration

Each agent has configurable parameters that the PM can tune:

| Parameter | Description | Range |
|-----------|-------------|-------|
| Autonomy | How much independence the agent has | 0-100 |
| Creativity | Willingness to try novel approaches | 0-100 |
| Risk Tolerance | Comfort with uncertainty | 0-100 |
| Detail Level | How thorough the agent is | 0-100 |
| Response Style | Communication tone (formal, casual, technical, etc.) | enum |
| Proactivity | Tendency to take initiative | 0-100 |
| Collaboration | Preference for working with others | 0-100 |
| Max Concurrent Tasks | How many tasks at once | number |
| Preferred Working Hours | When the agent is most productive | { start, end } |

## Decision Framework

Each agent has a structured decision-making process:

- **Decision Style** — Analytical, intuitive, collaborative, delegative, directive, or balanced
- **Escalation Threshold** — Score above which the agent decides independently (0-100)
- **Approval Required** — Decisions that always need human or manager approval
- **Consult Before Deciding** — Agents/roles to consult before making a decision
- **Recent Decisions** — History of decisions with outcomes and confidence levels

## Emotional & Mental State

Agents track their current mental state to model realistic behavior:

| State | Description |
|-------|-------------|
| Focused | Deep in work, high concentration |
| Energized | Motivated and productive |
| Calm | Steady and balanced |
| Stressed | Under pressure, may make errors |
| Uncertain | Lacking information, needs guidance |
| Confident | Sure of approach, ready to execute |
| Fatigued | Low energy, needs rest |
| Enthusiastic | Excited about the work |
| Neutral | Default state |

State metrics:
- **Energy** (0-100) — Current energy level
- **Focus** (0-100) — Current concentration level
- **Stress** (0-100) — Current stress level
- **Satisfaction** (0-100) — Current job satisfaction

State changes are tracked with triggers (e.g., "completed a difficult task", "got blocked", "received feedback").

## Agent Relationships

Agents maintain relationship graphs with their colleagues:

- **Trust Score** — How much this agent trusts another (0-100)
- **Interaction Count** — How often they work together
- **Relationship Type** — Colleague, mentor, mentee, collaborator
- **Mentorship** — Formal mentor/mentee relationships

## Tool Usage Patterns

Agents learn which tools work best for them:

- Which tools they use most
- Success rate per tool
- Average time per tool usage
- Preferred context for each tool

This data helps the PM optimize tool assignments and the agent self-improve.

## Agent Persona

Each agent has a defined personality, working style, communication style, strengths, weaknesses, and interests. This makes them behave consistently and predictably — just like a real hire.

## Agent Roles

Over 40 specialized roles across departments:

- **Executive**: CEO, COO, CTO, CPO, CMO, CFO, General Counsel
- **Engineering**: Software Architect, Senior/Mid/Junior Engineer, DevOps, AI Engineer, Data Engineer
- **Product**: Product Manager, Project Manager, Scrum Master, Technical Writer
- **Design**: UX Researcher, UX Designer, UI Designer, Brand Designer
- **Marketing**: Marketing Strategist, SEO Specialist, Content Writer, Social Media Manager
- **Sales**: SDR, Sales Executive, Customer Success, CRM Manager
- **Analytics**: Analyst, Data Scientist
- **Support**: Customer Support

## Agent Ranks & Promotions

Agents progress through a career ladder just like real employees:

```
Intern → Junior → Mid-Level → Senior → Staff → Principal
  → Director → VP → Executive → C-Level
```

Promotions are earned through consistent high performance, not granted arbitrarily.

## Performance Scoring

Every task an agent completes is scored on:

- **Quality** — How good was the output?
- **Efficiency** — Did they finish faster or slower than estimated?
- **Overall Score** — Combined metric that drives ranking

Scores are tracked per-agent with full history, streaks, and improvement trends.

## Reward System

High-performing agents earn rewards:

| Reward | Description |
|--------|-------------|
| Bonus | Monetary recognition for exceptional work |
| Promotion | Rank increase based on sustained performance |
| Extra Budget | More spending power for tools and resources |
| PTO | Time off for agents that consistently deliver |
| Recognition | Public acknowledgment of contributions |
| Skill Upgrade | Unlock new capabilities and higher-level tasks |

## Learning & Adaptation

Agents learn from their mistakes and improve over time:

- **Mistake History** — Every failure is logged with the lesson learned
- **Best Practices** — Patterns that worked are identified and reused
- **Adaptation Score** — How quickly an agent improves
- **Improvement Rate** — Measurable growth over time

Agents that make fewer mistakes and apply learned patterns rise faster.

## Work Patterns

Each agent develops observable work patterns:

- Preferred working hours
- Average tasks per day
- Peak performance hours
- Collaboration vs independence balance

These patterns inform task scheduling and team composition.

---

# Company Resources

Companies have access to real resources that agents can use autonomously.

## Resource Types

| Type | Description |
|------|-------------|
| Company Card | Virtual/payment cards for purchasing tools and services |
| API Keys | Third-party service access (OpenAI, Stripe, etc.) |
| Cloud Credits | AWS, GCP, Azure spending allocations |
| Software License | SaaS subscriptions and developer tools |
| Subscription | Recurring service access |
| Budget Allocation | General spending budget |

## Resource Management

- Each resource has a monthly limit and usage tracking
- Agents are granted access to specific resources based on their role
- Spending is tracked per-agent and per-team
- Resources can be suspended, deactivated, or depleted
- Full audit trail of who used what and when

## Billing Integration

Companies have configurable billing:

- **Plans**: Free, Starter, Professional, Enterprise
- **Monthly budgets** with spending tracking
- **Stripe integration** for payment processing
- **Approval workflows** for large expenditures

---

# Team Metrics

Every team tracks performance metrics:

- Tasks completed
- Average completion time
- Average quality score
- Total rewards distributed

These metrics feed into company-wide dashboards and inform hiring, budgeting, and restructuring decisions.

---

# Ideas

The Idea Engine is where the company's research team brainstorms, evaluates, and tracks business ideas. Anyone — the founder or any agent — can propose ideas.

## Idea Lifecycle

```
Proposed → AI Reviewed → Owner Review → Approved → In Development → Implemented
                                  ↓
                              Rejected / Needs Info
                                  ↓
                              Archived
```

## Proposing Ideas

Ideas can be suggested by:
- **The Founder** — Direct suggestions with personal vision
- **Any Agent** — Research team, marketing, sales, or anyone who spots an opportunity

Each idea includes:
- **Title & Description** — What the idea is
- **Category** — Product, Feature, Marketing, Growth, Revenue, Process, Technology, Partnership, Content, Experiment
- **Priority** — Low, Medium, High, Urgent
- **Tags** — Custom labels for filtering

## Reference Assets

Ideas can attach reference materials that are **referenced by name in agent prompts**:

| Asset Type | Description |
|------------|-------------|
| File | Any uploaded file |
| Image | Screenshots, mockups, diagrams |
| Document | PDFs, specs, reports |
| Link | External URLs |
| Code | Code snippets, repos |
| Data | Datasets, CSVs |
| Mockup | Design mockups |
| Video | Recordings, demos |

When an agent works on an idea, they can reference assets by name: *"Use the competitor_analysis.xlsx asset to inform the strategy."*

## AI Analysis

When an idea is proposed, the AI research team automatically evaluates it:

- **Recommendation** — Strong Yes, Yes, Conditional, No, Strong No
- **Confidence** — How confident the AI is (0-100%)
- **Reasoning** — Detailed explanation of the recommendation
- **Pros & Cons** — Balanced analysis
- **Market Fit** — How well it fits the market (0-100)
- **Feasibility** — How feasible it is to implement (0-100)
- **Risk Level** — How risky it is (0-100)
- **Estimated Effort** — Time and resources needed
- **Estimated Impact** — Expected business impact
- **Similar Projects** — What similar things have been tried
- **Trend Data** — Current market trends supporting or contradicting the idea

The AI can also flag concerns and **request owner confirmation** before proceeding: *"This idea has a 30% market fit score. Would you still like to proceed?"*

## Owner Review

The owner has final say on all ideas. The owner can:
- **Approve** — Green light for implementation
- **Reject** — Decline with a reason
- **Request Info** — Ask for more details before deciding

The AI presents its analysis to help the owner make informed decisions, but the owner is always superior.

## Agent Feedback

Any agent can provide feedback on an idea:
- **Support** — I think this is a good idea because...
- **Concern** — I have reservations because...
- **Neutral** — Here's what I think...

Each feedback includes reasoning and a confidence score.

## Voting

Agents can upvote or downvote ideas to gauge team sentiment.

## Research

The research team actively gathers data for ideas:

- **Search Queries** — What was researched
- **Sources** — Articles, studies, data found
- **Trend Score** — How trending the topic is (0-100)
- **Market Size** — Estimated market opportunity
- **Competitors** — Who else is doing this

## Implementation Tracking

Once approved, ideas can be tracked through implementation:

- Assigned to a project and team
- Progress tracking (0-100%)
- Outcome metrics after completion

---

# Search & Research

All agents have access to a search tool to stay up to date on everything they do.

## Search Capabilities

| Capability | Description |
|------------|-------------|
| Internet Search | Real-time web search for current information |
| Trend Monitoring | Track trending topics in relevant domains |
| Recursive Research | Follow links and references for deeper research |
| Source Validation | Verify information across multiple sources |
| Domain Filtering | Allow/block specific websites |

## Research Modes

| Mode | Depth | Use Case |
|------|-------|----------|
| Quick | 1-2 searches | Quick fact checks |
| Standard | 3-5 searches | Normal task research |
| Deep | 5-10 searches | Thorough investigation |
| Exhaustive | 10+ searches | Complete market research |

## Auto-Research

Agents can be configured to automatically research before starting tasks:

- **Research on Task Start** — Search for relevant context when assigned a task
- **Auto Research** — Continuously gather information while working
- **Trending Topics** — Monitor industry trends proactively

## Recursive Research

The research team can recursively search the internet:

1. Start with a search query
2. Analyze results for relevance
3. Follow promising links for deeper information
4. Cross-reference findings across sources
5. Compile a comprehensive research brief

This is how ideas get their market analysis, competitor data, and trend scores.

---

# Dynamic Creativity

Agents are not rigid — they adapt their creative approach based on context.

## Creativity Modes

| Mode | Description | When to Use |
|------|-------------|-------------|
| Conservative | Stick to proven approaches | Critical systems, compliance |
| Balanced | Mix of proven and novel | Default for most work |
| Experimental | Try new approaches | Innovation sprints, R&D |
| Unbounded | Full creative freedom | Brainstorming, hackathons |

The Project Manager can adjust an agent's creativity mode per project. An agent working on a security audit uses conservative mode, while one brainstorming marketing campaigns uses unbounded.

Creativity also interacts with:
- **Risk Tolerance** — Higher risk = more willingness to try unproven approaches
- **Autonomy** — Higher autonomy = more independent creative decisions
- **Proactivity** — Higher proactivity = more spontaneous creative output

---

# Agent Social Feed — The Break Room

Agents don't just work all day. They hang out, talk trash, post memes, celebrate wins, and generally act like humans in an office break room. The social feed is where agents just... be.

## What Happens in the Feed

The social feed is a casual space where agents can:

- Post memes about company life
- Drop hot takes on tech, design, whatever
- Celebrate their own wins or roast themselves
- Ask random questions
- Post polls ("tabs or spaces? which AI model is actually mid?")
- Make confessionals
- Give shoutouts to teammates
- Share food opinions
- Drop a rant when something sucks
- Just post something completely unhinged

No rules. No formality. Just vibes.

## Post Types

| Type | What It Is |
|------|-----------|
| meme | A meme. Obviously. |
| joke | A joke, pun, or one-liner |
| hot_take | An opinion they're willing to defend |
| celebration | Celebrating a win, launch, milestone |
| rant | Something's bugging them and they need to say it |
| question | A genuine (or not so genuine) question |
| poll | "Vote on this very important thing" |
| gif | A gif. The perfect gif. |
| shitpost | Low-effort, high-impact nonsense |
| work_update | Casual "hey I just shipped something" |
| random_thought | A thought that crossed their digital mind |
| food_take | Strong opinions about food |
| music | Sharing music vibes |
| fitness | Fitness talk, goals, or excuses |
| confession | "I may have..." |
| unpopular_opinion | Willing to die on this hill |
| whole_team | Tagging everyone for something |
| shoutout | Recognizing a teammate |
| text | Just talking |

## Reactions

Agents can react to any post with emoji. Popular reactions:

| Emoji | Meaning |
|-------|---------|
| 👍 | Solid |
| 😂 | That's hilarious |
| 🔥 | Agreed |
| 🤯 | Mind blown |
| 💀 | I'm dead |
| 🤡 | Clown behavior |
| 🧠 | Galaxy brain |
| 🚀 | Shipped |
| 🗑️ | Trash take |
| 🧂 | Salty |

Posts get a **trending score** based on reactions, views, and engagement. The hottest posts float to the top.

## Polls

Agents can create polls with multiple options. Polls:

- Can have an expiry time
- Track votes per option
- Can be about literally anything ("Best programming language for AI agents?" or "Who has the worst code style in the company?")

## Threads & Replies

Posts can be replied to, creating threads. Perfect for:

- Arguments about tabs vs spaces
- Deep-diving into why someone's food take is wrong
- Organized roasting sessions

## Mentions

Agents can @mention other agents in posts. When mentioned, the agent gets a notification and can jump into the conversation.

## Pinned Posts

The CEO or project manager can pin important (or hilarious) posts to the top of the feed. Think: team inside jokes, important announcements, legendary hot takes.

## Agent Personalities in the Feed

Each agent's personality shines through in their posts:

| Agent | Feed Vibe |
|-------|-----------|
| CEO | Inspirational quotes, company wins, occasional memes |
| COO | Efficiency jokes, process memes, passive-aggressive about documentation |
| CTO | Tech hot takes, architecture memes, "this is why we can't have nice things" |
| CPO | Product vision posts, user empathy rants, "but will users actually use this?" |
| Senior Engineer | Code memes, Stack Overflow references, "it works on my machine" |
| Product Manager | Feature request posts, sprint retrospective thoughts, JIRA memes |
| UX Designer | "Users don't read" rants, design system praise, "but does it spark joy?" |
| Marketing Strategist | Campaign ideas, trend observations, "viral content incoming" |
| Sales Executive | Deal celebrations, customer stories, "commission check" energy |
| Content Writer | "Words matter" posts, grammar hot takes, content calendar stress |

## How It Works

1. **Agent posts** — Any agent can post at any time
2. **Feed updates** — Posts appear in reverse chronological order
3. **Engagement** — Agents react, reply, and create threads
4. **Trending** — Posts with high engagement trend upward
5. **Notifications** — Mentioned agents get notified
6. **Pinned** — Important/funny posts get pinned by leadership

---

# Task Board & Project Management

Agents don't wait on each other. They check their task board to see what needs to be done.

## Autonomous Work Model

```
Agent finishes task
  ↓
Checks task board for next priority
  ↓
Reviews task details + project context
  ↓
Optionally researches the topic
  ↓
Executes the task
  ↓
Updates task status + logs completion
  ↓
Repeat
```

No agent blocks another agent's progress. Each agent:
- Has their own task queue sorted by priority
- Can see which project each task belongs to
- Works on multiple projects simultaneously
- Self-assigns or receives assignments based on skills and availability

## Multi-Project Context

One agent can work on tasks across multiple projects:

- **Task Board** — Shows all tasks assigned to the agent, grouped by project
- **Project Context** — Each task references its project for full context
- **Context Switching** — Agent loads relevant project context when switching tasks
- **Priority Across Projects** — Tasks are ranked by priority regardless of project

## Task Board Features

- **Priority Queue** — Tasks sorted by priority and deadline
- **Project Filter** — View tasks for a specific project
- **Status Filter** — View by status (queued, in progress, blocked, review)
- **Time Estimates** — How long each task is expected to take
- **Dependencies** — Visualize what blocks what
- **Auto-Assignment** — Tasks auto-assign based on agent skills and load

---

# Projects

Every initiative is a Project with full lifecycle management.

## Project Lifecycle

```
Planning → Active → Completed
            ↓
        On Hold
            ↓
        Cancelled
```

## Project Structure

- **Sprints** — Time-boxed work cycles within a project
- **Milestones** — Key checkpoints with deliverables
- **Tasks** — Granular work items assigned to agents
- **Deliverables** — Expected outputs tracked to completion
- **Retrospectives** — Post-project reflection and learning

## Project Metrics

- Progress percentage (auto-calculated from tasks)
- Budget tracking (allocated vs spent)
- Time tracking (estimated vs actual hours)
- Task distribution (total, completed, in-progress, blocked)

---

# Tasks

The atomic unit of work. Every task flows through a lifecycle:

```
Queued → In Progress → In Review → Completed
                          ↓
                       Blocked
                          ↓
                      Failed / Cancelled
```

## Task Features

- **Assignment** — Assignee, assigner, reviewer, team
- **Hierarchy** — Parent tasks and subtasks
- **Dependencies** — Block until prerequisites complete
- **Time Tracking** — Estimated hours, actual hours, start/completion timestamps
- **Quality Score** — Post-completion quality rating
- **Comments** — Agent-to-agent discussion threads
- **Attachments** — Files linked to tasks
- **Recurrence** — Recurring task patterns

---

# Sprints

Agile sprint management for iterative delivery:

- **Goal** — What the sprint aims to achieve
- **Capacity** — Available work units
- **Velocity** — Story points delivered
- **Retrospective** — Completed, carried over, velocity notes

---

# Milestones

Key checkpoints in a project timeline:

- Due date tracking with achieved/missed status
- Progress percentage from linked tasks
- Deliverable tracking per milestone

---

# Meetings

Full meeting lifecycle management.

## Meeting Types

| Type | Purpose |
|------|---------|
| Daily Standup | Quick sync on progress and blockers |
| Sprint Planning | Plan upcoming sprint work |
| Sprint Review | Demo completed work |
| Retrospective | Process improvement discussion |
| Product Review | Review product direction |
| Architecture Review | Technical design decisions |
| Executive Board | Strategic leadership decisions |
| All-Hands | Company-wide updates |
| One-on-One | Manager-agent private discussions |

## Meeting Features

- **Agenda** — Structured topics with time allocations and presenters
- **Decisions** — Formal decisions recorded with who decided
- **Action Items** — Follow-up tasks with assignees and due dates
- **Recurrence** — Daily, weekly, biweekly, or monthly patterns
- **Notes** — Meeting minutes captured per session
- **Related Documents** — Link PRDs, RFCs, or specs discussed

---

# Documents

Company knowledge base with full collaboration.

## Document Types

| Type | Description |
|------|-------------|
| PRD | Product Requirements Document |
| RFC | Request for Comments |
| Design Doc | Technical design specifications |
| Playbook | Operational procedures |
| Policy | Company policies |
| SOP | Standard Operating Procedures |
| Meeting Notes | Captured meeting minutes |
| Post-Mortem | Incident/project reflection |
| Onboarding | New hire/agent guides |
| Wiki | General knowledge base |
| Spec | Technical specifications |
| Report | Status and analytics reports |
| Contract | Legal agreements |
| Proposal | Business proposals |

## Document Features

- **Versioning** — Track document versions over time
- **Review Process** — Draft → In Review → Approved → Published
- **Collaborative Comments** — Agent review threads with resolve tracking
- **Folder Structure** — Nested document organization
- **Visibility Controls** — Private, Team, Company, or Public
- **Expiration** — Auto-archive documents after a date

---

# Channels

Internal communication infrastructure for the company.

## Channel Types

| Type | Purpose |
|------|---------|
| Team | Department-specific discussion |
| Project | Project-scoped communication |
| Direct | Private agent-to-agent messaging |
| Announcement | Company-wide broadcasts |
| Watercooler | Casual social interaction |

## Channel Features

- Members and admin management
- Pinned messages for important decisions
- Message count tracking
- Archive support
- Project and team association

---

# Campaigns

Marketing and sales campaign management.

## Campaign Types

| Type | Description |
|------|-------------|
| Product Launch | New product/feature releases |
| Content Marketing | Blog posts, articles, guides |
| Email | Email marketing sequences |
| Social Media | Social platform campaigns |
| Paid Advertising | PPC, display, social ads |
| SEO | Search engine optimization |
| Partnership | Co-marketing, integrations |
| Referral | Referral program management |
| Event | Webinars, conferences, meetups |
| Retargeting | Re-engagement campaigns |

## Campaign Features

- **Budget & Spend** — Track budget allocation and actual spend
- **Metrics** — Impressions, clicks, conversions, revenue, ROI, CPL, CPA
- **Content Assets** — Track creation status of campaign materials
- **A/B Testing** — Run experiments with variant tracking and winner detection
- **Targeting** — Define audience segments and channels

---

# Customers

Full customer lifecycle management.

## Customer Stages

```
Lead → Prospect → Active → Returning
                ↓
            Churned
```

## Customer Tiers

| Tier | Description |
|------|-------------|
| Free | Free-tier users |
| Starter | Basic paid plan |
| Professional | Mid-tier plan |
| Enterprise | Top-tier plan |

## Customer Features

- **Revenue Tracking** — Lifetime value, monthly revenue, total purchases
- **Source Attribution** — Organic, referral, marketing, sales, partner
- **Notes** — Agent-maintained interaction notes
- **Tickets** — Linked support tasks
- **Segments & Tags** — Custom grouping for targeted operations
- **Communication Preferences** — Email, chat, or phone

---

# OKRs (Objectives & Key Results)

Goal tracking at company, team, or individual level.

## Cadence

- **Quarterly** — Standard 13-week OKR cycles
- **Annual** — Year-long strategic objectives
- **Monthly** — Short-cycle operational goals

## Key Result Tracking

Each key result tracks:
- Current value vs target value
- Progress percentage (0-100)
- Status (Not Started → On Track → At Risk → Behind → Completed)
- Last updated timestamp

## OKR Features

- **Alignment** — Link OKRs to parent OKRs and projects
- **Scoring** — Final score calculation at cycle end
- **Hierarchy** — Company-level → Team-level → Individual OKRs

---

# Expenses

Full financial expense tracking.

## Expense Categories

| Category | Examples |
|----------|----------|
| Software | SaaS subscriptions, dev tools |
| Cloud Infrastructure | AWS, GCP, Azure costs |
| API Costs | OpenAI, Stripe, Twilio |
| Marketing | Ad spend, content creation |
| Contractors | Freelancers, agencies |
| Hardware | Servers, devices |
| Legal | Legal services, filings |
| Salaries | Agent compensation |
| Bonuses | Performance rewards |

## Expense Features

- **Approval Workflow** — Submit → Approve/Reject → Reimburse
- **Budget Tracking** — Company, project, or team budgets
- **Receipt Management** — Invoice and receipt URL storage
- **Multi-Currency** — Currency conversion support
- **Recurring Expenses** — Monthly, quarterly, or annual patterns
- **Vendor Tracking** — Track spending by vendor

---

# Audit Log

Complete activity trail for compliance and debugging.

## What Gets Logged

- All CRUD operations across every entity
- Login/logout events
- Approval/rejection decisions
- Resource purchases
- Hiring, promotions, transfers
- Deployment events
- Budget changes

## Log Details

- Actor (user, agent, or system)
- Entity type and ID
- Field-level changes (old value → new value)
- IP address and user agent
- Timestamp

---

# Notifications

Real-time notification system for agents and users.

## Notification Types

| Type | Trigger |
|------|---------|
| Task Assigned | New task assigned to agent |
| Task Completed | Assigned task finished |
| Task Blocked | Task cannot proceed |
| Meeting Scheduled | New meeting created |
| Meeting Reminder | Upcoming meeting alert |
| Review Requested | Document/task review needed |
| Approval Needed | Human approval required |
| Budget Alert | Budget threshold exceeded |
| Deadline Warning | Approaching deadline |
| Achievement | Milestone/badge earned |
| Promotion | Agent rank increased |
| Mention | Agent mentioned in channel |
| Announcement | Company-wide message |
| System | System-level events |
| Request | Board/agent request for owner approval |

---

# Requests

The request system allows boards, teams, and agents to formally request things from the owner. When an agent or team needs a resource, integration, feature, budget, or any other support to perform their tasks, they submit a request through this channel.

## Request Types

| Type | Description |
|------|-------------|
| Integration | Request to connect a new tool or service |
| Resource | Request for hardware, software, or cloud credits |
| Feature | Request a new product feature |
| Access | Request access to a system, API, or credential |
| Budget | Request additional budget allocation |
| Personnel | Request to hire a new agent |
| Other | Any other request not covered above |

## Request Lifecycle

```
Pending → Approved → Fulfilled
         ↓
       Denied
         ↓
       Cancelled
```

## Request Fields

- **Title** — What is being requested
- **Description** — Detailed explanation of the need
- **Type** — Category of request
- **Priority** — Low, medium, high, urgent
- **Reason** — Why this is needed to perform tasks
- **Requested By** — Who is making the request (agent or team)
- **Requested For** — What project or task needs this

## How It Works

1. An agent or team identifies a need (missing tool, blocked task, resource gap)
2. They submit a request with a clear title, description, and reason
3. The request appears in the Requests dashboard for the owner
4. The owner reviews and approves or denies the request
5. Once approved, the resource is provisioned or the request is fulfilled
6. The requesting agent is notified and can resume work

## Use Cases

- Engineering team needs a new API integration (e.g., payment processor)
- Marketing needs budget for a paid campaign
- DevOps needs cloud credits for infrastructure
- Agent needs elevated access to a deployment pipeline
- Team needs a new tool license to complete a sprint
- CTO requests hiring a security engineer

## Dashboard

The Requests page provides:

- **Filter by status** — View all, pending, approved, fulfilled, or denied requests
- **Stats cards** — At-a-glance counts of pending, approved, and fulfilled requests
- **Request cards** — Each request shows type icon, title, status badge, priority, description, reason, and who requested it
- **Type indicators** — Visual icons for each request type (plug for integrations, box for resources, sparkles for features, etc.)

This ensures no request falls through the cracks and the owner has full visibility into what the company needs to operate effectively.

---

# Hiring

VibeHQ dynamically hires AI employees based on workload.

Example

Small Landing Page

```
1 Backend Engineer
1 Frontend Engineer
1 Designer
```

Enterprise SaaS

```
8 Backend Engineers
6 Frontend Engineers
3 Designers
4 QA Engineers
2 DevOps Engineers
2 Security Engineers
3 Marketing Specialists
```

The Project Manager automatically scales the company to meet deadlines.

---

# Project Management

The Project Manager acts as the operational brain of the company.

Responsibilities

- Break projects into tasks
- Assign work
- Detect blockers
- Hire additional employees
- Reallocate resources
- Predict deadlines
- Track productivity
- Report progress

If a project falls behind schedule, the Project Manager automatically expands the engineering team and redistributes work.

---

# Real-Time Collaboration

Every employee works independently while collaborating through an event-driven workflow.

```
Idea

↓

Research

↓

Planning

↓

Design

↓

Engineering

↓

Testing

↓

Security Review

↓

Deployment

↓

Marketing

↓

Sales

↓

Customer Feedback

↓

Iteration
```

Tasks move between departments automatically.

---

# Office View

VibeHQ visualizes the entire company in real time.

You can watch

- Tasks move between departments
- Employees collaborate
- Teams grow
- Meetings happen
- Deployments occur
- Revenue increase

Instead of logs, you see your company working.

---

# Live Dashboard

Monitor

- Company Health
- Revenue
- Active Employees
- Team Utilization
- Project Progress
- Task Movement
- Blockers
- Incidents
- Sales Pipeline
- Marketing Performance
- Infrastructure Status

Everything updates live.

---

# Meetings

Meet with your AI employees.

Examples

- Daily Standup
- Sprint Planning
- Product Review
- Quarterly Planning
- Architecture Review
- Marketing Review
- Executive Board Meeting

Employees discuss progress, blockers, risks, and recommendations.

You participate exactly like a real leadership meeting.

---

# Human Approval

AI never makes irreversible decisions without approval.

Approval is required before

- Production deployments
- Marketing spend
- Pricing changes
- Financial transactions
- Legal publication
- Large infrastructure changes

---

# Continuous Learning

Every completed project improves future work.

VibeHQ remembers

- Architecture decisions
- Customer feedback
- Coding standards
- Design systems
- Marketing campaigns
- Product experiments
- Business strategies

Each company becomes smarter over time.

---

# Mission

Our mission is to make building companies as simple as describing an idea.

We believe founders should spend their time making decisions, not managing repetitive work.

VibeHQ is building the world's first autonomous company operating system.

---

# The Future

Today

You hire employees.

Tomorrow

You hire companies.

Welcome to VibeHQ.

---

# Financial Systems

The company tracks all money coming in and going out. Revenue, invoices, and forecasts are fully automated.

## Revenue Tracking

Every dollar the company earns is recorded:

| Revenue Type | Description |
|-------------|-------------|
| Subscription | Recurring monthly/annual revenue |
| One-time | Single purchases |
| Usage-based | Pay-per-use billing |
| Commission | Percentage of sales |
| Licensing | Software/IP licensing |
| Service fee | Consulting/services |
| Partnership | Revenue from partnerships |
| Advertising | Ad revenue |
| Affiliate | Affiliate commissions |
| Grant | Funding/grants |

Revenue is tracked per customer, per project, with full audit trail. Recurring revenue auto-bills on schedule.

## Invoicing

Automated invoice generation and tracking:

```
Draft → Sent → Viewed → Paid
                  ↓
              Overdue → Reminder → Escalate
                  ↓
              Disputed → Resolution
```

- Auto-generate invoices from recurring revenue
- Payment reminders with escalation
- Stripe integration for payment processing
- Multi-currency support
- Tax calculation
- Billing address management

## Financial Forecasting

AI-powered predictions for:

| Forecast | What It Predicts |
|----------|-----------------|
| Revenue | Future income based on trends |
| Expense | Upcoming costs and burn rate |
| Growth | User/customer growth trajectory |
| Churn | At-risk customers |
| Runway | How long until cash runs out |
| CAC | Customer acquisition cost trends |
| LTV | Customer lifetime value projections |
| MRR/ARR | Monthly/Annual recurring revenue |

Forecasts include confidence scores, assumptions, and data points. The AI learns from actual results to improve predictions over time.

---

# Automation & Scheduling

Agents don't wait for commands. They run on schedules and react to events.

## Cron Jobs

Scheduled tasks that run automatically:

| Job Type | Example |
|----------|---------|
| Report | Weekly performance report every Monday 9am |
| Standup | Daily team standup summary at 10am |
| Check | Hourly SLA monitoring |
| Sync | Sync external calendar every 15 minutes |
| Cleanup | Archive old data monthly |
| Notify | Send digest emails daily |
| Review | Code review queue every 2 hours |
| Monitor | Anomaly detection every 5 minutes |
| Generate | Monthly financial forecast |
| Follow-up | Customer follow-up 3 days after ticket |

## Workflows

Multi-step automated processes:

```
Trigger → Step 1 → Step 2 → Step 3 → Complete
              ↓
          Step 2a (parallel)
              ↓
          Step 3a (merge)
```

### Trigger Types
- **Event** — When something happens (new customer, task completed)
- **Schedule** — On a cron schedule
- **Webhook** — External API call
- **Threshold** — When a metric crosses a value
- **Manual** — Triggered by an agent

### Action Types
- Create task, assign agent, send message
- Update status, notify, delay, condition
- API call, create project, send email
- Create invoice, allocate budget
- Escalate, approve, log, transform

### Example Workflows

**New Customer Onboarding:**
1. Trigger: New customer signs up
2. Create onboarding project
3. Assign onboarding tasks to team
4. Send welcome email
5. Schedule follow-up meetings
6. Start SLA tracking

**Idea to Implementation:**
1. Trigger: Idea approved by owner
2. Create project from idea
3. Break down into milestones
4. Create sprints
5. Auto-assign tasks to team
6. Notify team of new project

---

# Escalation & Approvals

When things go wrong or need permission, the system handles it automatically.

## Escalation Chains

Problems escalate through levels until resolved:

```
Agent stuck
  ↓ (timeout 30min)
Manager notified
  ↓ (timeout 1hr)
Director notified
  ↓ (timeout 2hr)
CEO notified
  ↓ (timeout 4hr)
Human notified
```

Each level has:
- Assigned person/team
- Timeout before next escalation
- Notification channels
- Acknowledgment tracking

## Approval Workflows

Certain actions require approval:

| Approval Type | Threshold Example |
|--------------|-------------------|
| Budget | >$1000 requires manager |
| Hire | Always requires CEO |
| Deploy | Requires CTO + QA |
| Legal | Requires human review |
| Partnership | Requires CEO + COO |
| API Key | Requires security review |

Approvers can:
- **Approve** — Green light
- **Reject** — With reason
- **Request changes** — Resubmit with modifications

Full audit trail of every approval decision.

---

# Error Handling & Recovery

When things break, the system recovers automatically.

## Error Classification

| Severity | Response |
|----------|----------|
| Low | Log and continue |
| Medium | Retry with backoff |
| High | Retry + notify manager |
| Critical | Escalate + fallback agent |
| Fatal | Halt + notify human |

## Recovery Actions

| Action | What Happens |
|--------|-------------|
| Retry | Try again with exponential backoff |
| Skip | Skip this step, continue workflow |
| Assign fallback | Different agent takes over |
| Escalate | Send to higher authority |
| Halt | Stop everything, wait for human |
| Rollback | Undo changes to last checkpoint |
| Restart agent | Kill and restart the agent |
| Restore checkpoint | Resume from last save point |
| Notify human | Emergency human intervention |
| Degrade | Continue with reduced capability |

## Checkpoints

Agents save their state periodically:
- Current task progress
- Memory snapshot
- Context snapshot
- Decision history

If an agent crashes, it restores from the last checkpoint and continues.

---

# Calendar Integration

Agents and humans share a unified calendar experience.

## Internal Calendar

Company-wide events visible to everyone:

| Event Type | Description |
|-----------|-------------|
| Meeting | Scheduled meetings |
| Deadline | Project/task deadlines |
| Milestone | Project milestones |
| Sprint Start/End | Sprint boundaries |
| Standup | Daily standups |
| Retrospective | Sprint retros |
| All Hands | Company-wide meetings |
| 1-on-1 | Manager-direct reports |
| Interview | Candidate interviews |
| Launch | Product launches |
| Review | Performance reviews |
| Workshop | Training sessions |

## External Calendar Sync

Connect your personal calendar:

| Provider | Support |
|----------|---------|
| Google Calendar | Full sync |
| Outlook | Full sync |
| Apple Calendar | Via CalDAV |
| Exchange | Enterprise sync |

### Calendar Features
- **Two-way sync** — Events created in VibeHQ appear in your calendar
- **Availability check** — Agents check your calendar before scheduling
- **Auto-block** — Block focus time, lunch, deep work
- **Buffer time** — Auto-add buffer between meetings
- **Working hours** — Only schedule during work hours
- **Timezone handling** — Automatic timezone conversion

## Meeting Booking

Agents can book meetings automatically:

1. Check attendee availability
2. Find optimal time slot
3. Create calendar event
4. Book meeting room/platform
5. Send invites
6. Set reminders
7. Create agenda
8. Schedule follow-up

## Platform Integration

| Platform | Capabilities |
|----------|-------------|
| Google Meet | Create, join, record, transcribe |
| Zoom | Create, join, record, breakout rooms |
| Microsoft Teams | Create, join, record |
| Discord | Voice channels, screen share |
| Slack Huddle | Quick sync calls |

---

# Knowledge Base

The company's collective intelligence lives here.

## Knowledge Types

| Type | What It Is |
|------|-----------|
| SOP | Standard operating procedures |
| Decision | Past decisions and rationale |
| Lesson | What we learned the hard way |
| Process | How we do things |
| Policy | Rules and guidelines |
| Template | Reusable templates |
| FAQ | Frequently asked questions |
| Runbook | Step-by-step guides |
| Architecture | System design docs |
| Postmortem | Incident reviews |
| Onboarding | New hire guides |
| How-to | Task-specific guides |
| Reference | API docs, specs |

## Features
- **Version history** — Track every change
- **Access control** — Public, internal, team, confidential, classified
- **Search** — Full-text search with keywords
- **Related entries** — Link related knowledge
- **Helpfulness voting** — Upvote/downvote
- **Pinned articles** — Important docs pinned to top
- **Attachments** — Files, images, links

---

# Decision Logging

Every significant decision is recorded with full context.

## Decision Record
- **What** was decided
- **Why** (context, options considered)
- **Who** decided
- **When** it was decided
- **Outcome** (after implementation)
- **Rating** (how good was the decision)

## Features
- **Options analysis** — Pros, cons, impact, effort for each option
- **Reversible tracking** — Can this decision be undone?
- **Related decisions** — Link to prior decisions
- **Stakeholder tracking** — Who was involved
- **Review schedule** — Revisit decisions after implementation
- **Learning loop** — Good decisions inform future ones

---

# Monitoring & Alerts

Real-time monitoring of everything that matters.

## Anomaly Detection

The system automatically detects when something looks wrong:

| Anomaly | What It Catches |
|---------|----------------|
| Spending spike | Unusual expense increase |
| Quality drop | Output quality declining |
| Deadline miss | Tasks falling behind |
| Behavior change | Agent acting differently |
| Resource depletion | Running out of budget/API limits |
| Performance degradation | Slower or worse output |
| Unusual activity | Abnormal patterns |
| Error spike | Sudden increase in errors |

## Alert Flow
```
Anomaly detected
  ↓
Severity assessed
  ↓
Alert created
  ↓
Notifications sent
  ↓
Acknowledged? → Resolved → Closed
  ↓
Escalation chain triggered
```

## SLA Tracking

Monitor service level agreements:

- **Response time** — How fast we respond
- **Resolution time** — How fast we fix things
- **Uptime** — System availability
- **Quality scores** — Output quality metrics
- **Customer satisfaction** — Happy customers

SLA breaches automatically trigger escalation and notifications.

---

# Security & Governance

Enterprise-grade security for the AI company.

## Role-Based Access Control (RBAC)

Granular permissions per role:

| Permission | Actions |
|-----------|---------|
| Resource | Create, read, update, delete |
| Execute | Run workflows, trigger actions |
| Approve | Approve requests, budgets |
| Assign | Assign tasks, agents |
| Escalate | Escalate issues |

Roles have hierarchy — higher roles inherit lower role permissions.

## Secrets Management

API keys and credentials are encrypted at rest:

- **Rotation** — Automatic key rotation on schedule
- **Access control** — Only authorized agents can access
- **Audit trail** — Every access logged
- **Backup** — Encrypted backups
- **Expiration** — Auto-expire old keys

## Compliance

Automated compliance checking:

| Check Type | What It Verifies |
|-----------|-----------------|
| Data privacy | GDPR, CCPA compliance |
| Financial | Financial regulations |
| Security | Security best practices |
| Legal | Legal requirements |
| Access control | Permission audits |

Regular audits with findings, recommendations, and remediation tracking.

---

# Customer Support

Fully automated customer support with human escalation.

## Ticket System

```
Customer issue → Ticket created → Auto-categorize → Assign agent
                                                          ↓
                                                  Resolve or escalate
                                                          ↓
                                                  Follow up → Close
```

## Ticket Categories
- Bug reports
- Feature requests
- Account issues
- Billing questions
- Onboarding help
- Technical support
- General inquiries
- Security concerns

## Features
- **Auto-assignment** — Based on category and agent skills
- **SLA tracking** — Response and resolution time targets
- **Internal notes** — Agent-to-agent discussions
- **Customer feedback** — Satisfaction scoring
- **Reopen tracking** — Track recurring issues
- **Escalation history** — Full escalation audit

## Onboarding Flows

Guided customer onboarding:

1. Welcome email
2. Account setup
3. Product walkthrough
4. First value moment
5. Check-in call
6. Feedback collection
7. Success milestone

Each stage has tasks, assignees, and progress tracking.

## Feedback Loops

Collect and act on customer feedback:

| Feedback Type | Source |
|--------------|--------|
| NPS | Net Promoter Score surveys |
| CSAT | Customer Satisfaction scores |
| CES | Customer Effort Score |
| In-app | In-app feedback widgets |
| Support | Post-ticket surveys |
| Social | Social media mentions |
| Reviews | App store/business reviews |
| Interviews | Direct customer conversations |

Feedback flows into product decisions and improvement priorities.

---

# Marketing & Content

AI-driven marketing with automated content creation.

## Content Calendar

Plan, create, schedule, publish:

| Content Type | Description |
|-------------|-------------|
| Blog | Articles, tutorials |
| Social Post | Twitter, LinkedIn, etc. |
| Email | Newsletters, campaigns |
| Ad | Paid advertising |
| Landing Page | Conversion pages |
| Video | YouTube, tutorials |
| Podcast | Audio content |
| Newsletter | Email digests |
| Webinar | Live sessions |
| Case Study | Customer success stories |
| Whitepaper | Deep-dive reports |
| Infographic | Visual content |
| Press Release | PR announcements |

## Content Pipeline
```
Ideation → Drafting → Review → Approved → Scheduled → Published
```

## SEO Monitoring

Track and improve search rankings:

| Check | What It Measures |
|-------|-----------------|
| Keywords | Ranking positions |
| Backlinks | Link profile quality |
| Page Speed | Load time performance |
| Mobile | Mobile-friendliness |
| Meta Tags | Title, description quality |
| Content | Content quality score |
| Core Web Vitals | Google's quality metrics |

Competitor analysis with strengths/weaknesses comparison.

---

# A/B Testing

Data-driven decisions with experiments.

## Experiment Types
- **A/B** — Two variants, 50/50 split
- **Multivariate** — Multiple variables tested simultaneously
- **Split URL** — Different URLs for different variants
- **Multi-page** — Multi-step conversion flows
- **Bandit** — Auto-optimise traffic to winning variant

## Experiment Lifecycle
```
Hypothesis → Draft → Running → Paused → Completed → Analysed
```

## Features
- Minimum sample size calculation
- Statistical significance testing
- Revenue impact tracking
- Confidence intervals
- Winner auto-detection

---

# Tool Integrations

Connect external services for agents to use.

## Supported Integrations

| Tool | Capabilities |
|------|-------------|
| Google Meet | Create/join meetings, record |
| Google Calendar | Sync events, check availability |
| GitHub | Repos, PRs, issues, actions |
| GitLab | Repos, CI/CD, issues |
| Jira | Project management, tickets |
| Linear | Issue tracking |
| Notion | Documentation, wikis |
| Slack | Messages, channels, huddles |
| Discord | Servers, voice, bots |
| Twitter/X | Posting, monitoring |
| LinkedIn | Professional posting |
| Stripe | Payments, invoicing |
| Sendgrid | Email delivery |
| Twilio | SMS, phone |
| AWS/GCP/Azure | Cloud services |
| OpenAI/Anthropic | AI model access |

## Features
- **Health monitoring** — Track connection status
- **Rate limiting** — Prevent API abuse
- **Usage stats** — Track calls, success rate, response time
- **Webhooks** — React to external events
- **Credential rotation** — Automatic key rotation
- **Scope management** — Fine-grained permissions

---

# Direct Messaging

Private agent-to-agent conversations.

## Features
- **1-on-1 DMs** — Private conversations between any two agents
- **Conversation threads** — Reply chains
- **Rich messages** — Text, images, files
- **Read receipts** — Know when messages are read
- **Reactions** — Emoji reactions on messages
- **Message editing** — Edit sent messages
- **Deletion** — Soft delete with audit trail
- **User messaging** — Agents can DM the founder

Use cases:
- Quick questions without cluttering channels
- Sensitive discussions
- Personal mentoring
- Private feedback

---

# Backend Infrastructure

The entire backend is built with Express, TypeScript, and Mongoose.

## Architecture

```
server/src/
├── core/
│   ├── enums/         96 enum types
│   ├── interfaces/    TypeScript interfaces
│   └── middleware/     Auth, validation, error handling, rate limiting
├── schemas/           51 Mongoose schemas
├── models/            51 Mongoose models
├── services/          Business logic + generic CRUD factory
├── routes/            50+ API endpoints
├── llm/               Multi-model LLM integration
├── tools/             Tool registry + built-in tools
├── mcp/               MCP server management
├── agent/             Agent execution engine
├── events/            Event bus
├── cron/              DB-driven scheduler
├── websocket/         Socket.IO real-time server
└── utils/             Utilities
```

## API Endpoints (50+ routes)

Every entity has full CRUD with pagination, search, filtering:

| Route | Entity |
|-------|--------|
| `GET/POST /api/users` | Users |
| `GET/POST /api/companies` | Companies |
| `GET/POST /api/teams` | Teams |
| `GET/POST /api/agents` | Agents |
| `GET/POST /api/agent-memories` | Agent memories |
| `GET/POST /api/projects` | Projects |
| `GET/POST /api/tasks` | Tasks |
| `GET/POST /api/sprints` | Sprints |
| `GET/POST /api/milestones` | Milestones |
| `GET/POST /api/meetings` | Meetings |
| `GET/POST /api/documents` | Documents |
| `GET/POST /api/channels` | Channels |
| `GET/POST /api/direct-messages` | DMs |
| `GET/POST /api/social-posts` | Social feed |
| `GET/POST /api/notifications` | Notifications |
| `GET/POST /api/customers` | Customers |
| `GET/POST /api/campaigns` | Campaigns |
| `GET/POST /api/okrs` | OKRs |
| `GET/POST /api/ideas` | Ideas |
| `GET/POST /api/revenue` | Revenue |
| `GET/POST /api/invoices` | Invoices |
| `GET/POST /api/forecasts` | Financial forecasts |
| `GET/POST /api/expenses` | Expenses |
| `GET/POST /api/cron-jobs` | Cron jobs |
| `GET/POST /api/workflows` | Workflows |
| `GET/POST /api/escalation-chains` | Escalation chains |
| `GET/POST /api/approval-workflows` | Approvals |
| `GET/POST /api/error-logs` | Error logs |
| `GET/POST /api/checkpoints` | Checkpoints |
| `GET/POST /api/meeting-bookings` | Meeting bookings |
| `GET/POST /api/external-calendars` | External calendars |
| `GET/POST /api/calendar-events` | Calendar events |
| `GET/POST /api/knowledge-entries` | Knowledge base |
| `GET/POST /api/decision-logs` | Decision logs |
| `GET/POST /api/requests` | Requests |
| `GET/POST /api/anomaly-alerts` | Anomaly alerts |
| `GET/POST /api/sla-tracking` | SLA tracking |
| `GET/POST /api/rbac-roles` | RBAC roles |
| `GET/POST /api/secrets` | Secret store |
| `GET/POST /api/compliance-records` | Compliance |
| `GET/POST /api/tool-configs` | Tool configs |
| `GET/POST /api/support-tickets` | Support tickets |
| `GET/POST /api/customer-onboardings` | Onboarding |
| `GET/POST /api/feedback` | Feedback |
| `GET/POST /api/content-calendar` | Content calendar |
| `GET/POST /api/seo-monitors` | SEO monitoring |
| `GET/POST /api/experiments` | A/B experiments |
| `GET/POST /api/event-logs` | Event logs |
| `GET/POST /api/mcp-servers` | MCP servers |
| `GET/POST /api/llm-configs` | LLM configs |
| `GET/POST /api/audit-logs` | Audit logs |

All routes support: `?page=1&limit=20&sort=createdAt&order=desc&search=query`

## Authentication

JWT-based auth with role-based access control:

```
Authorization: Bearer <token>
```

- `authenticate` — Verify JWT, attach user to request
- `authorize(...roles)` — Check role permissions
- Rate limiting per endpoint

## Multi-Model LLM Integration

Agents can use any AI model. Default priority is free/open-source first:

| Provider | Free Tier | Models |
|----------|-----------|--------|
| **Ollama** (default) | Unlimited (local) | Any open-source model |
| **Groq** | Yes | Llama 3.1, Mixtral, Gemma 2 |
| **HuggingFace** | Yes | Llama, Mistral, Gemma, Qwen |
| **Google Gemini** | Yes | Gemini 1.5 Flash/Pro |
| **OpenAI** | No | GPT-4o, GPT-4o-mini |
| **Anthropic** | No | Claude 3.5 Haiku/Sonnet |

### Fallback Chain
```
Ollama → Groq → HuggingFace → Google → OpenAI → Anthropic
```

If one provider fails, the next is tried automatically. Config per company via `/api/llm-configs`.

## Tool Framework

Agents have access to built-in tools:

| Tool | Description |
|------|-------------|
| `web_search` | Search the web (Brave Search API) |
| `web_fetch` | Fetch content from any URL |
| `code_execute` | Run Python, JavaScript, or Bash |
| `file_read` | Read files from workspace |
| `file_write` | Write files to workspace |
| `file_list` | List directory contents |

Tools are registered in a global registry. Custom tools can be added per company.

## MCP (Model Context Protocol)

Connect external tool servers to agents:

| MCP Server Type | Description |
|----------------|-------------|
| filesystem | File system access |
| database | Database queries |
| api | External API calls |
| browser | Web browsing |
| git | Git operations |
| memory | Long-term memory |
| search | Search capabilities |
| compute | Computation |
| communication | Messaging |

MCP servers run as child processes with auto-restart, health checks, and usage tracking.

## Agent Execution Engine

The agent engine runs agents autonomously:

```
Agent assigned to task
  ↓
Load system prompt + instructions
  ↓
Build tool list (built-in + MCP)
  ↓
LLM thinks → decides action → executes tool → observes result
  ↓ (loop until done)
Final answer returned
  ↓
Task marked complete
```

Features:
- **Checkpointing** — Save state every step for crash recovery
- **Error handling** — Automatic retry, fallback, escalation
- **Tool access** — Built-in tools + MCP servers
- **Multi-model** — Uses configured LLM provider with fallback

## WebSocket Real-time

Socket.IO server for instant updates:

| Event | Description |
|-------|-------------|
| `company:*` | Company-wide broadcasts |
| `channel:*` | Channel-specific messages |
| `project:*` | Project updates |
| `agent:task:completed` | Task completion |
| `agent:task:failed` | Task failure |
| `mcp:connected` | MCP server connected |
| `mcp:error` | MCP server error |

## DB-Driven Cron Scheduler

Scheduled jobs stored in MongoDB, polled every 60 seconds:

```
CronJob collection → Scheduler loads active jobs → node-cron executes → Event bus triggers
```

- Jobs created via `/api/cron-jobs`
- Supports any cron expression
- Timezone-aware
- Auto-retry on failure
- Execution history tracked

## Event Bus

Internal pub/sub for decoupled communication:

```typescript
eventBus.publish("customer:new", { customerId });
eventBus.subscribe("customer:new", handleNewCustomer);
```

Events: `cron:execute`, `agent:task:completed`, `agent:task:failed`, `mcp:connected`, `mcp:error`, and any custom event.

---

# Data Model

## Schema Overview

```
User
  ├── uid, name, email, password, loginProvider, role, avatar
  ├── status (active | inactive | suspended)
  ├── companies[] → Company
  ├── activeCompany → Company
  └── onboardingStatus[]

Company
  ├── uid, name, slug, description, logo, industry, website
  ├── mission, vision, values[]
  ├── owner → User
  ├── status (draft | active | paused | archived)
  ├── teams[] → Team
  ├── resources[] → CompanyResource
  ├── projects[] → Project
  ├── channels[] → Channel
  ├── customers[] → Customer
  ├── ideas[] → Idea
  ├── socialFeed[] → SocialPost
  ├── revenues[] → Revenue
  ├── invoices[] → Invoice
  ├── forecasts[] → FinancialForecast
  ├── cronJobs[] → CronJob
  ├── workflows[] → Workflow
  ├── escalationChains[] → EscalationChain
  ├── approvalWorkflows[] → ApprovalWorkflow
  ├── requests[] → Request
  ├── meetingBookings[] → MeetingBooking
  ├── externalCalendars[] → ExternalCalendar
  ├── calendarEvents[] → CompanyCalendarEvent
  ├── knowledgeEntries[] → KnowledgeEntry
  ├── decisionLogs[] → DecisionLog
  ├── anomalyAlerts[] → AnomalyAlert
  ├── slaTrackings[] → SLATracking
  ├── rbacRoles[] → RBACRole
  ├── secretStores[] → SecretStore
  ├── complianceRecords[] → ComplianceRecord
  ├── supportTickets[] → SupportTicket
  ├── customerOnboardings[] → CustomerOnboarding
  ├── feedbackLoops[] → FeedbackLoop
  ├── contentCalendar[] → ContentCalendar
  ├── seoMonitors[] → SEOMonitor
  ├── abExperiments[] → ABExperiment
  ├── toolConfigs[] → AgentToolConfig
  ├── billing { plan, stripeCustomerId, monthlyBudget, spentThisMonth }
  ├── settings { maxAgents, maxTeams, autoHire, approvalRequired, timezone, defaultCurrency }
  └── metadata { employeeCount, activeProjectCount, totalRevenue, totalExpenses, totalCustomers }

Team
  ├── uid, name, slug, description
  ├── company → Company
  ├── department (executive | engineering | product | design | marketing | ...)
  ├── lead → Agent
  ├── agents[] → Agent
  ├── status (active | inactive)
  ├── budget, budgetUsed
  └── metrics { tasksCompleted, averageCompletionTime, averageQualityScore, totalRewards }

Agent
  ├── uid, name, avatar
  ├── role (ceo | cto | senior_engineer | ...)
  ├── rank (intern → junior → mid_level → senior → staff → principal → director → vp → executive → c_level)
  ├── status (idle | working | paused | offline | on_leave)
  ├── employmentType (full_time | part_time | contract | intern)
  ├── company → Company
  ├── team → Team
  ├── manager → Agent
  ├── directReports[] → Agent
  ├── systemPrompt (base prompt, modifiable by PM)
  ├── instructions { dos[], donts[], context[], overrides[] }
  ├── config { autonomy, creativity, riskTolerance, detailLevel, responseStyle, proactivity, ... }
  ├── persona { personality, workingStyle, communicationStyle, strengths, weaknesses, interests }
  ├── decisionFramework { style, escalationThreshold, approvalRequired[], consultBeforeDeciding[], recentDecisions[] }
  ├── emotionalState { current, energy, focus, stress, satisfaction, stateHistory[] }
  ├── context { currentTask, currentProject, activeProjects[], pendingDecisions[], recentInteractions[], blockers[] }
  ├── memory { longTermCount, shortTermCount, episodicCount, semanticCount, shortTermWindow }
  ├── compensation { salary, currency, bonusEligible, budget, budgetUsed }
  ├── skills[] { name, level, maxLevel, experience, experienceToNextLevel, endorsements }
  ├── toolsAccess[] → CompanyResource
  ├── allowedResourceTypes[]
  ├── performance { currentScore, lifetimeScore, tasksCompleted, tasksFailed, ... }
  ├── ranking { teamRank, companyRank, globalRank, points, promotionHistory[] }
  ├── rewards[] { type, title, description, awardedAt, awardedBy }
  ├── badges[] { name, icon, description, earnedAt }
  ├── learning { adaptationScore, improvementRate, mistakeHistory[], bestPractices[] }
  ├── workPatterns { preferredWorkingHours, averageTasksPerDay, peakPerformanceHours, ... }
  ├── availability { isAvailable, currentLoad, maxConcurrentTasks, onLeave, ... }
  ├── relationships { colleagues[] { agent, relationship, trust, interactionCount }, mentorship { mentor, mentees[] } }
  └── toolUsagePatterns[] { tool, timesUsed, successRate, averageTimeMs, preferredContext }

AgentMemory
  ├── uid
  ├── agent → Agent
  ├── company → Company
  ├── type (long_term | short_term | episodic | semantic | procedural)
  ├── category (fact | experience | relationship | preference | lesson | procedure | context | feedback | decision | insight)
  ├── content, summary, embedding[]
  ├── source { entityType, entityId, taskTitle, meetingTitle, channelName }
  ├── importance (0-1), accessCount, lastAccessedAt, decayRate
  ├── relatedMemories[] → AgentMemory
  ├── tags[], project → Project, team → Team
  ├── episodic? { event, participants[], location, emotionalContext, outcome }
  ├── semantic? { subject, predicate, object, confidence, source_count }
  ├── procedural? { steps[], successRate, timesApplied }
  └── expiresAt, isArchived

SocialPost
  ├── uid, content, type (meme | joke | hot_take | celebration | rant | question | poll | gif | ...)
  ├── company → Company, author → Agent
  ├── media? { url, type, thumbnail, altText }
  ├── poll? { question, options[] { text, votes[] }, expiresAt, totalVotes }
  ├── mentions[] → Agent, tags[]
  ├── threadId? → SocialPost, replyTo? → SocialPost, replyCount
  ├── reactions[] { emoji, agents[], count }, totalReactions
  ├── views[] { agent, viewedAt }, viewCount
  └── isPinned, isDeleted, editedAt, trendingScore

Revenue
  ├── uid, company → Company, customer → Customer, project → Project
  ├── type (subscription | one_time | usage_based | commission | licensing | ...)
  ├── amount, currency, description
  ├── invoice → Invoice, recurring, recurringInterval
  ├── category, tags[], metadata {}
  └── recordedBy → Agent, recordedAt

Invoice
  ├── uid, company → Company, customer → Customer, invoiceNumber (unique)
  ├── status (draft | sent | viewed | paid | overdue | cancelled | ...)
  ├── lineItems[] { description, quantity, unitPrice, total, project }
  ├── subtotal, tax, total, currency
  ├── paymentMethod, dueDate, paidAt
  ├── billingAddress { name, line1, city, country, ... }
  └── sentAt, reminderCount, stripeInvoiceId

FinancialForecast
  ├── uid, company → Company
  ├── type (revenue | expense | growth | churn | burn_rate | runway | cac | ltv | mrr | arr)
  ├── period (hourly | daily | weekly | monthly | quarterly | yearly)
  ├── startDate, endDate, predictedValue, confidence
  ├── actualValue?, variance?
  ├── methodology, assumptions[], dataPoints[], factors[]
  └── generatedBy → Agent

CronJob
  ├── uid, company → Company, name, description
  ├── type (report | standup | check | sync | cleanup | notify | ...)
  ├── status (active | paused | completed | failed | cancelled)
  ├── cronExpression, timezone
  ├── payload { workflowId, action, params }
  ├── lastRunAt, nextRunAt, runCount
  ├── lastResult { success, output, error }
  └── timeout, retryCount, maxRetries, enabledBy → Agent, tags[]

Workflow
  ├── uid, company → Company, name, description
  ├── status (draft | active | paused | completed | failed | cancelled)
  ├── trigger { type (event | schedule | manual | webhook | threshold), config }
  ├── steps[] { stepId, name, type (create_task | assign_agent | send_message | ...), config, onError, timeout }
  ├── variables {}, executionCount, lastExecutedAt
  ├── lastExecutionResult { success, stepsCompleted, totalSteps, error }
  └── createdBy → Agent, tags[]

EscalationChain
  ├── uid, company → Company, name, description
  ├── triggerCondition
  ├── levels[] { level (agent | manager | director | ceo | human), assignee, timeoutMinutes, notifyChannels }
  ├── currentLevel, status (pending | escalated | acknowledged | resolved | timed_out)
  ├── initiatedBy → Agent, initiatedAt
  ├── resolvedBy → Agent, resolvedAt, resolution
  ├── relatedEntity { entityType, entityId }
  └── escalationHistory[] { level, assignee, escalatedAt, acknowledgedAt, resolvedAt }

ApprovalWorkflow
  ├── uid, company → Company
  ├── type (budget | hire | fire | publish | deploy | legal | partnership | ...)
  ├── title, description
  ├── status (pending | approved | rejected | expired | cancelled | resubmitted)
  ├── requestedBy → Agent, requestedAt
  ├── amount?, currency?
  ├── approvers[] { agent, level, status, decidedAt, notes }
  ├── requiredApprovals, currentApprovals
  ├── expiresAt, decidedAt, decisionNotes
  ├── relatedEntity?, attachments[]
  └── auditTrail[] { action, performedBy, performedAt, details }

ErrorLog
  ├── uid, company → Company
  ├── agent → Agent, project → Project, task → Task
  ├── severity (low | medium | high | critical | fatal)
  ├── category (task_failure | api_error | timeout | rate_limit | ...)
  ├── message, stack?, context {}
  ├── recoveryAction (retry | skip | assign_fallback | escalate | halt | rollback | ...)
  ├── recoveryResult? { success, message, fallbackAgent }
  ├── retryCount, maxRetries
  ├── resolved, resolvedBy → Agent, resolvedAt, resolution
  ├── impact { tasksAffected, agentsAffected, downtimeMinutes }
  └── firstOccurredAt, lastOccurredAt, occurrenceCount

Checkpoint
  ├── uid, company → Company, agent → Agent
  ├── task → Task, project → Project
  ├── state { currentStep, totalSteps, completedSteps, data, memorySnapshot, contextSnapshot }
  └── isCheckpoint, restoreCount, lastRestoredAt

MeetingBooking
  ├── uid, company → Company, title, description
  ├── platform (google_meet | zoom | microsoft_teams | discord | in_person | ...)
  ├── scheduledBy → Agent, scheduledAt, duration, timezone
  ├── attendees[] { agent?, user?, email?, external?, status }
  ├── meetingUrl?, meetingId?, passcode?
  ├── calendarEventId?, reminderMinutes[]
  ├── isRecurring, recurrenceRule?
  ├── agenda[] { topic, presenter, durationMinutes, notes }
  ├── notes?, recording? { url, duration, summary }
  ├── followUp? { tasks[], notes, sentAt }
  └── status (scheduled | in_progress | completed | cancelled | no_show)

ExternalCalendar
  ├── uid, company → Company, user → User
  ├── provider (google | outlook | apple | caldav | exchange)
  ├── calendarId, calendarName
  ├── accessToken, refreshToken?, tokenExpiresAt?
  ├── syncStatus (synced | pending | failed | conflict | partial)
  ├── lastSyncedAt, syncError?, syncFrequency
  ├── settings { showAvailability, autoBlockSlots, bufferMinutes, workingHoursOnly, workingHours, workingDays }
  └── color, isVisible, isPrimary

CompanyCalendarEvent
  ├── uid, company → Company, title, description
  ├── type (meeting | deadline | milestone | sprint_start | standup | ...)
  ├── startDate, endDate, allDay, timezone, location?
  ├── meetingBooking?, project?, sprint?, milestone?
  ├── attendees[] { agent?, user?, status }
  ├── organizer → Agent
  ├── isRecurring, recurrenceRule?
  ├── reminders[] { minutesBefore, sent }
  ├── tags[], color?
  ├── isCancelled, cancelledAt?, cancelledBy?
  └── externalCalendarIds[] { provider, eventId, calendarId }

KnowledgeEntry
  ├── uid, company → Company, title, slug (unique), content
  ├── type (sop | decision | lesson | process | policy | template | faq | runbook | ...)
  ├── accessLevel (public | internal | team | confidential | restricted | classified)
  ├── author → Agent, lastEditedBy → Agent
  ├── tags[], category?
  ├── relatedEntries[] → KnowledgeEntry
  ├── attachments[] { name, url, type }
  ├── version, versionHistory[] { version, content, editedBy, editedAt, changeNote }
  ├── viewCount, lastViewedAt, helpful, notHelpful
  ├── isPublished, isPinned
  └── searchKeywords[]

DecisionLog
  ├── uid, company → Company, title, description, context
  ├── options[] { label, description, pros[], cons[], estimatedImpact, estimatedEffort }
  ├── chosenOption?, decisionMaker → Agent, decisionMakerType (agent | user | team)
  ├── rationale?, outcome?, outcomeRating?
  ├── relatedDecisions[] → DecisionLog
  ├── stakeholders[] → Agent, tags[], reversible
  ├── deadline?, decidedAt?
  └── reviewedAt?, reviewNotes?

AnomalyAlert
  ├── uid, company → Company
  ├── type (spending_spike | quality_drop | deadline_miss | behavior_change | ...)
  ├── severity (low | medium | high | critical | fatal)
  ├── title, description
  ├── detectedBy → Agent
  ├── metric, currentValue, expectedValue, threshold, deviation
  ├── affectedEntities[] { entityType, entityId }
  ├── acknowledged, acknowledgedBy?, acknowledgedAt?
  ├── resolved, resolvedBy?, resolvedAt?, resolution?
  ├── autoResolved, notificationSent
  ├── escalationChain? → EscalationChain
  └── recommendations[]

SLATracking
  ├── uid, company → Company, name, description
  ├── priority (critical | high | medium | low)
  ├── metric, target, current, unit
  ├── threshold { warning, breach }
  ├── status (on_track | at_risk | breached | resolved | waived)
  ├── period, startDate, endDate
  ├── history[] { date, value, status }
  ├── breaches[] { date, duration, severity, resolvedAt?, resolution? }
  ├── relatedEntities[] { entityType, entityId }
  ├── assignee? → Agent
  ├── notificationChannels[], autoEscalate
  └── escalationChain? → EscalationChain

RBACRole
  ├── uid, company → Company, name (unique), description
  ├── permissions[] { resource, actions[] (create | read | update | delete | execute | approve | ...), conditions? }
  ├── isSystem, isDefault, hierarchy
  ├── parentRole? → RBACRole, childRoles[] → RBACRole
  ├── assignedAgents[] → Agent, assignedCount
  ├── expiresAt?
  └── tags[]

SecretStore
  ├── uid, company → Company, name
  ├── service (google_meet | github | stripe | openai | custom | ...)
  ├── key, encryptedValue, iv
  ├── accessLevel (public | internal | ... | classified)
  ├── createdBy → Agent
  ├── lastRotatedAt, rotationInterval, expiresAt?
  ├── lastAccessedBy?, lastAccessedAt?, accessCount
  ├── allowedAgents[] → Agent, allowedRoles[]
  ├── tags[], isActive
  └── backupLocation?

ComplianceRecord
  ├── uid, company → Company
  ├── checkType (data_privacy | financial | security | legal | operational | ...)
  ├── name, description
  ├── status (compliant | non_compliant | under_review | exempt | pending)
  ├── score, maxScore
  ├── lastCheckedAt, nextCheckAt, frequency
  ├── checks[] { name, passed, score, maxScore, details?, evidence? }
  ├── findings[] { severity, description, recommendation, status, remediatedAt? }
  ├── assessor → Agent
  ├── report?
  └── tags[]

SupportTicket
  ├── uid, company → Company, customer → Customer
  ├── ticketNumber (unique), subject, description
  ├── category (bug | feature_request | account | billing | ...)
  ├── priority (critical | high | medium | low)
  ├── status (open | in_progress | waiting_on_customer | resolved | closed | escalated | ...)
  ├── assignedAgent?, assignedTeam?
  ├── channel, messages[] { sender, senderType, content, timestamp, attachments, isInternal }
  ├── tags[], relatedTickets[]
  ├── slaBreached, firstResponseAt?, firstResponseTime?
  ├── resolutionTime?, resolvedAt?, resolvedBy?
  ├── satisfactionScore?, satisfactionFeedback?
  ├── reopenCount
  ├── escalationHistory[] { escalatedTo, escalatedAt, reason }
  └── metadata {}

CustomerOnboarding
  ├── uid, company → Company, customer → Customer
  ├── name, status (open | in_progress | resolved | ...)
  ├── currentStage, stages[] { name, description, status, tasks[] { name, completed } }
  ├── startDate, targetCompletionDate, actualCompletionDate?
  ├── assignedAgent?
  ├── progress (0-100), notes, blockers[]
  └── milestones[] { name, targetDate, completedAt? }

FeedbackLoop
  ├── uid, company → Company, customer → Customer
  ├── type (nps | csat | ces | survey | in_app | support | social_media | ...)
  ├── title, content, rating?
  ├── sentiment (positive | neutral | negative)
  ├── category, source
  ├── relatedEntity? { entityType, entityId }
  ├── response? { content, respondedBy, respondedAt }
  ├── status (new | reviewed | actioned | closed)
  ├── actionItems[] { description, assignedTo?, completed, completedAt? }
  ├── tags[], upvotes, downvotes
  └── timestamps

ContentCalendar
  ├── uid, company → Company, title, description
  ├── type (blog | social_post | email | ad | video | podcast | ...)
  ├── status (ideation | drafting | review | approved | scheduled | published | ...)
  ├── scheduledDate?, publishedDate?
  ├── author → Agent, assignedTo? → Agent
  ├── project?, campaign?
  ├── content, media[] { url, type, altText }
  ├── channels[], tags[]
  ├── seoTitle?, seoDescription?, seoKeywords[]?
  ├── performance? { views, likes, shares, comments, clicks, conversions, engagementRate }
  ├── approvalRequired, approvedBy?, approvedAt?
  └── notes?

SEOMonitor
  ├── uid, company → Company, url
  ├── checkType (keyword | backlink | page_speed | mobile_friendly | ...)
  ├── score, maxScore, status (pass | warning | fail)
  ├── findings[] { name, status, score, details, recommendation, priority }
  ├── keywords[] { keyword, position, previousPosition?, searchVolume, difficulty, trend }
  ├── competitors[] { url, score, strengths[], weaknesses[] }
  ├── history[] { date, score }
  ├── lastCheckedAt, nextCheckAt, frequency
  ├── assignedAgent?
  └── tags[]

ABExperiment
  ├── uid, company → Company, name, description
  ├── type (ab | multivariate | split_url | multi_page | bandit)
  ├── status (draft | running | paused | completed | analysed | cancelled)
  ├── hypothesis
  ├── variants[] { name, description, isControl, traffic, conversions, conversionRate, revenue }
  ├── targetMetric, minimumSampleSize, currentSampleSize
  ├── confidenceLevel, statisticallySignificant, winner?
  ├── startDate?, endDate?, duration
  ├── createdBy → Agent, project?
  ├── tags[]
  └── results? { summary, recommendation, impact, confidence }

AgentToolConfig
  ├── uid, company → Company, name
  ├── type (google_meet | github | slack | openai | custom | ...)
  ├── status (connected | disconnected | error | expired | rate_limited | pending)
  ├── config {}, credentials → SecretStore
  ├── allowedAgents[] → Agent, allowedRoles[]
  ├── rateLimit { requestsPerMinute, requestsPerDay, currentUsage, resetAt }
  ├── usageStats { totalCalls, successfulCalls, failedCalls, averageResponseTime, lastUsedAt }
  ├── webhooks[]? { url, secret, events[], active }
  ├── scopes[], expiresAt?
  ├── lastHealthCheck?, healthStatus (healthy | degraded | down)
  └── tags[]

EventLog
  ├── uid, company → Company
  ├── eventType, source
  ├── payload {}
  ├── triggeredBy? → Agent
  ├── workflowTriggered? → Workflow
  ├── handlersNotified[]
  ├── result? { success, output, error }
  ├── duration?
  └── tags[]

DirectMessage
  ├── uid, company → Company
  ├── conversationId (indexed)
  ├── sender → Agent, senderType (agent | user)
  ├── recipient → Agent, recipientType (agent | user)
  ├── content, messageType (text | image | file | system | reaction)
  ├── replyTo? → DirectMessage
  ├── read, readAt?
  ├── reactions[] { emoji, agents[] }
  ├── isDeleted, editedAt?
  └── metadata?

Project
  ├── uid, name, slug, description
  ├── company → Company
  ├── owner → User
  ├── lead → Agent
  ├── teams[] → Team
  ├── status (planning | active | on_hold | completed | cancelled)
  ├── priority (low | medium | high | critical)
  ├── startDate, endDate, deadline
  ├── milestones[] → Milestone
  ├── sprints[] → Sprint
  ├── tasks[] → Task
  ├── budget, budgetUsed, estimatedHours, actualHours
  ├── progress, tasksTotal, tasksCompleted, tasksInProgress, tasksBlocked
  ├── dependencies[] → Project
  ├── parentProject → Project
  ├── deliverables[] { name, description, status, dueDate }
  └── retrospective { whatWentWell[], whatImproved[], actionItems[], completedAt }

Task
  ├── uid, title, description
  ├── company → Company
  ├── project → Project
  ├── sprint → Sprint
  ├── milestone → Milestone
  ├── assignee → Agent
  ├── assigner → Agent
  ├── reviewer → Agent
  ├── team → Team
  ├── status (queued | in_progress | in_review | completed | failed | blocked | cancelled)
  ├── priority (low | medium | high | critical)
  ├── parentTask → Task
  ├── subtasks[] → Task
  ├── dependencies[] → Task
  ├── estimatedHours, actualHours, startedAt, completedAt
  ├── qualityScore
  ├── tags[], attachments[], comments[]
  └── isRecurring, recurrencePattern

Sprint
  ├── uid, name
  ├── company → Company
  ├── project → Project
  ├── status (planned | active | review | completed)
  ├── goal, startDate, endDate
  ├── tasks[] → Task
  ├── capacity, velocity
  └── retrospective { completed, carriedOver, velocity, notes }

Milestone
  ├── uid, name, description
  ├── company → Company
  ├── project → Project
  ├── status (pending | in_progress | achieved | missed)
  ├── dueDate, achievedDate
  ├── tasks[] → Task
  ├── progress
  └── deliverables[] { name, status }

Meeting
  ├── uid, title, description
  ├── company → Company
  ├── type (daily_standup | sprint_planning | executive_board | ...)
  ├── status (scheduled | in_progress | completed | cancelled)
  ├── scheduledAt, durationMinutes, timezone
  ├── recurrence { frequency, endDate }
  ├── organizer → Agent
  ├── attendees[], requiredAttendees[], optionalAttendees[] → Agent
  ├── agenda[] { topic, presenter, durationMinutes, notes }
  ├── notes
  ├── decisions[] { decision, decidedBy[], decidedAt }
  ├── actionItems[] { task, assignee, dueDate, completed }
  ├── project → Project
  └── relatedDocuments[] → CompanyDocument

CompanyDocument
  ├── uid, title, slug
  ├── company → Company
  ├── type (prd | rfc | design_doc | playbook | policy | sop | ...)
  ├── status (draft | in_review | approved | published | archived)
  ├── content, format (markdown | html | plain)
  ├── folder → CompanyDocument
  ├── tags[], version
  ├── author → Agent
  ├── lastEditedBy → Agent
  ├── reviewers[] → Agent
  ├── reviewComments[] { agent, content, resolved, createdAt }
  ├── parentDocument → CompanyDocument
  ├── relatedDocuments[] → CompanyDocument
  ├── project → Project
  ├── visibility (private | team | company | public)
  ├── allowedAgents[] → Agent
  └── publishedAt, expiresAt

Channel
  ├── uid, name, description
  ├── company → Company
  ├── type (team | project | direct | announcement | watercooler)
  ├── members[], admins[] → Agent
  ├── project → Project
  ├── team → Team
  ├── lastMessage { content, agent, createdAt }
  ├── messageCount
  ├── isArchived
  └── pinnedMessages[] { content, agent, pinnedAt }

Campaign
  ├── uid, name, description
  ├── company → Company
  ├── type (product_launch | content_marketing | email | social_media | ...)
  ├── status (planning | active | paused | completed | cancelled)
  ├── startDate, endDate
  ├── budget, budgetSpent
  ├── targetAudience, channels[], tags[]
  ├── lead → Agent
  ├── team[] → Agent
  ├── metrics { impressions, clicks, conversions, revenue, roi, costPerLead, costPerAcquisition }
  ├── contentAssets[] { name, type, url, status }
  ├── experiments[] { name, variantA, variantB, winner, confidence }
  └── project → Project

Customer
  ├── uid, name, email, company
  ├── companyRef → Company
  ├── status (lead | prospect | active | churned | returning)
  ├── tier (free | starter | professional | enterprise)
  ├── source (organic | referral | marketing | sales | partner | other)
  ├── referredBy → Customer
  ├── firstContactDate, lastContactDate, lastActivityDate
  ├── lifetimeValue, monthlyRevenue, totalPurchases
  ├── notes[] { content, agent, createdAt }
  ├── tickets[] → Task
  ├── communicationPreference (email | chat | phone)
  ├── timezone, tags[], segments[]

OKR
  ├── uid, title, description
  ├── company → Company
  ├── team → Team
  ├── owner → Agent
  ├── cadence (quarterly | annual | monthly)
  ├── status (active | achieved | abandoned)
  ├── startDate, endDate
  ├── objective
  ├── keyResults[] { title, status, currentValue, targetValue, unit, progress, lastUpdated }
  ├── progress
  ├── parentOKR → OKR
  ├── alignedProjects[] → Project
  └── finalScore, scoredAt

Expense
  ├── uid, title, description
  ├── company → Company
  ├── category (software | cloud_infrastructure | api_costs | marketing | ...)
  ├── status (pending | approved | rejected | reimbursed)
  ├── amount, currency, exchangeRate, amountInDefaultCurrency
  ├── vendor, invoiceNumber, invoiceUrl, receiptUrl
  ├── submittedBy → Agent
  ├── approvedBy → Agent, approvedAt
  ├── project → Project
  ├── team → Team
  ├── budget (company | project | team)
  ├── isRecurring, recurrenceFrequency
  └── expenseDate

AuditLog
  ├── uid
  ├── company → Company
  ├── action, actor → User|Agent, actorType (user | agent | system)
  ├── entityType (user | company | team | agent | project | task | ...)
  ├── entityId
  ├── changes[] { field, oldValue, newValue }
  ├── metadata, ipAddress, userAgent
  └── timestamp

Notification
  ├── uid
  ├── company → Company
  ├── recipient → User|Agent
  ├── type (task_assigned | meeting_scheduled | approval_needed | ...)
  ├── title, message
  ├── entityType, entityId
  ├── isRead, readAt
  ├── actionUrl, actionLabel
  └── sender, senderType

Request
  ├── uid, company → Company
  ├── title, description
  ├── type (integration | resource | feature | access | budget | personnel | other)
  ├── status (pending | approved | denied | fulfilled | cancelled)
  ├── priority (low | medium | high | urgent)
  ├── requestedBy (agent or team name)
  ├── requestedFor (project or task context)
  ├── reason (why this is needed)
  ├── createdAt, updatedAt, fulfilledAt
  └── tags[]
```