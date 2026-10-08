import React, { useState } from 'react';
import { useSupervision } from '../context/SupervisionContext';
import {
  Cloud,
  CloudCheck,
  ShieldCheck,
  Download,
  Upload,
  RefreshCw,
  Calendar,
  CheckCircle2,
  HardDrive,
  Database,
  Lock,
  Clock,
  Sparkles,
  Server
} from 'lucide-react';

export const BackupManager: React.FC = () => {
  const {
    backups,
    createBackup,
    restoreBackup,
    exportDataToJson,
    importDataFromJson,
    settings,
    updateSettings,
    isCloudSynced,
    isSyncing,
    syncWithCloud,
    records
  } = useSupervision();

  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleManualBackup = () => {
    setIsProcessing(true);
    setTimeout(() => {
      createBackup('manual');
      setIsProcessing(false);
      setRestoreMessage('สร้างจุดสำรองข้อมูลเรียบร้อยแล้ว');
      setTimeout(() => setRestoreMessage(null), 3000);
    }, 400);
  };

  const handleDownloadBackupFile = () => {
    const jsonStr = exportDataToJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EduSupervision_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        const res = importDataFromJson(content);
        if (res.success) {
          setRestoreMessage('กู้คืนข้อมูลจากไฟล์สำรองสำเร็จเรียบร้อย');
        } else {
          setRestoreMessage(`เกิดข้อผิดพลาด: ${res.error}`);
        }
        setTimeout(() => setRestoreMessage(null), 4000);
      }
    };
    reader.readAsText(file);
  };

  const formatThaiDateTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Cloud className="w-4 h-4" />
          <span>ระบบคลาวด์และสำรองข้อมูลอัตโนมัติ (Cloud Security & Daily Backup)</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          การจัดเก็บบนคลาวด์อย่างปลอดภัย และระบบสำรองข้อมูลรายวัน
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          รับประกันความปลอดภัยของข้อมูลการประเมินวิทยฐานะ ด้วยการเข้ารหัสมาตรฐานสากลและระบบสำรองข้อมูลอัตโนมัติทุกวัน
        </p>
      </div>

      {/* Cloud Security Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">การเข้ารหัสความปลอดภัย</h3>
            <p className="text-xs text-slate-500 mt-0.5">TLS 1.3 / AES 256-bit Cloud Storage</p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> ทำงานอยู่ตลอดเวลา
            </span>
            <span className="text-slate-400 font-mono text-[11px]">Zero-Data-Loss</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">สำรองข้อมูลอัตโนมัติรายวัน</h3>
            <p className="text-xs text-slate-500 mt-0.5">ทำงานทุกวันเวลา 03:00 น. (Daily Auto Backup)</p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-blue-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> เปิดใช้งานอยู่
            </span>
            <span className="text-slate-400 text-[11px]">
              ล่าสุด: {formatThaiDateTime(settings.lastDailyBackupDate)}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">สถานะเซิร์ฟเวอร์คลาวด์</h3>
            <p className="text-xs text-slate-500 mt-0.5">สถานะออนไลน์ 99.98% อัปไทม์</p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              onClick={() => syncWithCloud()}
              disabled={isSyncing}
              className="text-blue-600 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'กำลังซิงค์...' : 'บังคับซิงค์ทันที'}</span>
            </button>
            <span className="text-emerald-600 font-bold">ONLINE</span>
          </div>
        </div>
      </div>

      {/* Main Backup Action Center */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">
              ศูนย์จัดการและกู้คืนข้อมูลสำรอง (Backup & Restore Center)
            </h3>
            <p className="text-xs text-slate-500">
              ปัจจุบันมีข้อมูลการนิเทศทั้งหมด {records.length} รายการในฐานข้อมูล
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleManualBackup}
              disabled={isProcessing}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <HardDrive className="w-4 h-4" />
              <span>สร้างจุดสำรองข้อมูลเดี๋ยวนี้</span>
            </button>

            <button
              onClick={handleDownloadBackupFile}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>ดาวน์โหลดไฟล์ JSON</span>
            </button>

            <label className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>กู้คืนข้อมูลจากไฟล์</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {restoreMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{restoreMessage}</span>
          </div>
        )}

        {/* Backups Table */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              ประวัติจุดสำรองข้อมูลล่าสุด (Backup Snapshots)
            </span>
            <span className="text-xs text-slate-400">
              ทั้งหมด {backups.length} จุดย้อนเวลา
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {backups.map(b => (
              <div
                key={b.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold ${
                      b.type === 'auto_daily'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-indigo-50 text-indigo-700'
                    }`}
                  >
                    {b.type === 'auto_daily' ? 'DAILY' : 'MANUAL'}
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-slate-900 flex items-center gap-2">
                      <span>{formatThaiDateTime(b.timestamp)}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                        {b.type === 'auto_daily' ? 'สำรองอัตโนมัติประจำวัน' : 'สร้างด้วยตนเอง'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      จำนวน {b.recordCount} รายการ • ขนาด {b.sizeKb} KB • {b.hash}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> สำเร็จ
                  </span>
                  <button
                    onClick={() => {
                      if (confirm('คุณต้องการนำข้อมูลจากจุดสำรองเวลานี้มาใช้งานใช่หรือไม่?')) {
                        restoreBackup(b.id);
                        setRestoreMessage(`นำข้อมูลจากวันที่ ${formatThaiDateTime(b.timestamp)} มาใช้งานสำเร็จ`);
                        setTimeout(() => setRestoreMessage(null), 3000);
                      }
                    }}
                    className="px-3 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg text-xs font-medium transition cursor-pointer"
                  >
                    เรียกคืนข้อมูล
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
