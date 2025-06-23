
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Clock, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  totalComplaints: number;
  resolvedComplaints: number;
  avgResolutionTime: number;
  activeUsers: number;
  categoryBreakdown: Array<{name: string, value: number, color: string}>;
  timelineData: Array<{date: string, complaints: number, resolved: number}>;
  statusDistribution: Array<{status: string, count: number}>;
}

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalComplaints: 0,
    resolvedComplaints: 0,
    avgResolutionTime: 0,
    activeUsers: 0,
    categoryBreakdown: [],
    timelineData: [],
    statusDistribution: []
  });
  const [timeRange, setTimeRange] = useState('30'); // days
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const daysAgo = parseInt(timeRange);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      // Fetch complaints data
      const { data: complaints } = await supabase
        .from('complaints')
        .select('*')
        .gte('created_at', startDate.toISOString());

      if (complaints) {
        // Basic stats
        const totalComplaints = complaints.length;
        const resolvedComplaints = complaints.filter(c => c.status === 'resolved').length;
        
        // Calculate average resolution time
        const resolvedWithTime = complaints.filter(c => 
          c.status === 'resolved' && c.updated_at && c.created_at
        );
        const avgResolutionTime = resolvedWithTime.length > 0 
          ? resolvedWithTime.reduce((acc, complaint) => {
              const created = new Date(complaint.created_at);
              const resolved = new Date(complaint.updated_at);
              return acc + (resolved.getTime() - created.getTime());
            }, 0) / resolvedWithTime.length / (1000 * 60 * 60 * 24) // Convert to days
          : 0;

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

        const categoryBreakdown = Object.entries(categoryCount).map(([category, count]) => ({
          name: category,
          value: count,
          color: categoryColors[category] || '#6b7280'
        }));

        // Timeline data (last 7 days)
        const timelineData = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          
          const dayComplaints = complaints.filter(c => 
            c.created_at.startsWith(dateStr)
          ).length;
          
          const dayResolved = complaints.filter(c => 
            c.updated_at && c.updated_at.startsWith(dateStr) && c.status === 'resolved'
          ).length;

          timelineData.push({
            date: date.toLocaleDateString('th-TH', { month: 'short', day: 'numeric' }),
            complaints: dayComplaints,
            resolved: dayResolved
          });
        }

        // Status distribution
        const statusCount = complaints.reduce((acc, complaint) => {
          acc[complaint.status] = (acc[complaint.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const statusDistribution = Object.entries(statusCount).map(([status, count]) => ({
          status,
          count
        }));

        // Get unique users count
        const uniqueUsers = new Set(complaints.map(c => c.user_id).filter(Boolean)).size;

        setAnalytics({
          totalComplaints,
          resolvedComplaints,
          avgResolutionTime: Math.round(avgResolutionTime * 10) / 10,
          activeUsers: uniqueUsers,
          categoryBreakdown,
          timelineData,
          statusDistribution
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const resolutionRate = analytics.totalComplaints > 0 
    ? Math.round((analytics.resolvedComplaints / analytics.totalComplaints) * 100) 
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">การวิเคราะห์และสถิติ</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 วันที่แล้ว</SelectItem>
            <SelectItem value="30">30 วันที่แล้ว</SelectItem>
            <SelectItem value="90">90 วันที่แล้ว</SelectItem>
            <SelectItem value="365">1 ปีที่แล้ว</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">เรื่องร้องเรียนทั้งหมด</p>
                <p className="text-2xl font-bold">{analytics.totalComplaints}</p>
              </div>
              <AlertTriangle className="text-blue-500" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">อัตราการแก้ไข</p>
                <p className="text-2xl font-bold text-green-600">{resolutionRate}%</p>
              </div>
              <CheckCircle className="text-green-500" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">เวลาแก้ไขเฉลี่ย</p>
                <p className="text-2xl font-bold">{analytics.avgResolutionTime}</p>
                <p className="text-xs text-gray-500">วัน</p>
              </div>
              <Clock className="text-yellow-500" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ผู้ใช้งานที่ลงทะเบียน</p>
                <p className="text-2xl font-bold">{analytics.activeUsers}</p>
              </div>
              <Users className="text-purple-500" size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="text-orange-500" />
            <span>แนวโน้มเรื่องร้องเรียน (7 วันที่แล้ว)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="complaints" stroke="#f97316" name="เรื่องร้องเรียนใหม่" />
              <Line type="monotone" dataKey="resolved" stroke="#22c55e" name="เรื่องที่แก้ไขแล้ว" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category and Status Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>การแจกแจงตามประเภท</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>สถานะเรื่องร้องเรียน</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.statusDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
