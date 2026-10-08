import React, { useState } from 'react';
import { useSupervision } from '../context/SupervisionContext';
import { DiscussionChannel, DiscussionMessage } from '../types';
import {
  MessageSquare,
  Send,
  Sparkles,
  Paperclip,
  CheckCircle,
  Users,
  Search,
  Tag,
  Pin,
  Smile,
  CornerDownRight,
  School,
  ExternalLink,
  ChevronDown,
  Filter,
  FileText,
  Image as ImageIcon,
  MessageCircle,
  HelpCircle,
  Award
} from 'lucide-react';

interface DiscussionBoardProps {
  initialChannelId?: string;
  onOpenCertificateByCode?: (code: string) => void;
}

export const DiscussionBoard: React.FC<DiscussionBoardProps> = ({
  initialChannelId,
  onOpenCertificateByCode
}) => {
  const {
    channels,
    messages,
    currentUser,
    addMessage,
    addReply,
    toggleReaction,
    records
  } = useSupervision();

  const [activeChannelId, setActiveChannelId] = useState<string>(
    initialChannelId || channels[0]?.id || 'general-plc'
  );
  const [contentInput, setContentInput] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [linkedRecordId, setLinkedRecordId] = useState<string>('');
  const [activeReplyMessageId, setActiveReplyMessageId] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [mockAttachment, setMockAttachment] = useState<{ name: string; type: 'document' | 'image' | 'link'; size?: string } | null>(null);

  const activeChannel = channels.find(c => c.id === activeChannelId) || channels[0];

  // Quick pedagogical tags
  const availableTags = [
    'Active Learning',
    'ปรึกษาแผนการสอน',
    'การวัดประเมินผล',
    'สื่อนวัตกรรม/EdTech',
    'การสะท้อนคิด (Reflection)',
    'ข้อเสนอแนะผู้นิเทศ',
    'ข้อคิดเห็นผู้บริหาร'
  ];

  // Filter messages for current channel
  const channelMessages = messages.filter(m => m.channelId === activeChannelId);
  const filteredMessages = searchQuery
    ? channelMessages.filter(
        m =>
          m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : channelMessages;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentInput.trim() && !mockAttachment) return;

    let recCode: string | undefined;
    if (linkedRecordId) {
      const rec = records.find(r => r.id === linkedRecordId);
      if (rec) recCode = rec.code;
    }

    const attachments = mockAttachment
      ? [{ ...mockAttachment }]
      : undefined;

    addMessage(
      activeChannelId,
      contentInput.trim(),
      selectedTags,
      attachments,
      linkedRecordId || undefined,
      recCode
    );

    setContentInput('');
    setSelectedTags([]);
    setMockAttachment(null);
    setLinkedRecordId('');
  };

  const handleSendReply = (messageId: string) => {
    if (!replyInput.trim()) return;
    addReply(messageId, replyInput.trim());
    setReplyInput('');
    setActiveReplyMessageId(null);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const formatThaiTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('th-TH', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'executive':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'supervisor':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'admin':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      default:
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-sky-950 text-white rounded-3xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-400 text-emerald-950 flex items-center gap-1.5 shadow-xs">
                <Users className="w-3.5 h-3.5" />
                ระบบสื่อสารสองทาง & แลกเปลี่ยนข้อเสนอแนะ (Two-Way Feedback Hub)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              ชุมชนการนิเทศและพัฒนาการเรียนรู้ร่วมกัน (PLC Forum)
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl">
              พื้นที่สื่อสารสองทางสำหรับผู้บริหาร ศึกษานิเทศก์ และครูผู้สอน เพื่อพูดคุยข้อเสนอแนะ ปรึกษาแผนการสอน และร่วมสะท้อนคิดหลังการนิเทศ
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-xs text-xs self-start md:self-auto">
            <span className="text-emerald-300">● กำลังสนทนาในฐานะ:</span>
            <span className="font-bold">{currentUser.name}</span>
            <span className="text-blue-200">({currentUser.roleTitle})</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Channels on left, Message Stream on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Channels List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 shadow-xs border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>ห้องเสวนาและช่องทางการนิเทศ</span>
            </h3>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono font-medium">
              {channels.length} ห้อง
            </span>
          </div>

          {/* Channels Navigation */}
          <div className="space-y-1.5">
            {channels.map(channel => {
              const isActive = channel.id === activeChannelId;
              const count = messages.filter(m => m.channelId === channel.id).length;

              return (
                <button
                  key={channel.id}
                  onClick={() => setActiveChannelId(channel.id)}
                  className={`w-full text-left p-3.5 rounded-2xl transition-all cursor-pointer flex items-start gap-3 border ${
                    isActive
                      ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/10 shadow-xs'
                      : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {channel.category === 'supervision' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <MessageCircle className="w-4 h-4" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={`text-xs font-bold truncate ${
                          isActive ? 'text-blue-900' : 'text-slate-800'
                        }`}
                      >
                        {channel.name}
                      </span>
                      {count > 0 && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-200/80 text-slate-700 shrink-0">
                          {count}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {channel.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
            <span>✨ สามารถสอบถามและขอคำปรึกษาได้แบบเรียลไทม์</span>
          </div>
        </div>

        {/* Right: Message Stream and Composer (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Active Channel Header */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-900 text-base">
                  {activeChannel?.name}
                </h2>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {activeChannel?.category === 'supervision' ? 'ผลการนิเทศเฉพาะคาบ' : 'แลกเปลี่ยนทั่วไป'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeChannel?.description}
              </p>
            </div>

            {/* Search within channel */}
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ค้นหาข้อความ/แท็ก..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Interactive Composer Box */}
          <form
            onSubmit={handleSendMessage}
            className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200 space-y-3"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>โพสต์ข้อเสนอแนะ / ปรึกษาผู้บริหารและศึกษานิเทศก์</span>
            </div>

            {/* Quick Tag Pills */}
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map(tag => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`text-[11px] px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>

            {/* Textarea */}
            <div className="relative">
              <textarea
                rows={3}
                value={contentInput}
                onChange={e => setContentInput(e.target.value)}
                placeholder={`พิมพ์ข้อความแลกเปลี่ยนความคิดเห็นในฐานะ ${currentUser.name} (${currentUser.roleTitle})...`}
                className="w-full p-3.5 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {/* Attachment preview if added */}
            {mockAttachment && (
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold">{mockAttachment.name}</span>
                  <span className="text-[10px] text-blue-600">({mockAttachment.size})</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMockAttachment(null)}
                  className="text-blue-500 hover:text-blue-800 font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Controls Bar: Link to Record & Attach File & Send */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap items-center gap-2">
                {/* Link to supervision record */}
                <select
                  value={linkedRecordId}
                  onChange={e => setLinkedRecordId(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700"
                >
                  <option value="">-- อ้างอิงบันทึกการนิเทศ (ไม่ระบุ) --</option>
                  {records.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.code}: {r.teacherName} ({r.subjectName})
                    </option>
                  ))}
                </select>

                {/* Simulate adding attachment */}
                <button
                  type="button"
                  onClick={() => {
                    setMockAttachment({
                      name: 'แผนการจัดการเรียนรู้_ActiveLearning_ฉบับปรับปรุง.pdf',
                      size: '1.8 MB',
                      type: 'document'
                    });
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs transition cursor-pointer"
                  title="แนบไฟล์แผนการสอน หรือ ลิงก์นวัตกรรม"
                >
                  <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                  <span>แนบไฟล์/แผน</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={!contentInput.trim() && !mockAttachment}
                className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition cursor-pointer self-end sm:self-auto"
              >
                <Send className="w-3.5 h-3.5" />
                <span>ส่งข้อความ</span>
              </button>
            </div>
          </form>

          {/* Messages Stream */}
          <div className="space-y-4">
            {filteredMessages.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-400">
                <MessageSquare className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p className="text-sm font-semibold">ยังไม่มีข้อความในห้องนี้</p>
                <p className="text-xs text-slate-400 mt-1">
                  เริ่มต้นการสนทนาโดยพิมพ์ข้อความในกล่องด้านบน
                </p>
              </div>
            ) : (
              filteredMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`bg-white rounded-3xl p-5 sm:p-6 shadow-xs border transition-all ${
                    msg.isPinned
                      ? 'border-amber-300 bg-amber-50/20 ring-1 ring-amber-300/40'
                      : 'border-slate-200'
                  }`}
                >
                  {/* Pinned label if pinned */}
                  {msg.isPinned && (
                    <div className="flex items-center gap-1.5 text-amber-800 text-[11px] font-bold mb-3 pb-2 border-b border-amber-200/60">
                      <Pin className="w-3.5 h-3.5" />
                      <span>ข้อความปักหมุดโดยผู้บริหารสถานศึกษา</span>
                    </div>
                  )}

                  {/* Author Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={msg.authorAvatar}
                        alt={msg.authorName}
                        className="w-10 h-10 rounded-full object-cover shadow-xs border-2 border-white ring-1 ring-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">
                            {msg.authorName}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.2 rounded-full border font-bold ${getRoleBadgeStyle(
                              msg.authorRole
                            )}`}
                          >
                            {msg.authorRoleTitle}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {formatThaiTime(msg.timestamp)}
                        </span>
                      </div>
                    </div>

                    {/* Linked Record badge */}
                    {msg.recordCode && (
                      <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1">
                        <Award className="w-3 h-3 text-amber-500" />
                        <span>{msg.recordCode}</span>
                      </span>
                    )}
                  </div>

                  {/* Message Content */}
                  <div className="mt-3 text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap pl-13">
                    {msg.content}
                  </div>

                  {/* Tags */}
                  {msg.tags && msg.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3 pl-13">
                      {msg.tags.map(t => (
                        <span
                          key={t}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Attachments */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-3 pl-13 space-y-1.5">
                      {msg.attachments.map((att, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between hover:bg-blue-50/50 transition cursor-pointer max-w-md"
                          onClick={() => alert(`จำลองการเปิดไฟล์: ${att.name}`)}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                              PDF
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">{att.name}</p>
                              <span className="text-[10px] text-slate-400">{att.size || 'ไฟล์แนบ'}</span>
                            </div>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reactions Bar and Reply Trigger */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 pl-13">
                    <div className="flex items-center gap-1.5">
                      {['👍', '💡', '❤️', '👏'].map(emoji => {
                        const reactedUsers = msg.reactions[emoji] || [];
                        const count = reactedUsers.length;
                        const hasReacted = reactedUsers.includes(currentUser.id);

                        return (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => toggleReaction(msg.id, emoji)}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                              hasReacted
                                ? 'bg-blue-50 border-blue-400 text-blue-800 shadow-xs'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <span>{emoji}</span>
                            {count > 0 && (
                              <span className="font-mono text-[11px]">{count}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setActiveReplyMessageId(
                          activeReplyMessageId === msg.id ? null : msg.id
                        )
                      }
                      className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <CornerDownRight className="w-3.5 h-3.5" />
                      <span>
                        ตอบกลับ ({msg.replies?.length || 0})
                      </span>
                    </button>
                  </div>

                  {/* Replies List */}
                  {msg.replies && msg.replies.length > 0 && (
                    <div className="mt-4 pl-13 space-y-2.5 border-l-2 border-slate-200 ml-5">
                      {msg.replies.map(rep => (
                        <div
                          key={rep.id}
                          className="bg-slate-50/80 rounded-2xl p-3 border border-slate-200 text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img
                                src={rep.authorAvatar}
                                alt={rep.authorName}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                              <span className="font-bold text-slate-800">
                                {rep.authorName}
                              </span>
                              <span
                                className={`text-[9px] px-1.5 py-0.2 rounded-full border ${getRoleBadgeStyle(
                                  rep.authorRole
                                )}`}
                              >
                                {rep.authorRoleTitle}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400">
                              {formatThaiTime(rep.timestamp)}
                            </span>
                          </div>
                          <p className="text-slate-700 leading-relaxed pl-8">
                            {rep.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Inline Reply Form */}
                  {activeReplyMessageId === msg.id && (
                    <div className="mt-3 pl-13 pt-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={replyInput}
                          onChange={e => setReplyInput(e.target.value)}
                          placeholder={`ตอบกลับข้อความของ ${msg.authorName}...`}
                          className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleSendReply(msg.id);
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleSendReply(msg.id)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                        >
                          ส่ง
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
