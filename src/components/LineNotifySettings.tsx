import React, { useState } from 'react';
import { useSupervision } from '../context/SupervisionContext';
import {
  BellRing,
  Send,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Key,
  Shield,
  Clock,
  Sparkles,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

export const LineNotifySettings: React.FC = () => {
  const { settings, updateSettings, lineLogs, sendLineNotification, records } = useSupervision();
  const [tokenInput, setTokenInput] = useState(settings.lineNotifyToken);
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const handleSaveToken = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      lineNotifyToken: tokenInput,
      enableLineNotify: true
    });
    setTestStatus('บันทึกการตั้งค่า LINE Notify Token สำเร็จ');
    setTimeout(() => setTestStatus(null), 3000);
  };

  const handleSendTestNotification = async () => {
    setIsSending(true);
    setTestStatus(null);

    const latestRecord = records[0] || {
      id: 'demo',
      code: 'SUP-2026-TEST',
      teacherName: 'ครูธีรภัทร ชาญวิทย์',
      school: settings.schoolName,
      subjectName: 'วิทยาการคำนวณ ว21103',
      gradeLevel: 'มัธยมศึกษาปีที่ 1',
      teachingTopic: 'การทดสอบระบบแจ้งเตือนอัตโนมัติ',
      totalScore: 38,
      percentage: 95,
      gradeTier: 'ยอดเยี่ยม',
      supervisorName: 'ศน.ดร.พรพิมล รัตนโกสินทร์',
      certificateNumber: 'CERT-EDUSUP-2026/TEST',
      date: new Date().toISOString().split('T')[0],
      timeStart: '09:00',
      timeEnd: '10:00'
    };

    try {
      const res = await sendLineNotification(
        latestRecord as any,
        `🔔 [EduSupervision Pro - ทดสอบระบบ]
----------------------------------------
✅ ระบบแจ้งเตือนการนิเทศการศึกษาออนไลน์ทำงานปกติ
👤 ครูผู้รับการนิเทศ: ${latestRecord.teacherName}
🏫 โรงเรียน: ${settings.schoolName}
📚 กลุ่มสาระฯ: วิทยาศาสตร์และเทคโนโลยี
🎖️ ผลการประเมิน: ยอดเยี่ยม (95%)
📜 รหัสเกียรติบัตร: ${latestRecord.certificateNumber || 'CERT-2026-DEMO'}
⏰ เวลาส่งแจ้งเตือน: ${new Date().toLocaleTimeString('th-TH')} น.
----------------------------------------
สามารถเข้าสู่ระบบเพื่อดาวน์โหลดเกียรติบัตรได้ทันที`
      );

      if (res.success) {
        setTestStatus('ส่งข้อความทดสอบไปยัง LINE Notify สำเร็จ (HTTP 200 OK)');
      }
    } finally {
      setIsSending(false);
      setTimeout(() => setTestStatus(null), 4000);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Smartphone className="w-4 h-4" />
          <span>ระบบแจ้งเตือนอัตโนมัติ (Automated Notification)</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          การแจ้งเตือนผ่าน LINE Notify เมื่อการนิเทศเสร็จสิ้น
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          เมื่อผู้นิเทศทำการประเมินผลเสร็จสิ้น ระบบจะส่งผลคะแนน ลิงก์เกียรติบัตร และข้อเสนอแนะเข้าสู่กลุ่ม LINE ทันที
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Settings Box (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
                  LINE
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    ตั้งค่า LINE Notify Access Token
                  </h3>
                  <p className="text-xs text-slate-500">
                    เชื่อมต่อ API เพื่อส่งข้อความเข้ากลุ่มสาระฯ หรือรายบุคคล
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableLineNotify}
                  onChange={e => updateSettings({ enableLineNotify: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <form onSubmit={handleSaveToken} className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  LINE Notify Token (โทเคนสำหรับส่งข้อความ)
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={tokenInput}
                    onChange={e => setTokenInput(e.target.value)}
                    placeholder="ใส่ LINE Notify Token..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-emerald-600" />
                  โทเคนถูกเก็บอย่างปลอดภัยและเข้ารหัสในระบบ
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  บันทึกโทเคน
                </button>

                <button
                  type="button"
                  onClick={handleSendTestNotification}
                  disabled={isSending}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSending ? 'กำลังส่ง...' : 'ทดสอบส่งการแจ้งเตือนเดี๋ยวนี้'}</span>
                </button>
              </div>

              {testStatus && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-medium flex items-center gap-2 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{testStatus}</span>
                </div>
              )}
            </form>

            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900 space-y-1">
              <p className="font-bold flex items-center gap-1">
                <span>💡</span> วิธีการสร้าง LINE Notify Token:
              </p>
              <ol className="list-decimal pl-5 space-y-0.5 text-blue-800 text-[11px]">
                <li>เข้าสู่เว็บไซต์ notify-bot.line.me ด้วยบัญชี LINE</li>
                <li>ไปที่หน้า My Page และคลิกปุ่ม "Generate token"</li>
                <li>ตั้งชื่อบอท (เช่น EduSupervision) และเลือกกลุ่มหรือแชทส่วนตัวที่ต้องการรับการแจ้งเตือน</li>
                <li>คัดลอก Token มาใส่ในช่องด้านบนนี้</li>
              </ol>
            </div>
          </div>

          {/* Logs History */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>ประวัติการส่งการแจ้งเตือน (Delivery Logs)</span>
            </h3>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {lineLogs.map(log => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1 hover:bg-slate-100/60 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">
                      {log.teacherName} ({log.recordCode})
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold">
                      HTTP {log.httpCode} OK
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-mono line-clamp-1">
                    {log.message}
                  </p>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {new Date(log.timestamp).toLocaleString('th-TH')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Smartphone Preview (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[320px] bg-slate-900 rounded-[40px] p-4 shadow-2xl border-4 border-slate-800 relative">
            {/* Speaker notch */}
            <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-3" />

            {/* Smartphone Screen */}
            <div className="bg-[#8c9bb0] rounded-[28px] overflow-hidden flex flex-col h-[480px]">
              {/* LINE Header */}
              <div className="bg-[#202738] text-white p-3 flex items-center gap-2 shadow-xs">
                <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-xs">
                  L
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">LINE Notify</div>
                  <div className="text-[9px] text-emerald-400">Official Notification</div>
                </div>
              </div>

              {/* Chat Bubble Area */}
              <div className="p-3 overflow-y-auto flex-1 space-y-3">
                <div className="text-center">
                  <span className="text-[9px] bg-black/20 text-white px-2 py-0.5 rounded-full">
                    วันนี้
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-1">
                    N
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-xs p-3 shadow-sm text-slate-800 text-[11px] max-w-[85%] leading-relaxed space-y-1.5 border border-slate-200">
                    <p className="font-bold text-slate-900 text-xs text-blue-700">
                      🔔 EduSupervision Pro
                    </p>
                    <p className="text-[10px] text-slate-600">
                      แจ้งผลการนิเทศการจัดการเรียนรู้
                    </p>
                    <div className="border-t border-slate-100 pt-1 space-y-0.5">
                      <p>👤 <strong>ครูธีรภัทร ชาญวิทย์</strong></p>
                      <p>📚 วิทยาการคำนวณ ว21103</p>
                      <p>🎖️ ผลการประเมิน: <span className="text-emerald-600 font-bold">ยอดเยี่ยม (95%)</span></p>
                      <p>🔍 ผู้นิเทศ: ศน.ดร.พรพิมล</p>
                      <p className="font-mono text-[10px] text-blue-600">
                        📜 รหัส: CERT-EDUSUP-2026/0088
                      </p>
                    </div>
                    <div className="pt-1 border-t border-slate-100 text-[9px] text-slate-500">
                      ออกเกียรติบัตรแล้ว เข้าสู่ระบบเพื่อดาวน์โหลด
                    </div>
                    <span className="text-[8px] text-slate-400 block text-right">
                      10:31 น.
                    </span>
                  </div>
                </div>
              </div>

              {/* Input bottom dummy */}
              <div className="bg-white p-2 border-t border-slate-200 text-[10px] text-slate-400 text-center">
                ระบบส่งการแจ้งเตือนอัตโนมัติ (Read-only)
              </div>
            </div>

            {/* Home bar */}
            <div className="w-28 h-1 bg-slate-700 rounded-full mx-auto mt-3" />
          </div>

          <p className="text-xs text-slate-400 mt-3 text-center">
            จำลองหน้าจอการแจ้งเตือนในสมาร์ตโฟนของครูและผู้บริหาร
          </p>
        </div>
      </div>
    </div>
  );
};
