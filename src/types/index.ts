export type UserRole = 'admin' | 'executive' | 'supervisor' | 'teacher';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  school: string;
  position: string;
  subjectGroup?: string;
  avatar: string;
  lineToken?: string;
  signatureUrl?: string;
}

export interface CriterionItem {
  id: string;
  number: number;
  title: string;
  description: string;
  maxScore: number;
  category: 'planning' | 'instruction' | 'media' | 'climate' | 'assessment';
}

export interface EditHistoryEntry {
  timestamp: string;
  modifiedBy: string;
  changeSummary: string;
}

export interface SupervisionRecord {
  id: string;
  code: string; // e.g. SUP-2026-001
  teacherId: string;
  teacherName: string;
  school: string;
  subjectGroup: string; // เช่น กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี
  subjectName: string; // เช่น วิทยาการคำนวณ ว21103
  gradeLevel: string; // เช่น มัธยมศึกษาปีที่ 1
  room: string; // เช่น ม.1/2
  teachingTopic: string; // หัวข้อเรื่อง เช่น การเขียนอัลกอริทึมแก้ปัญหา
  supervisorId: string;
  supervisorName: string;
  supervisorPosition: string;
  date: string; // YYYY-MM-DD
  timeStart: string;
  timeEnd: string;
  scores: Record<string, number>; // criterionId -> score (1-5)
  totalScore: number; // 0 - 40
  percentage: number; // 0 - 100
  gradeTier: 'ยอดเยี่ยม' | 'ดีมาก' | 'ดี' | 'ผ่านเกณฑ์' | 'ควรพัฒนา';
  tierColor: string;
  strengths: string;
  recommendations: string;
  generalComment: string;
  status: 'draft' | 'completed' | 'acknowledged';
  supervisorSignature?: string;
  teacherSignature?: string;
  teacherAcknowledgedAt?: string;
  certificateNumber?: string;
  certificateIssuedAt?: string;
  lineNotified: boolean;
  lineNotifiedAt?: string;
  lastModified: string; // ISO 8601
  lastModifiedBy: string;
  editHistory: EditHistoryEntry[];
}

export interface BackupRecord {
  id: string;
  timestamp: string;
  type: 'auto_daily' | 'manual';
  recordCount: number;
  sizeKb: number;
  status: 'success' | 'failed';
  hash: string;
}

export interface LineNotifyLog {
  id: string;
  recordCode: string;
  teacherName: string;
  timestamp: string;
  status: 'success' | 'failed';
  message: string;
  httpCode: number;
}

export interface ReplyMessage {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorRoleTitle: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
}

export interface DiscussionMessage {
  id: string;
  channelId: string;
  recordId?: string; // If tied to a specific supervision record
  recordCode?: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorRoleTitle: string;
  authorAvatar: string;
  content: string;
  tags?: string[];
  attachments?: Array<{
    name: string;
    size?: string;
    url?: string;
    type?: 'document' | 'link' | 'image';
  }>;
  reactions: Record<string, string[]>; // emoji -> array of userIds
  replies: ReplyMessage[];
  timestamp: string;
  isPinned?: boolean;
}

export interface DiscussionChannel {
  id: string;
  name: string;
  description: string;
  category: 'plc' | 'subject' | 'supervision' | 'general';
  unreadCount?: number;
  icon?: string;
}

export type SocialProvider = 'google' | 'facebook';

export interface SystemSettings {
  schoolName: string;
  educationalArea: string;
  directorName: string;
  directorPosition: string;
  supervisorDirectorName: string;
  lineNotifyToken: string;
  enableLineNotify: boolean;
  autoBackupDaily: boolean;
  lastDailyBackupDate: string;
  cloudSyncEnabled: boolean;
  lastCloudSync: string;
}
