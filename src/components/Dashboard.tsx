import React, { useState } from 'react';
import { useSupervision } from '../context/SupervisionContext';
import { SUPERVISION_CRITERIA, SUBJECT_GROUPS } from '../data/initialData';
import {
  TrendingUp,
  Award,
  Users,
  CheckCircle2,
  BarChart3,
  PieChart,
  ArrowUpRight,
  School,
  FileText,
  Calendar,
  Sparkles,
  Download,
  Filter,
  MessagesSquare
} from 'lucide-react';

export const Dashboard: React.FC<{
  onNavigateToForm: () => void;
  onNavigateToRecords: () => void;
  onNavigateToDiscussions?: () => void;
}> = ({
  onNavigateToForm,
  onNavigateToRecords,
  onNavigateToDiscussions
}) => {
  const { records, settings, currentUser, messages } = useSupervision();
  const [selectedSubjectGroup, setSelectedSubjectGroup] = useState<string>('all');

  const filteredRecords = selectedSubjectGroup === 'all'
    ? records
    : records.filter(r => r.subjectGroup === selectedSubjectGroup);

  const totalRecords = filteredRecords.length;

  // Key KPI calculations
  const totalScoreSum = filteredRecords.reduce((acc, r) => acc + r.percentage, 0);
  const avgPercentage = totalRecords > 0 ? Math.round((totalScoreSum / totalRecords) * 10) / 10 : 0;

  const passedCount = filteredRecords.filter(r => r.percentage >= 60).length;
  const passRate = totalRecords > 0 ? Math.round((passedCount / totalRecords) * 100) : 0;

  const certIssuedCount = filteredRecords.filter(r => !!r.certificateNumber).length;
  const acknowledgedCount = filteredRecords.filter(r => r.status === 'acknowledged').length;
  const ackRate = totalRecords > 0 ? Math.round((acknowledgedCount / totalRecords) * 100) : 0;

  // Grade Tier Distribution
  const tierCounts: Record<string, number> = {
    'ยอดเยี่ยม': 0,
    'ดีมาก': 0,
    'ดี': 0,
    'ผ่านเกณฑ์': 0,
    'ควรพัฒนา': 0
  };

  filteredRecords.forEach(r => {
    if (tierCounts[r.gradeTier] !== undefined) {
      tierCounts[r.gradeTier]++;
    }
  });

  // Criteria-by-Criteria Average Score (out of 5)
  const criteriaStats = SUPERVISION_CRITERIA.map(crit => {
    let sum = 0;
    let count = 0;
    filteredRecords.forEach(r => {
      if (r.scores && r.scores[crit.id] !== undefined) {
        sum += r.scores[crit.id];
        count++;
      }
    });
    const avg = count > 0 ? Math.round((sum / count) * 10) / 10 : 0;
    const pct = Math.round((avg / 5) * 100);
    return {
      ...crit,
      avgScore: avg,
      percentage: pct
    };
  });

  // Subject Group Performance Breakdown
  const subjectGroupStats = SUBJECT_GROUPS.map(group => {
    const groupRecs = records.filter(r => r.subjectGroup === group);
    const count = groupRecs.length;
    const avg = count > 0
      ? Math.round((groupRecs.reduce((a, b) => a + b.percentage, 0) / count) * 10) / 10
      : 0;
    return {
      group,
      count,
      avgPercentage: avg
    };
  }).filter(s => s.count > 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Executive Welcome & Filter Bar */}
      <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <BarChart3 className="w-96 h-96 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-400 text-amber-950 flex items-center gap-1.5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                แดชบอร์ดสรุปผลเชิงวิเคราะห์สำหรับผู้บริหารสถานศึกษา
              </span>
              <span className="text-xs text-blue-200 hidden sm:inline">
                ประจำปีการศึกษา 2569
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              การนิเทศการจัดการเรียนรู้เชิงรุก (Active Learning)
            </h1>
            <p className="text-sm text-blue-100 max-w-2xl">
              รายงานสรุปผลการประเมินแบบเรียลไทม์ วิเคราะห์สมรรถนะการสอนตามมาตรฐาน วPA สรุปสถิติเปรียบเทียบ และการออกเกียรติบัตรอิเล็กทรอนิกส์
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onNavigateToForm}
              className="px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <TrendingUp className="w-4 h-4" />
              <span>เริ่มการนิเทศใหม่</span>
            </button>
            {onNavigateToDiscussions && (
              <button
                onClick={onNavigateToDiscussions}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <MessagesSquare className="w-4 h-4" />
                <span>สื่อสารสองทาง & PLC ({messages.length})</span>
              </button>
            )}
            <button
              onClick={onNavigateToRecords}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>ดูบันทึกย้อนหลัง</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              การนิเทศทั้งหมด
            </p>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">
              {totalRecords} <span className="text-sm font-normal text-slate-500">ครั้ง</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> บันทึกสมบูรณ์บนคลาวด์
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              คะแนนเฉลี่ยรวม
            </p>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">
              {avgPercentage}%
            </div>
            <p className="text-[11px] text-blue-600 font-medium flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> ระดับคุณภาพดีมาก
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              อัตราผ่านเกณฑ์ประเมิน
            </p>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">
              {passRate}%
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {passedCount} จาก {totalRecords} คาบเรียน
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              เกียรติบัตรที่ออกแล้ว
            </p>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">
              {certIssuedCount} <span className="text-sm font-normal text-slate-500">ใบ</span>
            </div>
            <p className="text-[11px] text-indigo-600 font-medium mt-1">
              ครูยืนยันรับทราบ {ackRate}%
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Analytical Section: Tier Distribution & 8 Competency Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tier Distribution (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                การกระจายระดับผลการประเมิน
              </h3>
              <p className="text-xs text-slate-500">
                สัดส่วนครูผู้สอนตามเกณฑ์มาตรฐาน สพฐ.
              </p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              <PieChart className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {[
              { label: 'ยอดเยี่ยม (90-100%)', key: 'ยอดเยี่ยม', color: 'bg-emerald-500', textColor: 'text-emerald-700' },
              { label: 'ดีมาก (80-89%)', key: 'ดีมาก', color: 'bg-blue-500', textColor: 'text-blue-700' },
              { label: 'ดี (70-79%)', key: 'ดี', color: 'bg-sky-500', textColor: 'text-sky-700' },
              { label: 'ผ่านเกณฑ์ (60-69%)', key: 'ผ่านเกณฑ์', color: 'bg-amber-500', textColor: 'text-amber-700' },
              { label: 'ควรพัฒนา (<60%)', key: 'ควรพัฒนา', color: 'bg-rose-500', textColor: 'text-rose-700' }
            ].map(item => {
              const count = tierCounts[item.key] || 0;
              const pct = totalRecords > 0 ? Math.round((count / totalRecords) * 100) : 0;
              return (
                <div key={item.key} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">{item.label}</span>
                    <span className="font-mono text-slate-500 font-medium">
                      {count} คน ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 mt-4 text-xs text-emerald-900 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>ข้อสรุปเชิงสถิติ:</strong> คุณภาพการจัดการเรียนรู้ส่วนใหญ่อยู่ในระดับ <strong>ยอดเยี่ยมและดีมาก</strong> คิดเป็น {(tierCounts['ยอดเยี่ยม'] + tierCounts['ดีมาก']) * 100 / (totalRecords || 1)}% ของทั้งหมด
            </div>
          </div>
        </div>

        {/* 8 Competency Indicators (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                สมรรถนะเฉลี่ยแยกตาม 8 ตัวชี้วัด (วPA)
              </h3>
              <p className="text-xs text-slate-500">
                เปรียบเทียบคะแนนเต็ม 5 คะแนนในแต่ละมิติการจัดการเรียนรู้
              </p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {criteriaStats.map(stat => (
              <div key={stat.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {stat.number}
                    </span>
                    <span className="font-medium text-slate-800 truncate" title={stat.title}>
                      {stat.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-bold text-slate-900 font-mono">{stat.avgScore}</span>
                    <span className="text-[10px] text-slate-400">/ 5.0</span>
                  </div>
                </div>

                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subject Groups Performance Comparison */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              เปรียบเทียบผลการประเมินแยกตามกลุ่มสาระการเรียนรู้
            </h3>
            <p className="text-xs text-slate-500">
              ภาพรวมการพัฒนาการจัดการเรียนรู้ของแต่ละกลุ่มสาระฯ
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">สถานะ: ล่าสุด</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjectGroupStats.map(stat => (
            <div
              key={stat.group}
              className="p-4 rounded-2xl border border-slate-200 bg-linear-to-b from-white to-slate-50/50 hover:shadow-md transition-shadow"
            >
              <div className="text-xs font-semibold text-slate-700 line-clamp-1 mb-2">
                {stat.group}
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-blue-700">
                  {stat.avgPercentage}%
                </span>
                <span className="text-xs text-slate-500">
                  {stat.count} บันทึกการนิเทศ
                </span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: `${stat.avgPercentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
