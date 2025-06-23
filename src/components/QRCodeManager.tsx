
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QrCode, Download, Share2, Copy, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QRCodeData {
  url: string;
  size: string;
  category?: string;
  location?: string;
}

const QRCodeManager = () => {
  const { toast } = useToast();
  const [qrData, setQrData] = useState<QRCodeData>({
    url: window.location.origin + '/report',
    size: '200',
    category: '',
    location: ''
  });
  const [copied, setCopied] = useState(false);

  const generateQRUrl = () => {
    let baseUrl = window.location.origin + '/report';
    const params = new URLSearchParams();
    
    if (qrData.category) {
      params.append('category', qrData.category);
    }
    if (qrData.location) {
      params.append('location', qrData.location);
    }
    
    if (params.toString()) {
      baseUrl += '?' + params.toString();
    }
    
    return `https://api.qrserver.com/v1/create-qr-code/?size=${qrData.size}x${qrData.size}&data=${encodeURIComponent(baseUrl)}`;
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(generateQRUrl());
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr-code-wangsammo-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: 'สำเร็จ',
        description: 'ดาวน์โหลด QR Code แล้ว'
      });
    } catch (error) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถดาวน์โหลด QR Code ได้',
        variant: 'destructive'
      });
    }
  };

  const handleCopyUrl = async () => {
    const url = qrData.url + (qrData.category ? `?category=${qrData.category}` : '');
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: 'คัดลอกแล้ว',
        description: 'คัดลอกลิงก์เรียบร้อยแล้ว'
      });
    } catch (error) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถคัดลอกลิงก์ได้',
        variant: 'destructive'
      });
    }
  };

  const categories = [
    { value: 'road', label: 'ถนน', icon: '🛣️' },
    { value: 'water', label: 'น้ำประปา', icon: '💧' },
    { value: 'waste', label: 'ขยะ', icon: '🗑️' },
    { value: 'electricity', label: 'ไฟฟ้า', icon: '⚡' },
    { value: 'public_safety', label: 'ความปลอดภัย', icon: '🚨' },
    { value: 'environment', label: 'สิ่งแวดล้อม', icon: '🌱' },
    { value: 'other', label: 'อื่นๆ', icon: '📝' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <QrCode className="text-orange-500" />
            <span>สร้าง QR Code สำหรับรายงานปัญหา</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">ประเภทเฉพาะ (ถ้าต้องการ)</Label>
              <Select value={qrData.category} onValueChange={(value) => setQrData(prev => ({...prev, category: value}))}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกประเภท" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">ทั่วไป</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      <div className="flex items-center space-x-2">
                        <span>{category.icon}</span>
                        <span>{category.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">สถานที่เฉพาะ (ถ้าต้องการ)</Label>
              <Input
                id="location"
                value={qrData.location}
                onChange={(e) => setQrData(prev => ({...prev, location: e.target.value}))}
                placeholder="เช่น หน้าวัด, ใกล้โรงเรียน"
              />
            </div>

            <div>
              <Label htmlFor="size">ขนาด QR Code</Label>
              <Select value={qrData.size} onValueChange={(value) => setQrData(prev => ({...prev, size: value}))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="150">เล็ก (150x150)</SelectItem>
                  <SelectItem value="200">กลาง (200x200)</SelectItem>
                  <SelectItem value="300">ใหญ่ (300x300)</SelectItem>
                  <SelectItem value="400">ใหญ่มาก (400x400)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="text-center space-y-4">
              <img
                src={generateQRUrl()}
                alt="QR Code"
                className="border-2 border-orange-200 rounded-lg mx-auto"
              />
              <div className="flex flex-wrap gap-2 justify-center">
                <Button onClick={handleDownload} className="flex items-center space-x-2">
                  <Download size={16} />
                  <span>ดาวน์โหลด</span>
                </Button>
                <Button onClick={handleCopyUrl} variant="outline" className="flex items-center space-x-2">
                  {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                  <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอกลิงก์'}</span>
                </Button>
              </div>
              <p className="text-xs text-gray-500 max-w-xs break-all">
                {qrData.url}{qrData.category ? `?category=${qrData.category}` : ''}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>วิธีการใช้งาน QR Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-2">
              <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium">1</span>
              <p>พิมพ์ QR Code และติดตั้งในจุดที่เหมาะสม เช่น ป้ายประกาศ, บอร์ดชุมชน</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium">2</span>
              <p>ชาวบ้านสแกน QR Code ด้วยมือถือเพื่อเข้าสู่ระบบรายงานปัญหา</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium">3</span>
              <p>หาก QR Code มีการตั้งค่าประเภทหรือสถานที่ ระบบจะเติมข้อมูลให้อัตโนมัติ</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodeManager;
