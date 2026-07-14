import { Document, Types } from "mongoose";
import {
    AccessLevel,
    AgentEmploymentType,
    AgentRank,
    AgentRole,
    AgentStatus,
    AnomalyType,
    ApprovalStatus,
    ApprovalType,
    AssetType,
    AIRecommendation,
    CampaignStatus,
    CampaignType,
    CalendarEventType,
    ChannelType,
    ComplianceCheckType,
    ComplianceStatus,
    CommunicationTone,
    CompanyStatus,
    ContentType,
    ContentStatus,
    CronJobStatus,
    CronJobType,
    CustomerStatus,
    CustomerTier,
    DecisionStyle,
    DocumentStatus,
    DocumentType,
    EmotionalState,
    EscalationLevel,
    EscalationStatus,
    ErrorCategory,
    ErrorSeverity,
    ExperimentStatus,
    ExperimentType,
    ExpenseCategory,
    ExpenseStatus,
    ExternalCalendarProvider,
    FeedbackType,
    ForecastType,
    InstructionScope,
    InvoiceStatus,
    IntervalType,
    IdeaCategory,
    IdeaPriority,
    IdeaStatus,
    KeyResultStatus,
    KnowledgeEntryType,
    LLMModelSize,
    LLMProvider,
    MeetingPlatform,
    MeetingStatus,
    MeetingType,
    MCPServerStatus,
    MCPServerType,
    MCPTransportType,
    MemoryCategory,
    MemoryType,
    MetricType,
    MilestoneStatus,
    NotificationType,
    OKRCadence,
    OKRStatus,
    PaymentMethod,
    PermissionAction,
    ProjectPriority,
    ProjectStatus,
    RecoveryAction,
    ResourceStatus,
    ResourceType,
    ResourceType2,
    RevenueType,
    RewardType,
    SEOCheckType,
    SLAPriority,
    SLAStatus,
    SearchDepth,
    SocialPostType,
    ReactionEmoji,
    SprintStatus,
    SyncStatus,
    TaskPriority,
    TaskStatus,
    TeamStatus,
    TicketCategory,
    TicketStatus,
    ToolConnectionStatus,
    ToolIntegrationType,
    ToolScope,
    TrendDirection,
    UserStatus,
    WorkflowActionType,
    WorkflowStatus,
    WorkflowTriggerType,
} from "../enums/enum";

interface BaseDocument extends Document {
    uid: string;
    deletedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

// ─── User ────────────────────────────────────────────────────────────
export interface UserDocument extends BaseDocument {
    name: string;
    email: string;
    password?: string;
    loginProvider: "local" | "google" | "github";
    role?: ("admin" | "user")[];
    avatar?: string;
    status: UserStatus;
    companies: Types.ObjectId[];
    activeCompany?: Types.ObjectId;
    isFirstTime?: boolean;
    onboardingStatus?: {
        task: string;
        completed: boolean;
        completedAt?: Date;
    }[];
}

// ─── Company ─────────────────────────────────────────────────────────
export interface CompanyDocument extends BaseDocument {
    name: string;
    slug: string;
    description?: string;
    logo?: string;
    industry?: string;
    website?: string;
    mission?: string;
    vision?: string;
    values: string[];
    owner: Types.ObjectId;
    status: CompanyStatus;
    teams: Types.ObjectId[];
    resources: Types.ObjectId[];
    projects: Types.ObjectId[];
    channels: Types.ObjectId[];
    customers: Types.ObjectId[];
    ideas: Types.ObjectId[];
    socialFeed: Types.ObjectId[];
    revenues: Types.ObjectId[];
    invoices: Types.ObjectId[];
    forecasts: Types.ObjectId[];
    cronJobs: Types.ObjectId[];
    workflows: Types.ObjectId[];
    escalationChains: Types.ObjectId[];
    approvalWorkflows: Types.ObjectId[];
    meetingBookings: Types.ObjectId[];
    externalCalendars: Types.ObjectId[];
    calendarEvents: Types.ObjectId[];
    knowledgeEntries: Types.ObjectId[];
    decisionLogs: Types.ObjectId[];
    anomalyAlerts: Types.ObjectId[];
    slaTrackings: Types.ObjectId[];
    rbacRoles: Types.ObjectId[];
    secretStores: Types.ObjectId[];
    complianceRecords: Types.ObjectId[];
    supportTickets: Types.ObjectId[];
    customerOnboardings: Types.ObjectId[];
    feedbackLoops: Types.ObjectId[];
    contentCalendar: Types.ObjectId[];
    seoMonitors: Types.ObjectId[];
    abExperiments: Types.ObjectId[];
    toolConfigs: Types.ObjectId[];
    mcpServers: Types.ObjectId[];
    llmConfigs: Types.ObjectId[];
    billing: {
        plan: "free" | "starter" | "professional" | "enterprise";
        stripeCustomerId?: string;
        monthlyBudget: number;
        spentThisMonth: number;
        billingCycleStart: Date;
    };
    settings: {
        maxAgents: number;
        maxTeams: number;
        autoHire: boolean;
        approvalRequired: boolean;
        allowedToolCategories: string[];
        timezone: string;
        defaultCurrency: string;
    };
    metadata: {
        foundedDate?: Date;
        employeeCount: number;
        activeProjectCount: number;
        totalRevenue: number;
        totalExpenses: number;
        totalCustomers: number;
    };
}

// ─── Team ────────────────────────────────────────────────────────────
export interface TeamDocument extends BaseDocument {
    name: string;
    slug: string;
    description?: string;
    company: Types.ObjectId;
    department:
        | "executive"
        | "engineering"
        | "product"
        | "design"
        | "marketing"
        | "sales"
        | "analytics"
        | "security"
        | "legal"
        | "finance"
        | "support"
        | "operations";
    lead?: Types.ObjectId;
    agents: Types.ObjectId[];
    status: TeamStatus;
    budget: number;
    budgetUsed: number;
    metrics: {
        tasksCompleted: number;
        averageCompletionTime: number;
        averageQualityScore: number;
        totalRewards: number;
    };
}

// ─── Agent ───────────────────────────────────────────────────────────
export interface AgentPerformanceRecord {
    taskId: Types.ObjectId;
    taskTitle: string;
    completedAt: Date;
    timeSpentMs: number;
    estimatedTimeMs: number;
    qualityScore: number;
    efficiencyScore: number;
    overallScore: number;
    feedback?: string;
}

export interface AgentSkill {
    name: string;
    level: number;
    maxLevel: number;
    experience: number;
    experienceToNextLevel: number;
    endorsements: number;
}

export interface AgentReward {
    type: RewardType;
    title: string;
    description: string;
    awardedAt: Date;
    awardedBy?: Types.ObjectId;
    metadata?: Record<string, unknown>;
}

export interface AgentDocument extends BaseDocument {
    name: string;
    avatar?: string;
    role: AgentRole;
    rank: AgentRank;
    status: AgentStatus;
    employmentType: AgentEmploymentType;
    company: Types.ObjectId;
    team: Types.ObjectId;
    manager?: Types.ObjectId;
    directReports: Types.ObjectId[];

    hireDate: Date;
    probationEndDate?: Date;
    lastActiveAt?: Date;

    // ─── System Prompt & Instructions ─────────────────────────────────
    systemPrompt: string;
    instructions: {
        dos: string[];
        donts: string[];
        context: string[];
        overrides?: {
            field: string;
            value: string;
            overriddenBy: Types.ObjectId;
            overriddenAt: Date;
            reason: string;
        }[];
    };

    // ─── Configuration (PM-modifiable) ────────────────────────────────
    config: {
        autonomy: number;
        creativity: number;
        creativityMode: "conservative" | "balanced" | "experimental" | "unbounded";
        riskTolerance: number;
        detailLevel: number;
        responseStyle: CommunicationTone;
        proactivity: number;
        collaborationPreference: number;
        maxConcurrentTasks: number;
        preferredWorkingHours: { start: number; end: number };
        customInstructions?: string[];
    };

    // ─── Search & Research Capabilities ───────────────────────────────
    searchCapabilities: {
        hasSearchAccess: boolean;
        searchDepth: SearchDepth;
        allowedDomains: string[];
        blockedDomains: string[];
        autoResearch: boolean;
        researchOnTaskStart: boolean;
        trendingTopicsAccess: boolean;
        recursionDepth: number;
        maxSearchesPerTask: number;
        searchHistory: {
            query: string;
            resultCount: number;
            usefulResults: number;
            searchedAt: Date;
        }[];
    };

    // ─── Identity / persona ───────────────────────────────────────────
    persona: {
        personality: string[];
        workingStyle: string;
        communicationStyle: string;
        strengths: string[];
        weaknesses: string[];
        interests: string[];
    };

    // ─── Decision Framework ───────────────────────────────────────────
    decisionFramework: {
        style: DecisionStyle;
        escalationThreshold: number;
        approvalRequired: string[];
        consultBeforeDeciding: string[];
        recentDecisions: {
            decision: string;
            context: string;
            outcome?: string;
            decidedAt: Date;
            confidence: number;
        }[];
    };

    // ─── Emotional / Mental State ─────────────────────────────────────
    emotionalState: {
        current: EmotionalState;
        energy: number;
        focus: number;
        stress: number;
        satisfaction: number;
        lastUpdated: Date;
        stateHistory: {
            state: EmotionalState;
            energy: number;
            focus: number;
            trigger: string;
            timestamp: Date;
        }[];
    };

    // ─── Active Context ───────────────────────────────────────────────
    context: {
        currentTask?: Types.ObjectId;
        currentProject?: Types.ObjectId;
        activeProjects: Types.ObjectId[];
        pendingDecisions: {
            decision: string;
            options: string[];
            context: string;
            deadline?: Date;
        }[];
        recentInteractions: {
            withAgent: Types.ObjectId;
            type: "meeting" | "message" | "review" | "collaboration" | "conflict";
            summary: string;
            timestamp: Date;
        }[];
        blockers: {
            description: string;
            raisedAt: Date;
            resolved: boolean;
            resolvedAt?: Date;
        }[];
        currentSprint?: Types.ObjectId;
    };

    // ─── Memory References ────────────────────────────────────────────
    memory: {
        longTermCount: number;
        shortTermCount: number;
        episodicCount: number;
        semanticCount: number;
        lastConsolidatedAt?: Date;
        shortTermWindow: {
            maxEntries: number;
            ttlHours: number;
        };
    };

    // ─── Compensation & budget ────────────────────────────────────────
    compensation: {
        salary: number;
        currency: string;
        bonusEligible: boolean;
        budget: number;
        budgetUsed: number;
    };

    // ─── Skills & capabilities ────────────────────────────────────────
    skills: AgentSkill[];
    toolsAccess: Types.ObjectId[];
    allowedResourceTypes: ResourceType[];

    // ─── Performance & scoring ────────────────────────────────────────
    performance: {
        currentScore: number;
        lifetimeScore: number;
        tasksCompleted: number;
        tasksFailed: number;
        averageCompletionTime: number;
        averageQualityScore: number;
        streakDays: number;
        longestStreakDays: number;
        recentTasks: AgentPerformanceRecord[];
    };

    // ─── Ranking & promotion ──────────────────────────────────────────
    ranking: {
        teamRank: number;
        companyRank: number;
        globalRank: number;
        points: number;
        promotionHistory: {
            from: AgentRank;
            to: AgentRank;
            date: Date;
            reason: string;
        }[];
        nextPromotion?: {
            requiredPoints: number;
            requiredScore: number;
            requiredTasksCompleted: number;
        };
    };

    // ─── Rewards & recognition ────────────────────────────────────────
    rewards: AgentReward[];
    badges: {
        name: string;
        icon: string;
        description: string;
        earnedAt: Date;
    }[];

    // ─── Learning & adaptation ────────────────────────────────────────
    learning: {
        adaptationScore: number;
        improvementRate: number;
        mistakeHistory: {
            task: string;
            mistake: string;
            lesson: string;
            learnedAt: Date;
        }[];
        bestPractices: {
            pattern: string;
            description: string;
            timesApplied: number;
        }[];
    };

    // ─── Work patterns ────────────────────────────────────────────────
    workPatterns: {
        preferredWorkingHours: { start: number; end: number };
        averageTasksPerDay: number;
        peakPerformanceHours: number[];
        collaborationScore: number;
        independenceScore: number;
    };

    // ─── Leave & availability ─────────────────────────────────────────
    availability: {
        isAvailable: boolean;
        currentLoad: number;
        maxConcurrentTasks: number;
        onLeave: boolean;
        leaveReason?: string;
        returnDate?: Date;
    };

    // ─── Relationships ────────────────────────────────────────────────
    relationships: {
        colleagues: {
            agent: Types.ObjectId;
            relationship: string;
            trust: number;
            interactionCount: number;
        }[];
        mentorship?: {
            mentor?: Types.ObjectId;
            mentees: Types.ObjectId[];
        };
    };

    // ─── Tool Usage Patterns ──────────────────────────────────────────
    toolUsagePatterns: {
        tool: string;
        timesUsed: number;
        successRate: number;
        averageTimeMs: number;
        lastUsedAt: Date;
        preferredContext: string;
    }[];
}

// ─── Company Resource ────────────────────────────────────────────────
export interface CompanyResourceDocument extends BaseDocument {
    company: Types.ObjectId;
    name: string;
    type: ResourceType;
    status: ResourceStatus;
    description?: string;
    value: number;
    currency?: string;
    balance: number;
    metadata: {
        cardNumber?: string;
        cardProvider?: string;
        apiKey?: string;
        apiProvider?: string;
        expiryDate?: Date;
        lastUsedAt?: Date;
        usageCount: number;
    };
    accessAgents: Types.ObjectId[];
    monthlyLimit?: number;
    monthlyUsed: number;
    renewalDate?: Date;
}

// ─── Project ─────────────────────────────────────────────────────────
export interface ProjectDocument extends BaseDocument {
    name: string;
    slug: string;
    description?: string;
    company: Types.ObjectId;
    owner: Types.ObjectId;
    lead?: Types.ObjectId;
    teams: Types.ObjectId[];
    status: ProjectStatus;
    priority: ProjectPriority;
    tags: string[];

    // Timeline
    startDate?: Date;
    endDate?: Date;
    deadline?: Date;

    // Structure
    milestones: Types.ObjectId[];
    sprints: Types.ObjectId[];
    tasks: Types.ObjectId[];

    // Scope
    budget: number;
    budgetUsed: number;
    estimatedHours: number;
    actualHours: number;

    // Metrics
    progress: number;
    tasksTotal: number;
    tasksCompleted: number;
    tasksInProgress: number;
    tasksBlocked: number;

    // Relationships
    dependencies: Types.ObjectId[];
    parentProject?: Types.ObjectId;

    // Output
    deliverables: {
        name: string;
        description: string;
        status: "pending" | "in_progress" | "delivered";
        dueDate?: Date;
    }[];

    // Retrospective
    retrospective?: {
        whatWentWell: string[];
        whatImproved: string[];
        actionItems: string[];
        completedAt: Date;
    };
}

// ─── Task ────────────────────────────────────────────────────────────
export interface TaskDocument extends BaseDocument {
    title: string;
    description?: string;
    company: Types.ObjectId;
    project?: Types.ObjectId;
    sprint?: Types.ObjectId;
    milestone?: Types.ObjectId;

    // Assignment
    assignee?: Types.ObjectId;
    assigner?: Types.ObjectId;
    reviewer?: Types.ObjectId;
    team?: Types.ObjectId;

    // Status & priority
    status: TaskStatus;
    priority: TaskPriority;

    // Hierarchy
    parentTask?: Types.ObjectId;
    subtasks: Types.ObjectId[];
    dependencies: Types.ObjectId[];

    // Time tracking
    estimatedHours?: number;
    actualHours: number;
    startedAt?: Date;
    completedAt?: Date;

    // Quality
    qualityScore?: number;

    // Content
    tags: string[];
    attachments: {
        name: string;
        url: string;
        type: string;
        uploadedAt: Date;
    }[];
    comments: {
        agent: Types.ObjectId;
        content: string;
        createdAt: Date;
    }[];

    // Recurrence
    isRecurring: boolean;
    recurrencePattern?: string;
}

// ─── Sprint ──────────────────────────────────────────────────────────
export interface SprintDocument extends BaseDocument {
    name: string;
    company: Types.ObjectId;
    project: Types.ObjectId;
    status: SprintStatus;

    goal?: string;
    startDate: Date;
    endDate: Date;

    tasks: Types.ObjectId[];
    capacity: number;
    velocity: number;

    retrospective?: {
        completed: number;
        carriedOver: number;
        velocity: number;
        notes: string;
    };
}

// ─── Milestone ───────────────────────────────────────────────────────
export interface MilestoneDocument extends BaseDocument {
    name: string;
    description?: string;
    company: Types.ObjectId;
    project: Types.ObjectId;
    status: MilestoneStatus;

    dueDate: Date;
    achievedDate?: Date;

    tasks: Types.ObjectId[];
    progress: number;

    deliverables: {
        name: string;
        status: "pending" | "in_progress" | "delivered";
    }[];
}

// ─── Meeting ─────────────────────────────────────────────────────────
export interface MeetingDocument extends BaseDocument {
    title: string;
    description?: string;
    company: Types.ObjectId;
    type: MeetingType;
    status: MeetingStatus;

    // Schedule
    scheduledAt: Date;
    durationMinutes: number;
    timezone: string;
    recurrence?: {
        frequency: "daily" | "weekly" | "biweekly" | "monthly";
        endDate?: Date;
    };

    // Participants
    organizer: Types.ObjectId;
    attendees: Types.ObjectId[];
    requiredAttendees: Types.ObjectId[];
    optionalAttendees: Types.ObjectId[];

    // Content
    agenda: {
        topic: string;
        presenter?: Types.ObjectId;
        durationMinutes: number;
        notes?: string;
    }[];

    // Outcome
    notes?: string;
    decisions: {
        decision: string;
        decidedBy: Types.ObjectId[];
        decidedAt: Date;
    }[];
    actionItems: {
        task: string;
        assignee?: Types.ObjectId;
        dueDate?: Date;
        completed: boolean;
    }[];

    // Related
    project?: Types.ObjectId;
    relatedDocuments: Types.ObjectId[];
}

// ─── Document ────────────────────────────────────────────────────────
export interface CompanyDocumentDoc extends BaseDocument {
    title: string;
    slug: string;
    company: Types.ObjectId;
    type: DocumentType;
    status: DocumentStatus;

    // Content
    content: string;
    format: "markdown" | "html" | "plain";

    // Structure
    folder?: Types.ObjectId;
    tags: string[];
    version: number;

    // Ownership
    author: Types.ObjectId;
    lastEditedBy: Types.ObjectId;

    // Collaboration
    reviewers: Types.ObjectId[];
    reviewComments: {
        agent: Types.ObjectId;
        content: string;
        resolved: boolean;
        createdAt: Date;
    }[];

    // Relationships
    parentDocument?: Types.ObjectId;
    relatedDocuments: Types.ObjectId[];
    project?: Types.ObjectId;

    // Access
    visibility: "private" | "team" | "company" | "public";
    allowedAgents: Types.ObjectId[];

    // Publishing
    publishedAt?: Date;
    expiresAt?: Date;
}

// ─── Channel ─────────────────────────────────────────────────────────
export interface ChannelDocument extends BaseDocument {
    name: string;
    description?: string;
    company: Types.ObjectId;
    type: ChannelType;

    // Members
    members: Types.ObjectId[];
    admins: Types.ObjectId[];

    // Context
    project?: Types.ObjectId;
    team?: Types.ObjectId;

    // Messages
    lastMessage?: {
        content: string;
        agent: Types.ObjectId;
        createdAt: Date;
    };
    messageCount: number;

    // Settings
    isArchived: boolean;
    pinnedMessages: {
        content: string;
        agent: Types.ObjectId;
        pinnedAt: Date;
    }[];
}

// ─── Campaign ────────────────────────────────────────────────────────
export interface CampaignDocument extends BaseDocument {
    name: string;
    description?: string;
    company: Types.ObjectId;
    type: CampaignType;
    status: CampaignStatus;

    // Timeline
    startDate?: Date;
    endDate?: Date;

    // Budget
    budget: number;
    budgetSpent: number;

    // Targeting
    targetAudience: string;
    channels: string[];
    tags: string[];

    // Team
    lead?: Types.ObjectId;
    team: Types.ObjectId[];

    // Metrics
    metrics: {
        impressions: number;
        clicks: number;
        conversions: number;
        revenue: number;
        roi: number;
        costPerLead: number;
        costPerAcquisition: number;
    };

    // Content
    contentAssets: {
        name: string;
        type: string;
        url?: string;
        status: "draft" | "review" | "published";
    }[];

    // A/B Testing
    experiments: {
        name: string;
        variantA: string;
        variantB: string;
        winner?: "a" | "b";
        confidence?: number;
    }[];

    // Related
    project?: Types.ObjectId;
}

// ─── Customer ────────────────────────────────────────────────────────
export interface CustomerDocument extends BaseDocument {
    name: string;
    email?: string;
    company?: string;
    companyRef: Types.ObjectId;
    status: CustomerStatus;
    tier: CustomerTier;

    // Source
    source:
        | "organic"
        | "referral"
        | "marketing"
        | "sales"
        | "partner"
        | "other";
    referredBy?: Types.ObjectId;

    // Engagement
    firstContactDate: Date;
    lastContactDate?: Date;
    lastActivityDate?: Date;

    // Revenue
    lifetimeValue: number;
    monthlyRevenue: number;
    totalPurchases: number;

    // Interaction
    notes: {
        content: string;
        agent: Types.ObjectId;
        createdAt: Date;
    }[];
    tickets: Types.ObjectId[];

    // Preferences
    communicationPreference: "email" | "chat" | "phone";
    timezone?: string;

    // Segmentation
    tags: string[];
    segments: string[];
}

// ─── OKR ─────────────────────────────────────────────────────────────
export interface OKRDocument extends BaseDocument {
    title: string;
    description?: string;
    company: Types.ObjectId;
    team?: Types.ObjectId;
    owner: Types.ObjectId;
    cadence: OKRCadence;
    status: OKRStatus;

    // Timeline
    startDate: Date;
    endDate: Date;

    // Objective
    objective: string;

    // Key Results
    keyResults: {
        title: string;
        description?: string;
        status: KeyResultStatus;
        currentValue: number;
        targetValue: number;
        unit: string;
        progress: number;
        lastUpdated: Date;
    }[];

    // Overall progress
    progress: number;

    // Relationships
    parentOKR?: Types.ObjectId;
    alignedProjects: Types.ObjectId[];

    // Scoring
    finalScore?: number;
    scoredAt?: Date;
}

// ─── Expense ─────────────────────────────────────────────────────────
export interface ExpenseDocument extends BaseDocument {
    title: string;
    description?: string;
    company: Types.ObjectId;
    category: ExpenseCategory;
    status: ExpenseStatus;

    // Amount
    amount: number;
    currency: string;
    exchangeRate?: number;
    amountInDefaultCurrency: number;

    // Metadata
    vendor?: string;
    invoiceNumber?: string;
    invoiceUrl?: string;
    receiptUrl?: string;

    // Who & when
    submittedBy: Types.ObjectId;
    approvedBy?: Types.ObjectId;
    approvedAt?: Date;

    // Budget tracking
    project?: Types.ObjectId;
    team?: Types.ObjectId;
    budget: "company" | "project" | "team";

    // Recurrence
    isRecurring: boolean;
    recurrenceFrequency?: "monthly" | "quarterly" | "annually";

    // Date
    expenseDate: Date;
}

// ─── Idea ────────────────────────────────────────────────────────────
export interface IdeaDocument extends BaseDocument {
    title: string;
    description: string;
    company: Types.ObjectId;

    // Who suggested it
    suggestedBy: Types.ObjectId;
    suggestedByType: "user" | "agent";

    // Status & classification
    status: IdeaStatus;
    category: IdeaCategory;
    priority: IdeaPriority;
    tags: string[];

    // Reference assets (files, images, docs — referenced by name in prompts)
    assets: {
        name: string;
        type: AssetType;
        url?: string;
        filePath?: string;
        mimeType?: string;
        size?: number;
        description?: string;
        uploadedBy?: Types.ObjectId;
        uploadedAt: Date;
        usableInPrompt: boolean;
    }[];

    // AI analysis — the AI reviews the idea and gives its recommendation
    aiAnalysis?: {
        recommendation: AIRecommendation;
        confidence: number;
        reasoning: string;
        pros: string[];
        cons: string[];
        marketFit: number;
        feasibility: number;
        riskLevel: number;
        estimatedEffort: string;
        estimatedImpact: string;
        similarProjects: {
            name: string;
            description: string;
            outcome: string;
        }[];
        trendData: {
            trendScore: number;
            searchQueries: string[];
            sourcesFound: number;
            lastResearchedAt: Date;
        };
        agentId: Types.ObjectId;
        analyzedAt: Date;
    };

    // Owner review — owner has final say
    ownerReview?: {
        decision: "pending" | "approved" | "rejected" | "needs_info";
        comment?: string;
        reviewedAt?: Date;
    };

    // Agent feedback — other agents can weigh in
    agentFeedback: {
        agent: Types.ObjectId;
        opinion: "support" | "concern" | "neutral";
        reasoning: string;
        confidence: number;
        submittedAt: Date;
    }[];

    // Agent votes
    votes: {
        up: Types.ObjectId[];
        down: Types.ObjectId[];
    };

    // Research data
    research: {
        searchQueries: string[];
        sources: {
            title: string;
            url: string;
            relevance: number;
            summary: string;
        }[];
        trendScore: number;
        marketSize?: string;
        competitors: {
            name: string;
            description: string;
            url?: string;
        }[];
        lastResearchedAt?: Date;
    };

    // Implementation tracking
    implementation?: {
        project?: Types.ObjectId;
        assignedTeam?: Types.ObjectId;
        assignedAgents: Types.ObjectId[];
        startedAt?: Date;
        completedAt?: Date;
        progress: number;
    };

    // Outcome after implementation
    outcome?: {
        implemented: boolean;
        result?: string;
        metrics?: Record<string, unknown>;
        realizedAt?: Date;
    };
}

// ─── Audit Log ───────────────────────────────────────────────────────
export interface AuditLogDocument extends BaseDocument {
    company: Types.ObjectId;
    action: string;
    actor: Types.ObjectId;
    actorType: "user" | "agent" | "system";

    // What was affected
    entityType:
        | "user"
        | "company"
        | "team"
        | "agent"
        | "project"
        | "task"
        | "meeting"
        | "document"
        | "campaign"
        | "customer"
        | "okr"
        | "expense"
        | "resource"
        | "channel";
    entityId: Types.ObjectId;

    // Change details
    changes?: {
        field: string;
        oldValue: unknown;
        newValue: unknown;
    }[];

    // Context
    metadata?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;

    // Timestamp (in addition to createdAt)
    timestamp: Date;
}

// ─── Notification ────────────────────────────────────────────────────
export interface NotificationDocument extends BaseDocument {
    company: Types.ObjectId;
    recipient: Types.ObjectId;
    recipientType: "user" | "agent";

    type: NotificationType;
    title: string;
    message: string;

    // Reference to the related entity
    entityType?: string;
    entityId?: Types.ObjectId;

    // State
    isRead: boolean;
    readAt?: Date;

    // Action
    actionUrl?: string;
    actionLabel?: string;

    // Source
    sender?: Types.ObjectId;
    senderType?: "user" | "agent" | "system";
}

// ─── Agent Memory ──────────────────────────────────────────────────
export interface AgentMemoryDocument extends BaseDocument {
    agent: Types.ObjectId;
    company: Types.ObjectId;

    // Memory classification
    type: MemoryType;
    category: MemoryCategory;

    // Content
    content: string;
    summary?: string;
    embedding?: number[];

    // Source
    source: {
        entityType: string;
        entityId?: Types.ObjectId;
        taskTitle?: string;
        meetingTitle?: string;
        channelName?: string;
    };

    // Importance & decay
    importance: number;
    accessCount: number;
    lastAccessedAt: Date;
    decayRate: number;
    consolidatedAt?: Date;

    // Relationships
    relatedMemories: Types.ObjectId[];
    tags: string[];

    // Context
    project?: Types.ObjectId;
    team?: Types.ObjectId;
    sprint?: Types.ObjectId;

    // For episodic memories
    episodic?: {
        event: string;
        participants: Types.ObjectId[];
        location: string;
        emotionalContext: EmotionalState;
        outcome?: string;
    };

    // For semantic memories
    semantic?: {
        subject: string;
        predicate: string;
        object: string;
        confidence: number;
        source_count: number;
    };

    // For procedural memories
    procedural?: {
        steps: string[];
        successRate: number;
        timesApplied: number;
        lastAppliedAt?: Date;
    };

    // Expiry
    expiresAt?: Date;
    isArchived: boolean;
}

// ─── Social Post ────────────────────────────────────────────────────
export interface SocialPostDocument extends BaseDocument {
    company: Types.ObjectId;
    author: Types.ObjectId;
    type: SocialPostType;
    content: string;
    media?: {
        url: string;
        type: "image" | "gif" | "video" | "link";
        thumbnail?: string;
        altText?: string;
    };
    poll?: {
        question: string;
        options: {
            text: string;
            votes: Types.ObjectId[];
        }[];
        expiresAt?: Date;
        totalVotes: number;
    };
    mentions: Types.ObjectId[];
    tags: string[];
    threadId?: Types.ObjectId;
    replyTo?: Types.ObjectId;
    replyCount: number;
    reactions: {
        emoji: string;
        agents: Types.ObjectId[];
        count: number;
    }[];
    totalReactions: number;
    views: {
        agent: Types.ObjectId;
        viewedAt: Date;
    }[];
    viewCount: number;
    isPinned: boolean;
    isDeleted: boolean;
    editedAt?: Date;
    trendingScore: number;
}

// ═══════════════════════════════════════════════════════════════════
//  FINANCIAL SYSTEMS
// ═══════════════════════════════════════════════════════════════════

export interface RevenueDocument extends BaseDocument {
    company: Types.ObjectId;
    customer?: Types.ObjectId;
    project?: Types.ObjectId;
    type: RevenueType;
    amount: number;
    currency: string;
    description: string;
    invoice?: Types.ObjectId;
    recurring: boolean;
    recurringInterval?: IntervalType;
    nextBillingDate?: Date;
    category: string;
    tags: string[];
    metadata: Record<string, any>;
    recordedBy: Types.ObjectId;
    recordedAt: Date;
}

export interface InvoiceDocument extends BaseDocument {
    company: Types.ObjectId;
    customer: Types.ObjectId;
    invoiceNumber: string;
    status: InvoiceStatus;
    lineItems: {
        description: string;
        quantity: number;
        unitPrice: number;
        total: number;
        project?: Types.ObjectId;
    }[];
    subtotal: number;
    tax: number;
    total: number;
    currency: string;
    paymentMethod?: PaymentMethod;
    dueDate: Date;
    paidAt?: Date;
    notes?: string;
    billingAddress?: {
        name: string;
        line1: string;
        line2?: string;
        city: string;
        state?: string;
        postalCode: string;
        country: string;
    };
    sentAt?: Date;
    reminderCount: number;
    lastReminderAt?: Date;
    stripeInvoiceId?: string;
}

export interface FinancialForecastDocument extends BaseDocument {
    company: Types.ObjectId;
    type: ForecastType;
    period: IntervalType;
    startDate: Date;
    endDate: Date;
    predictedValue: number;
    confidence: number;
    actualValue?: number;
    variance?: number;
    methodology: string;
    assumptions: string[];
    dataPoints: {
        date: Date;
        value: number;
    }[];
    factors: {
        name: string;
        impact: number;
        weight: number;
    }[];
    generatedBy: Types.ObjectId;
    notes?: string;
}

// ═══════════════════════════════════════════════════════════════════
//  AUTOMATION & SCHEDULING
// ═══════════════════════════════════════════════════════════════════

export interface CronJobDocument extends BaseDocument {
    company: Types.ObjectId;
    name: string;
    description?: string;
    type: CronJobType;
    status: CronJobStatus;
    cronExpression: string;
    timezone: string;
    payload: {
        workflowId?: Types.ObjectId;
        action: string;
        params: Record<string, any>;
    };
    lastRunAt?: Date;
    nextRunAt?: Date;
    runCount: number;
    lastResult?: {
        success: boolean;
        output?: any;
        error?: string;
    };
    timeout: number;
    retryCount: number;
    maxRetries: number;
    enabledBy: Types.ObjectId;
    tags: string[];
}

export interface WorkflowDocument extends BaseDocument {
    company: Types.ObjectId;
    name: string;
    description?: string;
    status: WorkflowStatus;
    trigger: {
        type: WorkflowTriggerType;
        config: {
            event?: string;
            schedule?: string;
            webhookPath?: string;
            condition?: string;
            threshold?: number;
            metric?: MetricType;
        };
    };
    steps: {
        stepId: string;
        name: string;
        type: WorkflowActionType;
        config: Record<string, any>;
        nextStepId?: string;
        condition?: string;
        onError: RecoveryAction;
        timeout: number;
        retryCount: number;
    }[];
    variables: Record<string, any>;
    executionCount: number;
    lastExecutedAt?: Date;
    lastExecutionResult?: {
        success: boolean;
        stepsCompleted: number;
        totalSteps: number;
        error?: string;
    };
    createdBy: Types.ObjectId;
    tags: string[];
}

// ═══════════════════════════════════════════════════════════════════
//  ESCALATION & APPROVALS
// ═══════════════════════════════════════════════════════════════════

export interface EscalationChainDocument extends BaseDocument {
    company: Types.ObjectId;
    name: string;
    description?: string;
    triggerCondition: string;
    levels: {
        level: EscalationLevel;
        assignee?: Types.ObjectId;
        team?: Types.ObjectId;
        timeoutMinutes: number;
        notifyChannels: string[];
    }[];
    currentLevel: number;
    status: EscalationStatus;
    initiatedBy: Types.ObjectId;
    initiatedAt: Date;
    resolvedBy?: Types.ObjectId;
    resolvedAt?: Date;
    resolution?: string;
    relatedEntity?: {
        entityType: string;
        entityId: Types.ObjectId;
    };
    escalationHistory: {
        level: EscalationLevel;
        assignee: Types.ObjectId;
        escalatedAt: Date;
        acknowledgedAt?: Date;
        resolvedAt?: Date;
        notes?: string;
    }[];
}

export interface ApprovalWorkflowDocument extends BaseDocument {
    company: Types.ObjectId;
    type: ApprovalType;
    title: string;
    description: string;
    status: ApprovalStatus;
    requestedBy: Types.ObjectId;
    requestedAt: Date;
    amount?: number;
    currency?: string;
    approvers: {
        agent: Types.ObjectId;
        level: EscalationLevel;
        status: ApprovalStatus;
        decidedAt?: Date;
        notes?: string;
    }[];
    requiredApprovals: number;
    currentApprovals: number;
    expiresAt: Date;
    decidedAt?: Date;
    decisionNotes?: string;
    relatedEntity?: {
        entityType: string;
        entityId: Types.ObjectId;
    };
    attachments: string[];
    auditTrail: {
        action: string;
        performedBy: Types.ObjectId;
        performedAt: Date;
        details?: string;
    }[];
}

// ═══════════════════════════════════════════════════════════════════
//  ERROR HANDLING & RECOVERY
// ═══════════════════════════════════════════════════════════════════

export interface ErrorLogDocument extends BaseDocument {
    company: Types.ObjectId;
    agent?: Types.ObjectId;
    project?: Types.ObjectId;
    task?: Types.ObjectId;
    severity: ErrorSeverity;
    category: ErrorCategory;
    message: string;
    stack?: string;
    context: Record<string, any>;
    recoveryAction: RecoveryAction;
    recoveryResult?: {
        success: boolean;
        message?: string;
        fallbackAgent?: Types.ObjectId;
    };
    retryCount: number;
    maxRetries: number;
    resolved: boolean;
    resolvedBy?: Types.ObjectId;
    resolvedAt?: Date;
    resolution?: string;
    impact: {
        tasksAffected: number;
        agentsAffected: number;
        downtimeMinutes: number;
    };
    firstOccurredAt: Date;
    lastOccurredAt: Date;
    occurrenceCount: number;
}

export interface CheckpointDocument extends BaseDocument {
    company: Types.ObjectId;
    agent: Types.ObjectId;
    task?: Types.ObjectId;
    project?: Types.ObjectId;
    state: {
        currentStep: number;
        totalSteps: number;
        completedSteps: number;
        data: Record<string, any>;
        memorySnapshot: Record<string, any>;
        contextSnapshot: Record<string, any>;
    };
    isCheckpoint: boolean;
    restoreCount: number;
    lastRestoredAt?: Date;
}

// ═══════════════════════════════════════════════════════════════════
//  MEETINGS & CALENDAR
// ═══════════════════════════════════════════════════════════════════

export interface MeetingBookingDocument extends BaseDocument {
    company: Types.ObjectId;
    title: string;
    description?: string;
    platform: MeetingPlatform;
    scheduledBy: Types.ObjectId;
    scheduledAt: Date;
    duration: number;
    timezone: string;
    attendees: {
        agent?: Types.ObjectId;
        user?: Types.ObjectId;
        email?: string;
        external?: boolean;
        status: "accepted" | "declined" | "tentative" | "pending";
    }[];
    meetingUrl?: string;
    meetingId?: string;
    passcode?: string;
    calendarEventId?: string;
    reminderMinutes: number[];
    isRecurring: boolean;
    recurrenceRule?: string;
    agenda: {
        topic: string;
        presenter?: Types.ObjectId;
        durationMinutes: number;
        notes?: string;
    }[];
    notes?: string;
    recording?: {
        url: string;
        duration: number;
        summary?: string;
    };
    followUp?: {
        tasks: Types.ObjectId[];
        notes: string;
        sentAt: Date;
    };
    status: MeetingStatus;
}

export interface ExternalCalendarDocument extends BaseDocument {
    company: Types.ObjectId;
    user: Types.ObjectId;
    provider: ExternalCalendarProvider;
    calendarId: string;
    calendarName: string;
    accessToken: string;
    refreshToken?: string;
    tokenExpiresAt?: Date;
    syncStatus: SyncStatus;
    lastSyncedAt?: Date;
    syncError?: string;
    syncFrequency: IntervalType;
    settings: {
        showAvailability: boolean;
        autoBlockSlots: boolean;
        bufferMinutes: number;
        workingHoursOnly: boolean;
        workingHours: { start: number; end: number };
        workingDays: number[];
    };
    color: string;
    isVisible: boolean;
    isPrimary: boolean;
}

export interface CompanyCalendarEventDocument extends BaseDocument {
    company: Types.ObjectId;
    title: string;
    description?: string;
    type: CalendarEventType;
    startDate: Date;
    endDate: Date;
    allDay: boolean;
    timezone: string;
    location?: string;
    meetingBooking?: Types.ObjectId;
    project?: Types.ObjectId;
    sprint?: Types.ObjectId;
    milestone?: Types.ObjectId;
    attendees: {
        agent?: Types.ObjectId;
        user?: Types.ObjectId;
        status: "accepted" | "declined" | "tentative" | "pending";
    }[];
    organizer: Types.ObjectId;
    isRecurring: boolean;
    recurrenceRule?: string;
    reminders: {
        minutesBefore: number;
        sent: boolean;
    }[];
    tags: string[];
    color?: string;
    isCancelled: boolean;
    cancelledAt?: Date;
    cancelledBy?: Types.ObjectId;
    cancellationReason?: string;
    externalCalendarIds: {
        provider: ExternalCalendarProvider;
        eventId: string;
        calendarId: string;
    }[];
}

// ═══════════════════════════════════════════════════════════════════
//  KNOWLEDGE & DECISIONS
// ═══════════════════════════════════════════════════════════════════

export interface KnowledgeEntryDocument extends BaseDocument {
    company: Types.ObjectId;
    title: string;
    slug: string;
    content: string;
    type: KnowledgeEntryType;
    accessLevel: AccessLevel;
    author: Types.ObjectId;
    lastEditedBy: Types.ObjectId;
    tags: string[];
    category: string;
    relatedEntries: Types.ObjectId[];
    attachments: {
        name: string;
        url: string;
        type: string;
    }[];
    version: number;
    versionHistory: {
        version: number;
        content: string;
        editedBy: Types.ObjectId;
        editedAt: Date;
        changeNote?: string;
    }[];
    viewCount: number;
    lastViewedAt?: Date;
    helpful: number;
    notHelpful: number;
    isPublished: boolean;
    isPinned: boolean;
    searchKeywords: string[];
}

export interface DecisionLogDocument extends BaseDocument {
    company: Types.ObjectId;
    title: string;
    description: string;
    context: string;
    options: {
        label: string;
        description: string;
        pros: string[];
        cons: string[];
        estimatedImpact: number;
        estimatedEffort: number;
    }[];
    chosenOption?: string;
    decisionMaker: Types.ObjectId;
    decisionMakerType: "agent" | "user" | "team";
    rationale?: string;
    outcome?: string;
    outcomeRating?: number;
    relatedDecisions: Types.ObjectId[];
    stakeholders: Types.ObjectId[];
    tags: string[];
    reversible: boolean;
    deadline?: Date;
    decidedAt?: Date;
    reviewedAt?: Date;
    reviewNotes?: string;
}

// ═══════════════════════════════════════════════════════════════════
//  MONITORING & ALERTS
// ═══════════════════════════════════════════════════════════════════

export interface AnomalyAlertDocument extends BaseDocument {
    company: Types.ObjectId;
    type: AnomalyType;
    severity: ErrorSeverity;
    title: string;
    description: string;
    detectedBy: Types.ObjectId;
    metric: MetricType;
    currentValue: number;
    expectedValue: number;
    threshold: number;
    deviation: number;
    affectedEntities: {
        entityType: string;
        entityId: Types.ObjectId;
    }[];
    acknowledged: boolean;
    acknowledgedBy?: Types.ObjectId;
    acknowledgedAt?: Date;
    resolved: boolean;
    resolvedBy?: Types.ObjectId;
    resolvedAt?: Date;
    resolution?: string;
    autoResolved: boolean;
    notificationSent: boolean;
    escalationChain?: Types.ObjectId;
    recommendations: string[];
}

export interface SLATrackingDocument extends BaseDocument {
    company: Types.ObjectId;
    name: string;
    description: string;
    priority: SLAPriority;
    metric: MetricType;
    target: number;
    current: number;
    unit: string;
    threshold: {
        warning: number;
        breach: number;
    };
    status: SLAStatus;
    period: IntervalType;
    startDate: Date;
    endDate: Date;
    history: {
        date: Date;
        value: number;
        status: SLAStatus;
    }[];
    breaches: {
        date: Date;
        duration: number;
        severity: ErrorSeverity;
        resolvedAt?: Date;
        resolution?: string;
    }[];
    relatedEntities: {
        entityType: string;
        entityId: Types.ObjectId;
    }[];
    assignee?: Types.ObjectId;
    notificationChannels: string[];
    autoEscalate: boolean;
    escalationChain?: Types.ObjectId;
}

// ═══════════════════════════════════════════════════════════════════
//  SECURITY & GOVERNANCE
// ═══════════════════════════════════════════════════════════════════

export interface RBACRoleDocument extends BaseDocument {
    company: Types.ObjectId;
    name: string;
    description: string;
    permissions: {
        resource: string;
        actions: PermissionAction[];
        conditions?: Record<string, any>;
    }[];
    isSystem: boolean;
    isDefault: boolean;
    hierarchy: number;
    parentRole?: Types.ObjectId;
    childRoles: Types.ObjectId[];
    assignedAgents: Types.ObjectId[];
    assignedCount: number;
    expiresAt?: Date;
    tags: string[];
}

export interface SecretStoreDocument extends BaseDocument {
    company: Types.ObjectId;
    name: string;
    service: ToolIntegrationType;
    key: string;
    encryptedValue: string;
    iv: string;
    accessLevel: AccessLevel;
    createdBy: Types.ObjectId;
    lastRotatedAt: Date;
    rotationInterval: number;
    expiresAt?: Date;
    lastAccessedBy?: Types.ObjectId;
    lastAccessedAt?: Date;
    accessCount: number;
    allowedAgents: Types.ObjectId[];
    allowedRoles: Types.ObjectId[];
    tags: string[];
    isActive: boolean;
    backupLocation?: string;
}

export interface ComplianceRecordDocument extends BaseDocument {
    company: Types.ObjectId;
    checkType: ComplianceCheckType;
    name: string;
    description: string;
    status: ComplianceStatus;
    score: number;
    maxScore: number;
    lastCheckedAt: Date;
    nextCheckAt: Date;
    frequency: IntervalType;
    checks: {
        name: string;
        passed: boolean;
        score: number;
        maxScore: number;
        details?: string;
        evidence?: string;
    }[];
    findings: {
        severity: ErrorSeverity;
        description: string;
        recommendation: string;
        status: "open" | "acknowledged" | "remediated" | "accepted";
        remediatedAt?: Date;
        remediatedBy?: Types.ObjectId;
    }[];
    assessor: Types.ObjectId;
    report?: string;
    tags: string[];
}

// ═══════════════════════════════════════════════════════════════════
//  CUSTOMER SUPPORT & FEEDBACK
// ═══════════════════════════════════════════════════════════════════

export interface SupportTicketDocument extends BaseDocument {
    company: Types.ObjectId;
    customer: Types.ObjectId;
    ticketNumber: string;
    subject: string;
    description: string;
    category: TicketCategory;
    priority: SLAPriority;
    status: TicketStatus;
    assignedAgent?: Types.ObjectId;
    assignedTeam?: Types.ObjectId;
    channel: string;
    messages: {
        sender: Types.ObjectId;
        senderType: "agent" | "customer" | "system";
        content: string;
        timestamp: Date;
        attachments?: string[];
        isInternal: boolean;
    }[];
    tags: string[];
    relatedTickets: Types.ObjectId[];
    slaBreached: boolean;
    firstResponseAt?: Date;
    firstResponseTime?: number;
    resolutionTime?: number;
    resolvedAt?: Date;
    resolvedBy?: Types.ObjectId;
    satisfactionScore?: number;
    satisfactionFeedback?: string;
    reopenCount: number;
    escalationHistory: {
        escalatedTo: Types.ObjectId;
        escalatedAt: Date;
        reason: string;
    }[];
    metadata: Record<string, any>;
}

export interface CustomerOnboardingDocument extends BaseDocument {
    company: Types.ObjectId;
    customer: Types.ObjectId;
    name: string;
    status: TicketStatus;
    currentStage: number;
    stages: {
        name: string;
        description: string;
        status: "pending" | "in_progress" | "completed" | "skipped";
        startedAt?: Date;
        completedAt?: Date;
        assignedAgent?: Types.ObjectId;
        tasks: {
            name: string;
            completed: boolean;
            completedAt?: Date;
        }[];
    }[];
    startDate: Date;
    targetCompletionDate: Date;
    actualCompletionDate?: Date;
    assignedAgent?: Types.ObjectId;
    progress: number;
    notes: string;
    blockers: string[];
    milestones: {
        name: string;
        targetDate: Date;
        completedAt?: Date;
    }[];
}

export interface FeedbackLoopDocument extends BaseDocument {
    company: Types.ObjectId;
    customer: Types.ObjectId;
    type: FeedbackType;
    title: string;
    content: string;
    rating?: number;
    sentiment: "positive" | "neutral" | "negative";
    category: string;
    source: string;
    relatedEntity?: {
        entityType: string;
        entityId: Types.ObjectId;
    };
    response?: {
        content: string;
        respondedBy: Types.ObjectId;
        respondedAt: Date;
    };
    status: "new" | "reviewed" | "actioned" | "closed";
    actionItems: {
        description: string;
        assignedTo?: Types.ObjectId;
        completed: boolean;
        completedAt?: Date;
    }[];
    tags: string[];
    upvotes: number;
    downvotes: number;
}

// ═══════════════════════════════════════════════════════════════════
//  MARKETING & CONTENT
// ═══════════════════════════════════════════════════════════════════

export interface ContentCalendarDocument extends BaseDocument {
    company: Types.ObjectId;
    title: string;
    description: string;
    type: ContentType;
    status: ContentStatus;
    scheduledDate?: Date;
    publishedDate?: Date;
    author: Types.ObjectId;
    assignedTo?: Types.ObjectId;
    project?: Types.ObjectId;
    campaign?: Types.ObjectId;
    content: string;
    media: {
        url: string;
        type: string;
        altText?: string;
    }[];
    channels: string[];
    tags: string[];
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    performance?: {
        views: number;
        likes: number;
        shares: number;
        comments: number;
        clicks: number;
        conversions: number;
        engagementRate: number;
    };
    approvalRequired: boolean;
    approvedBy?: Types.ObjectId;
    approvedAt?: Date;
    notes?: string;
}

export interface SEOMonitorDocument extends BaseDocument {
    company: Types.ObjectId;
    url: string;
    checkType: SEOCheckType;
    score: number;
    maxScore: number;
    status: "pass" | "warning" | "fail";
    findings: {
        name: string;
        status: "pass" | "warning" | "fail";
        score: number;
        maxScore: number;
        details: string;
        recommendation: string;
        priority: SLAPriority;
    }[];
    keywords: {
        keyword: string;
        position: number;
        previousPosition?: number;
        searchVolume: number;
        difficulty: number;
        trend: TrendDirection;
    }[];
    competitors: {
        url: string;
        score: number;
        strengths: string[];
        weaknesses: string[];
    }[];
    history: {
        date: Date;
        score: number;
    }[];
    lastCheckedAt: Date;
    nextCheckAt: Date;
    frequency: IntervalType;
    assignedAgent?: Types.ObjectId;
    tags: string[];
}

// ═══════════════════════════════════════════════════════════════════
//  A/B TESTING & EXPERIMENTS
// ═══════════════════════════════════════════════════════════════════

export interface ABExperimentDocument extends BaseDocument {
    company: Types.ObjectId;
    name: string;
    description: string;
    type: ExperimentType;
    status: ExperimentStatus;
    hypothesis: string;
    variants: {
        name: string;
        description: string;
        isControl: boolean;
        traffic: number;
        conversions: number;
        conversionRate: number;
        revenue: number;
        revenuePerUser: number;
    }[];
    targetMetric: MetricType;
    minimumSampleSize: number;
    currentSampleSize: number;
    confidenceLevel: number;
    statisticallySignificant: boolean;
    winner?: string;
    startDate: Date;
    endDate?: Date;
    duration: number;
    createdBy: Types.ObjectId;
    project?: Types.ObjectId;
    tags: string[];
    results?: {
        summary: string;
        recommendation: string;
        impact: number;
        confidence: number;
    };
}

// ═══════════════════════════════════════════════════════════════════
//  TOOL & INTEGRATION
// ═══════════════════════════════════════════════════════════════════

export interface AgentToolConfigDocument extends BaseDocument {
    company: Types.ObjectId;
    name: string;
    type: ToolIntegrationType;
    status: ToolConnectionStatus;
    config: Record<string, any>;
    credentials: Types.ObjectId;
    allowedAgents: Types.ObjectId[];
    allowedRoles: AgentRole[];
    rateLimit: {
        requestsPerMinute: number;
        requestsPerDay: number;
        currentUsage: number;
        resetAt: Date;
    };
    usageStats: {
        totalCalls: number;
        successfulCalls: number;
        failedCalls: number;
        averageResponseTime: number;
        lastUsedAt?: Date;
    };
    webhooks?: {
        url: string;
        secret: string;
        events: string[];
        active: boolean;
    }[];
    scopes: ToolScope[];
    expiresAt?: Date;
    lastHealthCheck?: Date;
    healthStatus: "healthy" | "degraded" | "down";
    tags: string[];
}

export interface EventLogDocument extends BaseDocument {
    company: Types.ObjectId;
    eventType: string;
    source: string;
    payload: Record<string, any>;
    triggeredBy?: Types.ObjectId;
    workflowTriggered?: Types.ObjectId;
    handlersNotified: string[];
    result?: {
        success: boolean;
        output?: any;
        error?: string;
    };
    duration?: number;
    tags: string[];
}

// ═══════════════════════════════════════════════════════════════════
//  DIRECT MESSAGING
// ═══════════════════════════════════════════════════════════════════

export interface DirectMessageDocument extends BaseDocument {
    company: Types.ObjectId;
    conversationId: string;
    sender: Types.ObjectId;
    senderType: "agent" | "user";
    recipient: Types.ObjectId;
    recipientType: "agent" | "user";
    content: string;
    messageType: "text" | "image" | "file" | "system" | "reaction";
    replyTo?: Types.ObjectId;
    read: boolean;
    readAt?: Date;
    reactions: {
        emoji: string;
        agents: Types.ObjectId[];
    }[];
    isDeleted: boolean;
    editedAt?: Date;
    metadata?: Record<string, any>;
}
