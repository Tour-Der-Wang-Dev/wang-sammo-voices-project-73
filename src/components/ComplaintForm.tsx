
import React, { useState } from 'react';
import { Camera, MapPin, Phone, Shield, Send, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import VoiceRecorder from './VoiceRecorder';
import { supabase } from '@/integrations/supabase/client';

type ComplaintCategory = 'road' | 'water' | 'waste' | 'electricity' | 'public_safety' | 'environment' | 'other';

interface ComplaintFormData {
  description: string;
  category: ComplaintCategory | '';
  location: string;
  phone: string;
  isAnonymous: boolean;
  photo?: File;
  audioBlob?: Blob;
}

const categories = [
  { value: 'road' as ComplaintCategory, icon: '🛣️' },
  { value: 'water' as ComplaintCategory, icon: '💧' },
  { value: 'waste' as ComplaintCategory, icon: '🗑️' },
  { value: 'electricity' as ComplaintCategory, icon: '⚡' },
  { value: 'public_safety' as ComplaintCategory, icon: '🚨' },
  { value: 'environment' as ComplaintCategory, icon: '🌱' },
  { value: 'other' as ComplaintCategory, icon: '📝' }
];

const ComplaintForm = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ComplaintFormData>({
    description: '',
    category: '',
    location: '',
    phone: '',
    isAnonymous: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: t('message.error'),
          description: 'File size must be less than 5MB',
          variant: 'destructive'
        });
        return;
      }
      setFormData(prev => ({...prev, photo: file}));
    }
  };

  const handleVoiceRecording = (audioBlob: Blob, audioUrl: string) => {
    setFormData(prev => ({...prev, audioBlob}));
  };

  const handleVoiceRemove = () => {
    setFormData(prev => ({...prev, audioBlob: undefined}));
  };

  const uploadFile = async (file: File | Blob, fileName: string, bucket: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(`complaints/${Date.now()}-${fileName}`, file);
      
    if (error) throw error;
    
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
      
    return urlData.publicUrl;
  };

  const generateTitle = (category: ComplaintCategory, description: string) => {
    const categoryLabels = {
      road: 'ปัญหาถนน',
      water: 'ปัญหาน้ำประปา',
      waste: 'ปัญหาขยะ',
      electricity: 'ปัญหาไฟฟ้า',
      public_safety: 'ปัญหาความปลอดภัย',
      environment: 'ปัญหาสิ่งแวดล้อม',
      other: 'ปัญหาอื่นๆ'
    };
    
    const shortDescription = description.length > 50 
      ? description.substring(0, 50) + '...' 
      : description;
    
    return `${categoryLabels[category]}: ${shortDescription}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let photoUrl = null;
      let voiceUrl = null;

      // Upload photo if provided
      if (formData.photo) {
        photoUrl = await uploadFile(formData.photo, formData.photo.name, 'photos');
      }

      // Upload voice recording if provided
      if (formData.audioBlob) {
        voiceUrl = await uploadFile(formData.audioBlob, 'voice-memo.wav', 'audio');
      }

      // Get current user if not anonymous
      const { data: { user } } = await supabase.auth.getUser();

      // Generate title from category and description
      const title = generateTitle(formData.category as ComplaintCategory, formData.description);

      // Insert complaint
      const { data: complaint, error } = await supabase
        .from('complaints')
        .insert({
          title: title,
          description: formData.description,
          category: formData.category as ComplaintCategory,
          location_text: formData.location,
          phone: formData.isAnonymous ? formData.phone : null,
          photo_url: photoUrl,
          voice_memo_url: voiceUrl,
          user_id: formData.isAnonymous ? null : user?.id,
          is_anonymous: formData.isAnonymous,
          complaint_id: 'WS-' + new Date().getFullYear() + '-' + Math.random().toString(36).substr(2, 3).toUpperCase()
        })
        .select()
        .single();

      if (error) throw error;

      // Award points to user if not anonymous
      if (!formData.isAnonymous && user) {
        await supabase.rpc('award_points', {
          user_uuid: user.id,
          points_to_add: 10
        });
      }

      toast({
        title: t('message.success'),
        description: t('message.complaintSubmitted'),
      });

      // Reset form
      setFormData({
        description: '',
        category: '',
        location: '',
        phone: '',
        isAnonymous: false
      });

    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast({
        title: t('message.error'),
        description: 'Failed to submit complaint. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-orange-400 to-orange-500 text-white">
        <CardTitle className="flex items-center space-x-2">
          <AlertCircle size={24} />
          <span>{t('nav.report')}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Anonymous Toggle */}
          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Shield className="text-orange-500" size={20} />
              <Label htmlFor="anonymous" className="text-sm font-medium">
                {t('form.anonymous')}
              </Label>
            </div>
            <Switch
              id="anonymous"
              checked={formData.isAnonymous}
              onCheckedChange={(checked) => handleInputChange('isAnonymous', checked)}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">
              {t('form.category')} <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.category} onValueChange={(value: ComplaintCategory) => handleInputChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="เลือกประเภทปัญหา" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <div className="flex items-center space-x-2">
                      <span>{category.icon}</span>
                      <span>{t(`category.${category.value}`)}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              {t('form.description')} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="โปรดอธิบายปัญหาให้ละเอียด เช่น สถานที่เกิดเหตุ ความรุนแรง ผลกระทบ"
              className="min-h-[120px]"
              required
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center space-x-2">
              <MapPin size={16} />
              <span>{t('form.location')}</span>
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="เช่น หน้าวัด ใกล้โรงเรียน หมู่ 3"
            />
          </div>

          {/* Phone (if anonymous) */}
          {formData.isAnonymous && (
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center space-x-2">
                <Phone size={16} />
                <span>{t('form.phone')}</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="08x-xxx-xxxx"
              />
            </div>
          )}

          {/* Photo Upload */}
          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <Camera size={16} />
              <span>{t('form.addPhoto')}</span>
            </Label>
            <div className="border-2 border-dashed border-orange-200 rounded-lg p-4">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              <Label
                htmlFor="photo-upload"
                className="flex flex-col items-center justify-center cursor-pointer space-y-2"
              >
                <Camera className="text-orange-400" size={32} />
                <span className="text-sm text-gray-600">
                  {formData.photo ? formData.photo.name : 'คลิกเพื่อเลือกรูปภาพ'}
                </span>
              </Label>
            </div>
          </div>

          {/* Voice Recording */}
          <VoiceRecorder
            onRecordingComplete={handleVoiceRecording}
            onRecordingRemove={handleVoiceRemove}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || !formData.description || !formData.category}
            className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600"
          >
            <Send size={16} className="mr-2" />
            {isSubmitting ? t('message.loading') : t('form.submit')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ComplaintForm;
