
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'th' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  th: {
    // Navigation
    'nav.home': 'หน้าหลัก',
    'nav.report': 'แจ้งปัญหา',
    'nav.status': 'ติดตามสถานะ',
    'nav.dashboard': 'แดชบอร์ด',
    'nav.profile': 'โปรไฟล์',
    
    // Home Page
    'home.title': 'ระบบแจ้งปัญหาชุมชนวังสามหมอ',
    'home.subtitle': 'แจ้งปัญหาในชุมชนของคุณ เพื่อให้เจ้าหน้าที่รับทราบและดำเนินการแก้ไข',
    'home.reportButton': 'แจ้งปัญหาใหม่',
    'home.trackButton': 'ติดตามสถานะ',
    'home.stats.totalComplaints': 'ปัญหาทั้งหมด',
    'home.stats.resolved': 'แก้ไขแล้ว',
    'home.stats.inProgress': 'กำลังดำเนินการ',
    'home.stats.points': 'คะแนนของคุณ',
    
    // Categories
    'category.road': 'ถนน/การจราจร',
    'category.water': 'น้ำประปา',
    'category.waste': 'ขยะ/สิ่งแวดล้อม',
    'category.electricity': 'ไฟฟ้า',
    'category.public_safety': 'ความปลอดภัย',
    'category.environment': 'สิ่งแวดล้อม',
    'category.other': 'อื่นๆ',
    
    // Status
    'status.open': 'รอดำเนินการ',
    'status.in_progress': 'กำลังดำเนินการ',
    'status.resolved': 'แก้ไขเสร็จสิ้น',
    'status.closed': 'ปิดเรื่อง',
    
    // Forms
    'form.title': 'หัวข้อปัญหา',
    'form.description': 'รายละเอียดปัญหา',
    'form.category': 'ประเภทปัญหา',
    'form.location': 'สถานที่',
    'form.phone': 'หมายเลขโทรศัพท์',
    'form.anonymous': 'แจ้งแบบไม่ระบุชื่อ',
    'form.addPhoto': 'เพิ่มรูปภาพ',
    'form.addVoice': 'บันทึกเสียง',
    'form.submit': 'ส่งรายงาน',
    'form.required': 'จำเป็น',
    
    // Buttons
    'button.submit': 'ส่ง',
    'button.cancel': 'ยกเลิก',
    'button.save': 'บันทึก',
    'button.edit': 'แก้ไข',
    'button.delete': 'ลบ',
    'button.vote': 'โหวต',
    'button.unvote': 'ยกเลิกโหวต',
    
    // Messages
    'message.success': 'สำเร็จ',
    'message.error': 'เกิดข้อผิดพลาด',
    'message.loading': 'กำลังโหลด...',
    'message.noData': 'ไม่มีข้อมูล',
    'message.complaintSubmitted': 'แจ้งปัญหาเรียบร้อยแล้ว',
    'message.pointsEarned': 'คุณได้รับ {points} คะแนน!',
    
    // QR Code
    'qr.title': 'สแกน QR Code เพื่อแจ้งปัญหา',
    'qr.subtitle': 'สแกนด้วยแอพกล้องบนมือถือของคุณ',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.report': 'Report Issue',
    'nav.status': 'Track Status',
    'nav.dashboard': 'Dashboard',
    'nav.profile': 'Profile',
    
    // Home Page
    'home.title': 'Wang Sammo Community Reporting System',
    'home.subtitle': 'Report community issues for officials to acknowledge and resolve',
    'home.reportButton': 'Report New Issue',
    'home.trackButton': 'Track Status',
    'home.stats.totalComplaints': 'Total Issues',
    'home.stats.resolved': 'Resolved',
    'home.stats.inProgress': 'In Progress',
    'home.stats.points': 'Your Points',
    
    // Categories
    'category.road': 'Roads/Traffic',
    'category.water': 'Water Supply',
    'category.waste': 'Waste/Environment',
    'category.electricity': 'Electricity',
    'category.public_safety': 'Public Safety',
    'category.environment': 'Environment',
    'category.other': 'Other',
    
    // Status
    'status.open': 'Open',
    'status.in_progress': 'In Progress',
    'status.resolved': 'Resolved',
    'status.closed': 'Closed',
    
    // Forms
    'form.title': 'Issue Title',
    'form.description': 'Issue Description',
    'form.category': 'Issue Category',
    'form.location': 'Location',
    'form.phone': 'Phone Number',
    'form.anonymous': 'Report Anonymously',
    'form.addPhoto': 'Add Photo',
    'form.addVoice': 'Record Voice',
    'form.submit': 'Submit Report',
    'form.required': 'Required',
    
    // Buttons
    'button.submit': 'Submit',
    'button.cancel': 'Cancel',
    'button.save': 'Save',
    'button.edit': 'Edit',
    'button.delete': 'Delete',
    'button.vote': 'Vote',
    'button.unvote': 'Unvote',
    
    // Messages
    'message.success': 'Success',
    'message.error': 'Error occurred',
    'message.loading': 'Loading...',
    'message.noData': 'No data',
    'message.complaintSubmitted': 'Issue reported successfully',
    'message.pointsEarned': 'You earned {points} points!',
    
    // QR Code
    'qr.title': 'Scan QR Code to Report Issue',
    'qr.subtitle': 'Scan with your phone camera app',
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('th');

  const t = (key: string, params?: Record<string, string | number>) => {
    let translation = translations[language][key] || key;
    
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{${param}}`, String(value));
      });
    }
    
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
