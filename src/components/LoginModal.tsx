import React, { useState } from 'react';
import { useSupervision } from '../context/SupervisionContext';
import { SocialProvider, UserRole } from '../types';
import {
  X,
  Lock,
  Mail,
  CheckCircle2,
  ShieldCheck,
  User as UserIcon,
  Sparkles,
  School,
  ArrowRight,
  Check
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { users, currentUser, switchUser, loginUser, socialLogin, settings } = useSupervision();
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('••••••••');
  const [error, setError] = useState('');

  // Social account picker dialog states
  const [socialModalProvider, setSocialModalProvider] = useState<SocialProvider | null>(null);
  const [socialName, setSocialName] = useState('');
  const [socialEmail, setSocialEmail] = useState('');
  const [socialRole, setSocialRole] = useState<UserRole>('teacher');
  const [isProcessingSocial, setIsProcessingSocial] = useState(false);

  if (!isOpen) return null;

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('กรุณากรอกอีเมล');
      return;
    }
    const success = loginUser(email, password);
    if (success) {
      onClose();
    }
  };

  const handleSelectPreset = (userId: string) => {
    switchUser(userId);
    onClose();
  };

  const openSocialDialog = (provider: SocialProvider) => {
    setSocialModalProvider(provider);
    if (provider === 'google') {
      setSocialName('ครูสมศักดิ์ สุขสวัสดิ์');
      setSocialEmail('krangdong2018@gmail.com');
      setSocialRole('teacher');
    } else {
      setSocialName('ครูสายใจ มั่นคง');
      setSocialEmail('saijai.teacher@facebook.com');
      setSocialRole('teacher');
    }
  };

  const handleConfirmSocialLogin = () => {
    if (!socialModalProvider) return;
    setIsProcessingSocial(true);

    setTimeout(() => {
      socialLogin(socialModalProvider, {
        name: socialName || (socialModalProvider === 'google' ? 'ครูผู้ใช้งาน (Google)' : 'ครูผู้ใช้งาน (Facebook)'),
        email: socialEmail || (socialModalProvider === 'google' ? 'user@gmail.com' : 'user@facebook.com'),
        role: socialRole,
        school: settings.schoolName,
        avatar:
          socialModalProvider === 'google'
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
      });
      setIsProcessingSocial(false);
      setSocialModalProvider(null);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-6 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {tab === 'signin' ? 'เข้าสู่ระบบนิเทศการศึกษา' : 'ลงทะเบียนผู้ใช้งานใหม่'}
            </h3>
            <p className="text-xs text-slate-500">
              รองรับ Social Login ด้วย Google หรือ Facebook เพื่อความสะดวกรวดเร็ว
            </p>
          </div>
        </div>

        {/* Tab switcher: Sign in vs Sign up */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl mb-5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setTab('signin')}
            className={`py-2 rounded-xl transition ${
              tab === 'signin' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            เข้าสู่ระบบ (Sign In)
          </button>
          <button
            type="button"
            onClick={() => setTab('signup')}
            className={`py-2 rounded-xl transition ${
              tab === 'signup' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            สมัครสมาชิกใหม่ (Sign Up)
          </button>
        </div>

        {/* Social Logins: Google & Facebook */}
        <div className="space-y-2.5 mb-6">
          <button
            type="button"
            onClick={() => openSocialDialog('google')}
            className="w-full py-3 px-4 bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 rounded-2xl flex items-center justify-center gap-3 font-semibold text-slate-700 text-xs sm:text-sm shadow-xs transition cursor-pointer"
          >
            {/* Google G Logo */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.14z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>
              {tab === 'signin' ? 'เข้าสู่ระบบด้วย Google' : 'ลงทะเบียนด้วยบัญชี Google'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => openSocialDialog('facebook')}
            className="w-full py-3 px-4 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-2xl flex items-center justify-center gap-3 font-semibold text-xs sm:text-sm shadow-xs transition cursor-pointer"
          >
            {/* Facebook Logo */}
            <svg className="w-5 h-5 shrink-0 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>
              {tab === 'signin' ? 'เข้าสู่ระบบด้วย Facebook' : 'ลงทะเบียนด้วยบัญชี Facebook'}
            </span>
          </button>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-slate-400 font-medium">
              หรือเลือกบัญชีตัวอย่าง / อีเมล
            </span>
          </div>
        </div>

        {/* Quick Demo Preset Selection */}
        <div className="mb-6">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
            บัญชีสาธิตตามบทบาท (คลิกสลับบทบาททันที)
          </label>
          <div className="space-y-2">
            {users.slice(0, 4).map(u => {
              const isSelected = u.id === currentUser.id;
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleSelectPreset(u.id)}
                  className={`w-full p-2.5 sm:p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-9 h-9 rounded-full object-cover shadow-xs"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs sm:text-sm text-slate-900 truncate">
                        {u.name}
                      </span>
                      {isSelected && (
                        <span className="text-[9px] bg-blue-600 text-white font-bold px-1.5 py-0.2 rounded-full">
                          ใช้งานอยู่
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      {u.roleTitle}
                    </p>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Login / Register */}
        <form onSubmit={handleCustomLogin} className="space-y-3">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">
              อีเมลผู้ใช้งาน (Email)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="teacher@school.ac.th"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">
              รหัสผ่าน (Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer mt-1"
          >
            {tab === 'signin' ? 'เข้าสู่ระบบด้วยอีเมล' : 'สมัครสมาชิกด้วยอีเมล'}
          </button>
        </form>
      </div>

      {/* Social Account Chooser Popup */}
      {socialModalProvider && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                {socialModalProvider === 'google' ? (
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.14z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.34 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold">
                    f
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    ยืนยันการเชื่อมต่อ {socialModalProvider === 'google' ? 'Google' : 'Facebook'}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    ลงชื่อเข้าใช้ระบบนิเทศการศึกษาออนไลน์
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSocialModalProvider(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  ชื่อ-นามสกุล ที่แสดงในระบบ
                </label>
                <input
                  type="text"
                  value={socialName}
                  onChange={e => setSocialName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  อีเมลบัญชี {socialModalProvider === 'google' ? 'Google' : 'Facebook'}
                </label>
                <input
                  type="email"
                  value={socialEmail}
                  onChange={e => setSocialEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  บทบาทในระบบสถานศึกษา
                </label>
                <select
                  value={socialRole}
                  onChange={e => setSocialRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="teacher">ครูผู้สอน / ผู้รับการนิเทศ</option>
                  <option value="supervisor">ศึกษานิเทศก์ / ครูนิเทศก์</option>
                  <option value="executive">ผู้บริหารสถานศึกษา (ผู้อำนวยการ)</option>
                  <option value="admin">ผู้ดูแลระบบ</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-[11px] text-blue-900 flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  ระบบจะซิงค์ข้อมูลโปรไฟล์และเชื่อมต่อกับระบบคลาวด์โดยอัตโนมัติ
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSocialModalProvider(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirmSocialLogin}
                disabled={isProcessingSocial}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>{isProcessingSocial ? 'กำลังเชื่อมต่อ...' : 'ยืนยันเข้าสู่ระบบ'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
