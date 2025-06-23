
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Search, CheckCircle, Clock, AlertCircle, MessageSquareWarning } from 'lucide-react';

interface Complaint {
  id: string;
  complaint_id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  created_at: string;
  updated_at: string;
  admin_response: string;
  priority: number;
}

const Track = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchComplaint = async () => {
    if (!searchTerm.trim()) {
      setError('กรุณากรอกรหัสเรื่องร้องเรียน');
      return;
    }

    setLoading(true);
    setError('');
    setComplaint(null);

    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('complaint_id', searchTerm.trim())
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setError('ไม่พบเรื่องร้องเรียนที่มีรหัสนี้');
        return;
      }

      setComplaint(data);
    } catch (error) {
      console.error('Error searching complaint:', error);
      setError('เกิดข้อผิดพลาดในการค้นหา กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'resolved':
        return {
          badge: <Badge className="bg-green-100 text-green-800"><CheckCircle size={12} className="mr-1" />แก้ไขแล้ว</Badge>,
          message: 'เรื่องร้องเรียนของท่านได้รับการแก้ไขเรียบร้อยแล้ว',
          color: 'text-green-600'
        };
      case 'in_progress':
        return {
          badge: <Badge className="bg-yellow-100 text-yellow-800"><Clock size={12} className="mr-1" />กำลังดำเนินการ</Badge>,
          message: 'เรื่องร้องเรียนของท่านอยู่ระหว่างการดำเนินการ',
          color: 'text-yellow-600'
        };
      case 'open':
        return {
          badge: <Badge className="bg-red-100 text-red-800"><AlertCircle size={12} className="mr-1" />รอดำเนินการ</Badge>,
          message: 'เรื่องร้องเรียนของท่านได้รับการบันทึกแล้ว รอการดำเนินการ',
          color: 'text-red-600'
        };
      default:
        return {
          badge: <Badge variant="secondary">{status}</Badge>,
          message: 'สถานะไม่ทราบ',
          color: 'text-gray-600'
        };
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      road: '🛣️',
      water: '💧',
      waste: '🗑️',
      electricity: '⚡',
      public_safety: '🚨',
      environment: '🌱',
      other: '📝'
    };
    return icons[category] || '📝';
  };

  const getCategoryName = (category: string) => {
    const names = {
      road: 'ปัญหาถนน',
      water: 'ปัญหาน้ำประปา',
      waste: 'ปัญหาขยะ',
      electricity: 'ปัญหาไฟฟ้า',
      public_safety: 'ปัญหาความปลอดภัย',
      environment: 'ปัญหาสิ่งแวดล้อม',
      other: 'ปัญหาอื่นๆ'
    };
    return names[category] || category;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ติดตามเรื่องร้องเรียน
          </h1>
          <p className="text-gray-600">
            ตรวจสอบสถานะเรื่องร้องเรียนของท่านด้วยรหัสเรื่องร้องเรียน
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search size={20} />
              <span>ค้นหาเรื่องร้องเรียน</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="กรอกรหัสเรื่องร้องเรียน (เช่น WS1234567890123)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-lg"
                  onKeyPress={(e) => e.key === 'Enter' && searchComplaint()}
                />
                {error && (
                  <p className="text-red-500 text-sm mt-2">{error}</p>
                )}
              </div>
              <Button
                onClick={searchComplaint}
                disabled={loading}
                className="bg-orange-500 hover:bg-orange-600"
                size="lg"
              >
                {loading ? 'กำลังค้นหา...' : 'ค้นหา'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Complaint Details */}
        {complaint && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <MessageSquareWarning size={20} />
                  <span>รายละเอียดเรื่องร้องเรียน</span>
                </span>
                <span className="text-sm font-mono text-gray-500">
                  {complaint.complaint_id}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status */}
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="mb-4">
                  {getStatusInfo(complaint.status).badge}
                </div>
                <p className={`text-lg font-medium ${getStatusInfo(complaint.status).color}`}>
                  {getStatusInfo(complaint.status).message}
                </p>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ประเภทปัญหา
                    </label>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getCategoryIcon(complaint.category)}</span>
                      <span className="text-gray-900">{getCategoryName(complaint.category)}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      วันที่แจ้ง
                    </label>
                    <p className="text-gray-900">
                      {new Date(complaint.created_at).toLocaleDateString('th-TH', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  {complaint.updated_at !== complaint.created_at && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        อัปเดตล่าสุด
                      </label>
                      <p className="text-gray-900">
                        {new Date(complaint.updated_at).toLocaleDateString('th-TH', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      หัวข้อ
                    </label>
                    <p className="text-gray-900">{complaint.title}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      รายละเอียด
                    </label>
                    <p className="text-gray-700 leading-relaxed">
                      {complaint.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Admin Response */}
              {complaint.admin_response && (
                <div className="border-t pt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    การตอบกลับจากเจ้าหน้าที่
                  </label>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-gray-700">{complaint.admin_response}</p>
                  </div>
                </div>
              )}

              {/* Priority Badge */}
              {complaint.priority && complaint.priority > 1 && (
                <div className="flex justify-center">
                  <Badge variant="outline" className="border-orange-300 text-orange-700">
                    ความสำคัญ: {complaint.priority === 2 ? 'ปานกลาง' : complaint.priority === 3 ? 'สูง' : 'สูงมาก'}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>วิธีการใช้งาน</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-gray-600">
              <p>1. กรอกรหัสเรื่องร้องเรียนที่ท่านได้รับเมื่อแจ้งเรื่องร้องเรียน</p>
              <p>2. คลิกปุ่ม "ค้นหา" เพื่อตรวจสอบสถานะ</p>
              <p>3. ระบบจะแสดงรายละเอียดและสถานะปัจจุบันของเรื่องร้องเรียน</p>
              <p className="text-sm text-gray-500 mt-4">
                หมายเหตุ: หากท่านไม่พบรหัสเรื่องร้องเรียน กรุณาติดต่อเจ้าหน้าที่ของชุมชน
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Track;
