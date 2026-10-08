import React, { useState } from 'react';
import { useSupervision } from '../context/SupervisionContext';
import { SUPERVISION_CRITERIA, SUBJECT_GROUPS, GRADE_LEVELS } from '../data/initialData';
import { SignaturePad } from './SignaturePad';
import confetti from 'canvas-confetti';
import {
  Award,
  Sparkles,
  Send,
  UserCheck,
  Calendar,
  Clock,
  BookOpen,
  School,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BookmarkCheck
} from 'lucide-react';

interface SupervisionFormProps {
  onSuccess: (newRecordId: string) => void;
}

export const SupervisionForm: React.FC<SupervisionFormProps> = ({ onSuccess }) => {
  const { users, currentUser, createRecord, settings } = useSupervision();

  // Teachers list
  const teachers = users.filter(u => u.role === 'teacher');

  const [selectedTeacherId, setSelectedTeacherId] = useState(teachers[0]?.id || '');
  const [customTeacherName, setCustomTeacherName] = useState(teachers[0]?.name || '');
  const [subjectGroup, setSubjectGroup] = useState(SUBJECT_GROUPS[0]);
  const [subjectName, setSubjectName] = useState('วิทยาการคำนวณ (ว21103)');
  const [gradeLevel, setGradeLevel] = useState(GRADE_LEVELS[0]);
  const [room, setRoom] = useState('ม.1/1');
  const [teachingTopic, setTeachingTopic] = useState('การแก้ปัญหาด้วยอัลกอริทึมและโค้ดดิ้งเชิงรุก');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [timeStart, setTimeStart] = useState('09:00');
  const [timeEnd, setTimeEnd] = useState('10:00');

  // Scores state: criterionId -> 1..5
  const [scores, setScores] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    SUPERVISION_CRITERIA.forEach(c => {
      initial[c.id] = 4; // default good
    });
    return initial;
  });

  const [strengths, setStrengths] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [generalComment, setGeneralComment] = useState('');
  const [signatureData, setSignatureData] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHelperCriteria, setShowHelperCriteria] = useState<string | null>(null);

  // Quick suggestion tags
  const strengthTags = [
    'กิจกรรม Active Learning น่าสนใจ',
    'นักเรียนมีส่วนร่วมสูง (>80%)',
    'ใช้เทคโนโลยีดิจิทัลอย่างคุ้มค่า',
    'บรรยากาศห้องเรียนเชิงบวกและอบอุ่น',
    'ให้ข้อมูลย้อนกลับทันท่วงที',
    'ครูจัดกิจกรรมเป็นขั้นตอนชัดเจน'
  ];

  const recommendationTags = [
    'ควรเพิ่มเวลาในการสรุปบทเรียนท้ายคาบ',
    'ควรเปิดโอกาสให้นักเรียนประเมินตนเอง (Self-Assessment)',
    'ส่งเสริมการทำงานกลุ่มให้มีความหลากหลาย',
    'บูรณาการเชื่อมโยงกับปัญหาในชุมชน/ชีวิตจริง',
    'เสริมคำถามกระตุ้นการคิดวิเคราะห์ขั้นสูง (HOTS)'
  ];

  const handleTeacherChange = (teacherId: string) => {
    setSelectedTeacherId(teacherId);
    const teacher = teachers.find(t => t.id === teacherId);
    if (teacher) {
      setCustomTeacherName(teacher.name);
      if (teacher.subjectGroup) setSubjectGroup(teacher.subjectGroup);
    }
  };

  const handleScoreChange = (criterionId: string, score: number) => {
    setScores(prev => ({
      ...prev,
      [criterionId]: score
    }));
  };

  // Real-time calculation
  const totalScore = SUPERVISION_CRITERIA.reduce((sum, crit) => sum + (scores[crit.id] || 0), 0);
  const maxPossible = SUPERVISION_CRITERIA.length * 5;
  const percentage = Math.round((totalScore / maxPossible) * 100 * 10) / 10;

  const getTierInfo = (pct: number) => {
    if (pct >= 90) return { title: 'ยอดเยี่ยม (เหรียญทอง)', color: 'text-emerald-700 bg-emerald-50 border-emerald-300', badge: 'bg-emerald-600' };
    if (pct >= 80) return { title: 'ดีมาก (เหรียญเงิน)', color: 'text-blue-700 bg-blue-50 border-blue-300', badge: 'bg-blue-600' };
    if (pct >= 70) return { title: 'ดี (เหรียญทองแดง)', color: 'text-sky-700 bg-sky-50 border-sky-300', badge: 'bg-sky-600' };
    if (pct >= 60) return { title: 'ผ่านเกณฑ์มาตรฐาน', color: 'text-amber-700 bg-amber-50 border-amber-300', badge: 'bg-amber-600' };
    return { title: 'ควรพัฒนาปรับปรุง', color: 'text-rose-700 bg-rose-50 border-rose-300', badge: 'bg-rose-600' };
  };

  const tier = getTierInfo(percentage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const created = createRecord({
        teacherId: selectedTeacherId,
        teacherName: customTeacherName,
        school: settings.schoolName,
        subjectGroup,
        subjectName,
        gradeLevel,
        room,
        teachingTopic,
        date,
        timeStart,
        timeEnd,
        scores,
        strengths: strengths || 'ครูผู้สอนมีความพร้อมในการจัดการเรียนรู้ ออกแบบกิจกรรมให้นักเรียนมีส่วนร่วมได้ดี',
        recommendations: recommendations || 'รักษามาตรฐานและพัฒนาสื่อนวัตกรรมการสอนอย่างต่อเนื่อง',
        generalComment: generalComment || 'การจัดการเรียนรู้โดยรวมมีประสิทธิภาพ สอดคล้องกับตัวชี้วัด',
        supervisorSignature: signatureData || `${currentUser.name} (ลงนามดิจิทัล)`,
        status: 'completed'
      });

      // trigger celebratory confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }

      onSuccess(created.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Sticky Real-Time Evaluation Status Ticker */}
      <div className="sticky top-28 z-30 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-slate-200 transition-all">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm ${tier.badge}`}>
              {percentage}%
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
                  คะแนนประเมินเรียลไทม์
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${tier.color}`}>
                  {tier.title}
                </span>
              </div>
              <div className="text-lg font-bold text-slate-900">
                {totalScore} <span className="text-xs font-normal text-slate-500">/ {maxPossible} คะแนนเต็ม</span>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-xs w-full hidden md:block">
            <div className="flex justify-between text-[11px] text-slate-500 mb-1">
              <span>เกณฑ์ความก้าวหน้า</span>
              <span className="font-semibold text-slate-700">{percentage}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${tier.badge}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="text-right text-xs hidden sm:block">
              <div className="text-slate-500 font-medium">ผู้นิเทศ</div>
              <div className="text-slate-800 font-bold truncate max-w-[160px]">{currentUser.name}</div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/25 transition-all cursor-pointer w-full sm:w-auto"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>บันทึก & ออกเกียรติบัตรทันที</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Form Box */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-8">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>แบบประเมินผลการจัดการเรียนรู้แบบเรียลไทม์ (Active Learning & วPA)</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            บันทึกการสังเกตชั้นเรียนและนิเทศการสอน
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            บันทึกผลการนิเทศตาม 8 ตัวชี้วัดมาตรฐานกระทรวงศึกษาธิการ ออกเกียรติบัตรอัตโนมัติ และส่งผลแจ้งเตือนผ่าน LINE Notify ทันที
          </p>
        </div>

        {/* Section 1: General Info */}
        <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span>ข้อมูลครูผู้รับการนิเทศและชั้นเรียน</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                เลือกครูผู้รับการนิเทศ
              </label>
              <select
                value={selectedTeacherId}
                onChange={e => handleTeacherChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.position})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                ชื่อ-สกุล ครูผู้รับการนิเทศ (แก้ไขได้)
              </label>
              <input
                type="text"
                value={customTeacherName}
                onChange={e => setCustomTeacherName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                กลุ่มสาระการเรียนรู้
              </label>
              <select
                value={subjectGroup}
                onChange={e => setSubjectGroup(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {SUBJECT_GROUPS.map(sg => (
                  <option key={sg} value={sg}>
                    {sg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                รายวิชาที่สอน (รหัสวิชาและชื่อวิชา)
              </label>
              <input
                type="text"
                value={subjectName}
                onChange={e => setSubjectName(e.target.value)}
                placeholder="เช่น วิทยาการคำนวณ ว21103"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                ระดับชั้น
              </label>
              <select
                value={gradeLevel}
                onChange={e => setGradeLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {GRADE_LEVELS.map(g => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                ห้องเรียน
              </label>
              <input
                type="text"
                value={room}
                onChange={e => setRoom(e.target.value)}
                placeholder="เช่น ห้อง 1/2 หรือ ห้องปฏิบัติการคอมพิวเตอร์ 1"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                หัวข้อเรื่อง / หน่วยการเรียนรู้
              </label>
              <input
                type="text"
                value={teachingTopic}
                onChange={e => setTeachingTopic(e.target.value)}
                placeholder="เช่น การออกแบบขั้นตอนวิธี (Algorithm) ด้วย Flowchart"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> วันที่นิเทศ
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> เวลาเริ่ม
                </label>
                <input
                  type="time"
                  value={timeStart}
                  onChange={e => setTimeStart(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> สิ้นสุด
                </label>
                <input
                  type="time"
                  value={timeEnd}
                  onChange={e => setTimeEnd(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                ผู้นิเทศ / ตำแหน่ง
              </label>
              <div className="px-3.5 py-2.5 bg-slate-100 rounded-xl text-sm text-slate-700 font-medium border border-slate-200 truncate">
                {currentUser.name} ({currentUser.roleTitle || currentUser.position})
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Rubric Criteria (8 items) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <BookmarkCheck className="w-5 h-5 text-blue-600" />
              <span>การประเมิน 8 ตัวชี้วัดสมรรถนะการจัดการเรียนรู้ (มาตราฐาน วPA / Active Learning)</span>
            </h3>
            <span className="text-xs text-slate-500">
              ระดับคะแนน 1 (ปรับปรุง) - 5 (ยอดเยี่ยม)
            </span>
          </div>

          <div className="space-y-3">
            {SUPERVISION_CRITERIA.map((criterion, idx) => {
              const currentVal = scores[criterion.id] || 0;
              const isShowingHelper = showHelperCriteria === criterion.id;

              return (
                <div
                  key={criterion.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    currentVal === 5
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : currentVal >= 4
                      ? 'border-blue-200 bg-blue-50/10'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center shrink-0">
                          {criterion.number}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">
                          {criterion.title}
                        </h4>
                        <button
                          type="button"
                          onClick={() => setShowHelperCriteria(isShowingHelper ? null : criterion.id)}
                          className="text-slate-400 hover:text-blue-600 transition-colors p-0.5"
                          title="ดูคำอธิบายเกณฑ์"
                        >
                          <HelpCircle className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 pl-8">
                        {criterion.description}
                      </p>

                      {isShowingHelper && (
                        <div className="mt-2.5 ml-8 p-3 rounded-xl bg-blue-50/80 text-blue-900 text-xs border border-blue-100">
                          <strong>เกณฑ์ระดับคะแนน:</strong>
                          <ul className="list-disc pl-4 mt-1 space-y-0.5">
                            <li>5 คะแนน: ปฏิบัติได้ครบถ้วน ชัดเจน เป็นแบบอย่างได้ เกิดผลสัมฤทธิ์สูง</li>
                            <li>4 คะแนน: ปฏิบัติได้ถูกต้อง ชัดเจน และนักเรียนมีส่วนร่วมส่วนใหญ่</li>
                            <li>3 คะแนน: ปฏิบัติได้ตามเกณฑ์มาตรฐาน มีกระบวนการเหมาะสม</li>
                            <li>2 คะแนน: ปฏิบัติได้บางส่วน ยังต้องการการชี้แนะเพิ่มเติม</li>
                            <li>1 คะแนน: ยังไม่ปรากฏร่องรอยการปฏิบัติชัดเจน ต้องพัฒนา</li>
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Score Picker buttons (1 to 5) */}
                    <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                      {[1, 2, 3, 4, 5].map(scoreNum => {
                        const isSelected = currentVal === scoreNum;
                        return (
                          <button
                            key={scoreNum}
                            type="button"
                            onClick={() => handleScoreChange(criterion.id, scoreNum)}
                            className={`w-9 h-9 rounded-xl font-bold text-xs transition-all cursor-pointer flex flex-col items-center justify-center ${
                              isSelected
                                ? scoreNum === 5
                                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25 scale-105'
                                  : scoreNum === 4
                                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-105'
                                  : scoreNum === 3
                                  ? 'bg-sky-600 text-white scale-105'
                                  : 'bg-amber-600 text-white scale-105'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            <span>{scoreNum}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Qualitative Feedback & Quick Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 block flex items-center justify-between">
              <span>🌟 จุดเด่นที่พบในการจัดการเรียนรู้</span>
              <span className="text-[11px] text-slate-400 font-normal">คลิกแท็กเพื่อใส่ข้อความรวดเร็ว</span>
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {strengthTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setStrengths(prev => (prev ? `${prev} • ${tag}` : tag))}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                >
                  + {tag}
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              value={strengths}
              onChange={e => setStrengths(e.target.value)}
              placeholder="ระบุจุดเด่น เช่น การจัดกิจกรรมกระตุ้นให้นักเรียนคิดสร้างสรรค์ การประยุกต์ใช้สื่อเทคโนโลยี..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 block flex items-center justify-between">
              <span>💡 ข้อเสนอแนะเพื่อการพัฒนา (Actionable Feedback)</span>
              <span className="text-[11px] text-slate-400 font-normal">คลิกแท็กเพื่อใส่ข้อความรวดเร็ว</span>
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {recommendationTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setRecommendations(prev => (prev ? `${prev} • ${tag}` : tag))}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors"
                >
                  + {tag}
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              value={recommendations}
              onChange={e => setRecommendations(e.target.value)}
              placeholder="ระบุข้อเสนอแนะ เช่น ควรเพิ่มระยะเวลาให้นักเรียนสะท้อนความคิด หรือเสริมใบงานสังเคราะห์..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1">
            ความเห็นและข้อสังเกตภาพรวม
          </label>
          <textarea
            rows={2}
            value={generalComment}
            onChange={e => setGeneralComment(e.target.value)}
            placeholder="สรุปผลภาพรวมของการนิเทศครั้งนี้..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Section 4: Signature Pad */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <SignaturePad
            label={`ลายมือชื่อดิจิทัลของผู้นิเทศ (${currentUser.name})`}
            onSave={dataUrl => setSignatureData(dataUrl)}
          />
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>เมื่อกดบันทึก ระบบจะออกเกียรติบัตรอัตโนมัติพร้อมเลขทะเบียน และส่ง LINE Notify ทันที</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 bg-linear-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer text-base"
          >
            <Award className="w-5 h-5 text-amber-300" />
            <span>{isSubmitting ? 'กำลังประมวลผล...' : 'บันทึกผลการนิเทศ & ออกเกียรติบัตร'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
