import React, { useState } from 'react';
import { useSupervision } from '../context/SupervisionContext';
import {
  LayoutDashboard,
  ClipboardCheck,
  FileSpreadsheet,
  Award,
  BellRing,
  Cloud,
  CloudCheck,
  RefreshCw,
  UserCheck,
  ChevronDown,
  GraduationCap,
  Sparkles,
  School,
  LogOut,
  MessagesSquare
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenLoginModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenLoginModal
}) => {
  const {
    currentUser,
    users,
    switchUser,
    isCloudSynced,
    isSyncing,
    syncWithCloud,
    settings,
    records,
    messages
  } = useSupervision();

  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const navItems = [
    {
      id: 'dashboard',
      label: 'แดชบอร์ดผู้บริหาร',
      icon: LayoutDashboard,
      roles: ['executive', 'admin', 'supervisor', 'teacher'],
      badge: null
    },
    {
      id: 'form',
      label: 'ประเมินผลเรียลไทม์',
      icon: ClipboardCheck,
      roles: ['supervisor', 'admin', 'executive'],
      badge: 'Live'
    },
    {
      id: 'discussions',
      label: 'สื่อสารสองทาง & PLC',
      icon: MessagesSquare,
      roles: ['executive', 'admin', 'supervisor', 'teacher'],
      badge: messages.length
    },
    {
      id: 'records',
      label: 'คลังรายงานย้อนหลัง',
      icon: FileSpreadsheet,
      roles: ['executive', 'admin', 'supervisor', 'teacher'],
      badge: records.length
    },
    {
      id: 'certificates',
      label: 'เกียรติบัตรอัตโนมัติ',
      icon: Award,
      roles: ['executive', 'admin', 'supervisor', 'teacher'],
      badge: records.filter(r => r.certificateNumber).length
    },
    {
      id: 'line',
      label: 'LINE Notify',
      icon: BellRing,
      roles: ['executive', 'admin', 'supervisor', 'teacher'],
      badge: null
    },
    {
      id: 'backup',
      label: 'สำรองข้อมูล & คลาวด์',
      icon: Cloud,
      roles: ['admin', 'executive', 'supervisor', 'teacher'],
      badge: 'Auto'
    }
  ];

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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Ministry Ribbon */}
      <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-sky-900 text-white text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 shadow-inner">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span className="font-medium tracking-wide">
            ระบบนิเทศการศึกษาออนไลน์ ตามมาตรฐาน วPA และ Active Learning
          </span>
          <span className="hidden md:inline text-blue-200">|</span>
          <span className="hidden md:inline text-blue-200 flex items-center gap-1">
            <School className="w-3.5 h-3.5 inline text-amber-300" />
            {settings.educationalArea}
          </span>
        </div>

        {/* Cloud Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => syncWithCloud()}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] transition cursor-pointer"
            title="กดเพื่อซิงค์ข้อมูลกับระบบคลาวด์"
          >
            {isSyncing ? (
              <RefreshCw className="w-3 h-3 animate-spin text-amber-300" />
            ) : isCloudSynced ? (
              <CloudCheck className="w-3 h-3 text-emerald-300" />
            ) : (
              <Cloud className="w-3 h-3 text-amber-300" />
            )}
            <span>
              {isSyncing ? 'กำลังซิงค์...' : 'คลาวด์ซิงค์เรียลไทม์ (TLS 256-bit)'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & School Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 ring-2 ring-blue-100">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">
                  EduSupervision <span className="text-blue-700">Pro</span>
                </span>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/80">
                  สพฐ.
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {settings.schoolName}
              </p>
            </div>
          </div>

          {/* Right Action: User & Quick Switch */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-xs"
                />
                <div className="hidden sm:block">
                  <div className="text-xs font-semibold text-slate-800 line-clamp-1">
                    {currentUser.name}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded border font-medium ${getRoleBadgeStyle(
                        currentUser.role
                      )}`}
                    >
                      {currentUser.roleTitle}
                    </span>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {showUserDropdown && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setShowUserDropdown(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                      สลับบทบาทผู้ใช้งาน (Demo Multi-Role)
                    </p>
                  </div>

                  <div className="py-1 max-h-72 overflow-y-auto">
                    {users.map(u => (
                      <button
                        key={u.id}
                        onClick={() => switchUser(u.id)}
                        className={`w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-slate-50 transition-colors ${
                          u.id === currentUser.id ? 'bg-blue-50/70' : ''
                        }`}
                      >
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-900 truncate">
                            {u.name}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">
                            {u.roleTitle}
                          </p>
                        </div>
                        {u.id === currentUser.id && (
                          <UserCheck className="w-4 h-4 text-blue-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 p-2 space-y-1">
                    <button
                      onClick={onOpenLoginModal}
                      className="w-full text-center text-xs text-blue-600 font-semibold py-1.5 hover:bg-blue-50 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>🔑 ล็อกอินด้วย Google / Facebook / อีเมล</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto py-2 no-scrollbar border-t border-slate-100">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.badge !== null && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
