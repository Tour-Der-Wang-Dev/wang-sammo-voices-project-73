
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Search, Layers, Navigation, MapPin, Heart, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface MapProps {
  showComplaints?: boolean;
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
  selectedLocation?: { lat: number; lng: number } | null;
}

const Map: React.FC<MapProps> = ({ 
  showComplaints = true, 
  onLocationSelect, 
  selectedLocation 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [layerView, setLayerView] = useState('streets');
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize map with custom styling
  useEffect(() => {
    if (!mapContainer.current) return;

    // Use environment variable or fallback to input field
    const accessToken = 'YOUR_MAPBOX_TOKEN_HERE'; // This will be replaced with actual token
    
    if (!accessToken || accessToken === 'YOUR_MAPBOX_TOKEN_HERE') {
      setIsLoading(false);
      return;
    }

    mapboxgl.accessToken = accessToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: getMapStyle(layerView),
      center: [100.5018, 13.7563], // Bangkok coordinates as default
      zoom: 10,
      pitch: 0,
      bearing: 0,
    });

    // Add navigation controls
    const nav = new mapboxgl.NavigationControl({
      visualizePitch: true,
    });
    map.current.addControl(nav, 'top-right');

    // Add geolocate control
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    });
    map.current.addControl(geolocate, 'top-right');

    map.current.on('load', () => {
      setIsLoading(false);
      if (showComplaints) {
        loadComplaints();
      }
      
      // Add click handler for location selection
      if (onLocationSelect) {
        map.current?.on('click', handleMapClick);
      }
    });

    // Set selected location if provided
    if (selectedLocation) {
      map.current.flyTo({
        center: [selectedLocation.lng, selectedLocation.lat],
        zoom: 15
      });
      
      new mapboxgl.Marker({ color: '#f97316' })
        .setLngLat([selectedLocation.lng, selectedLocation.lat])
        .addTo(map.current);
    }

    return () => {
      map.current?.remove();
    };
  }, [layerView, selectedLocation, showComplaints, onLocationSelect]);

  const getMapStyle = (view: string) => {
    const styles = {
      streets: 'mapbox://styles/mapbox/streets-v12',
      satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
      light: 'mapbox://styles/mapbox/light-v11',
      dark: 'mapbox://styles/mapbox/dark-v11'
    };
    return styles[view] || styles.streets;
  };

  const handleMapClick = async (e: mapboxgl.MapMouseEvent) => {
    if (!onLocationSelect) return;

    const { lng, lat } = e.lngLat;
    
    try {
      // Reverse geocoding to get address
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      const address = data.features[0]?.place_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      
      onLocationSelect({ lat, lng, address });
    } catch (error) {
      console.error('Error getting address:', error);
      onLocationSelect({ lat, lng, address: `${lat.toFixed(6)}, ${lng.toFixed(6)}` });
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}&country=TH&limit=5`
      );
      const data = await response.json();
      setSearchResults(data.features || []);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const selectSearchResult = (result: any) => {
    const [lng, lat] = result.center;
    map.current?.flyTo({
      center: [lng, lat],
      zoom: 15,
      essential: true
    });
    
    setSearchValue(result.place_name);
    setShowSearchResults(false);
    
    if (onLocationSelect) {
      onLocationSelect({ lat, lng, address: result.place_name });
    }
  };

  const loadComplaints = async () => {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('id, title, category, status, location_lat, location_lng, location_text')
        .not('location_lat', 'is', null)
        .not('location_lng', 'is', null);

      if (error) throw error;

      setComplaints(data || []);
      addComplaintMarkers(data || []);
    } catch (error) {
      console.error('Error loading complaints:', error);
    }
  };

  const addComplaintMarkers = (complaintsData: any[]) => {
    if (!map.current) return;

    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.complaint-marker');
    existingMarkers.forEach(marker => marker.remove());

    complaintsData.forEach(complaint => {
      const el = document.createElement('div');
      el.className = 'complaint-marker';
      el.innerHTML = getMarkerIcon(complaint.category, complaint.status);
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.cursor = 'pointer';

      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2">
            <h3 class="font-semibold text-sm">${complaint.title}</h3>
            <p class="text-xs text-gray-600 mt-1">สถานะ: ${getStatusText(complaint.status)}</p>
            <p class="text-xs text-gray-600">${complaint.location_text || 'ไม่ระบุที่อยู่'}</p>
          </div>
        `);

      new mapboxgl.Marker(el)
        .setLngLat([complaint.location_lng, complaint.location_lat])
        .setPopup(popup)
        .addTo(map.current!);
    });
  };

  const getMarkerIcon = (category: string, status: string) => {
    const categoryIcons = {
      road: '🛣️',
      water: '💧',
      waste: '🗑️',
      electricity: '⚡',
      public_safety: '🚨',
      environment: '🌱',
      other: '📝'
    };

    const statusColors = {
      open: '#ef4444',
      in_progress: '#f59e0b',
      resolved: '#10b981',
      closed: '#6b7280'
    };

    const icon = categoryIcons[category] || '📝';
    const color = statusColors[status] || '#6b7280';

    return `
      <div style="
        background: ${color};
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      ">${icon}</div>
    `;
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      open: 'รอดำเนินการ',
      in_progress: 'กำลังดำเนินการ',
      resolved: 'แก้ไขแล้ว',
      closed: 'ปิดเรื่อง'
    };
    return statusMap[status] || status;
  };

  const zoomIn = () => {
    if (map.current) {
      map.current.zoomIn({ duration: 300 });
    }
  };

  const zoomOut = () => {
    if (map.current) {
      map.current.zoomOut({ duration: 300 });
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation([longitude, latitude]);
          map.current?.flyTo({
            center: [longitude, latitude],
            zoom: 15,
            essential: true
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  };

  if (!mapboxgl.accessToken || mapboxgl.accessToken === 'YOUR_MAPBOX_TOKEN_HERE') {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center p-6">
          <MapPin className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Mapbox Token Required
          </h3>
          <p className="text-gray-600 mb-4">
            Please provide your Mapbox access token to enable the map functionality.
          </p>
          <Input
            placeholder="Enter your Mapbox token here..."
            className="mb-2"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const token = (e.target as HTMLInputElement).value;
                if (token) {
                  mapboxgl.accessToken = token;
                  window.location.reload();
                }
              }
            }}
          />
          <p className="text-xs text-gray-500">
            Get your token from <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">mapbox.com</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
      {/* Search Bar */}
      <div className="absolute top-4 left-4 z-10 w-80 max-w-[calc(100%-2rem)]">
        <div className="relative">
          <div className="flex">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                type="text"
                placeholder="ค้นหาสถานที่..."
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  handleSearch(e.target.value);
                }}
                className="pl-10 pr-4 bg-white shadow-md border-gray-200"
                aria-label="Search locations"
              />
            </div>
            <Button
              onClick={getCurrentLocation}
              className="ml-2 bg-orange-500 hover:bg-orange-600"
              size="icon"
              aria-label="Get current location"
            >
              <Navigation size={16} />
            </Button>
          </div>
          
          {/* Search Results */}
          {showSearchResults && searchResults.length > 0 && (
            <Card className="absolute top-full mt-2 w-full bg-white shadow-lg z-20">
              <CardContent className="p-0">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => selectSearchResult(result)}
                    className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0 focus:bg-gray-50 focus:outline-none"
                  >
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-2 text-gray-400" />
                      <div>
                        <div className="font-medium text-sm">{result.text}</div>
                        <div className="text-xs text-gray-600">{result.place_name}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Layer Controls */}
      <div className="absolute top-4 right-4 z-10">
        <Card className="bg-white shadow-md">
          <CardContent className="p-2">
            <div className="flex flex-col space-y-1">
              <Button
                variant={layerView === 'streets' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setLayerView('streets')}
                className="justify-start text-xs"
              >
                <Layers size={14} className="mr-1" />
                ถนน
              </Button>
              <Button
                variant={layerView === 'satellite' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setLayerView('satellite')}
                className="justify-start text-xs"
              >
                <Layers size={14} className="mr-1" />
                ดาวเทียม
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Zoom Controls */}
      <div className="absolute bottom-4 right-4 z-10">
        <Card className="bg-white shadow-md">
          <CardContent className="p-1">
            <div className="flex flex-col">
              <Button
                variant="ghost"
                size="sm"
                onClick={zoomIn}
                className="p-2"
                aria-label="Zoom in"
              >
                <Plus size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={zoomOut}
                className="p-2"
                aria-label="Zoom out"
              >
                <Minus size={16} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
            <p className="text-gray-600">กำลังโหลดแผนที่...</p>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default Map;
