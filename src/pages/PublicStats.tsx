
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MapPin, TrendingUp, CheckCircle, Clock, Users, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PublicStats {
  totalComplaints: number;
  resolvedComplaints: number;
  resolutionRate: number;
  categories: Array<{name: string, value: number, color: string}>;
  recentActivity: Array<{date: string, count: number}>;
}

const PublicStats = () => {
  const [stats, setStats] = useState<PublicStats>({
    totalComplaints: 0,
    resolvedComplaints: 0,
    resolutionRate: 0,
    categories: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicStats();
  }, []);

  const fetchPublicStats = async () => {
    try {
      // Fetch all complaints (no sensitive data)
      const { data: complaints } = await supabase
        .from('complaints')
        .select('category, status, created_at')
        .order('created_at', { ascending: false });

      if (complaints) {
        const totalComplaints = complaints.length;
        const resolvedComplaints = complaints.filter(c => c.status === 'resolved').length;
        const resolutionRate = totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0;

        // Category breakdown
        const categoryCount = complaints.reduce((acc, complaint) => {
          acc[complaint.category] = (acc[complaint.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const categoryColors = {
          road: '#ef4444',
          water: '#3b82f6',
          waste: '#22c55e',
          electricity: '#eab308',
          public_safety: '#dc2626',
          environment: '#16a34a',
          other: '#6b7280'
        };

        const categoryLabels = {
          road: 'ถนน',
          water: 'น้ำประปา',
          waste: 'ขยะ',
          electricity: 'ไฟฟ้า',
          public_safety: 'ความปลอดภัย',
          environment: 'สิ่งแวดล้อม',
          other: 'อื่นๆ'
        };

        const categories = Object.entries(categoryCount).map(([category, count]) => ({
          name: categoryLabels[category] || category,
          value: count,
          color: categoryColors[category] || '#6b7280'
        }));

        // Recent activity (last 7 days)
        const recentActivity = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          
          const dayCount = complaints.filter(c => 
            c.created_at.startsWith(dateStr)
          ).length;

          recentActivity.push({
            date: date.toLocaleDateString('th-TH', { month: 'short', day: 'numeric' }),
            count: dayCount
          });
        }

        setStats({
          totalComplaints,
          resolvedComplaints,
          resolutionRate,
          categories,
          recentActivity
        });
      }
    } catch (error) {
      console.error('Error fetching public stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-8 px-4 pb-24 md:pb-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            สถิติการรายงานปัญหาชุมชนวังสามหมอ
          </h1>
          <p className="text-gray-600">
            ข้อมูลสาธารณะการดำเนินงานระบบรายงานปัญหาของชุมชน
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">เรื่องร้องเรียนทั้งหมด</p>
                  <p className="text-2xl font-bold">{stats.totalComplaints}</p>
                </div>
                <AlertTriangle className="text-blue-500" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">แก้ไขแล้ว</p>
                  <p className="text-2xl font-bold text-green-600">{stats.resolvedComplaints}</p>
                </div>
                <CheckCircle className="text-green-500" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">อัตราความสำเร็จ</p>
                  <p className="text-2xl font-bold text-green-600">{stats.resolutionRate}%</p>
                </div>
                <TrendingUp className="text-green-500" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">กำลังดำเนินการ</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats.totalComplaints - stats.resolvedComplaints}
                  </p>
                </div>
                <Clock className="text-yellow-500" size={24} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>การแจกแจงตามประเภทปัญหา</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.categories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>กิจกรรมการรายงาน (7 วันที่แล้ว)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.recentActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="text-orange-500" />
                <span>เกี่ยวกับระบบ</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <p>ระบบรายงานปัญหาชุมชนวังสามหมอ เป็นแพลตฟอร์มที่ให้ชาวบ้านสามารถรายงานปัญหาต่างๆ ในชุมชนได้อย่างสะดวกและรวดเร็ว</p>
                <p>ข้อมูลที่แสดงในหน้านี้เป็นสถิติสาธารณะที่ไม่เปิดเผยข้อมูลส่วนบุคคลของผู้ใช้งาน</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="text-orange-500" />
                <span>วิธีการมีส่วนร่วม</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• สแกน QR Code หรือเข้าเว็บไซต์เพื่อรายงานปัญหา</p>
                <p>• ติดตามความคืบหน้าการแก้ไขปัญหา</p>
                <p>• ให้คะแนนและความคิดเห็นเพื่อปรับปรุงบริการ</p>
                <p>• ร่วมเป็นอาสาสมัครในการแก้ไขปัญหาชุมชน</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PublicStats;
