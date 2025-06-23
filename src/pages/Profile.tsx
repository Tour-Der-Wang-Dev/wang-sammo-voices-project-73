
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, Award, LogOut, MessageSquareWarning, CheckCircle } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone_number: string;
  points: number;
  role: string;
  created_at: string;
}

interface UserStats {
  totalComplaints: number;
  resolvedComplaints: number;
  pendingComplaints: number;
}

const Profile = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats>({ totalComplaints: 0, resolvedComplaints: 0, pendingComplaints: 0 });
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }

      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      // If no profile exists, create one
      if (!profileData) {
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert({
            id: session.user.id,
            full_name: session.user.user_metadata?.full_name || '',
            phone_number: session.user.user_metadata?.phone || '',
            points: 0,
            role: 'resident'
          })
          .select()
          .single();

        if (createError) throw createError;
        setProfile({
          ...newProfile,
          email: session.user.email || ''
        });
      } else {
        setProfile({
          ...profileData,
          email: session.user.email || ''
        });
      }

      // Set form values
      setFullName(profileData?.full_name || session.user.user_metadata?.full_name || '');
      setPhoneNumber(profileData?.phone_number || session.user.user_metadata?.phone || '');

      // Get user complaint statistics
      const { data: complaintsData, error: complaintsError } = await supabase
        .from('complaints')
        .select('status')
        .eq('user_id', session.user.id);

      if (complaintsError) throw complaintsError;

      const totalComplaints = complaintsData?.length || 0;
      const resolvedComplaints = complaintsData?.filter(c => c.status === 'resolved').length || 0;
      const pendingComplaints = complaintsData?.filter(c => c.status !== 'resolved').length || 0;

      setStats({ totalComplaints, resolvedComplaints, pendingComplaints });

    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถโหลดข้อมูลโปรไฟล์ได้',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: fullName,
          phone_number: phoneNumber,
          updated_at: new Date().toISOString()
        })
        .eq('id', session.user.id);

      if (error) throw error;

      toast({
        title: 'อัปเดตสำเร็จ',
        description: 'ข้อมูลโปรไฟล์ได้รับการอัปเดตแล้ว'
      });

      // Refresh profile data
      checkUser();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถอัปเดตข้อมูลได้',
        variant: 'destructive'
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: 'ออกจากระบบสำเร็จ',
        description: 'ขอบคุณที่ใช้บริการ'
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถออกจากระบบได้',
        variant: 'destructive'
      });
    }
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p>ไม่พบข้อมูลโปรไฟล์</p>
          <Button onClick={() => navigate('/auth')} className="mt-4">
            เข้าสู่ระบบ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 pt-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            โปรไฟล์ของฉน
          </h1>
          <p className="text-gray-600">จัดการข้อมูลส่วนตัวและดูสถิติการใช้งาน</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User size={20} />
                  <span>ข้อมูลส่วนตัว</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={updateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">อีเมล</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        disabled
                        className="pl-10 bg-gray-50"
                      />
                    </div>
                    <p className="text-xs text-gray-500">อีเมลไม่สามารถเปลี่ยนแปลงได้</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullName">ชื่อ-นามสกุล</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="กรอกชื่อ-นามสกุล"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">เบอร์โทรศัพท์</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phoneNumber"
                        type="tel"
                        placeholder="กรอกเบอร์โทรศัพท์"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="capitalize">
                        {profile.role === 'admin' ? 'ผู้ดูแลระบบ' : 'ประชาชน'}
                      </Badge>
                      <Badge variant="outline">
                        <Award size={12} className="mr-1" />
                        {profile.points} คะแนน
                      </Badge>
                    </div>
                    
                    <Button type="submit" disabled={updating}>
                      {updating ? 'กำลังอัปเดต...' : 'อัปเดตข้อมูล'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Stats & Actions */}
          <div className="space-y-6">
            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>สถิติการใช้งาน</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquareWarning size={16} className="text-blue-500" />
                    <span className="text-sm">เรื่องร้องเรียนทั้งหมด</span>
                  </div>
                  <span className="font-bold">{stats.totalComplaints}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-sm">แก้ไขแล้ว</span>
                  </div>
                  <span className="font-bold text-green-600">{stats.resolvedComplaints}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquareWarning size={16} className="text-orange-500" />
                    <span className="text-sm">รอดำเนินการ</span>
                  </div>
                  <span className="font-bold text-orange-600">{stats.pendingComplaints}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>การดำเนินการ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => navigate('/report')}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  <MessageSquareWarning size={16} className="mr-2" />
                  แจ้งเรื่องร้องเรียนใหม่
                </Button>

                <Button
                  onClick={() => navigate('/track')}
                  variant="outline"
                  className="w-full"
                >
                  ติดตามเรื่องร้องเรียน
                </Button>

                {profile.role === 'admin' && (
                  <Button
                    onClick={() => navigate('/dashboard')}
                    variant="outline"
                    className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    แดชบอร์ดผู้ดูแล
                  </Button>
                )}

                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="w-full border-red-300 text-red-700 hover:bg-red-50"
                >
                  <LogOut size={16} className="mr-2" />
                  ออกจากระบบ
                </Button>
              </CardContent>
            </Card>

            {/* Member Info */}
            <Card>
              <CardHeader>
                <CardTitle>ข้อมูลสมาชิก</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                <p>สมาชิกตั้งแต่: {new Date(profile.created_at).toLocaleDateString('th-TH')}</p>
                <p className="mt-2">
                  ขอบคุณที่เป็นส่วนหนึ่งในการพัฒนาชุมชนวังสามหมอ
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
