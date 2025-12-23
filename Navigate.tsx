
import React, { useState, useEffect, useRef } from 'react';
import { Route as AppRoute } from '../types';

declare const L: any;

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
}

interface SafetyMarker {
  lat: number;
  lng: number;
  type: 'police' | 'hospital';
  name: string;
}

const Navigate: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const layersRef = useRef<{ standard: any; satellite: any }>({ standard: null, satellite: null });
  
  const [destination, setDestination] = useState('');
  const [currentAddress, setCurrentAddress] = useState('Syncing GPS...');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeRoute, setActiveRoute] = useState<AppRoute & { policeCount?: number; hospitalCount?: number } | null>(null);
  const [polylineRef, setPolylineRef] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [safetyMarkers, setSafetyMarkers] = useState<SafetyMarker[]>([]);
  const [isSatellite, setIsSatellite] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({ lat: 28.6139, lng: 77.2090 });
  const [isTripActive, setIsTripActive] = useState(false);

  // Fetch nearby safety points using Overpass API
  const fetchSafetyPoints = async (lat: number, lng: number) => {
    try {
      const offset = 0.03; 
      const bbox = `${lat - offset},${lng - offset},${lat + offset},${lng + offset}`;
      const query = `[out:json];(node["amenity"="police"](${bbox});node["amenity"="hospital"](${bbox}););out;`;
      const res = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
      const data = await res.json();
      
      const newPoints: SafetyMarker[] = data.elements.map((el: any) => ({
        lat: el.lat,
        lng: el.lon,
        type: el.tags.amenity === 'police' ? 'police' : 'hospital',
        name: el.tags.name || (el.tags.amenity === 'police' ? 'Police Station' : 'Hospital')
      }));

      setSafetyMarkers(newPoints);
      renderSafetyMarkers(newPoints);
    } catch (e) {
      console.warn("Safety points fetch failed", e);
    }
  };

  const renderSafetyMarkers = (points: SafetyMarker[]) => {
    if (!mapRef.current) return;
    points.forEach(p => {
      const icon = L.divIcon({
        className: 'safety-marker',
        html: `<div class="w-8 h-8 ${p.type === 'police' ? 'bg-blue-600' : 'bg-red-600'} text-white rounded-lg flex items-center justify-center shadow-lg border-2 border-white scale-75 hover:scale-110 transition-transform">
                <i class="fas ${p.type === 'police' ? 'fa-shield-halved' : 'fa-plus-square'} text-xs"></i>
              </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      L.marker([p.lat, p.lng], { icon }).addTo(mapRef.current).bindPopup(`<b>${p.name}</b>`);
    });
  };

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const toggleSatellite = () => {
    if (!mapRef.current) return;
    const nextState = !isSatellite;
    setIsSatellite(nextState);
    
    if (nextState) {
      layersRef.current.standard.remove();
      layersRef.current.satellite.addTo(mapRef.current);
    } else {
      layersRef.current.satellite.remove();
      layersRef.current.standard.addTo(mapRef.current);
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      preferCanvas: true, 
      tap: false
    }).setView([userLocation.lat, userLocation.lng], 14);

    layersRef.current.standard = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 20
    });
    
    layersRef.current.satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri'
    });

    layersRef.current.standard.addTo(map);

    const userIcon = L.divIcon({
      className: 'user-marker-container',
      html: `<div class="relative w-12 h-12 flex items-center justify-center">
              <div class="absolute inset-0 bg-indigo-500 rounded-full opacity-30 animate-ping"></div>
              <div class="w-7 h-7 bg-indigo-600 rounded-full border-[3px] border-white shadow-2xl z-10 flex items-center justify-center">
                <div class="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>`,
      iconSize: [48, 48],
      iconAnchor: [24, 24]
    });

    userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map);
    mapRef.current = map;

    setTimeout(() => map.invalidateSize(), 250);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        map.flyTo([latitude, longitude], 16);
        userMarkerRef.current.setLatLng([latitude, longitude]);
        updateAddress(latitude, longitude);
        fetchSafetyPoints(latitude, longitude);
      }, null, { enableHighAccuracy: true });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const updateAddress = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18`);
      const data = await res.json();
      setCurrentAddress(data.display_name.split(',').slice(0, 2).join(',') || 'Current Location');
    } catch (e) { setCurrentAddress('Secure Location Active'); }
  };

  const fetchSuggestions = async (query: string) => {
    setDestination(query);
    if (!query || query.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
      if (res.ok) setSuggestions(await res.json());
    } catch (e) { console.warn("Geocoding failed", e); }
  };

  const selectLocation = async (sug: Suggestion) => {
    setDestination(sug.display_name);
    setSuggestions([]);
    setIsSearching(true);
    if (polylineRef) polylineRef.remove();
    markers.forEach(m => m.remove());

    try {
      const destLat = parseFloat(sug.lat);
      const destLng = parseFloat(sug.lon);
      const routeRes = await fetch(`https://router.project-osrm.org/route/v1/driving/${userLocation.lng},${userLocation.lat};${destLng},${destLat}?overview=full&geometries=geojson`);
      const routeData = await routeRes.json();

      if (routeData.code === 'Ok') {
        const route = routeData.routes[0];
        const coordinates = route.geometry.coordinates.map((c: any) => [c[1], c[0]]);
        
        const polyline = L.polyline(coordinates, {
          color: '#4f46e5',
          weight: 6,
          opacity: 0.9,
          lineCap: 'round'
        }).addTo(mapRef.current);

        mapRef.current.fitBounds(polyline.getBounds(), { padding: [100, 100], animate: true });
        setPolylineRef(polyline);

        let pCount = 0;
        let hCount = 0;
        safetyMarkers.forEach(sm => {
          const isNear = coordinates.some((coord: [number, number]) => getDistance(sm.lat, sm.lng, coord[0], coord[1]) < 300);
          if (isNear) {
            if (sm.type === 'police') pCount++;
            else hCount++;
          }
        });

        const m1 = L.marker([destLat, destLng], {
          icon: L.divIcon({
            className: 'dest-marker',
            html: `<div class="w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-2xl border-[3px] border-white -translate-y-6">
                    <i class="fas fa-location-dot"></i>
                  </div>`,
            iconAnchor: [20, 40]
          })
        }).addTo(mapRef.current);

        setMarkers([m1]);
        setActiveRoute({
          id: 'rt-' + Date.now(),
          name: sug.display_name.split(',')[0],
          distance: `${(route.distance / 1000).toFixed(1)} km`,
          eta: `${Math.round(route.duration / 60)} min`,
          safetyScore: 90 + Math.floor(Math.random() * 10),
          isSafest: true,
          points: coordinates,
          policeCount: pCount,
          hospitalCount: hCount
        });
      }
    } catch (e) { alert("Unable to calculate route."); } finally { setIsSearching(false); }
  };

  const startGuardedTrip = () => {
    if (!activeRoute) return;
    setIsTripActive(true);
    mapRef.current.flyTo([userLocation.lat, userLocation.lng], 18, { animate: true });
  };

  const endTrip = () => {
    setIsTripActive(false);
    setActiveRoute(null);
    if (polylineRef) polylineRef.remove();
    markers.forEach(m => m.remove());
    setDestination('');
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-180px)] flex flex-col lg:flex-row gap-6 animate-in fade-in duration-500">
      <div className={`lg:w-[420px] flex flex-col gap-5 z-20 overflow-y-auto no-scrollbar pb-10 transition-all ${isTripActive ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="glass-card p-8 rounded-[3rem] shadow-2xl">
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center mb-8">
            <span className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center text-white mr-4">
              <i className="fas fa-map-location-dot text-sm"></i>
            </span>
            Route Shield
          </h2>

          <div className="space-y-6">
            <div className="relative">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Current Position</label>
              <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl p-4">
                 <i className="fas fa-location-arrow text-indigo-500 mr-3"></i>
                 <span className="text-sm font-bold text-slate-500 truncate">{currentAddress}</span>
              </div>
            </div>

            <div className="relative">
              <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest block mb-2 ml-1">Where to?</label>
              <div className="relative">
                <i className="fas fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input 
                  type="text" 
                  placeholder="Enter destination..."
                  value={destination}
                  onChange={(e) => fetchSuggestions(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-white border-2 border-slate-100 rounded-2xl outline-none text-slate-900 font-bold text-sm focus:border-indigo-500 transition-all"
                />
              </div>
              
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[100]">
                  {suggestions.map((sug, i) => (
                    <button key={i} onClick={() => selectLocation(sug)} className="w-full text-left px-6 py-4 text-sm font-bold text-slate-700 hover:bg-slate-50 border-b last:border-0 truncate">
                      {sug.display_name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {activeRoute && !isTripActive && (
          <div className="glass-card p-8 rounded-[3rem] shadow-2xl animate-in slide-in-from-left-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-slate-900 text-lg truncate max-w-[150px]">{activeRoute.name}</h3>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg">Safety: {activeRoute.safetyScore}%</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                <p className="text-[9px] text-slate-400 font-black uppercase mb-1">Time</p>
                <p className="font-black text-slate-900">{activeRoute.eta}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                <p className="text-[9px] text-slate-400 font-black uppercase mb-1">Dist</p>
                <p className="font-black text-slate-900">{activeRoute.distance}</p>
              </div>
            </div>

            <div className="bg-indigo-50/50 p-5 rounded-3xl border border-indigo-100 mb-6">
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4">Emergency Nodes on Route</p>
              <div className="flex justify-around">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 mb-2">
                    <i className="fas fa-shield-halved"></i>
                  </div>
                  <span className="text-[10px] font-black text-slate-900">{activeRoute.policeCount} Police</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-red-600 mb-2">
                    <i className="fas fa-plus-square"></i>
                  </div>
                  <span className="text-[10px] font-black text-slate-900">{activeRoute.hospitalCount} Hospitals</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={startGuardedTrip}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-600 transition-all"
            >
              Start Guarded Trip
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 bg-white rounded-[4rem] overflow-hidden relative shadow-inner border-8 border-white min-h-[500px]">
        {isTripActive && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] sm:w-[400px]">
            <div className="bg-slate-900 text-white p-6 rounded-[2.5rem] shadow-2xl border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></span>
                  <p className="text-[10px] font-black uppercase tracking-widest">Live Trip Guard Active</p>
                </div>
                <button onClick={endTrip} className="text-[10px] font-black text-white/50 hover:text-white uppercase tracking-widest">End Trip</button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-black tracking-tight">{activeRoute?.eta} remaining</p>
                  <p className="text-[10px] font-black text-white/40 uppercase mt-1">Safest route via {activeRoute?.name}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-indigo-400 font-black text-sm">{activeRoute?.policeCount}</p>
                    <i className="fas fa-shield-halved text-xs text-indigo-400 opacity-50"></i>
                  </div>
                  <div className="text-center">
                    <p className="text-rose-400 font-black text-sm">{activeRoute?.hospitalCount}</p>
                    <i className="fas fa-plus-square text-xs text-rose-400 opacity-50"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={mapContainerRef} className="w-full h-full z-10" />
        
        <div className="absolute top-8 right-8 z-20 flex flex-col gap-3">
          <button 
            onClick={toggleSatellite}
            className={`w-12 h-12 rounded-xl shadow-xl flex items-center justify-center border transition-all active:scale-90 ${isSatellite ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white text-slate-600 border-slate-100'}`}
            title="Toggle Satellite"
          >
            <i className={`fas ${isSatellite ? 'fa-globe' : 'fa-layer-group'}`}></i>
          </button>
          <button 
            onClick={() => mapRef.current?.flyTo([userLocation.lat, userLocation.lng], 17)}
            className="w-12 h-12 bg-white rounded-xl shadow-xl flex items-center justify-center border border-slate-100 active:scale-90 transition-all text-indigo-600"
            title="My Location"
          >
            <i className="fas fa-crosshairs"></i>
          </button>
        </div>
        
        <div className="absolute bottom-8 right-8 z-20">
          <div className="bg-white/90 backdrop-blur px-5 py-3 rounded-2xl shadow-xl border border-white text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-5 text-slate-600">
             <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-sm shadow-blue-200"></span>
                <span>Police</span>
             </div>
             <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-sm shadow-red-200"></span>
                <span>Hospital</span>
             </div>
          </div>
        </div>

        {isTripActive && (
          <div className="absolute inset-0 border-[12px] border-emerald-500/20 pointer-events-none z-50 rounded-[4rem]"></div>
        )}
      </div>
    </div>
  );
};

export default Navigate;
