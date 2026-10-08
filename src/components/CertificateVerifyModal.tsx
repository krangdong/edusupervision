import React from 'react';
import { useSupervision } from '../context/SupervisionContext';
import { CheckCircle2, ShieldCheck, X, Award, School, Calendar } from 'lucide-react';

interface CertificateVerifyModalProps {
  recordCode: string | null;
  onClose: () => void;
}

export const CertificateVerifyModal: React.FC<CertificateVerifyModalProps> = ({
  recordCode,
  onClose
}) => {
  const { records, settings } = useSupervision();

  if (!recordCode) return null;

  const record = records.find(
    r => r.code === recordCode || r.certificateNumber === recordCode
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 text-center relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {record ? (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                เอกสารถูกต้องตามระบบ สพฐ.
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">
                เกียรติบัตรอิเล็กทรอนิกส์ถูกต้องสมบูรณ์
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {record.certificateNumber}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
                <span className="text-slate-500">ผู้รับเกียรติบัตร:</span>
                <span className="font-bold text-slate-900">{record.teacherName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
                <span className="text-slate-500">สถานศึกษา:</span>
                <span className="font-medium text-slate-800">{record.school}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
                <span className="text-slate-500">วิชาที่นิเทศ:</span>
                <span className="font-medium text-slate-800">{record.subjectName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
                <span className="text-slate-500">ระดับผลการประเมิน:</span>
                <span className="font-bold text-emerald-700">{record.gradeTier} ({record.percentage}%)</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
                <span className="text-slate-500">ผู้นิเทศ:</span>
                <span className="font-medium text-slate-800">{record.supervisorName}</span>
              </div>
              <div className="flex justify-between pt-0.5">
                <span className="text-slate-500">วันที่ประเมิน:</span>
                <span className="font-mono text-slate-700">{record.date}</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>ยืนยันข้อมูลโดย {settings.educationalArea}</span>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              รับทราบ
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <X className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">ไม่พบข้อมูลเกียรติบัตรนี้</h3>
            <p className="text-xs text-slate-500">
              รหัสอ้างอิง {recordCode} ไม่ตรงกับฐานข้อมูลในระบบ
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition"
            >
              ปิด
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
