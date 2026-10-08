import React, { useState } from 'react';
import { useSupervision } from '../context/SupervisionContext';
import { SupervisionRecord } from '../types';
import { Award, Search, Download, Printer, CheckCircle, ShieldCheck, Calendar, Eye } from 'lucide-react';

interface CertificateCenterProps {
  onOpenCertificate: (record: SupervisionRecord) => void;
}

export const CertificateCenter: React.FC<CertificateCenterProps> = ({ onOpenCertificate }) => {
  const { records, settings, currentUser } = useSupervision();
  const [search, setSearch] = useState('');

  // Records with certificate number
  const certRecords = records.filter(r => !!r.certificateNumber);

  const filtered = certRecords.filter(r =>
    r.teacherName.toLowerCase().includes(search.toLowerCase()) ||
    r.subjectName.toLowerCase().includes(search.toLowerCase()) ||
    (r.certificateNumber && r.certificateNumber.toLowerCase().includes(search.toLowerCase())) ||
    r.gradeTier.includes(search)
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" />
            <span>ทะเบียนเกียรติบัตรอิเล็กทรอนิกส์ (E-Certificates Registry)</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            ระบบออกเกียรติบัตรอัตโนมัติ
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            เกียรติบัตรการนิเทศการจัดการเรียนรู้เชิงรุก (Active Learning) ออกอัตโนมัติพร้อมหมายเลขทะเบียนและระบบตรวจความถูกต้อง
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาชื่อครู, วิชา, เลขเกียรติบัตร..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Grid of Certificates Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(r => (
          <div
            key={r.id}
            className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 hover:shadow-md transition-all group flex flex-col justify-between relative overflow-hidden"
          >
            {/* Ribbon Decoration */}
            <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none">
              <div
                className={`absolute transform rotate-45 text-white text-[9px] font-bold py-1 right-[-35px] top-[18px] w-[120px] text-center shadow-xs ${
                  r.gradeTier === 'ยอดเยี่ยม'
                    ? 'bg-emerald-600'
                    : r.gradeTier === 'ดีมาก'
                    ? 'bg-blue-600'
                    : 'bg-amber-600'
                }`}
              >
                {r.gradeTier}
              </div>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs">
                <Award className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[11px] font-mono text-slate-400 block">
                  {r.certificateNumber}
                </span>
                <h3 className="font-bold text-slate-900 text-lg mt-0.5 group-hover:text-blue-600 transition-colors">
                  {r.teacherName}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-1">
                  {r.subjectName} ({r.gradeLevel})
                </p>
                <p className="text-[11px] text-slate-400 font-light mt-0.5">
                  {r.subjectGroup}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">คะแนนประเมิน:</span>
                  <span className="font-bold text-slate-800">{r.totalScore}/40 ({r.percentage}%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ผู้นิเทศ:</span>
                  <span className="font-medium text-slate-700 truncate max-w-[150px]">{r.supervisorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">วันที่ออกเกียรติบัตร:</span>
                  <span className="font-mono text-slate-600">{r.date}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> ตรวจสอบได้
              </span>

              <button
                onClick={() => onOpenCertificate(r)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>เปิดเกียรติบัตร</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400">
          ไม่พบเกียรติบัตรตามคำค้นหา
        </div>
      )}
    </div>
  );
};
