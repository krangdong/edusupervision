import { CriterionItem, User, SupervisionRecord, SystemSettings, BackupRecord } from '../types';

export const SUPERVISION_CRITERIA: CriterionItem[] = [
  {
    id: 'crit-1',
    number: 1,
    title: 'การจัดทำแผนการจัดการเรียนรู้สอดคล้องกับมาตรฐานและตัวชี้วัด',
    description: 'แผนการจัดการเรียนรู้ระบุจุดประสงค์การเรียนรู้ (KPA) ชัดเจน เชื่อมโยงกับมาตรฐาน/ตัวชี้วัด และสมรรถนะสำคัญของผู้เรียน',
    maxScore: 5,
    category: 'planning'
  },
  {
    id: 'crit-2',
    number: 2,
    title: 'การจัดกิจกรรมการเรียนรู้เชิงรุก (Active Learning Process)',
    description: 'จัดกิจกรรมให้ผู้เรียนได้ลงมือปฏิบัติจริง มีการสืบเสาะ อภิปราย ทำงานร่วมกัน กระตุ้นความสนใจและคิดสร้างสรรค์',
    maxScore: 5,
    category: 'instruction'
  },
  {
    id: 'crit-3',
    number: 3,
    title: 'การเลือกใช้และพัฒนาสื่อ นวัตกรรม และเทคโนโลยีดิจิทัล',
    description: 'ใช้สื่อประกอบการสอนที่เหมาะสม ทันสมัย เช่น แพลตฟอร์มการเรียนรู้ สื่อมัลติมีเดีย หรืออุปกรณ์ทดลองที่ช่วยให้เข้าใจลึกซึ้ง',
    maxScore: 5,
    category: 'media'
  },
  {
    id: 'crit-4',
    number: 4,
    title: 'การบริหารจัดการชั้นเรียนเชิงบวกและการมีส่วนร่วม',
    description: 'สร้างบรรยากาศที่อบอุ่น ปลอดภัย ให้เกียรติผู้เรียน จัดการกับพฤติกรรมเชิงบวก และส่งเสริมให้นักเรียนทุกคนมีส่วนร่วม',
    maxScore: 5,
    category: 'climate'
  },
  {
    id: 'crit-5',
    number: 5,
    title: 'การวัดและประเมินผลตามสภาพจริงด้วยเครื่องมือหลากหลาย',
    description: 'วัดผลระหว่างเรียน (Formative) และหลังเรียน มีรูบริกส์ที่ชัดเจน สอดคล้องกับจุดประสงค์การเรียนรู้',
    maxScore: 5,
    category: 'assessment'
  },
  {
    id: 'crit-6',
    number: 6,
    title: 'การให้ข้อมูลย้อนกลับทันท่วงที (Constructive Feedback)',
    description: 'แนะนำ จุดเด่น-จุดที่ควรพัฒนาแก่นักเรียนอย่างสร้างสรรค์ เพื่อให้นักเรียนสามารถปรับปรุงการเรียนรู้ได้ทันที',
    maxScore: 5,
    category: 'assessment'
  },
  {
    id: 'crit-7',
    number: 7,
    title: 'การพัฒนาทักษะการคิดขั้นสูงและการแก้ปัญหา (Higher-Order Thinking)',
    description: 'ใช้คำถามกระตุ้นการคิดวิเคราะห์ การสังเคราะห์ และการประเมินค่า ตลอดจนการประยุกต์ใช้ในชีวิตจริง',
    maxScore: 5,
    category: 'instruction'
  },
  {
    id: 'crit-8',
    number: 8,
    title: 'การบันทึกหลังการสอนและสะท้อนผลสู่ชุมชนแห่งการเรียนรู้ (PLC)',
    description: 'บันทึกผลการจัดกิจกรรม ปัญหาอุปสรรค แนวทางแก้ไข และนำข้อมูลไปแลกเปลี่ยนเรียนรู้เพื่อพัฒนาต่อเนื่อง',
    maxScore: 5,
    category: 'planning'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'u-exec',
    name: 'ดร.วิเชียร สมใจนึก',
    email: 'wichian.director@obec.go.th',
    role: 'executive',
    roleTitle: 'ผู้อำนวยการสถานศึกษา เชี่ยวชาญ',
    school: 'โรงเรียนกัลยาณวัตรวิทยา สพม.กรุงเทพมหานคร เขต 1',
    position: 'ผู้อำนวยการโรงเรียน',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    signatureUrl: 'https://api.iconify.design/fluent-emoji:writing-hand.svg'
  },
  {
    id: 'u-sup1',
    name: 'ศน.ดร.พรพิมล รัตนโกสินทร์',
    email: 'pornpimon.sup@obec.go.th',
    role: 'supervisor',
    roleTitle: 'ศึกษานิเทศก์ชำนาญการพิเศษ',
    school: 'สำนักงานเขตพื้นที่การศึกษามัธยมศึกษากรุงเทพมหานคร เขต 1',
    position: 'กลุ่มนิเทศ ติดตาม และประเมินผลการจัดการศึกษา',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    signatureUrl: 'https://api.iconify.design/fluent-emoji:pen.svg'
  },
  {
    id: 'u-teach1',
    name: 'ครูธีรภัทร ชาญวิทย์',
    email: 'teerapat.c@school.ac.th',
    role: 'teacher',
    roleTitle: 'ครู คศ.2 (ชำนาญการ)',
    school: 'โรงเรียนกัลยาณวัตรวิทยา',
    position: 'ครูกลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี',
    subjectGroup: 'กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    lineToken: 'line_token_demo_01'
  },
  {
    id: 'u-teach2',
    name: 'ครูปรียานุช รัตนศิริ',
    email: 'priyanuch.r@school.ac.th',
    role: 'teacher',
    roleTitle: 'ครู คศ.1',
    school: 'โรงเรียนกัลยาณวัตรวิทยา',
    position: 'ครูกลุ่มสาระการเรียนรู้ภาษาต่างประเทศ',
    subjectGroup: 'กลุ่มสาระการเรียนรู้ภาษาต่างประเทศ',
    avatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&auto=format&fit=crop&q=80',
    lineToken: 'line_token_demo_02'
  },
  {
    id: 'u-teach3',
    name: 'ครูกิตติพงษ์ เจริญทรัพย์',
    email: 'kittipong.k@school.ac.th',
    role: 'teacher',
    roleTitle: 'ครู คศ.2 (ชำนาญการ)',
    school: 'โรงเรียนกัลยาณวัตรวิทยา',
    position: 'ครูกลุ่มสาระการเรียนรู้คณิตศาสตร์',
    subjectGroup: 'กลุ่มสาระการเรียนรู้คณิตศาสตร์',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'u-admin',
    name: 'นายอดิศร วงศ์สว่าง',
    email: 'admin.supervision@obec.go.th',
    role: 'admin',
    roleTitle: 'ผู้ดูแลระบบระบบนิเทศออนไลน์',
    school: 'ศูนย์เทคโนโลยีสารสนเทศ สพฐ.',
    position: 'นักวิชาการคอมพิวเตอร์ชำนาญการ',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  }
];

export const SUBJECT_GROUPS = [
  'กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี',
  'กลุ่มสาระการเรียนรู้คณิตศาสตร์',
  'กลุ่มสาระการเรียนรู้ภาษาไทย',
  'กลุ่มสาระการเรียนรู้ภาษาต่างประเทศ',
  'กลุ่มสาระการเรียนรู้สังคมศึกษา ศาสนา และวัฒนธรรม',
  'กลุ่มสาระการเรียนรู้สุขศึกษาและพลศึกษา',
  'กลุ่มสาระการเรียนรู้ศิลปะ',
  'กลุ่มสาระการเรียนรู้การงานอาชีพ'
];

export const GRADE_LEVELS = [
  'มัธยมศึกษาปีที่ 1',
  'มัธยมศึกษาปีที่ 2',
  'มัธยมศึกษาปีที่ 3',
  'มัธยมศึกษาปีที่ 4',
  'มัธยมศึกษาปีที่ 5',
  'มัธยมศึกษาปีที่ 6'
];

export const INITIAL_SETTINGS: SystemSettings = {
  schoolName: 'โรงเรียนกัลยาณวัตรวิทยา',
  educationalArea: 'สำนักงานเขตพื้นที่การศึกษามัธยมศึกษากรุงเทพมหานคร เขต 1',
  directorName: 'ดร.วิเชียร สมใจนึก',
  directorPosition: 'ผู้อำนวยการโรงเรียนกัลยาณวัตรวิทยา',
  supervisorDirectorName: 'ดร.อัมพร พินะสา',
  lineNotifyToken: 'LINE_NOTIFY_SECURE_TOKEN_SAMPLE_2026',
  enableLineNotify: true,
  autoBackupDaily: true,
  lastDailyBackupDate: '2026-10-08T03:00:00.000Z',
  cloudSyncEnabled: true,
  lastCloudSync: new Date().toISOString()
};

export const INITIAL_RECORDS: SupervisionRecord[] = [
  {
    id: 'rec-001',
    code: 'SUP-2026-001',
    teacherId: 'u-teach1',
    teacherName: 'ครูธีรภัทร ชาญวิทย์',
    school: 'โรงเรียนกัลยาณวัตรวิทยา',
    subjectGroup: 'กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี',
    subjectName: 'วิทยาการคำนวณ (ว21103)',
    gradeLevel: 'มัธยมศึกษาปีที่ 1',
    room: 'ม.1/2',
    teachingTopic: 'การออกแบบขั้นตอนวิธี (Algorithm) ด้วย Flowchart และ Scratch',
    supervisorId: 'u-sup1',
    supervisorName: 'ศน.ดร.พรพิมล รัตนโกสินทร์',
    supervisorPosition: 'ศึกษานิเทศก์ชำนาญการพิเศษ',
    date: '2026-10-06',
    timeStart: '09:20',
    timeEnd: '10:10',
    scores: {
      'crit-1': 5,
      'crit-2': 5,
      'crit-3': 5,
      'crit-4': 5,
      'crit-5': 4,
      'crit-6': 5,
      'crit-7': 5,
      'crit-8': 4
    },
    totalScore: 38,
    percentage: 95,
    gradeTier: 'ยอดเยี่ยม',
    tierColor: '#16a34a',
    strengths: 'ครูจัดกิจกรรมการเรียนรู้แบบ Active Learning ได้อย่างยอดเยี่ยม นักเรียนทุกคนได้ลงมือเขียนโค้ดและช่วยกันแก้บั๊ก (Debugging) เป็นกลุ่ม มีการใช้สื่อ Interactive แพลตฟอร์ม Scratch ที่เร้าความสนใจสูงมาก',
    recommendations: 'สามารถเชื่อมโยงโจทย์ปัญหาในชีวิตจริงของชุมชน เพื่อเสริมทักษะ Computational Thinking สู่การแก้ปัญหาจริงในระดับที่ซับซ้อนยิ่งขึ้น',
    generalComment: 'การจัดการเรียนรู้มีมาตรฐานสูง เป็นแบบอย่างที่ดีสำหรับเครือข่ายครูวิทยาศาสตร์และเทคโนโลยีในเขตพื้นที่',
    status: 'acknowledged',
    supervisorSignature: 'ศน.ดร.พรพิมล รัตนโกสินทร์ (ยืนยันระบบดิจิทัล)',
    teacherSignature: 'ครูธีรภัทร ชาญวิทย์ (รับทราบผลการนิเทศ)',
    teacherAcknowledgedAt: '2026-10-06T11:45:00.000Z',
    certificateNumber: 'CERT-EDUSUP-2026/0088',
    certificateIssuedAt: '2026-10-06T10:30:00.000Z',
    lineNotified: true,
    lineNotifiedAt: '2026-10-06T10:31:12.000Z',
    lastModified: '2026-10-06T11:45:00.000Z',
    lastModifiedBy: 'ครูธีรภัทร ชาญวิทย์ (ยืนยันรับทราบ)',
    editHistory: [
      {
        timestamp: '2026-10-06T10:30:00.000Z',
        modifiedBy: 'ศน.ดร.พรพิมล รัตนโกสินทร์',
        changeSummary: 'บันทึกผลการนิเทศและออกเกียรติบัตรอัตโนมัติ'
      },
      {
        timestamp: '2026-10-06T11:45:00.000Z',
        modifiedBy: 'ครูธีรภัทร ชาญวิทย์',
        changeSummary: 'ลงลายมือชื่อดิจิทัลรับทราบผลการประเมิน'
      }
    ]
  },
  {
    id: 'rec-002',
    code: 'SUP-2026-002',
    teacherId: 'u-teach2',
    teacherName: 'ครูปรียานุช รัตนศิริ',
    school: 'โรงเรียนกัลยาณวัตรวิทยา',
    subjectGroup: 'กลุ่มสาระการเรียนรู้ภาษาต่างประเทศ',
    subjectName: 'ภาษาอังกฤษเพื่อการสื่อสาร (อ22101)',
    gradeLevel: 'มัธยมศึกษาปีที่ 2',
    room: 'ม.2/4',
    teachingTopic: 'Role-Play Interview: My Dream Career in 2030',
    supervisorId: 'u-sup1',
    supervisorName: 'ศน.ดร.พรพิมล รัตนโกสินทร์',
    supervisorPosition: 'ศึกษานิเทศก์ชำนาญการพิเศษ',
    date: '2026-10-07',
    timeStart: '10:20',
    timeEnd: '11:10',
    scores: {
      'crit-1': 4,
      'crit-2': 5,
      'crit-3': 4,
      'crit-4': 5,
      'crit-5': 4,
      'crit-6': 4,
      'crit-7': 4,
      'crit-8': 4
    },
    totalScore: 34,
    percentage: 85,
    gradeTier: 'ดีมาก',
    tierColor: '#2563eb',
    strengths: 'บรรยากาศในห้องเรียนผ่อนคลายและกระตุ้นให้นักเรียนกล้าพูดภาษาอังกฤษ กิจกรรมบทบาทสมมติมีความสนุกสนาน เด็กๆ มีส่วนร่วมมากกว่า 90%',
    recommendations: 'ควรเพิ่มเกณฑ์การประเมินตนเอง (Self-Assessment Rubric) ให้นักเรียนได้ประเมินทักษะการออกเสียง (Pronunciation) ของเพื่อนร่วมชั้น',
    generalComment: 'ครูผู้สอนมีความตั้งใจสูง มีจิตวิทยาเชิงบวกในการเสริมสร้างความมั่นใจในการสื่อสารภาษาอังกฤษแก่นักเรียน',
    status: 'completed',
    supervisorSignature: 'ศน.ดร.พรพิมล รัตนโกสินทร์ (ยืนยันระบบดิจิทัล)',
    certificateNumber: 'CERT-EDUSUP-2026/0089',
    certificateIssuedAt: '2026-10-07T11:25:00.000Z',
    lineNotified: true,
    lineNotifiedAt: '2026-10-07T11:26:00.000Z',
    lastModified: '2026-10-07T11:25:00.000Z',
    lastModifiedBy: 'ศน.ดร.พรพิมล รัตนโกสินทร์',
    editHistory: [
      {
        timestamp: '2026-10-07T11:25:00.000Z',
        modifiedBy: 'ศน.ดร.พรพิมล รัตนโกสินทร์',
        changeSummary: 'บันทึกการประเมินผลและส่งการแจ้งเตือน LINE Notify'
      }
    ]
  },
  {
    id: 'rec-003',
    code: 'SUP-2026-003',
    teacherId: 'u-teach3',
    teacherName: 'ครูกิตติพงษ์ เจริญทรัพย์',
    school: 'โรงเรียนกัลยาณวัตรวิทยา',
    subjectGroup: 'กลุ่มสาระการเรียนรู้คณิตศาสตร์',
    subjectName: 'คณิตศาสตร์พื้นฐาน (ค31101)',
    gradeLevel: 'มัธยมศึกษาปีที่ 4',
    room: 'ม.4/1',
    teachingTopic: 'ฟังก์ชันตรีโกณมิติและการประยุกต์ใช้ในการวัดความสูงอาคาร',
    supervisorId: 'u-sup1',
    supervisorName: 'ศน.ดร.พรพิมล รัตนโกสินทร์',
    supervisorPosition: 'ศึกษานิเทศก์ชำนาญการพิเศษ',
    date: '2026-10-08',
    timeStart: '13:00',
    timeEnd: '13:50',
    scores: {
      'crit-1': 5,
      'crit-2': 5,
      'crit-3': 5,
      'crit-4': 4,
      'crit-5': 5,
      'crit-6': 4,
      'crit-7': 5,
      'crit-8': 4
    },
    totalScore: 37,
    percentage: 92.5,
    gradeTier: 'ยอดเยี่ยม',
    tierColor: '#16a34a',
    strengths: 'บูรณาการการนำเครื่องวัดมุมคลีโนมิเตอร์ (Clinometer) ให้นักเรียนลงไปวัดจริงรอบอาคารเรียน ทำให้คณิตศาสตร์มีชีวิตและจับต้องได้',
    recommendations: 'สามารถใช้ GeoGebra App ช่วยในการแสดงผลกราฟเพื่อเสริมมโนทัศน์ทางเรขาคณิตเพิ่มเติม',
    generalComment: 'เป็นคาบเรียนที่นักเรียนมีความกระตือรือร้นและเข้าใจการประยุกต์ใช้คณิตศาสตร์ในชีวิตประจำวันได้อย่างชัดเจน',
    status: 'acknowledged',
    supervisorSignature: 'ศน.ดร.พรพิมล รัตนโกสินทร์ (ยืนยันระบบดิจิทัล)',
    teacherSignature: 'ครูกิตติพงษ์ เจริญทรัพย์ (รับทราบผลการประเมิน)',
    teacherAcknowledgedAt: '2026-10-08T14:10:00.000Z',
    certificateNumber: 'CERT-EDUSUP-2026/0090',
    certificateIssuedAt: '2026-10-08T14:00:00.000Z',
    lineNotified: true,
    lineNotifiedAt: '2026-10-08T14:01:05.000Z',
    lastModified: '2026-10-08T14:10:00.000Z',
    lastModifiedBy: 'ครูกิตติพงษ์ เจริญทรัพย์',
    editHistory: [
      {
        timestamp: '2026-10-08T14:00:00.000Z',
        modifiedBy: 'ศน.ดร.พรพิมล รัตนโกสินทร์',
        changeSummary: 'สร้างบันทึกการนิเทศครั้งแรก'
      },
      {
        timestamp: '2026-10-08T14:10:00.000Z',
        modifiedBy: 'ครูกิตติพงษ์ เจริญทรัพย์',
        changeSummary: 'ยืนยันรับทราบและลงลายมือชื่อดิจิทัล'
      }
    ]
  }
];

export const INITIAL_BACKUPS: BackupRecord[] = [
  {
    id: 'bak-001',
    timestamp: '2026-10-08T03:00:00.000Z',
    type: 'auto_daily',
    recordCount: 3,
    sizeKb: 18.4,
    status: 'success',
    hash: 'sha256:d8f92a10b48c3e21'
  },
  {
    id: 'bak-002',
    timestamp: '2026-10-07T03:00:00.000Z',
    type: 'auto_daily',
    recordCount: 2,
    sizeKb: 12.1,
    status: 'success',
    hash: 'sha256:9c18bf23aa7e5501'
  },
  {
    id: 'bak-003',
    timestamp: '2026-10-06T03:00:00.000Z',
    type: 'auto_daily',
    recordCount: 1,
    sizeKb: 6.8,
    status: 'success',
    hash: 'sha256:55ab83cd029f6481'
  }
];
