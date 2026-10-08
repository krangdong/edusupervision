import { DiscussionChannel, DiscussionMessage } from '../types';

export const INITIAL_CHANNELS: DiscussionChannel[] = [
  {
    id: 'general-plc',
    name: 'ชุมชนแห่งการเรียนรู้ทางวิชาชีพ (PLC กลาง)',
    description: 'พื้นที่กลางสำหรับผู้บริหาร ศึกษานิเทศก์ และครูผู้สอน แลกเปลี่ยนนโยบายและแนวทางการจัดการเรียนรู้',
    category: 'plc',
    icon: 'MessageSquare'
  },
  {
    id: 'active-learning',
    name: 'คลินิก Active Learning & EdTech',
    description: 'แลกเปลี่ยนเทคนิคการจัดกิจกรรมเชิงรุก การใช้แพลตฟอร์ม Canva, Padlet, GeoGebra และสื่อดิจิทัล',
    category: 'plc',
    icon: 'Sparkles'
  },
  {
    id: 'rec-001',
    name: 'เสวนาผลการนิเทศ: ว21103 วิทยาการคำนวณ (SUP-2026-001)',
    description: 'ช่องทางการสื่อสารสองทางระหว่างผู้นิเทศและครูธีรภัทร ชาญวิทย์ สำหรับคาบเรียนการออกแบบอัลกอริทึม',
    category: 'supervision',
    icon: 'CheckCircle'
  },
  {
    id: 'rec-002',
    name: 'เสวนาผลการนิเทศ: อ22101 ภาษาอังกฤษ (SUP-2026-002)',
    description: 'ช่องทางการสื่อสารสองทางระหว่างผู้นิเทศและครูปรียานุช รัตนศิริ เรื่อง Role-Play Interview',
    category: 'supervision',
    icon: 'CheckCircle'
  },
  {
    id: 'assessment-rubric',
    name: 'การวัดและประเมินผลตามสภาพจริง (Rubrics)',
    description: 'ปรึกษาการออกแบบเครื่องมือวัดผล Formative Assessment และเกณฑ์การประเมินสมรรถนะผู้เรียน',
    category: 'plc',
    icon: 'BookOpen'
  }
];

export const INITIAL_MESSAGES: DiscussionMessage[] = [
  {
    id: 'msg-001',
    channelId: 'rec-001',
    recordId: 'rec-001',
    recordCode: 'SUP-2026-001',
    authorId: 'u-sup1',
    authorName: 'ศน.ดร.พรพิมล รัตนโกสินทร์',
    authorRole: 'supervisor',
    authorRoleTitle: 'ศึกษานิเทศก์ชำนาญการพิเศษ',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    content: 'ขอชื่นชมครูธีรภัทรมากค่ะ การจัดกิจกรรมให้นักเรียนแบ่งกลุ่ม Pair Programming บน Scratch ทำให้นักเรียนสนุกและมีสมาธิสูงมาก สำหรับตัวชี้วัดที่ 5 เรื่องการประเมินผล หากในคาบหน้ามีการให้นักเรียนทำ Peer-Review ตรวจโค้ดของเพื่อนร่วมกลุ่มด้วยใบรูบริกส์สั้นๆ จะช่วยยกระดับทักษะการสะท้อนคิด (Metacognition) ได้ดียิ่งขึ้นไปอีกค่ะ',
    tags: ['Active Learning', 'Scratch Coding', 'Peer Review'],
    attachments: [
      {
        name: 'ตัวอย่าง_Peer_Review_Rubric_Coding.pdf',
        size: '1.2 MB',
        type: 'document'
      }
    ],
    reactions: {
      '👍': ['u-teach1', 'u-exec'],
      '❤️': ['u-teach1'],
      '💡': ['u-teach2']
    },
    replies: [
      {
        id: 'rep-001',
        authorId: 'u-teach1',
        authorName: 'ครูธีรภัทร ชาญวิทย์',
        authorRole: 'teacher',
        authorRoleTitle: 'ครู คศ.2 (ผู้รับการนิเทศ)',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        content: 'กราบขอบพระคุณท่าน ศน.ดร.พรพิมล มากครับสำหรับคำแนะนำที่ตรงจุดมาก ผมจะนำแบบประเมิน Peer-Review ไปปรับใช้ในแผนการจัดการเรียนรู้คาบถัดไปเรื่อง Debugging ทันทีครับ และได้แนบแผนการสอนฉบับปรับปรุงไว้ในระบบเรียบร้อยแล้วครับ',
        timestamp: '2026-10-06T11:15:00.000Z'
      },
      {
        id: 'rep-002',
        authorId: 'u-exec',
        authorName: 'ดร.วิเชียร สมใจนึก',
        authorRole: 'executive',
        authorRoleTitle: 'ผู้อำนวยการโรงเรียน',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        content: 'ทางผู้บริหารขอร่วมเป็นกำลังใจให้ครูธีรภัทรและกลุ่มสาระฯ วิทยาศาสตร์ครับ ถือเป็น Best Practice ที่ยอดเยี่ยมของโรงเรียนเรา สามารถนำโมเดลนี้ไปขยายผลในวง PLC สัปดาห์หน้าได้เลยครับ',
        timestamp: '2026-10-06T12:00:00.000Z'
      }
    ],
    timestamp: '2026-10-06T10:45:00.000Z',
    isPinned: true
  },
  {
    id: 'msg-002',
    channelId: 'general-plc',
    authorId: 'u-exec',
    authorName: 'ดร.วิเชียร สมใจนึก',
    authorRole: 'executive',
    authorRoleTitle: 'ผู้อำนวยการโรงเรียน',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    content: 'เรียนคุณครูทุกท่านครับ ในภาคเรียนนี้ทางฝ่ายวิชาการได้ประสานกับกลุ่มนิเทศ สพม. เพื่อขับเคลื่อนกระบวนการนิเทศแบบกัลยาณมิตร ขอเชิญชวนคุณครูทุกกลุ่มสาระฯ นำผลการประเมินและข้อเสนอแนะจากผู้นิเทศมาแลกเปลี่ยนในกระดานนี้ได้อย่างอิสระ หากต้องการการสนับสนุนสื่อ เทคโนโลยี หรืองบประมาณในการจัด Active Learning ขอให้แจ้งผ่านช่องทางนี้ได้โดยตรงครับ',
    tags: ['นโยบายสถานศึกษา', 'นิเทศกัลยาณมิตร', 'Active Learning'],
    reactions: {
      '👏': ['u-teach1', 'u-teach2', 'u-teach3', 'u-sup1'],
      '❤️': ['u-teach1', 'u-sup1']
    },
    replies: [
      {
        id: 'rep-003',
        authorId: 'u-teach2',
        authorName: 'ครูปรียานุช รัตนศิริ',
        authorRole: 'teacher',
        authorRoleTitle: 'ครูผู้สอนภาษาต่างประเทศ',
        authorAvatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&auto=format&fit=crop&q=80',
        content: 'ขอบพระคุณท่าน ผอ. มากค่ะ กำลังวางแผนจะจัดกิจกรรม Role-play ภาษาอังกฤษร่วมกับแอปพลิเคชัน AI สื่อสาร ขอปรึกษาเรื่องชุดไมค์ไร้สายขนาดเล็กสำหรับห้องเรียนเพื่อให้นักเรียนอัดคลิปเสียงได้ชัดเจนยิ่งขึ้นค่ะ',
        timestamp: '2026-10-07T08:30:00.000Z'
      }
    ],
    timestamp: '2026-10-05T09:00:00.000Z',
    isPinned: true
  },
  {
    id: 'msg-003',
    channelId: 'active-learning',
    authorId: 'u-teach3',
    authorName: 'ครูกิตติพงษ์ เจริญทรัพย์',
    authorRole: 'teacher',
    authorRoleTitle: 'ครูกลุ่มสาระการเรียนรู้คณิตศาสตร์',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    content: 'วันนี้ได้ทดลองนำเครื่องมือ Clinometer ร่วมกับแอปพลิเคชัน Measure บนสมาร์ตโฟนให้นักเรียน ม.4 ลงไปวัดความสูงของเสาธงและอาคารเรียน เด็กๆ ตื่นเต้นมากครับ ได้เห็นการประยุกต์ใช้ตรีโกณมิติจริงๆ มีภาพบรรยากาศการจัดกิจกรรมมาแบ่งปันครับ',
    tags: ['คณิตศาสตร์เชิงรุก', 'Outdoor Learning', 'ตรีโกณมิติ'],
    attachments: [
      {
        name: 'ภาพบรรยากาศกิจกรรม_Clinometer_Outdoor.jpg',
        size: '2.4 MB',
        type: 'image'
      }
    ],
    reactions: {
      '💡': ['u-sup1', 'u-teach1'],
      '👍': ['u-exec', 'u-teach2']
    },
    replies: [],
    timestamp: '2026-10-08T14:30:00.000Z'
  }
];
