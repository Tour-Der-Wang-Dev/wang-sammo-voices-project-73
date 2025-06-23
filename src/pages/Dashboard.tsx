import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BarChart3, Filter, MessageSquareWarning, CheckCircle, Clock, AlertCircle } from 'lucide-react';

type ComplaintStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
type ComplaintCategory = 'road' | 'water' | 'waste' | 'electricity' | 'public_safety' | 'environment' | 'other';

interface Complaint {
  id: string;
  complaint_id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  created_at: string;
  user_id: string;
  priority: number;
  admin_response: string;
  vote_count: number;
  phone: string;
}

const Dashboard = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<ComplaintCategory | 'all'>('all');
  const [adminResponse, setAdminResponse] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter, categoryFilter]);

  const fetchComplaints = async () => {
    try {
      let query = supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setComplaints(data || []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถโหลดข้อมูลเรื่องร้องเรียนได้',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateComplaintStatus = async (complaintId: string, newStatus: ComplaintStatus) => {
    try {
      const { error } = await supabase
        .from('complaints')
        .update({ 
          status: newStatus,
          admin_response: adminResponse || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', complaintId);

      if (error) throw error;

      toast({
        title: 'อัปเดตสำเร็จ',
        description: 'สถานะเรื่องร้องเรียนได้รับการอัปเดตแล้ว'
      });

      setSelectedComplaint(null);
      setAdminResponse('');
      fetchComplaints();
    } catch (error) {
      console.error('Error updating complaint:', error);
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถอัปเดตสถานะได้',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle size={12} className="mr-1" />แก้ไขแล้ว</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock size={12} className="mr-1" />กำลังดำเนินการ</Badge>;
      case 'open':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle size={12} className="mr-1" />รอดำเนินการ</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
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

  const stats = {
    total: complaints.length,
    open: complaints.filter(c => c.status === 'open').length,
    inProgress: complaints.filter(c => c.status === 'in_progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            แดชบอร์ดผู้ดูแลระบบ
          </h1>
          <p className="text-gray-600">จัดการเรื่องร้องเรียนของชุมชนวังสามหมอ</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">ทั้งหมด</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <MessageSquareWarning className="text-blue-500" size={24} />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">รอดำเนินการ</p>
                  <p className="text-2xl font-bold text-red-600">{stats.open}</p>
                </div>
                <AlertCircle className="text-red-500" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">กำลังดำเนินการ</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
                </div>
                <Clock className="text-yellow-500" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">แก้ไขแล้ว</p>
                  <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
                </div>
                <CheckCircle className="text-green-500" size={24} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter size={20} />
              <span>ตัวกรอง</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">สถานะ</label>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ComplaintStatus | 'all')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    <SelectItem value="open">รอดำเนินการ</SelectItem>
                    <SelectItem value="in_progress">กำลังดำเนินการ</SelectItem>
                    <SelectItem value="resolved">แก้ไขแล้ว</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">ประเภท</label>
                <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as ComplaintCategory | 'all')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    <SelectItem value="road">ถนน</SelectItem>
                    <SelectItem value="water">น้ำประปา</SelectItem>
                    <SelectItem value="waste">ขยะ</SelectItem>
                    <SelectItem value="electricity">ไฟฟ้า</SelectItem>
                    <SelectItem value="public_safety">ความปลอดภัย</SelectItem>
                    <SelectItem value="environment">สิ่งแวดล้อม</SelectItem>
                    <SelectItem value="other">อื่นๆ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Complaints Table */}
        <Card>
          <CardHeader>
            <CardTitle>รายการเรื่องร้องเรียน</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>รหัส</TableHead>
                    <TableHead>ประเภท</TableHead>
                    <TableHead>หัวข้อ</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead>วันที่</TableHead>
                    <TableHead>การดำเนินการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complaints.map((complaint) => (
                    <TableRow key={complaint.id}>
                      <TableCell className="font-mono">
                        {complaint.complaint_id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{getCategoryIcon(complaint.category)}</span>
                          <span className="capitalize">{complaint.category}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {complaint.title || complaint.description}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(complaint.status)}
                      </TableCell>
                      <TableCell>
                        {new Date(complaint.created_at).toLocaleDateString('th-TH')}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => setSelectedComplaint(complaint)}
                        >
                          จัดการ
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Complaint Detail Modal */}
        {selectedComplaint && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">
                  รายละเอียดเรื่องร้องเรียน: {selectedComplaint.complaint_id}
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">หัวข้อ</label>
                    <p className="mt-1">{selectedComplaint.title}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">รายละเอียด</label>
                    <p className="mt-1 text-gray-600">{selectedComplaint.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ประเภท</label>
                      <p className="mt-1">{getCategoryIcon(selectedComplaint.category)} {selectedComplaint.category}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">สถานะปัจจุบัน</label>
                      <div className="mt-1">{getStatusBadge(selectedComplaint.status)}</div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">การตอบกลับของผู้ดูแล</label>
                    <Textarea
                      value={adminResponse}
                      onChange={(e) => setAdminResponse(e.target.value)}
                      placeholder="เพิ่มการตอบกลับหรือหมายเหตุ..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">อัปเดตสถานะ</label>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateComplaintStatus(selectedComplaint.id, 'in_progress')}
                        className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                      >
                        กำลังดำเนินการ
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateComplaintStatus(selectedComplaint.id, 'resolved')}
                        className="border-green-300 text-green-700 hover:bg-green-50"
                      >
                        แก้ไขแล้ว
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedComplaint(null);
                      setAdminResponse('');
                    }}
                  >
                    ปิด
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
