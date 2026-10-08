import React, { useRef, useState } from 'react';
import { SupervisionRecord } from '../types';
import { useSupervision } from '../context/SupervisionContext';
import {
  X,
  Printer,
  Download,
  Share2,
  CheckCircle,
  QrCode,
  Sparkles,
  Award,
  ShieldCheck,
  Calendar,
  Building
} from 'lucide-react';

interface CertificateModalProps {
  record: SupervisionRecord | null;
  onClose: () => void;
  onOpenVerifyModal?: (recordCode: string) => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  record,
  onClose,
  onOpenVerifyModal
}) => {
  const { settings } = useSupervision();
  const certRef = useRef<HTMLDivElement | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  if (!record) return null;

  // Format Thai Buddhist date
  const formatThaiDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const thaiMonths = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
      ];
      const day = d.getDate();
      const month = thaiMonths[d.getMonth()];
      const year = d.getFullYear() + 543;
      return `${day} ${month} พ.ศ. ${year}`;
    } catch {
      return dateStr;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadImage = async () => {
    if (!certRef.current) return;
    setIsExporting(true);

    try {
      // Use SVG-based canvas rasterization or HTML canvas
      const node = certRef.current;
      const width = node.offsetWidth;
      const height = node.offsetHeight;

      const canvas = document.createElement('canvas');
      const scale = 2; // high res
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.scale(scale, scale);
        // Draw certificate background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        // We can create a blob snapshot or print view
        // For standard fast high quality export, trigger print/download or save HTML
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `Certificate_${record.code}_${record.teacherName}.png`;
        link.href = dataUrl;
        // link.click();
      }

      // Also trigger print to PDF for pristine vector output
      setTimeout(() => {
        window.print();
      }, 200);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}?verify=${record.certificateNumber || record.code}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full my-6 shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="no-print p-4 sm:px-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                เกียรติบัตรอิเล็กทรอนิกส์ (E-Certificate)
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {record.certificateNumber || 'CERT-EDUSUP-2026/0000'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl transition"
              title="คัดลอกลิงก์ตรวจสอบเกียรติบัตร"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'คัดลอกแล้ว!' : 'แชร์ลิงก์'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>พิมพ์ / บันทึก PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Display Area */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1 bg-slate-100 flex justify-center">
          <div
            ref={certRef}
            className="certificate-print-container w-full max-w-[800px] bg-white rounded-2xl shadow-xl p-8 sm:p-12 border-8 border-amber-600/30 relative overflow-hidden text-center text-slate-800"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #fffdfa 100%)',
              aspectRatio: '1.414 / 1', // A4 Landscape
              minHeight: '520px'
            }}
          >
            {/* Elegant Golden Border Filigree */}
            <div className="absolute inset-2 border-2 border-amber-400/60 pointer-events-none rounded-lg" />
            <div className="absolute inset-3 border border-amber-300/40 pointer-events-none rounded-sm" />

            {/* Corner Ornaments */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-amber-600/60 rounded-tl-lg pointer-events-none" />
            <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-amber-600/60 rounded-tr-lg pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-amber-600/60 rounded-bl-lg pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-amber-600/60 rounded-br-lg pointer-events-none" />

            {/* Watermark Crest in Center Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none">
              <svg className="w-96 h-96" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>

            {/* Certificate Header Emblem */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mb-3 flex items-center justify-center rounded-full bg-linear-to-b from-amber-500 to-amber-700 text-white shadow-md shadow-amber-600/20 p-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-full h-full">
                  <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
                  <path d="M12 8v5l3 3" />
                </svg>
              </div>

              <div className="text-xs sm:text-sm font-semibold tracking-wide text-amber-900 uppercase">
                {settings.educationalArea}
              </div>
              <div className="text-sm sm:text-base font-bold text-slate-800 mt-0.5">
                {settings.schoolName}
              </div>
              
              <div className="mt-4 mb-2">
                <span className="text-xs font-mono tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  เกียรติบัตรการนิเทศการจัดการเรียนรู้ออนไลน์
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-500 font-light mt-2">
                ขอมอบเกียรติบัตรฉบับนี้ไว้เพื่อแสดงว่า
              </p>

              {/* Recipient Name */}
              <div className="my-3 sm:my-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-900 tracking-tight font-serif drop-shadow-xs">
                  {record.teacherName}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                  {record.subjectGroup}
                </p>
              </div>

              {/* Achievement Body */}
              <p className="text-xs sm:text-sm text-slate-700 max-w-xl mx-auto leading-relaxed">
                ได้ผ่านการรับการนิเทศการจัดการเรียนรู้เชิงรุก (Active Learning) ตามมาตรฐานตำแหน่งและวิทยฐานะ (วPA)
                <br />
                รายวิชา <strong>{record.subjectName}</strong> ({record.gradeLevel})
                <br />
                ผลการประเมินอยู่ในระดับ <span className="font-bold text-emerald-700">"{record.gradeTier}"</span> (คะแนน {record.totalScore}/40 คิดเป็นร้อยละ {record.percentage}%)
              </p>

              {/* Date */}
              <p className="text-xs text-slate-500 mt-3 font-light">
                ให้ไว้ ณ วันที่ {formatThaiDate(record.date)}
              </p>

              {/* Dual Signatures */}
              <div className="grid grid-cols-2 gap-8 w-full max-w-md mx-auto mt-6 pt-4 border-t border-slate-200/80">
                {/* Director Signature */}
                <div className="text-center">
                  <div className="h-10 flex items-center justify-center">
                    <span className="font-serif italic text-blue-900 font-bold text-sm tracking-wider">
                      วิเชียร สมใจนึก
                    </span>
                  </div>
                  <div className="border-t border-slate-400/80 pt-1">
                    <p className="text-xs font-bold text-slate-800">
                      ({settings.directorName})
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {settings.directorPosition}
                    </p>
                  </div>
                </div>

                {/* Supervisor Signature */}
                <div className="text-center">
                  <div className="h-10 flex items-center justify-center">
                    {record.supervisorSignature?.startsWith('data:image') ? (
                      <img
                        src={record.supervisorSignature}
                        alt="Signature"
                        className="max-h-9 object-contain"
                      />
                    ) : (
                      <span className="font-serif italic text-blue-900 font-bold text-sm tracking-wider">
                        พรพิมล รัตนโกสินทร์
                      </span>
                    )}
                  </div>
                  <div className="border-t border-slate-400/80 pt-1">
                    <p className="text-xs font-bold text-slate-800">
                      ({record.supervisorName})
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {record.supervisorPosition}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Verification & QR */}
              <div className="mt-6 flex items-center justify-between w-full text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ตรวจสอบความถูกต้อง: {record.certificateNumber}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenVerifyModal?.(record.code)}
                  className="flex items-center gap-1 text-blue-600 hover:underline cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>สแกน QR ตรวจสอบข้อมูล</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
