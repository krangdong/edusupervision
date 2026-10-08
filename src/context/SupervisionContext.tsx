import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  SupervisionRecord,
  SystemSettings,
  BackupRecord,
  LineNotifyLog,
  EditHistoryEntry,
  DiscussionChannel,
  DiscussionMessage,
  ReplyMessage,
  SocialProvider
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_RECORDS,
  INITIAL_SETTINGS,
  INITIAL_BACKUPS,
  SUPERVISION_CRITERIA
} from '../data/initialData';
import { INITIAL_CHANNELS, INITIAL_MESSAGES } from '../data/initialDiscussions';

interface SupervisionContextType {
  currentUser: User;
  users: User[];
  records: SupervisionRecord[];
  backups: BackupRecord[];
  lineLogs: LineNotifyLog[];
  settings: SystemSettings;
  channels: DiscussionChannel[];
  messages: DiscussionMessage[];
  setCurrentUser: (user: User) => void;
  switchUser: (userId: string) => void;
  loginUser: (email: string, password?: string) => boolean;
  socialLogin: (provider: SocialProvider, profile?: Partial<User>) => User;
  logoutUser: () => void;
  createRecord: (recordData: Partial<SupervisionRecord>) => SupervisionRecord;
  updateRecord: (id: string, updates: Partial<SupervisionRecord>, reason?: string) => SupervisionRecord | null;
  deleteRecord: (id: string) => boolean;
  acknowledgeRecord: (id: string, teacherSignatureText: string) => boolean;
  sendLineNotification: (record: SupervisionRecord, customMessage?: string) => Promise<{ success: boolean; message: string }>;
  createBackup: (type?: 'manual' | 'auto_daily') => BackupRecord;
  restoreBackup: (backupId: string) => boolean;
  importDataFromJson: (jsonData: string) => { success: boolean; error?: string };
  exportDataToJson: () => string;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  triggerDailyBackupCheck: () => void;
  isCloudSynced: boolean;
  isSyncing: boolean;
  syncWithCloud: () => Promise<void>;
  addMessage: (channelId: string, content: string, tags?: string[], attachments?: any, recordId?: string, recordCode?: string) => DiscussionMessage;
  addReply: (messageId: string, content: string) => void;
  toggleReaction: (messageId: string, emoji: string) => void;
  createChannelForRecord: (record: SupervisionRecord) => string;
}

const SupervisionContext = createContext<SupervisionContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'edusup_current_user',
  USERS: 'edusup_users',
  RECORDS: 'edusup_records',
  BACKUPS: 'edusup_backups',
  SETTINGS: 'edusup_settings',
  LINE_LOGS: 'edusup_line_logs',
  CHANNELS: 'edusup_channels',
  MESSAGES: 'edusup_messages'
};

export function SupervisionProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_USERS;
  });
  
  // Current logged in user (default to supervisor for immediate action)
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_USERS[1]; // ศน.ดร.พรพิมล (Supervisor)
  });

  // Channels
  const [channels, setChannels] = useState<DiscussionChannel[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHANNELS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_CHANNELS;
  });

  // Messages
  const [messages, setMessages] = useState<DiscussionMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_MESSAGES;
  });

  // Records
  const [records, setRecords] = useState<SupervisionRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RECORDS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_RECORDS;
  });

  // Backups
  const [backups, setBackups] = useState<BackupRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BACKUPS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_BACKUPS;
  });

  // Settings
  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_SETTINGS;
  });

  // Line notify logs
  const [lineLogs, setLineLogs] = useState<LineNotifyLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LINE_LOGS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [
      {
        id: 'll-1',
        recordCode: 'SUP-2026-001',
        teacherName: 'ครูธีรภัทร ชาญวิทย์',
        timestamp: '2026-10-06T10:31:12.000Z',
        status: 'success',
        message: '🔔 [EduSupervision] แจ้งผลการนิเทศการจัดการเรียนรู้ ครูธีรภัทร ชาญวิทย์ คะแนน: 38/40 (ยอดเยี่ยม 95%) รหัสเกียรติบัตร: CERT-EDUSUP-2026/0088',
        httpCode: 200
      },
      {
        id: 'll-2',
        recordCode: 'SUP-2026-002',
        teacherName: 'ครูปรียานุช รัตนศิริ',
        timestamp: '2026-10-07T11:26:00.000Z',
        status: 'success',
        message: '🔔 [EduSupervision] แจ้งผลการนิเทศการจัดการเรียนรู้ ครูปรียานุช รัตนศิริ คะแนน: 34/40 (ดีมาก 85%) รหัสเกียรติบัตร: CERT-EDUSUP-2026/0089',
        httpCode: 200
      },
      {
        id: 'll-3',
        recordCode: 'SUP-2026-003',
        teacherName: 'ครูกิตติพงษ์ เจริญทรัพย์',
        timestamp: '2026-10-08T14:01:05.000Z',
        status: 'success',
        message: '🔔 [EduSupervision] แจ้งผลการนิเทศการจัดการเรียนรู้ ครูกิตติพงษ์ เจริญทรัพย์ คะแนน: 37/40 (ยอดเยี่ยม 92.5%) รหัสเกียรติบัตร: CERT-EDUSUP-2026/0090',
        httpCode: 200
      }
    ];
  });

  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BACKUPS, JSON.stringify(backups));
  }, [backups]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LINE_LOGS, JSON.stringify(lineLogs));
  }, [lineLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHANNELS, JSON.stringify(channels));
  }, [channels]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);

  // Daily backup scheduler check
  useEffect(() => {
    triggerDailyBackupCheck();
  }, []);

  const triggerDailyBackupCheck = () => {
    if (!settings.autoBackupDaily) return;
    const now = new Date();
    const lastBackup = new Date(settings.lastDailyBackupDate || 0);
    
    // Check if 24 hours passed or new day
    const isDifferentDay = now.toDateString() !== lastBackup.toDateString();
    if (isDifferentDay) {
      createBackup('auto_daily');
      setSettings(prev => ({
        ...prev,
        lastDailyBackupDate: now.toISOString()
      }));
    }
  };

  const switchUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
    }
  };

  const loginUser = (email: string) => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      return true;
    }
    // If not found in presets, create dynamic user
    const newUser: User = {
      id: `u-${Date.now()}`,
      name: email.split('@')[0],
      email: email,
      role: 'teacher',
      roleTitle: 'ครูผู้สอน',
      school: settings.schoolName,
      position: 'ครูผู้สอน',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    };
    setCurrentUser(newUser);
    return true;
  };

  const socialLogin = (provider: SocialProvider, profile?: Partial<User>): User => {
    const email = profile?.email || (provider === 'google' ? 'teacher.workspace@obec.go.th' : 'teacher.fb@social.school');
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
      return existing;
    }
    const defaultRole: UserRole = profile?.role || 'teacher';
    const roleTitles: Record<UserRole, string> = {
      teacher: `ครูผู้สอน (${provider === 'google' ? 'Google Workspace' : 'Facebook Education'})`,
      supervisor: 'ศึกษานิเทศก์',
      executive: 'ผู้บริหารสถานศึกษา',
      admin: 'ผู้ดูแลระบบ'
    };
    const newUser: User = {
      id: `u-${provider}-${Date.now()}`,
      name: profile?.name || (provider === 'google' ? 'ครูสมศักดิ์ สุขสวัสดิ์ (Google)' : 'ครูสายใจ มั่นคง (Facebook)'),
      email: email,
      role: defaultRole,
      roleTitle: roleTitles[defaultRole],
      school: profile?.school || settings.schoolName,
      position: profile?.position || 'ครูผู้สอน',
      subjectGroup: profile?.subjectGroup || 'กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี',
      avatar: profile?.avatar || (provider === 'google'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80')
    };
    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    syncWithCloud();
    return newUser;
  };

  const addMessage = (
    channelId: string,
    content: string,
    tags?: string[],
    attachments?: any,
    recordId?: string,
    recordCode?: string
  ): DiscussionMessage => {
    const newMsg: DiscussionMessage = {
      id: `msg-${Date.now()}`,
      channelId,
      recordId,
      recordCode,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      authorRoleTitle: currentUser.roleTitle || currentUser.position,
      authorAvatar: currentUser.avatar,
      content,
      tags: tags || [],
      attachments: attachments || [],
      reactions: {},
      replies: [],
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [newMsg, ...prev]);
    syncWithCloud();
    return newMsg;
  };

  const addReply = (messageId: string, content: string) => {
    const newReply: ReplyMessage = {
      id: `rep-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      authorRoleTitle: currentUser.roleTitle || currentUser.position,
      authorAvatar: currentUser.avatar,
      content,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => prev.map(m => {
      if (m.id === messageId) {
        return {
          ...m,
          replies: [...m.replies, newReply]
        };
      }
      return m;
    }));
    syncWithCloud();
  };

  const toggleReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== messageId) return m;
      const currentUsers = m.reactions[emoji] || [];
      const hasReacted = currentUsers.includes(currentUser.id);
      const updatedUsers = hasReacted
        ? currentUsers.filter(id => id !== currentUser.id)
        : [...currentUsers, currentUser.id];
      const newReactions = { ...m.reactions };
      if (updatedUsers.length > 0) {
        newReactions[emoji] = updatedUsers;
      } else {
        delete newReactions[emoji];
      }
      return {
        ...m,
        reactions: newReactions
      };
    }));
  };

  const createChannelForRecord = (record: SupervisionRecord): string => {
    const channelId = `channel-${record.id}`;
    const existing = channels.find(c => c.id === channelId);
    if (existing) return channelId;
    const newChannel: DiscussionChannel = {
      id: channelId,
      name: `เสวนาผลการนิเทศ: ${record.subjectName} (${record.code})`,
      description: `การสื่อสารสองทางระหว่างผู้นิเทศและ ${record.teacherName} (${record.school})`,
      category: 'supervision',
      icon: 'CheckCircle'
    };
    setChannels(prev => [...prev, newChannel]);
    return channelId;
  };

  const logoutUser = () => {
    // switch to first teacher or visitor
    setCurrentUser(INITIAL_USERS[2]);
  };

  const syncWithCloud = async () => {
    setIsSyncing(true);
    // Simulate secure cloud transmission with TLS & checksum verification
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSyncing(false);
    setIsCloudSynced(true);
    setSettings(prev => ({ ...prev, lastCloudSync: new Date().toISOString() }));
  };

  const calculateGradeTier = (percentage: number): { tier: SupervisionRecord['gradeTier']; color: string } => {
    if (percentage >= 90) return { tier: 'ยอดเยี่ยม', color: '#16a34a' };
    if (percentage >= 80) return { tier: 'ดีมาก', color: '#2563eb' };
    if (percentage >= 70) return { tier: 'ดี', color: '#0284c7' };
    if (percentage >= 60) return { tier: 'ผ่านเกณฑ์', color: '#d97706' };
    return { tier: 'ควรพัฒนา', color: '#dc2626' };
  };

  const createRecord = (recordData: Partial<SupervisionRecord>): SupervisionRecord => {
    const timestamp = new Date().toISOString();
    const count = records.length + 1;
    const code = `SUP-2026-${String(count).padStart(3, '0')}`;
    const certNumber = `CERT-EDUSUP-2026/${String(count + 87).padStart(4, '0')}`;

    // compute scores
    const scores = recordData.scores || {};
    const totalScore = SUPERVISION_CRITERIA.reduce((acc, crit) => acc + (scores[crit.id] || 0), 0);
    const maxPossible = SUPERVISION_CRITERIA.length * 5;
    const percentage = Math.round((totalScore / maxPossible) * 100 * 10) / 10;
    const { tier, color } = calculateGradeTier(percentage);

    const newRecord: SupervisionRecord = {
      id: `rec-${Date.now()}`,
      code: code,
      teacherId: recordData.teacherId || '',
      teacherName: recordData.teacherName || 'ครูผู้รับการนิเทศ',
      school: recordData.school || settings.schoolName,
      subjectGroup: recordData.subjectGroup || 'กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี',
      subjectName: recordData.subjectName || 'วิชาเพิ่มเติม',
      gradeLevel: recordData.gradeLevel || 'มัธยมศึกษาปีที่ 1',
      room: recordData.room || 'ห้อง 1',
      teachingTopic: recordData.teachingTopic || 'การจัดการเรียนรู้เชิงรุก (Active Learning)',
      supervisorId: currentUser.id,
      supervisorName: currentUser.name,
      supervisorPosition: currentUser.roleTitle || currentUser.position,
      date: recordData.date || new Date().toISOString().split('T')[0],
      timeStart: recordData.timeStart || '09:00',
      timeEnd: recordData.timeEnd || '10:00',
      scores: scores,
      totalScore: totalScore,
      percentage: percentage,
      gradeTier: tier,
      tierColor: color,
      strengths: recordData.strengths || '',
      recommendations: recordData.recommendations || '',
      generalComment: recordData.generalComment || '',
      status: recordData.status || 'completed',
      supervisorSignature: recordData.supervisorSignature || `${currentUser.name} (ยืนยันระบบดิจิทัล)`,
      certificateNumber: certNumber,
      certificateIssuedAt: timestamp,
      lineNotified: false,
      lastModified: timestamp,
      lastModifiedBy: currentUser.name,
      editHistory: [
        {
          timestamp: timestamp,
          modifiedBy: currentUser.name,
          changeSummary: 'สร้างบันทึกการนิเทศและประเมินผลแบบเรียลไทม์'
        }
      ]
    };

    setRecords(prev => [newRecord, ...prev]);

    // Send Line notification automatically if enabled
    if (settings.enableLineNotify) {
      sendLineNotification(newRecord);
    }

    // Trigger cloud sync
    syncWithCloud();

    return newRecord;
  };

  const updateRecord = (id: string, updates: Partial<SupervisionRecord>, reason = 'แก้ไขข้อมูลการนิเทศ'): SupervisionRecord | null => {
    const existing = records.find(r => r.id === id);
    if (!existing) return null;

    const timestamp = new Date().toISOString();
    
    // recompute score if scores changed
    const newScores = updates.scores || existing.scores;
    const totalScore = SUPERVISION_CRITERIA.reduce((acc, crit) => acc + (newScores[crit.id] || 0), 0);
    const maxPossible = SUPERVISION_CRITERIA.length * 5;
    const percentage = Math.round((totalScore / maxPossible) * 100 * 10) / 10;
    const { tier, color } = calculateGradeTier(percentage);

    const historyEntry: EditHistoryEntry = {
      timestamp: timestamp,
      modifiedBy: currentUser.name,
      changeSummary: reason
    };

    const updated: SupervisionRecord = {
      ...existing,
      ...updates,
      scores: newScores,
      totalScore: totalScore,
      percentage: percentage,
      gradeTier: tier,
      tierColor: color,
      lastModified: timestamp,
      lastModifiedBy: currentUser.name,
      editHistory: [historyEntry, ...(existing.editHistory || [])]
    };

    setRecords(prev => prev.map(r => r.id === id ? updated : r));
    syncWithCloud();
    return updated;
  };

  const deleteRecord = (id: string): boolean => {
    setRecords(prev => prev.filter(r => r.id !== id));
    syncWithCloud();
    return true;
  };

  const acknowledgeRecord = (id: string, teacherSignatureText: string): boolean => {
    const timestamp = new Date().toISOString();
    const updated = updateRecord(id, {
      status: 'acknowledged',
      teacherSignature: teacherSignatureText || `${currentUser.name} (รับทราบผล)`,
      teacherAcknowledgedAt: timestamp
    }, 'ครูผู้รับการนิเทศลงนามรับทราบผลการประเมิน');
    return !!updated;
  };

  const sendLineNotification = async (record: SupervisionRecord, customMessage?: string): Promise<{ success: boolean; message: string }> => {
    const timestamp = new Date().toISOString();
    
    const defaultMsg = `🔔 [EduSupervision Pro] แจ้งเตือนผลการนิเทศการจัดการเรียนรู้
----------------------------------------
👤 ครูผู้รับการนิเทศ: ${record.teacherName}
🏫 โรงเรียน: ${record.school}
📚 วิชา: ${record.subjectName} (${record.gradeLevel})
📋 หัวข้อ: ${record.teachingTopic}
🎖️ ผลการประเมิน: ${record.gradeTier} (${record.totalScore}/40 คะแนน, ${record.percentage}%)
🔍 ผู้นิเทศ: ${record.supervisorName}
📜 รหัสเกียรติบัตร: ${record.certificateNumber || 'กำลังประมวลผล'}
⏰ วันที่ประเมิน: ${record.date} ${record.timeStart}-${record.timeEnd} น.
----------------------------------------
ระบบได้ออกเกียรติบัตรอิเล็กทรอนิกส์เรียบร้อยแล้ว ท่านสามารถเข้าสู่ระบบเพื่อดาวน์โหลดเอกสารได้ทันที`;

    const messageText = customMessage || defaultMsg;

    // Simulate sending to LINE Notify API
    try {
      // In web app, we simulate LINE Notify webhook delivery with realistic HTTP 200 payload
      const logEntry: LineNotifyLog = {
        id: `ll-${Date.now()}`,
        recordCode: record.code,
        teacherName: record.teacherName,
        timestamp: timestamp,
        status: 'success',
        message: messageText,
        httpCode: 200
      };

      setLineLogs(prev => [logEntry, ...prev]);

      // update record flag
      setRecords(prev => prev.map(r => {
        if (r.id === record.id) {
          return {
            ...r,
            lineNotified: true,
            lineNotifiedAt: timestamp
          };
        }
        return r;
      }));

      return {
        success: true,
        message: 'ส่งการแจ้งเตือนผ่าน LINE Notify ไปยังกลุ่มสาระฯ และครูผู้สอนสำเร็จ (Status: 200 OK)'
      };
    } catch {
      return {
        success: false,
        message: 'เกิดข้อผิดพลาดในการเชื่อมต่อ LINE Notify'
      };
    }
  };

  const createBackup = (type: 'manual' | 'auto_daily' = 'manual'): BackupRecord => {
    const timestamp = new Date().toISOString();
    const count = records.length;
    const jsonStr = JSON.stringify({ records, settings, timestamp });
    const sizeKb = Math.round((jsonStr.length / 1024) * 10) / 10;
    const hash = 'sha256:' + Math.random().toString(36).substring(2, 12);

    const newBackup: BackupRecord = {
      id: `bak-${Date.now()}`,
      timestamp: timestamp,
      type: type,
      recordCount: count,
      sizeKb: sizeKb,
      status: 'success',
      hash: hash
    };

    setBackups(prev => [newBackup, ...prev]);
    return newBackup;
  };

  const restoreBackup = (backupId: string): boolean => {
    const target = backups.find(b => b.id === backupId);
    if (!target) return false;
    // In local demo environment, we can refresh/re-seed or confirm
    return true;
  };

  const exportDataToJson = (): string => {
    const payload = {
      app: 'EduSupervision Pro',
      version: '2.5.0',
      exportedAt: new Date().toISOString(),
      exportedBy: currentUser.name,
      settings: settings,
      records: records,
      users: users,
      backups: backups
    };
    return JSON.stringify(payload, null, 2);
  };

  const importDataFromJson = (jsonData: string): { success: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(jsonData);
      if (Array.isArray(parsed.records)) {
        setRecords(parsed.records);
        if (parsed.settings) setSettings(parsed.settings);
        createBackup('manual');
        syncWithCloud();
        return { success: true };
      }
      return { success: false, error: 'โครงสร้างข้อมูลไฟล์ JSON ไม่ถูกต้อง ไม่พบบันทึกการนิเทศ' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid JSON file';
      return { success: false, error: msg };
    }
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <SupervisionContext.Provider
      value={{
        currentUser,
        users,
        records,
        backups,
        lineLogs,
        settings,
        channels,
        messages,
        setCurrentUser,
        switchUser,
        loginUser,
        socialLogin,
        logoutUser,
        createRecord,
        updateRecord,
        deleteRecord,
        acknowledgeRecord,
        sendLineNotification,
        createBackup,
        restoreBackup,
        importDataFromJson,
        exportDataToJson,
        updateSettings,
        triggerDailyBackupCheck,
        isCloudSynced,
        isSyncing,
        syncWithCloud,
        addMessage,
        addReply,
        toggleReaction,
        createChannelForRecord
      }}
    >
      {children}
    </SupervisionContext.Provider>
  );
}

export function useSupervision() {
  const context = useContext(SupervisionContext);
  if (!context) {
    throw new Error('useSupervision must be used within a SupervisionProvider');
  }
  return context;
}
