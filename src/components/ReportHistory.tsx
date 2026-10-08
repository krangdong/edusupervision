import React, { useState } from 'react';
import { useSupervision } from '../context/SupervisionContext';
import { SupervisionRecord } from '../types';
import { SUPERVISION_CRITERIA, SUBJECT_GROUPS } from '../data/initialData';
import {
  Search,
  Download,
  Filter,
  Eye,
  Edit3,
  Trash2,
  Award,
  Calendar,
  Clock,
  CheckCircle,
  FileSpreadsheet,
  History,
  AlertTriangle,
  Printer,
  ChevronDown,
  UserCheck,
  Send,
  MessagesSquare
} from 'lucide-react';

interface ReportHistoryProps {
  onOpenCertificate: (record: SupervisionRecord) => void;
  onOpenLiveForm: () => void;
  onNavigateToDiscussion?: (record: SupervisionRecord) => void;
}

export const ReportHistory: React.FC<ReportHistoryProps> = ({
  onOpenCertificate,
  onOpenLiveForm,
  onNavigateToDiscussion
}) => {
  const {
    records,
    deleteRecord,
    updateRecord,
    acknowledgeRecord,
    currentUser,
    sendLineNotification
  } = useSupervision();

  // Search & Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedTier, setSelectedTier] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Selected Record Modal States
  const [selectedRecord, setSelectedRecord] = useState<SupervisionRecord | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editReason, setEditReason] = useState('');
  const [editStrengths, setEditStrengths] = useState('');
  const [editRecommendations, setEditRecommendations] = useState('');
  const [editScores, setEditScores] = useState<Record<string, number>>({});
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [teacherSignatureInput, setTeacherSignatureInput] = useState('');

  // Filter records
  const filteredRecords = records.filter(r => {
    const matchesSearch =
      r.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.supervisorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.certificateNumber && r.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesGroup = selectedGroup === 'all' || r.subjectGroup === selectedGroup;
    const matchesTier = selectedTier === 'all' || r.gradeTier === selectedTier;

    const matchesDateFrom = !dateFrom || r.date >= dateFrom;
    const matchesDateTo = !dateTo || r.date <= dateTo;

    return matchesSearch && matchesGroup && matchesTier && matchesDateFrom && matchesDateTo;
  });

  const formatThaiDateTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  // Unlimited CSV Export with Thai UTF-8 BOM
  const handleExportCSV = () => {
    const headers = [
      'รหัสการนิเทศ',
      'วันที่',
      'เวลา',
      'ครูผู้รับการนิเทศ',
      'กลุ่มสาระการเรียนรู้',
      'วิชา',
      'ระดับชั้น',
      'ห้อง',
      'หัวข้อเรื่อง',
      'ผู้นิเทศ',
      'คะแนนรวม (40)',
      'ร้อยละ (%)',
      'ระดับผลการประเมิน',
      'เลขที่เกียรติบัตร',
      'สถานะการรับทราบ',
      'แก้ไขล่าสุดเมื่อ',
      'ผู้แก้ไขล่าสุด'
    ];

    const rows = filteredRecords.map(r => [
      `"${r.code}"`,
      `"${r.date}"`,
      `"${r.timeStart}-${r.timeEnd}"`,
      `"${r.teacherName}"`,
      `"${r.subjectGroup}"`,
      `"${r.subjectName}"`,
      `"${r.gradeLevel}"`,
      `"${r.room}"`,
      `"${r.teachingTopic.replace(/"/g, '""')}"`,
      `"${r.supervisorName}"`,
      r.totalScore,
      r.percentage,
      `"${r.gradeTier}"`,
      `"${r.certificateNumber || '-'}"`,
      `"${r.status === 'acknowledged' ? 'ลงนามรับทราบแล้ว' : 'รอดำเนินการ'}"`,
      `"${formatThaiDateTime(r.lastModified)}"`,
      `"${r.lastModifiedBy}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `รายงานการนิเทศการศึกษา_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openDetailModal = (record: SupervisionRecord) => {
    setSelectedRecord(record);
    setIsEditing(false);
    setTeacherSignatureInput(record.teacherSignature || `${currentUser.name} (รับทราบผลการประเมิน)`);
  };

  const startEditMode = (record: SupervisionRecord) => {
    setSelectedRecord(record);
    setIsEditing(true);
    setEditScores({ ...record.scores });
    setEditStrengths(record.strengths);
    setEditRecommendations(record.recommendations);
    setEditReason('ปรับปรุงข้อเสนอแนะและรายละเอียดเพิ่มเติม');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;

    const updated = updateRecord(
      selectedRecord.id,
      {
        scores: editScores,
        strengths: editStrengths,
        recommendations: editRecommendations
      },
      editReason || 'แก้ไขผลการประเมินและข้อเสนอแนะ'
    );

    if (updated) {
      setSelectedRecord(updated);
      setIsEditing(false);
    }
  };

  const handleTeacherAcknowledge = () => {
    if (!selectedRecord) return;
    acknowledgeRecord(selectedRecord.id, teacherSignatureInput);
    const updated = records.find(r => r.id === selectedRecord.id);
    if (updated) {
      setSelectedRecord(updated);
    }
  };

  const handleResendLine = (record: SupervisionRecord) => {
    sendLineNotification(record);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            คลังรายงานและประวัติการนิเทศย้อนหลัง
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            ดึงข้อมูลรายงานย้อนหลังได้ไม่จำกัดจำนวนครั้ง พร้อมระบบตรวจสอบเวลาการแก้ไขล่าสุด (Audit Trail)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>ส่งออกรายงาน Excel (CSV) ไม่จำกัด</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาชื่อครู, วิชา, ผู้นิเทศ, รหัส..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Group Filter */}
          <div>
            <select
              value={selectedGroup}
              onChange={e => setSelectedGroup(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="all">ทุกกลุ่มสาระการเรียนรู้</option>
              {SUBJECT_GROUPS.map(g => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Tier Filter */}
          <div>
            <select
              value={selectedTier}
              onChange={e => setSelectedTier(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="all">ทุกระดับผลการประเมิน</option>
              <option value="ยอดเยี่ยม">ยอดเยี่ยม (90% ขึ้นไป)</option>
              <option value="ดีมาก">ดีมาก (80-89%)</option>
              <option value="ดี">ดี (70-79%)</option>
              <option value="ผ่านเกณฑ์">ผ่านเกณฑ์ (60-69%)</option>
              <option value="ควรพัฒนา">ควรพัฒนา (ต่ำกว่า 60%)</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-1.5">
            <input
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              placeholder="ตั้งแต่วันที่"
              className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <input
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              placeholder="ถึงวันที่"
              className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>พบผลการนิเทศทั้งหมด {filteredRecords.length} รายการ</span>
          {(searchTerm || selectedGroup !== 'all' || selectedTier !== 'all' || dateFrom || dateTo) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedGroup('all');
                setSelectedTier('all');
                setDateFrom('');
                setDateTo('');
              }}
              className="text-blue-600 hover:underline font-medium cursor-pointer"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          )}
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">รหัส / วันที่นิเทศ</th>
                <th className="py-3.5 px-4">ครูผู้รับการนิเทศ / วิชา</th>
                <th className="py-3.5 px-4">ผู้นิเทศ</th>
                <th className="py-3.5 px-4 text-center">ผลการประเมิน</th>
                <th className="py-3.5 px-4">แก้ไขล่าสุด (Audit Log)</th>
                <th className="py-3.5 px-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    ไม่พบข้อมูลบันทึกการนิเทศตามเงื่อนไขที่เลือก
                  </td>
                </tr>
              ) : (
                filteredRecords.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Code & Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-slate-900">{r.code}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>{r.date}</span>
                      </div>
                    </td>

                    {/* Teacher & Subject */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{r.teacherName}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{r.subjectName} ({r.gradeLevel})</div>
                      <span className="text-[10px] text-slate-400 font-light">{r.subjectGroup}</span>
                    </td>

                    {/* Supervisor */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-medium text-slate-800">{r.supervisorName}</div>
                      <div className="text-[10px] text-slate-400">{r.supervisorPosition}</div>
                    </td>

                    {/* Score & Tier Badge */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="inline-flex flex-col items-center">
                        <span className="font-extrabold text-sm text-slate-900 font-mono">
                          {r.percentage}%
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${
                            r.gradeTier === 'ยอดเยี่ยม'
                              ? 'bg-emerald-100 text-emerald-800'
                              : r.gradeTier === 'ดีมาก'
                              ? 'bg-blue-100 text-blue-800'
                              : r.gradeTier === 'ดี'
                              ? 'bg-sky-100 text-sky-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {r.gradeTier}
                        </span>
                      </div>
                    </td>

                    {/* Last Modified Date & User */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="text-[11px] font-mono font-medium text-slate-700 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{formatThaiDateTime(r.lastModified)}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        โดย {r.lastModifiedBy}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openDetailModal(r)}
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="ดูรายละเอียดการประเมิน"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onNavigateToDiscussion?.(r)}
                          className="p-1.5 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition"
                          title="เปิดห้องเสวนาสองทาง & แลกเปลี่ยนข้อเสนอแนะ (PLC Discussion)"
                        >
                          <MessagesSquare className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onOpenCertificate(r)}
                          className="p-1.5 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition"
                          title="ดูเกียรติบัตร"
                        >
                          <Award className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => startEditMode(r)}
                          className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          title="แก้ไขข้อมูล (พร้อมบันทึกประวัติ)"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleResendLine(r)}
                          className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                          title="ส่งการแจ้งเตือน LINE Notify ซ้ำ"
                        >
                          <Send className="w-4 h-4" />
                        </button>

                        {currentUser.role === 'admin' && (
                          <button
                            onClick={() => {
                              if (confirm(`คุณแน่ใจว่าต้องการลบบันทึก ${r.code} ใช่หรือไม่?`)) {
                                deleteRecord(r.id);
                              }
                            }}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                            title="ลบบันทึก"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details & Edit Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    {selectedRecord.code}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      selectedRecord.gradeTier === 'ยอดเยี่ยม'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {selectedRecord.gradeTier} ({selectedRecord.percentage}%)
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  รายละเอียดการนิเทศ: {selectedRecord.teacherName}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedRecord.subjectName} • {selectedRecord.gradeLevel} • วันที่ {selectedRecord.date}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const rec = selectedRecord;
                    setSelectedRecord(null);
                    onNavigateToDiscussion?.(rec);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  title="เปิดห้องเสวนาสองทางสำหรับคาบเรียนนี้"
                >
                  <MessagesSquare className="w-3.5 h-3.5" />
                  <span>สนทนาสองทาง & PLC</span>
                </button>
                <button
                  onClick={() => onOpenCertificate(selectedRecord)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>ดูเกียรติบัตร</span>
                </button>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Audit Trail Banner (Highlighted Last Modified Timestamp) */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-amber-700 shrink-0" />
                <div>
                  <strong>วันที่และเวลาแก้ไขล่าสุด:</strong>{' '}
                  <span className="font-mono font-semibold">{formatThaiDateTime(selectedRecord.lastModified)}</span>
                  {' '}โดย <span className="font-semibold">{selectedRecord.lastModifiedBy}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowHistoryModal(!showHistoryModal)}
                className="text-amber-800 underline font-semibold text-xs cursor-pointer self-start sm:self-auto"
              >
                {showHistoryModal ? 'ซ่อนประวัติการแก้ไข' : `ดูประวัติการแก้ไข (${selectedRecord.editHistory?.length || 1} ครั้ง)`}
              </button>
            </div>

            {/* Edit History Trail Log */}
            {showHistoryModal && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <p className="text-xs font-bold text-slate-700">ประวัติการบันทึกและแก้ไขทั้งหมด (Revision Trail):</p>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {(selectedRecord.editHistory || []).map((entry, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs flex justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-800">{entry.changeSummary}</p>
                        <p className="text-[11px] text-slate-500">โดย: {entry.modifiedBy}</p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
                        {formatThaiDateTime(entry.timestamp)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Editing Form vs Display View */}
            {isEditing ? (
              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-3">
                  <h4 className="font-bold text-indigo-900 text-xs">
                    แก้ไขผลการประเมิน 8 ตัวชี้วัด (คะแนน 1-5):
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SUPERVISION_CRITERIA.map(crit => (
                      <div key={crit.id} className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                        <span className="text-xs text-slate-800 truncate pr-2" title={crit.title}>
                          {crit.number}. {crit.title}
                        </span>
                        <input
                          type="number"
                          min={1}
                          max={5}
                          value={editScores[crit.id] || 5}
                          onChange={e => setEditScores({ ...editScores, [crit.id]: Number(e.target.value) })}
                          className="w-14 px-2 py-1 bg-slate-50 border border-slate-300 rounded-lg text-center font-bold text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    จุดเด่นที่พบ
                  </label>
                  <textarea
                    rows={2}
                    value={editStrengths}
                    onChange={e => setEditStrengths(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    ข้อเสนอแนะเพื่อการพัฒนา
                  </label>
                  <textarea
                    rows={2}
                    value={editRecommendations}
                    onChange={e => setEditRecommendations(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-rose-700 block mb-1">
                    เหตุผลในการแก้ไขข้อมูล (Required for Audit Trail)
                  </label>
                  <input
                    type="text"
                    required
                    value={editReason}
                    onChange={e => setEditReason(e.target.value)}
                    placeholder="เช่น ปรับแก้คะแนนตัวชี้วัดที่ 3 ตามหลักฐานเพิ่มเติม..."
                    className="w-full p-2.5 bg-rose-50/50 border border-rose-200 rounded-xl text-xs text-rose-950 font-medium"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    บันทึกการแก้ไข
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-5">
                {/* 8 Criteria Score Breakdown */}
                <div>
                  <h4 className="font-bold text-slate-800 text-xs mb-2">
                    คะแนนรายตัวชี้วัด (8 ตัวชี้วัดมาตรฐาน):
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SUPERVISION_CRITERIA.map(crit => (
                      <div key={crit.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                        <span className="truncate pr-2 text-slate-700">
                          {crit.number}. {crit.title}
                        </span>
                        <span className="font-bold font-mono text-blue-700 px-2 py-0.5 bg-white rounded-md border border-slate-200">
                          {selectedRecord.scores[crit.id] || 0} / 5
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Qualitative Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-1">
                    <p className="font-bold text-emerald-900">🌟 จุดเด่นที่พบ:</p>
                    <p className="text-emerald-950 leading-relaxed">{selectedRecord.strengths}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs space-y-1">
                    <p className="font-bold text-amber-900">💡 ข้อเสนอแนะเพื่อการพัฒนา:</p>
                    <p className="text-amber-950 leading-relaxed">{selectedRecord.recommendations}</p>
                  </div>
                </div>

                {/* Teacher Acknowledgement Section */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-blue-600" />
                      <span>สถานะการรับทราบผลการนิเทศของครูผู้สอน</span>
                    </h4>
                    {selectedRecord.status === 'acknowledged' ? (
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> รับทราบและลงนามแล้ว
                      </span>
                    ) : (
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800">
                        รอดำเนินการลงนาม
                      </span>
                    )}
                  </div>

                  {selectedRecord.status === 'acknowledged' ? (
                    <div className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
                      ลายมือชื่อ: <strong>{selectedRecord.teacherSignature}</strong>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        ยืนยันเมื่อ: {formatThaiDateTime(selectedRecord.teacherAcknowledgedAt || selectedRecord.lastModified)}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={teacherSignatureInput}
                        onChange={e => setTeacherSignatureInput(e.target.value)}
                        placeholder="ระบุชื่อหรือข้อความรับทราบ..."
                        className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                      />
                      <button
                        onClick={handleTeacherAcknowledge}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl whitespace-nowrap cursor-pointer transition"
                      >
                        ลงนามรับทราบผล
                      </button>
                    </div>
                  )}
                </div>

                {/* Actions bottom */}
                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <button
                    onClick={() => startEditMode(selectedRecord)}
                    className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold hover:underline"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>แก้ไขผลการประเมินนี้</span>
                  </button>

                  <button
                    onClick={() => setSelectedRecord(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
                  >
                    ปิดหน้าต่าง
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
