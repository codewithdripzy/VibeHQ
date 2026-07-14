export enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended",
}

export enum CompanyStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    PAUSED = "paused",
    ARCHIVED = "archived",
}

export enum TeamStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
}

export enum AgentStatus {
    IDLE = "idle",
    WORKING = "working",
    PAUSED = "paused",
    OFFLINE = "offline",
    ON_LEAVE = "on_leave",
}

export enum AgentRole {
    CEO = "ceo",
    COO = "coo",
    CTO = "cto",
    CPO = "cpo",
    CMO = "cmo",
    CFO = "cfo",
    GENERAL_COUNSEL = "general_counsel",
    VP_ENGINEERING = "vp_engineering",
    VP_PRODUCT = "vp_product",
    VP_MARKETING = "vp_marketing",
    VP_SALES = "vp_sales",
    VP_DESIGN = "vp_design",
    SOFTWARE_ARCHITECT = "software_architect",
    SENIOR_ENGINEER = "senior_engineer",
    MID_ENGINEER = "mid_engineer",
    JUNIOR_ENGINEER = "junior_engineer",
    DEVOPS_ENGINEER = "devops_engineer",
    QA_ENGINEER = "qa_engineer",
    SECURITY_ENGINEER = "security_engineer",
    DATA_ENGINEER = "data_engineer",
    AI_ENGINEER = "ai_engineer",
    PRODUCT_MANAGER = "product_manager",
    PROJECT_MANAGER = "project_manager",
    SCRUM_MASTER = "scrum_master",
    UX_RESEARCHER = "ux_researcher",
    UX_DESIGNER = "ux_designer",
    UI_DESIGNER = "ui_designer",
    BRAND_DESIGNER = "brand_designer",
    TECHNICAL_WRITER = "technical_writer",
    MARKETING_STRATEGIST = "marketing_strategist",
    SEO_SPECIALIST = "seo_specialist",
    CONTENT_WRITER = "content_writer",
    SOCIAL_MEDIA_MANAGER = "social_media_manager",
    VIDEO_CREATOR = "video_creator",
    GRAPHIC_DESIGNER = "graphic_designer",
    EMAIL_MARKETING = "email_marketing",
    SDR = "sdr",
    SALES_EXECUTIVE = "sales_executive",
    CUSTOMER_SUCCESS = "customer_success",
    CRM_MANAGER = "crm_manager",
    ANALYST = "analyst",
    DATA_SCIENTIST = "data_scientist",
    CUSTOMER_SUPPORT = "customer_support",
    EMPLOYEE = "employee",
}

export enum AgentRank {
    INTERN = "intern",
    JUNIOR = "junior",
    MID_LEVEL = "mid_level",
    SENIOR = "senior",
    STAFF = "staff",
    PRINCIPAL = "principal",
    DIRECTOR = "director",
    VP = "vice_president",
    EXECUTIVE = "executive",
    C_LEVEL = "c_level",
}

export enum AgentEmploymentType {
    FULL_TIME = "full_time",
    PART_TIME = "part_time",
    CONTRACT = "contract",
    INTERN = "intern",
}

export enum ResourceType {
    COMPANY_CARD = "company_card",
    API_KEY = "api_key",
    CLOUD_CREDITS = "cloud_credits",
    SOFTWARE_LICENSE = "software_license",
    SUBSCRIPTION = "subscription",
    BUDGET_ALLOCATION = "budget_allocation",
}

export enum ResourceStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    DEPLETED = "depleted",
    SUSPENDED = "suspended",
}

export enum ToolRequestStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
}

export enum RewardType {
    BONUS = "bonus",
    PROMOTION = "promotion",
    EXTRA_BUDGET = "extra_budget",
    PTO = "pto",
    RECOGNITION = "recognition",
    SKILL_UPGRADE = "skill_upgrade",
}

export enum TaskPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical",
}

export enum TaskStatus {
    QUEUED = "queued",
    IN_PROGRESS = "in_progress",
    IN_REVIEW = "in_review",
    COMPLETED = "completed",
    FAILED = "failed",
    BLOCKED = "blocked",
    CANCELLED = "cancelled",
}

export enum ProjectStatus {
    PLANNING = "planning",
    ACTIVE = "active",
    ON_HOLD = "on_hold",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
}

export enum ProjectPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical",
}

export enum SprintStatus {
    PLANNED = "planned",
    ACTIVE = "active",
    REVIEW = "review",
    COMPLETED = "completed",
}

export enum MilestoneStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    ACHIEVED = "achieved",
    MISSED = "missed",
}

export enum MeetingType {
    DAILY_STANDUP = "daily_standup",
    SPRINT_PLANNING = "sprint_planning",
    SPRINT_REVIEW = "sprint_review",
    RETROSPECTIVE = "retrospective",
    PRODUCT_REVIEW = "product_review",
    ARCHITECTURE_REVIEW = "architecture_review",
    MARKETING_REVIEW = "marketing_review",
    SALES_REVIEW = "sales_review",
    EXECUTIVE_BOARD = "executive_board",
    ALL_HANDS = "all_hands",
    ONE_ON_ONE = "one_on_one",
    CUSTOM = "custom",
}

export enum MeetingStatus {
    SCHEDULED = "scheduled",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
}

export enum DocumentType {
    PRD = "prd",
    RFC = "rfc",
    DESIGN_DOC = "design_doc",
    PLAYBOOK = "playbook",
    POLICY = "policy",
    SOP = "sop",
    MEETING_NOTES = "meeting_notes",
    POST_MORTEM = "post_mortem",
    RETROSPECTIVE = "retrospective",
    ONBOARDING = "onboarding",
    WIKI = "wiki",
    SPEC = "spec",
    REPORT = "report",
    CONTRACT = "contract",
    PROPOSAL = "proposal",
    OTHER = "other",
}

export enum DocumentStatus {
    DRAFT = "draft",
    IN_REVIEW = "in_review",
    APPROVED = "approved",
    PUBLISHED = "published",
    ARCHIVED = "archived",
}

export enum ChannelType {
    TEAM = "team",
    PROJECT = "project",
    DIRECT = "direct",
    ANNOUNCEMENT = "announcement",
    WATERCOOLER = "watercooler",
}

export enum CampaignStatus {
    PLANNING = "planning",
    ACTIVE = "active",
    PAUSED = "paused",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
}

export enum CampaignType {
    PRODUCT_LAUNCH = "product_launch",
    CONTENT_MARKETING = "content_marketing",
    EMAIL = "email",
    SOCIAL_MEDIA = "social_media",
    PAID_ADVERTISING = "paid_advertising",
    SEO = "seo",
    PARTNERSHIP = "partnership",
    REFERRAL = "referral",
    EVENT = "event",
    RETARGETING = "retargeting",
}

export enum CustomerStatus {
    LEAD = "lead",
    PROSPECT = "prospect",
    ACTIVE = "active",
    CHURNED = "churned",
    RETURNING = "returning",
}

export enum CustomerTier {
    FREE = "free",
    STARTER = "starter",
    PROFESSIONAL = "professional",
    ENTERPRISE = "enterprise",
}

export enum OKRCadence {
    QUARTERLY = "quarterly",
    ANNUAL = "annual",
    MONTHLY = "monthly",
}

export enum OKRStatus {
    ACTIVE = "active",
    ACHIEVED = "achieved",
    ABANDONED = "abandoned",
}

export enum KeyResultStatus {
    NOT_STARTED = "not_started",
    ON_TRACK = "on_track",
    AT_RISK = "at_risk",
    BEHIND = "behind",
    COMPLETED = "completed",
}

export enum ExpenseCategory {
    SOFTWARE = "software",
    CLOUD_INFRASTRUCTURE = "cloud_infrastructure",
    API_COSTS = "api_costs",
    MARKETING = "marketing",
    CONTRACTORS = "contractors",
    HARDWARE = "hardware",
    OFFICE = "office",
    TRAVEL = "travel",
    LEGAL = "legal",
    INSURANCE = "insurance",
    SALARIES = "salaries",
    BONUSES = "bonuses",
    OTHER = "other",
}

export enum ExpenseStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    REIMBURSED = "reimbursed",
}

export enum AuditAction {
    CREATE = "create",
    UPDATE = "update",
    DELETE = "delete",
    LOGIN = "login",
    LOGOUT = "logout",
    APPROVE = "approve",
    REJECT = "reject",
    ASSIGN = "assign",
    DEPLOY = "deploy",
    PURCHASE = "purchase",
    HIRE = "hire",
    FIRE = "fire",
    PROMOTE = "promote",
    TRANSFER = "transfer",
}

export enum NotificationType {
    TASK_ASSIGNED = "task_assigned",
    TASK_COMPLETED = "task_completed",
    TASK_BLOCKED = "task_blocked",
    MEETING_SCHEDULED = "meeting_scheduled",
    MEETING_REMINDER = "meeting_reminder",
    REVIEW_REQUESTED = "review_requested",
    APPROVAL_NEEDED = "approval_needed",
    BUDGET_ALERT = "budget_alert",
    DEADLINE_WARNING = "deadline_warning",
    ACHIEVEMENT = "achievement",
    PROMOTION = "promotion",
    MENTION = "mention",
    ANNOUNCEMENT = "announcement",
    SYSTEM = "system",
}

export enum MemoryType {
    LONG_TERM = "long_term",
    SHORT_TERM = "short_term",
    EPISODIC = "episodic",
    SEMANTIC = "semantic",
    PROCEDURAL = "procedural",
}

export enum MemoryCategory {
    FACT = "fact",
    EXPERIENCE = "experience",
    RELATIONSHIP = "relationship",
    PREFERENCE = "preference",
    LESSON = "lesson",
    PROCEDURE = "procedure",
    CONTEXT = "context",
    FEEDBACK = "feedback",
    DECISION = "decision",
    INSIGHT = "insight",
}

export enum DecisionStyle {
    ANALYTICAL = "analytical",
    INTUITIVE = "intuitive",
    COLLABORATIVE = "collaborative",
    DELEGATIVE = "delegative",
    DIRECTIVE = "directive",
    BALANCED = "balanced",
}

export enum EmotionalState {
    FOCUSED = "focused",
    ENERGIZED = "energized",
    CALM = "calm",
    STRESSED = "stressed",
    UNCERTAIN = "uncertain",
    CONFIDENT = "confident",
    FATIGUED = "fatigued",
    ENTHUSIASTIC = "enthusiastic",
    NEUTRAL = "neutral",
}

export enum CommunicationTone {
    FORMAL = "formal",
    CASUAL = "casual",
    TECHNICAL = "technical",
    FRIENDLY = "friendly",
    DIRECT = "direct",
    DIPLOMATIC = "diplomatic",
    ENCOURAGING = "encouraging",
    ANALYTICAL = "analytical",
}

export enum InstructionScope {
    GLOBAL = "global",
    COMPANY = "company",
    TEAM = "team",
    PROJECT = "project",
    ROLE = "role",
}

export enum LogLevel {
    DEBUG = "debug",
    INFO = "info",
    WARNING = "warning",
    ERROR = "error",
    CRITICAL = "critical",
}

export enum IdeaStatus {
    PROPOSED = "proposed",
    AI_REVIEWED = "ai_reviewed",
    OWNER_REVIEW = "owner_review",
    APPROVED = "approved",
    REJECTED = "rejected",
    IN_DEVELOPMENT = "in_development",
    IMPLEMENTED = "implemented",
    ARCHIVED = "archived",
}

export enum IdeaCategory {
    PRODUCT = "product",
    FEATURE = "feature",
    MARKETING = "marketing",
    GROWTH = "growth",
    REVENUE = "revenue",
    PROCESS = "process",
    TECHNOLOGY = "technology",
    PARTNERSHIP = "partnership",
    CONTENT = "content",
    EXPERIMENT = "experiment",
    OTHER = "other",
}

export enum IdeaPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    URGENT = "urgent",
}

export enum AssetType {
    FILE = "file",
    IMAGE = "image",
    DOCUMENT = "document",
    LINK = "link",
    CODE = "code",
    DATA = "data",
    MOCKUP = "mockup",
    VIDEO = "video",
}

export enum AIRecommendation {
    STRONG_YES = "strong_yes",
    YES = "yes",
    CONDITIONAL = "conditional",
    NO = "no",
    STRONG_NO = "strong_no",
}

export enum SearchDepth {
    QUICK = "quick",
    STANDARD = "standard",
    DEEP = "deep",
    EXHAUSTIVE = "exhaustive",
}

export enum SocialPostType {
    MEME = "meme",
    JOKE = "joke",
    HOT_TAKE = "hot_take",
    CELEBRATION = "celebration",
    RANT = "rant",
    QUESTION = "question",
    POLL = "poll",
    GIF = "gif",
    SHITPOST = "shitpost",
    WORK_UPDATE = "work_update",
    RANDOM_THOUGHT = "random_thought",
    FOOD_TAKE = "food_take",
    MUSIC = "music",
    FITNESS = "fitness",
    CONFESSION = "confession",
    UNPOPULAR_OPINION = "unpopular_opinion",
    WHOLE_TEAM = "whole_team",
    SHOUTOUT = "shoutout",
    MEME_TEMPLATE = "meme_template",
    LINK = "link",
    TEXT = "text",
}

export enum ReactionEmoji {
    THUMBS_UP = "👍",
    THUMBS_DOWN = "👎",
    HEART = "❤️",
    LAUGH = "😂",
    FIRE = "🔥",
    MIND_BLOWN = "🤯",
    CRY = "😢",
    ROFL = "🤣",
    CLAP = "👏",
    EYES = "👀",
    SKULL = "💀",
    PRAY = "🙏",
    MUSCLE = "💪",
    NERD = "🤓",
    CLOWN = "🤡",
    COFFEE = "☕",
    BEER = "🍺",
    PARTY = "🎉",
    ROCKET = "🚀",
    TRASH = "🗑️",
    CAP = "🧢",
    SALT = "🧂",
    WIP = "🔨",
    DONE = "✅",
    BRAIN = "🧠",
}

// ═══════════════════════════════════════════════════════════════════
//  FINANCIAL SYSTEMS
// ═══════════════════════════════════════════════════════════════════

export enum RevenueType {
    SUBSCRIPTION = "subscription",
    ONE_TIME = "one_time",
    USAGE_BASED = "usage_based",
    COMMISSION = "commission",
    LICENSING = "licensing",
    SERVICE_FEE = "service_fee",
    PARTNERSHIP = "partnership",
    ADVERTISING = "advertising",
    AFFILIATE = "affiliate",
    GRANT = "grant",
}

export enum InvoiceStatus {
    DRAFT = "draft",
    SENT = "sent",
    VIEWED = "viewed",
    PAID = "paid",
    OVERDUE = "overdue",
    CANCELLED = "cancelled",
    REFUNDED = "refunded",
    PARTIALLY_PAID = "partially_paid",
    DISPUTED = "disputed",
}

export enum PaymentMethod {
    CREDIT_CARD = "credit_card",
    DEBIT_CARD = "debit_card",
    BANK_TRANSFER = "bank_transfer",
    WIRE_TRANSFER = "wire_transfer",
    CRYPTO = "crypto",
    INVOICE = "invoice",
    AUTO_DEDUCT = "auto_deduct",
    PAYPAL = "paypal",
    STRIPE = "stripe",
}

export enum ForecastType {
    REVENUE = "revenue",
    EXPENSE = "expense",
    GROWTH = "growth",
    CHURN = "churn",
    BURN_RATE = "burn_rate",
    RUNWAY = "runway",
    CAC = "cac",
    LTV = "ltv",
    MRR = "mrr",
    ARR = "arr",
}

// ═══════════════════════════════════════════════════════════════════
//  AUTOMATION & SCHEDULING
// ═══════════════════════════════════════════════════════════════════

export enum CronJobStatus {
    ACTIVE = "active",
    PAUSED = "paused",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled",
}

export enum CronJobType {
    REPORT = "report",
    STANDUP = "standup",
    CHECK = "check",
    SYNC = "sync",
    CLEANUP = "cleanup",
    NOTIFY = "notify",
    REVIEW = "review",
    BACKUP = "backup",
    MONITOR = "monitor",
    GENERATE = "generate",
    ANALYSE = "analyse",
    POST = "post",
    FOLLOW_UP = "follow_up",
    RENEWAL = "renewal",
    MAINTENANCE = "maintenance",
}

export enum WorkflowStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    PAUSED = "paused",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled",
}

export enum WorkflowTriggerType {
    EVENT = "event",
    SCHEDULE = "schedule",
    MANUAL = "manual",
    WEBHOOK = "webhook",
    THRESHOLD = "threshold",
    CONDITION = "condition",
    EXTERNAL = "external",
}

export enum WorkflowActionType {
    CREATE_TASK = "create_task",
    ASSIGN_AGENT = "assign_agent",
    SEND_MESSAGE = "send_message",
    UPDATE_STATUS = "update_status",
    NOTIFY = "notify",
    DELAY = "delay",
    CONDITION = "condition",
    API_CALL = "api_call",
    CREATE_PROJECT = "create_project",
    UPDATE_PROJECT = "update_project",
    SEND_EMAIL = "send_email",
    CREATE_INVOICE = "create_invoice",
    ALLOCATE_BUDGET = "allocate_budget",
    ESCALATE = "escalate",
    APPROVE = "approve",
    LOG = "log",
    TRANSFORM = "transform",
    BRANCH = "branch",
    PARALLEL = "parallel",
}

// ═══════════════════════════════════════════════════════════════════
//  ESCALATION & APPROVALS
// ═══════════════════════════════════════════════════════════════════

export enum EscalationLevel {
    AGENT = "agent",
    MANAGER = "manager",
    DIRECTOR = "director",
    CEO = "ceo",
    HUMAN = "human",
}

export enum EscalationStatus {
    PENDING = "pending",
    ESCALATED = "escalated",
    ACKNOWLEDGED = "acknowledged",
    IN_PROGRESS = "in_progress",
    RESOLVED = "resolved",
    TIMED_OUT = "timed_out",
    CANCELLED = "cancelled",
}

export enum ApprovalStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    EXPIRED = "expired",
    CANCELLED = "cancelled",
    RESUBMITTED = "resubmitted",
}

export enum ApprovalType {
    BUDGET = "budget",
    HIRE = "hire",
    FIRE = "fire",
    PUBLISH = "publish",
    DEPLOY = "deploy",
    LEGAL = "legal",
    PARTNERSHIP = "partnership",
    ACQUISITION = "acquisition",
    RESTRUCTURE = "restructure",
    API_KEY = "api_key",
    DATA_ACCESS = "data_access",
    VENDOR = "vendor",
}

// ═══════════════════════════════════════════════════════════════════
//  ERROR HANDLING & RECOVERY
// ═══════════════════════════════════════════════════════════════════

export enum ErrorSeverity {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical",
    FATAL = "fatal",
}

export enum ErrorCategory {
    TASK_FAILURE = "task_failure",
    API_ERROR = "api_error",
    TIMEOUT = "timeout",
    RATE_LIMIT = "rate_limit",
    AUTH_FAILURE = "auth_failure",
    DATA_CORRUPTION = "data_corruption",
    DEPENDENCY_FAILURE = "dependency_failure",
    RESOURCE_EXHAUSTED = "resource_exhausted",
    LOGIC_ERROR = "logic_error",
    EXTERNAL_SERVICE = "external_service",
    NETWORK = "network",
    VALIDATION = "validation",
    PERMISSION = "permission",
    UNKNOWN = "unknown",
}

export enum RecoveryAction {
    RETRY = "retry",
    SKIP = "skip",
    ASSIGN_FALLBACK = "assign_fallback",
    ESCALATE = "escalate",
    HALT = "halt",
    ROLLBACK = "rollback",
    RESTART_AGENT = "restart_agent",
    RESTORE_CHECKPOINT = "restore_checkpoint",
    NOTIFY_HUMAN = "notify_human",
    DEGRADE = "degrade",
}

// ═══════════════════════════════════════════════════════════════════
//  MEETINGS & CALENDAR
// ═══════════════════════════════════════════════════════════════════

export enum MeetingPlatform {
    GOOGLE_MEET = "google_meet",
    ZOOM = "zoom",
    MICROSOFT_TEAMS = "microsoft_teams",
    DISCORD = "discord",
    SLACK_HUDDLE = "slack_huddle",
    IN_PERSON = "in_person",
    PHONE = "phone",
    WEBEX = "webex",
    HANGOUTS = "hangouts",
    CUSTOM = "custom",
}

export enum ExternalCalendarProvider {
    GOOGLE = "google",
    OUTLOOK = "outlook",
    APPLE = "apple",
    CALDAV = "caldav",
    EXCHANGE = "exchange",
}

export enum SyncStatus {
    SYNCED = "synced",
    PENDING = "pending",
    FAILED = "failed",
    CONFLICT = "conflict",
    PARTIAL = "partial",
}

export enum CalendarEventType {
    MEETING = "meeting",
    DEADLINE = "deadline",
    MILESTONE = "milestone",
    SPRINT_START = "sprint_start",
    SPRINT_END = "sprint_end",
    STANDUP = "standup",
    RETROSPECTIVE = "retrospective",
    ALL_HANDS = "all_hands",
    ONE_ON_ONE = "one_on_one",
    INTERVIEW = "interview",
    LAUNCH = "launch",
    REVIEW = "review",
    WORKSHOP = "workshop",
    CONFERENCE = "conference",
    PERSONAL = "personal",
    REMINDER = "reminder",
    RECURRING = "recurring",
}

// ═══════════════════════════════════════════════════════════════════
//  KNOWLEDGE & DECISIONS
// ═══════════════════════════════════════════════════════════════════

export enum KnowledgeEntryType {
    SOP = "sop",
    DECISION = "decision",
    LESSON = "lesson",
    PROCESS = "process",
    POLICY = "policy",
    TEMPLATE = "template",
    FAQ = "faq",
    RUNBOOK = "runbook",
    ARCHITECTURE = "architecture",
    POSTMORTEM = "postmortem",
    ONBOARDING = "onboarding",
    HOW_TO = "how_to",
    REFERENCE = "reference",
}

export enum AccessLevel {
    PUBLIC = "public",
    INTERNAL = "internal",
    TEAM = "team",
    CONFIDENTIAL = "confidential",
    RESTRICTED = "restricted",
    CLASSIFIED = "classified",
}

// ═══════════════════════════════════════════════════════════════════
//  MONITORING & ALERTS
// ═══════════════════════════════════════════════════════════════════

export enum AnomalyType {
    SPENDING_SPIKE = "spending_spike",
    QUALITY_DROP = "quality_drop",
    DEADLINE_MISS = "deadline_miss",
    BEHAVIOR_CHANGE = "behavior_change",
    RESOURCE_DEPLETION = "resource_depletion",
    PERFORMANCE_DEGRADATION = "performance_degradation",
    UNUSUAL_ACTIVITY = "unusual_activity",
    COST_OVERRUN = "cost_overrun",
    OUTPUT_DROP = "output_drop",
    RESPONSE_DELAY = "response_delay",
    ERROR_SPIKE = "error_spike",
    COLLABORATION_BREAKDOWN = "collaboration_breakdown",
}

export enum SLAPriority {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low",
}

export enum SLAStatus {
    ON_TRACK = "on_track",
    AT_RISK = "at_risk",
    BREACHED = "breached",
    RESOLVED = "resolved",
    WAIVED = "waived",
}

export enum MetricType {
    REVENUE = "revenue",
    USERS = "users",
    TASKS = "tasks",
    QUALITY = "quality",
    SATISFACTION = "satisfaction",
    GROWTH = "growth",
    CHURN = "churn",
    RETENTION = "retention",
    RESPONSE_TIME = "response_time",
    UPTIME = "uptime",
    COST = "cost",
    EFFICIENCY = "efficiency",
    THROUGHPUT = "throughput",
    LATENCY = "latency",
}

export enum IntervalType {
    HOURLY = "hourly",
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    QUARTERLY = "quarterly",
    YEARLY = "yearly",
}

// ═══════════════════════════════════════════════════════════════════
//  SECURITY & GOVERNANCE
// ═══════════════════════════════════════════════════════════════════

export enum PermissionAction {
    CREATE = "create",
    READ = "read",
    UPDATE = "update",
    DELETE = "delete",
    EXECUTE = "execute",
    APPROVE = "approve",
    ASSIGN = "assign",
    ESCALATE = "escalate",
}

export enum ResourceType2 {
    API_KEY = "api_key",
    DATABASE = "database",
    STORAGE = "storage",
    SERVICE = "service",
    CREDENTIAL = "credential",
    TOKEN = "token",
    CERTIFICATE = "certificate",
    WEBHOOK = "webhook",
}

export enum ComplianceStatus {
    COMPLIANT = "compliant",
    NON_COMPLIANT = "non_compliant",
    UNDER_REVIEW = "under_review",
    EXEMPT = "exempt",
    PENDING = "pending",
}

export enum ComplianceCheckType {
    DATA_PRIVACY = "data_privacy",
    FINANCIAL = "financial",
    SECURITY = "security",
    LEGAL = "legal",
    OPERATIONAL = "operational",
    HR = "hr",
    ENVIRONMENTAL = "environmental",
    ACCESS_CONTROL = "access_control",
}

// ═══════════════════════════════════════════════════════════════════
//  CUSTOMER SUPPORT & FEEDBACK
// ═══════════════════════════════════════════════════════════════════

export enum TicketStatus {
    OPEN = "open",
    IN_PROGRESS = "in_progress",
    WAITING_ON_CUSTOMER = "waiting_on_customer",
    WAITING_ON_INTERNAL = "waiting_on_internal",
    RESOLVED = "resolved",
    CLOSED = "closed",
    ESCALATED = "escalated",
    REOPENED = "reopened",
}

export enum TicketCategory {
    BUG = "bug",
    FEATURE_REQUEST = "feature_request",
    ACCOUNT = "account",
    BILLING = "billing",
    ONBOARDING = "onboarding",
    TECHNICAL = "technical",
    GENERAL = "general",
    COMPLAINT = "complause",
    SECURITY = "security",
    PERFORMANCE = "performance",
}

export enum FeedbackType {
    NPS = "nps",
    CSAT = "csat",
    CES = "ces",
    SURVEY = "survey",
    IN_APP = "in_app",
    SUPPORT = "support",
    SOCIAL_MEDIA = "social_media",
    REVIEW = "review",
    INTERVIEW = "interview",
    USAGE = "usage",
}

// ═══════════════════════════════════════════════════════════════════
//  MARKETING & CONTENT
// ═══════════════════════════════════════════════════════════════════

export enum ContentType {
    BLOG = "blog",
    SOCIAL_POST = "social_post",
    EMAIL = "email",
    AD = "ad",
    LANDING_PAGE = "landing_page",
    VIDEO = "video",
    PODCAST = "podcast",
    NEWSLETTER = "newsletter",
    WEBINAR = "webinar",
    CASE_STUDY = "case_study",
    WHITEPAPER = "whitepaper",
    INFOGRAPHIC = "infographic",
    PRESS_RELEASE = "press_release",
    DOCUMENTATION = "documentation",
    TUTORIAL = "tutorial",
}

export enum ContentStatus {
    IDEATION = "ideation",
    DRAFTING = "drafting",
    REVIEW = "review",
    APPROVED = "approved",
    SCHEDULED = "scheduled",
    PUBLISHED = "published",
    ARCHIVED = "archived",
    FAILED = "failed",
}

export enum SEOCheckType {
    KEYWORD = "keyword",
    BACKLINK = "backlink",
    PAGE_SPEED = "page_speed",
    MOBILE_FRIENDLY = "mobile_friendly",
    META_TAGS = "meta_tags",
    CONTENT_QUALITY = "content_quality",
    STRUCTURED_DATA = "structured_data",
    INTERNAL_LINKS = "internal_links",
    IMAGE_OPTIMISATION = "image_optimisation",
    CORE_WEB_VITALS = "core_web_vitals",
}

// ═══════════════════════════════════════════════════════════════════
//  A/B TESTING & EXPERIMENTS
// ═══════════════════════════════════════════════════════════════════

export enum ExperimentStatus {
    DRAFT = "draft",
    RUNNING = "running",
    PAUSED = "paused",
    COMPLETED = "completed",
    ANALYSED = "analysed",
    CANCELLED = "cancelled",
}

export enum ExperimentType {
    AB = "ab",
    MULTIVARIATE = "multivariate",
    SPLIT_URL = "split_url",
    MULTI_PAGE = "multi_page",
    BANDIT = "bandit",
}

// ═══════════════════════════════════════════════════════════════════
//  TOOL & INTEGRATION
// ═══════════════════════════════════════════════════════════════════

export enum ToolIntegrationType {
    GOOGLE_MEET = "google_meet",
    GOOGLE_CALENDAR = "google_calendar",
    GITHUB = "github",
    GITLAB = "gitlab",
    JIRA = "jira",
    LINEAR = "linear",
    NOTION = "notion",
    SLACK = "slack",
    DISCORD = "discord",
    TWITTER = "twitter",
    LINKEDIN = "linkedin",
    STRIPE = "stripe",
    SENDGRID = "sendgrid",
    TWILIO = "twilio",
    AWS = "aws",
    GCP = "gcp",
    AZURE = "azure",
    OPENAI = "openai",
    ANTHROPIC = "anthropic",
    FIREBASE = "firebase",
    SUPABASE = "supabase",
    REDIS = "redis",
    POSTGRES = "postgres",
    MONGODB = "mongodb",
    ELASTICSEARCH = "elasticsearch",
    CUSTOM = "custom",
}

export enum ToolConnectionStatus {
    CONNECTED = "connected",
    DISCONNECTED = "disconnected",
    ERROR = "error",
    EXPIRED = "expired",
    RATE_LIMITED = "rate_limited",
    PENDING = "pending",
}

export enum TrendDirection {
    RISING = "rising",
    STABLE = "stable",
    DECLINING = "declining",
}

export enum ToolScope {
    READ = "read",
    WRITE = "write",
    ADMIN = "admin",
    EXECUTE = "execute",
}

// ═══════════════════════════════════════════════════════════════════
//  MCP (Model Context Protocol)
// ═══════════════════════════════════════════════════════════════════

export enum MCPServerType {
    FILESYSTEM = "filesystem",
    DATABASE = "database",
    API = "api",
    BROWSER = "browser",
    GIT = "git",
    MEMORY = "memory",
    SEARCH = "search",
    COMPUTE = "compute",
    COMMUNICATION = "communication",
    CUSTOM = "custom",
}

export enum MCPServerStatus {
    CONNECTED = "connected",
    DISCONNECTED = "disconnected",
    ERROR = "error",
    STARTING = "starting",
    STOPPING = "stopping",
}

export enum MCPTransportType {
    STDIO = "stdio",
    SSE = "sse",
    HTTP = "http",
    WEBSOCKET = "websocket",
}

export enum LLMProvider {
    OLLAMA = "ollama",
    HUGGINGFACE = "huggingface",
    TOGETHER = "together",
    GROQ = "groq",
    OPENAI = "openai",
    ANTHROPIC = "anthropic",
    GOOGLE = "google",
    MISTRAL = "mistral",
    DEEPSEEK = "deepseek",
    LOCAL = "local",
    CUSTOM = "custom",
}

export enum LLMModelSize {
    TINY = "tiny",
    SMALL = "small",
    MEDIUM = "medium",
    LARGE = "large",
    EXTRA_LARGE = "extra_large",
}
