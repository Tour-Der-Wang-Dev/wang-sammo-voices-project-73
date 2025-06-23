
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquareWarning, BarChart3, Award, Users, CheckCircle, Clock, AlertCircle, QrCode, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

interface Stats {
  totalComplaints: number;
  resolved: number;
  inProgress: number;
  userPoints: number;
}

const Home = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState<Stats>({
    totalComplaints: 0,
    resolved: 0,
    inProgress: 0,
    userPoints: 0
  });
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get complaint statistics
      const { data: complaints } = await supabase
        .from('complaints')
        .select('status, created_at');

      if (complaints) {
        const total = complaints.length;
        const resolved = complaints.filter(c => c.status === 'resolved').length;
        const inProgress = complaints.filter(c => c.status === 'in_progress').length;

        setStats(prev => ({
          ...prev,
          totalComplaints: total,
          resolved,
          inProgress
        }));
      }

      // Get user points if authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('points')
          .eq('id', user.id)
          .single();

        if (profile) {
          setStats(prev => ({
            ...prev,
            userPoints: profile.points || 0
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.origin + '/report')}`;

  const statCards = [
    {
      title: t('home.stats.totalComplaints'),
      value: stats.totalComplaints,
      icon: MessageSquareWarning,
      color: 'bg-blue-500'
    },
    {
      title: t('home.stats.resolved'),
      value: stats.resolved,
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      title: t('home.stats.inProgress'),
      value: stats.inProgress,
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      title: t('home.stats.points'),
      value: stats.userPoints,
      icon: Award,
      color: 'bg-purple-500'
    }
  ];

  const categoryCards = [
    { key: 'road', icon: '🛣️', color: 'bg-red-100 border-red-200' },
    { key: 'water', icon: '💧', color: 'bg-blue-100 border-blue-200' },
    { key: 'waste', icon: '🗑️', color: 'bg-green-100 border-green-200' },
    { key: 'electricity', icon: '⚡', color: 'bg-yellow-100 border-yellow-200' },
    { key: 'public_safety', icon: '🚨', color: 'bg-red-100 border-red-200' },
    { key: 'environment', icon: '🌱', color: 'bg-green-100 border-green-200' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 pb-20 md:pb-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {t('home.title')}
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-3xl mx-auto">
            {t('home.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/report">
              <Button
                size="lg"
                className="bg-white text-orange-500 hover:bg-orange-50 font-semibold px-8 py-3"
              >
                <MessageSquareWarning className="mr-2" size={20} />
                {t('home.reportButton')}
              </Button>
            </Link>
            
            <Button
              size="lg"
              variant="outline"
              onClick={() => setShowQR(!showQR)}
              className="border-white text-white hover:bg-white hover:text-orange-500 font-semibold px-8 py-3"
            >
              <QrCode className="mr-2" size={20} />
              QR Code
            </Button>

            <Link to="/stats">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-orange-500 font-semibold px-8 py-3"
              >
                <TrendingUp className="mr-2" size={20} />
                สถิติชุมชน
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* QR Code Section */}
      {showQR && (
        <div className="max-w-2xl mx-auto mt-8 px-4">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center space-x-2">
                <QrCode className="text-orange-500" />
                <span>{t('qr.title')}</span>
              </CardTitle>
              <p className="text-gray-600">{t('qr.subtitle')}</p>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-4">
                <img
                  src={qrCodeUrl}
                  alt="QR Code for reporting"
                  className="border-2 border-orange-200 rounded-lg"
                />
              </div>
              <p className="text-sm text-gray-500">
                {window.location.origin}/report
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card key={index} className="relative overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {card.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {card.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${card.color}`}>
                      <Icon className="text-white" size={20} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Category Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            ประเภทปัญหาในชุมชน
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categoryCards.map((category) => (
              <Link key={category.key} to={`/report?category=${category.key}`}>
                <Card className={`hover:shadow-lg transition-all duration-200 cursor-pointer ${category.color}`}>
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">{category.icon}</div>
                    <p className="text-sm font-medium text-gray-700">
                      {t(`category.${category.key}`)}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Complaints */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="text-orange-500" />
              <span>ปัญหาล่าสุดในชุมชน</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <RecentComplaintsList />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const RecentComplaintsList = () => {
  const [complaints, setComplaints] = useState([]);
  const { t } = useLanguage();

  useEffect(() => {
    fetchRecentComplaints();
  }, []);

  const fetchRecentComplaints = async () => {
    try {
      const { data } = await supabase
        .from('complaints')
        .select('id, title, category, status, created_at, vote_count')
        .order('created_at', { ascending: false })
        .limit(5);

      if (data) {
        setComplaints(data);
      }
    } catch (error) {
      console.error('Error fetching recent complaints:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'open': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  if (complaints.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
        <p>{t('message.noData')}</p>
      </div>
    );
  }

  return (
    <>
      {complaints.map((complaint) => (
        <div key={complaint.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="flex items-center space-x-4">
            <div className="text-2xl">
              {getCategoryIcon(complaint.category)}
            </div>
            <div>
              <h3 className="font-medium text-gray-900 line-clamp-1">
                {complaint.title}
              </h3>
              <p className="text-sm text-gray-600">
                {new Date(complaint.created_at).toLocaleDateString('th-TH')}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
              {t(`status.${complaint.status}`)}
            </span>
            {complaint.vote_count > 0 && (
              <span className="flex items-center space-x-1 text-xs text-gray-500">
                <Users size={12} />
                <span>{complaint.vote_count}</span>
              </span>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default Home;
