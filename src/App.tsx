/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SupervisionProvider, useSupervision } from './context/SupervisionContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { SupervisionForm } from './components/SupervisionForm';
import { ReportHistory } from './components/ReportHistory';
import { CertificateModal } from './components/CertificateModal';
import { CertificateCenter } from './components/CertificateCenter';
import { LineNotifySettings } from './components/LineNotifySettings';
import { BackupManager } from './components/BackupManager';
import { LoginModal } from './components/LoginModal';
import { CertificateVerifyModal } from './components/CertificateVerifyModal';
import { DiscussionBoard } from './components/DiscussionBoard';
import { SupervisionRecord } from './types';
import { ShieldCheck, School, Heart, CheckCircle2 } from 'lucide-react';

function AppContent() {
  const { records, settings, createChannelForRecord } = useSupervision();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCertRecord, setSelectedCertRecord] = useState<SupervisionRecord | null>(null);
  const [verifyRecordCode, setVerifyRecordCode] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [discussionChannelId, setDiscussionChannelId] = useState<string>('general-plc');

  // Check URL query parameters for verification
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const verifyCode = params.get('verify');
    if (verifyCode) {
      setVerifyRecordCode(verifyCode);
    }
  }, []);

  const handleFormSuccess = (newRecordId: string) => {
    const found = records.find(r => r.id === newRecordId);
    if (found) {
      setSelectedCertRecord(found);
    } else if (records.length > 0) {
      setSelectedCertRecord(records[0]);
    }
  };

  const handleNavigateToDiscussion = (record: SupervisionRecord) => {
    const channelId = createChannelForRecord(record);
    setDiscussionChannelId(channelId);
    setActiveTab('discussions');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            onNavigateToForm={() => setActiveTab('form')}
            onNavigateToRecords={() => setActiveTab('records')}
            onNavigateToDiscussions={() => setActiveTab('discussions')}
          />
        )}

        {activeTab === 'form' && (
          <SupervisionForm onSuccess={handleFormSuccess} />
        )}

        {activeTab === 'discussions' && (
          <DiscussionBoard
            initialChannelId={discussionChannelId}
            onOpenCertificateByCode={code => {
              const rec = records.find(r => r.code === code || r.certificateNumber === code);
              if (rec) setSelectedCertRecord(rec);
            }}
          />
        )}

        {activeTab === 'records' && (
          <ReportHistory
            onOpenCertificate={rec => setSelectedCertRecord(rec)}
            onOpenLiveForm={() => setActiveTab('form')}
            onNavigateToDiscussion={handleNavigateToDiscussion}
          />
        )}

        {activeTab === 'certificates' && (
          <CertificateCenter
            onOpenCertificate={rec => setSelectedCertRecord(rec)}
          />
        )}

        {activeTab === 'line' && (
          <LineNotifySettings />
        )}

        {activeTab === 'backup' && (
          <BackupManager />
        )}
      </main>

      {/* Modals */}
      <CertificateModal
        record={selectedCertRecord}
        onClose={() => setSelectedCertRecord(null)}
        onOpenVerifyModal={code => setVerifyRecordCode(code)}
      />

      <CertificateVerifyModal
        recordCode={verifyRecordCode}
        onClose={() => {
          setVerifyRecordCode(null);
          if (window.location.search) {
            window.history.replaceState({}, '', window.location.pathname);
          }
        }}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* Footer */}
      <footer className="no-print bg-white border-t border-slate-200 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <School className="w-4 h-4 text-blue-700" />
            <span className="font-semibold text-slate-700">
              {settings.schoolName}
            </span>
            <span>•</span>
            <span>{settings.educationalArea}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <ShieldCheck className="w-4 h-4" /> ปลอดภัยตามมาตรฐานความมั่นคงปลอดภัยไซเบอร์
            </span>
            <span>เวอร์ชัน 2.5.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <SupervisionProvider>
      <AppContent />
    </SupervisionProvider>
  );
}
