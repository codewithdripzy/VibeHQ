import { createCrudService } from "./crudFactory";
import { User } from "../models/user.model";
import { Company } from "../models/company.model";
import { Team } from "../models/team.model";
import { Agent } from "../models/agent.model";
import { AgentMemory } from "../models/agentMemory.model";
import { Project } from "../models/project.model";
import { Task } from "../models/task.model";
import { Sprint } from "../models/sprint.model";
import { Milestone } from "../models/milestone.model";
import { Meeting } from "../models/meeting.model";
import { CompanyDocument } from "../models/document.model";
import { Channel } from "../models/channel.model";
import { Campaign } from "../models/campaign.model";
import { Customer } from "../models/customer.model";
import { OKR } from "../models/okr.model";
import { Expense } from "../models/expense.model";
import { AuditLog } from "../models/auditLog.model";
import { Notification } from "../models/notification.model";
import { Idea } from "../models/idea.model";
import { CompanyResource } from "../models/companyResource.model";
import SocialPost from "../models/socialPost.model";
import Revenue from "../models/revenue.model";
import Invoice from "../models/invoice.model";
import FinancialForecast from "../models/financialForecast.model";
import CronJob from "../models/cronJob.model";
import Workflow from "../models/workflow.model";
import EscalationChain from "../models/escalationChain.model";
import ApprovalWorkflow from "../models/approvalWorkflow.model";
import ErrorLog from "../models/errorLog.model";
import Checkpoint from "../models/checkpoint.model";
import MeetingBooking from "../models/meetingBooking.model";
import ExternalCalendar from "../models/externalCalendar.model";
import CompanyCalendarEvent from "../models/companyCalendarEvent.model";
import KnowledgeEntry from "../models/knowledgeEntry.model";
import DecisionLog from "../models/decisionLog.model";
import AnomalyAlert from "../models/anomalyAlert.model";
import SLATracking from "../models/slaTracking.model";
import RBACRole from "../models/rbacRole.model";
import SecretStore from "../models/secretStore.model";
import ComplianceRecord from "../models/complianceRecord.model";
import SupportTicket from "../models/supportTicket.model";
import CustomerOnboarding from "../models/customerOnboarding.model";
import FeedbackLoop from "../models/feedbackLoop.model";
import ContentCalendar from "../models/contentCalendar.model";
import SEOMonitor from "../models/seoMonitor.model";
import ABExperiment from "../models/abExperiment.model";
import AgentToolConfig from "../models/agentToolConfig.model";
import EventLog from "../models/eventLog.model";
import DirectMessage from "../models/directMessage.model";
import MCPServer from "../models/mcpServer.model";
import LLMConfig from "../models/llmConfig.model";
import BrainstormSession from "../models/brainstormSession.model";

export const services = {
    user: createCrudService(User),
    company: createCrudService(Company),
    team: createCrudService(Team),
    agent: createCrudService(Agent),
    agentMemory: createCrudService(AgentMemory),
    project: createCrudService(Project),
    task: createCrudService(Task),
    sprint: createCrudService(Sprint),
    milestone: createCrudService(Milestone),
    meeting: createCrudService(Meeting),
    document: createCrudService(CompanyDocument),
    channel: createCrudService(Channel),
    campaign: createCrudService(Campaign),
    customer: createCrudService(Customer),
    okr: createCrudService(OKR),
    expense: createCrudService(Expense),
    auditLog: createCrudService(AuditLog),
    notification: createCrudService(Notification),
    idea: createCrudService(Idea),
    socialPost: createCrudService(SocialPost),
    revenue: createCrudService(Revenue),
    invoice: createCrudService(Invoice),
    financialForecast: createCrudService(FinancialForecast),
    cronJob: createCrudService(CronJob),
    workflow: createCrudService(Workflow),
    escalationChain: createCrudService(EscalationChain),
    approvalWorkflow: createCrudService(ApprovalWorkflow),
    errorLog: createCrudService(ErrorLog),
    checkpoint: createCrudService(Checkpoint),
    meetingBooking: createCrudService(MeetingBooking),
    externalCalendar: createCrudService(ExternalCalendar),
    companyCalendarEvent: createCrudService(CompanyCalendarEvent),
    knowledgeEntry: createCrudService(KnowledgeEntry),
    decisionLog: createCrudService(DecisionLog),
    anomalyAlert: createCrudService(AnomalyAlert),
    slaTracking: createCrudService(SLATracking),
    rbacRole: createCrudService(RBACRole),
    secretStore: createCrudService(SecretStore),
    complianceRecord: createCrudService(ComplianceRecord),
    supportTicket: createCrudService(SupportTicket),
    customerOnboarding: createCrudService(CustomerOnboarding),
    feedbackLoop: createCrudService(FeedbackLoop),
    contentCalendar: createCrudService(ContentCalendar),
    seoMonitor: createCrudService(SEOMonitor),
    abExperiment: createCrudService(ABExperiment),
    agentToolConfig: createCrudService(AgentToolConfig),
    eventLog: createCrudService(EventLog),
    directMessage: createCrudService(DirectMessage),
    mcpServer: createCrudService(MCPServer),
    llmConfig: createCrudService(LLMConfig),
    brainstormSession: createCrudService(BrainstormSession),
    resource: createCrudService(CompanyResource),
    forecast: createCrudService(FinancialForecast),
};

export { createCrudService };
