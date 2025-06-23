
import React, { useState } from 'react';
import Map from './Map';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, X } from 'lucide-react';

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  selectedLocation?: { lat: number; lng: number; address: string } | null;
  onClose?: () => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  selectedLocation,
  onClose
}) => {
  const [tempLocation, setTempLocation] = useState<{ lat: number; lng: number; address: string } | null>(
    selectedLocation || null
  );

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setTempLocation(location);
  };

  const confirmLocation = () => {
    if (tempLocation) {
      onLocationSelect(tempLocation);
      onClose?.();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="text-orange-500" size={20} />
            <span>เลือกตำแหน่งที่ตั้ง</span>
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={20} />
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-96">
            <Map
              showComplaints={false}
              onLocationSelect={handleLocationSelect}
              selectedLocation={tempLocation}
            />
          </div>
          
          {tempLocation && (
            <div className="p-4 border-t">
              <div className="flex items-start space-x-3 mb-4">
                <MapPin className="text-orange-500 mt-1" size={16} />
                <div className="flex-1">
                  <p className="font-medium text-sm">ตำแหน่งที่เลือก:</p>
                  <p className="text-sm text-gray-600">{tempLocation.address}</p>
                  <p className="text-xs text-gray-500">
                    {tempLocation.lat.toFixed(6)}, {tempLocation.lng.toFixed(6)}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={onClose}>
                  ยกเลิก
                </Button>
                <Button onClick={confirmLocation} className="bg-orange-500 hover:bg-orange-600">
                  ยืนยันตำแหน่ง
                </Button>
              </div>
            </div>
          )}
          
          {!tempLocation && (
            <div className="p-4 border-t">
              <p className="text-sm text-gray-600 text-center">
                คลิกบนแผนที่เพื่อเลือกตำแหน่งที่ตั้ง
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationPicker;
