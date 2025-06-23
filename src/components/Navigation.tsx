
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageSquareWarning, BarChart3, User, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'nav.home' },
    { path: '/report', icon: MessageSquareWarning, label: 'nav.report' },
    { path: '/dashboard', icon: BarChart3, label: 'nav.dashboard' },
    { path: '/profile', icon: User, label: 'nav.profile' },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'th' ? 'en' : 'th');
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-between bg-white shadow-sm px-6 py-3 border-b border-orange-100">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">WS</span>
            </div>
            <span className="font-bold text-gray-800">Wang Sammo</span>
          </div>
          
          <div className="flex space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-orange-100 text-orange-600'
                      : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{t(item.label)}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleLanguage}
          className="flex items-center space-x-2"
        >
          <Globe size={16} />
          <span>{language === 'th' ? 'EN' : 'ไทย'}</span>
        </Button>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-orange-100 z-50">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-orange-600'
                    : 'text-gray-600'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs font-medium">{t(item.label)}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Language Toggle */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleLanguage}
          className="flex items-center space-x-1 bg-white shadow-lg"
        >
          <Globe size={14} />
          <span className="text-sm">{language === 'th' ? 'EN' : 'ไทย'}</span>
        </Button>
      </div>
    </>
  );
};

export default Navigation;
