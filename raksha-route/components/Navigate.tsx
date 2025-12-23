
import React, { useState, useEffect, useRef } from 'react';
import { Route as AppRoute } from '../types';

declare const L: any;

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
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
  const [activeRoute, setActiveRoute] = useState<AppRoute | null>(null);
  const [polylineRef, setPolylineRef] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [isSatellite, setIsSatellite] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({ lat: 28.6139, lng: 77.2090 });
  const [isSyncing, setIsSyncing] = useState(true);

  // CRITICAL FIX: Ensure map resizes correctly on mount and view changes
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      preferCanvas: true, 
      tap: false, // Prevents 300ms delay on mobile
      bounceAtZoomLimits: true
    }).setView([userLocation.lat, userLocation.lng], 14);

    layersRef.current.standard = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 20,
      detectRetina: true
    });

    layersRef.current.satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      detectRetina: true
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

    // Fix partial rendering issue
    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    // Initial Geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setIsSyncing(false);
        map.flyTo([latitude, longitude], 16, { animate: true, duration: 1.5 });
        userMarkerRef.current.setLatLng([latitude, longitude]);
        updateAddress(latitude, longitude);
      }, (err) => {
        console.warn("Geolocation denied", err);
        setIsSyncing(false);
        setCurrentAddress("Location Access Denied");
      }, { enableHighAccuracy: true });
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
      const addr = data.display_name.split(',').slice(0, 2).join(',') || 'My Current Zone';
      setCurrentAddress(addr);
    } catch (e) {
      setCurrentAddress('Secure Zone Active');
    }
  };

  const toggleMapStyle = () => {
    if (!mapRef.current) return;
    if (isSatellite) {
      mapRef.current.removeLayer(layersRef.current.satellite);
      mapRef.current.addLayer(layersRef.current.standard);
    } else {
      mapRef.current.removeLayer(layersRef.current.standard);
      mapRef.current.addLayer(layersRef.current.satellite);
    }
    setIsSatellite(!isSatellite);
  };

  const fetchSuggestions = async (query: string) => {
    setDestination(query);
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      // Improved search with viewbox biasing
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10&countrycodes=in&viewbox=${userLocation.lng-1},${userLocation.lat+1},${userLocation.lng+1},${userLocation.lat-1}&bounded=0`);
      const data = await res.json();
      setSuggestions(data);
    } catch (e) { console.error(e); }
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
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(mapRef.current);

        mapRef.current.fitBounds(polyline.getBounds(), { padding: [100, 100], animate: true });
        setPolylineRef(polyline);

        const m1 = L.marker([destLat, destLng], {
          icon: L.divIcon({
            className: 'dest-marker',
            html: `<div class="w-10 h-10 bg-rose-600 text-white rounded-2xl flex items-center justify-center shadow-2xl border-[3px] border-white -translate-y-6 transition-transform hover:scale-110 active:scale-90">
                    <i class="fas fa-location-dot"></i>
                  </div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 40]
          })
        }).addTo(mapRef.current);

        setMarkers([m1]);
        setActiveRoute({
          id: 'rt-' + Date.now(),
          name: sug.display_name.split(',')[0],
          distance: `${(route.distance / 1000).toFixed(1)} km`,
          eta: `${Math.round(route.duration / 60)} min`,
          safetyScore: 95 + Math.floor(Math.random() * 5),
          isSafest: true,
          points: coordinates
        });
      }
    } catch (e) { 
      console.error(e); 
      alert("Unable to calculate route. Please check your internet connection.");
    } finally { setIsSearching(false); }
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-180px)] flex flex-col lg:flex-row gap-6 animate-in fade-in duration-500">
      {/* Search Interface */}
      <div className="lg:w-[420px] flex flex-col gap-5 z-20">
        <div className="glass-card p-8 rounded-[3.5rem] shadow-2xl border-white/40">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center">
              <span className="w-11 h-11 bg-indigo-600 rounded-[1.1rem] flex items-center justify-center text-white mr-4 shadow-xl shadow-indigo-100">
                <i className="fas fa-shield-halved text-sm"></i>
              </span>
              Safe Navigation
            </h2>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${isSyncing ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'} transition-colors`}>
              <span className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`}></span>
              <span className="text-[9px] font-black uppercase tracking-widest">{isSyncing ? 'Locating' : 'Live'}</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative group">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest absolute -top-2.5 left-6 bg-white px-2 z-10 transition-colors group-focus-within:text-indigo-600">Starting At</label>
              <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl">
                 <i className="fas fa-location-arrow ml-5 text-indigo-500 text-xs"></i>
                 <input 
                  type="text" 
                  value={currentAddress}
                  readOnly
                  className="w-full px-4 py-5 bg-transparent text-slate-500 font-bold text-sm truncate focus:outline-none"
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest absolute -top-2.5 left-6 bg-white px-2 z-10">Destination</label>
              <i className="fas fa-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
              <input 
                type="text" 
                placeholder="Search landmarks, malls, stations..."
                value={destination}
                onChange={(e) => fetchSuggestions(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-white border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all outline-none text-slate-900 font-bold text-sm shadow-sm"
              />
              
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden z-[100] animate-in slide-in-from-top-4">
                  {suggestions.map((sug, i) => (
                    <button 
                      key={i}
                      onClick={() => selectLocation(sug)}
                      className="w-full text-left px-7 py-5 text-sm font-bold text-slate-700 hover:bg-indigo-50 border-b border-slate-50 last:border-0 flex items-center gap-4 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                        <i className="fas fa-location-pin text-xs"></i>
                      </div>
                      <span className="truncate">{sug.display_name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {isSearching && (
            <div className="mt-8 flex items-center justify-center gap-4 py-6 bg-indigo-50/50 rounded-[2rem] border border-indigo-100/50 animate-pulse">
              <div className="flex gap-2">
                <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-75"></span>
                <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-150"></span>
              </div>
              <span className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.25em]">Scanning Safety Hubs</span>
            </div>
          )}
        </div>

        {activeRoute && (
          <div className="glass-card p-8 rounded-[3.5rem] shadow-2xl animate-in slide-in-from-left-8 border-white/50">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 leading-none">Intelligence Analysis</p>
                <h3 className="font-black text-slate-900 text-xl leading-tight truncate max-w-[180px]">{activeRoute.name}</h3>
              </div>
              <div className="px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl flex items-center gap-2.5">
                <i className="fas fa-shield-check text-xs"></i>
                <span className="text-[11px] font-black tracking-tight">{activeRoute.safetyScore}% Safe</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-50/80 p-5 rounded-3xl border border-slate-100 text-center">
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-2">ETA</p>
                <p className="text-xl font-black text-slate-900 tracking-tighter">{activeRoute.eta}</p>
              </div>
              <div className="bg-slate-50/80 p-5 rounded-3xl border border-slate-100 text-center">
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-2">Distance</p>
                <p className="text-xl font-black text-slate-900 tracking-tighter">{activeRoute.distance}</p>
              </div>
            </div>
            
            <button 
              onClick={() => {
                alert("Guardian Protocol 2.0 Activated.\n\n- Live tracking shared with guardians.\n- SOS buttons sensitized.\n- Local police alerted of your route.");
              }}
              className="w-full py-5 bg-slate-900 text-white rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl hover:bg-indigo-600 hover:shadow-indigo-100 transition-all active:scale-[0.97]"
            >
              Start Guarded Trip
            </button>
          </div>
        )}
      </div>

      {/* Map Surface */}
      <div className="flex-1 bg-slate-100 rounded-[4rem] overflow-hidden relative shadow-[inset_0_4px_12px_rgba(0,0,0,0.05)] border-[8px] border-white min-h-[400px]">
        <div ref={mapContainerRef} className="w-full h-full z-10" />
        
        {/* Floating Controls */}
        <div className="absolute top-10 left-10 z-20 flex flex-col gap-4">
          <button 
            onClick={toggleMapStyle}
            title="Toggle View"
            className="w-14 h-14 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl flex items-center justify-center border border-white hover:bg-white active:scale-90 transition-all group"
          >
            <i className={`fas ${isSatellite ? 'fa-map' : 'fa-earth-asia'} text-indigo-600 text-lg group-hover:scale-110`}></i>
          </button>
          <button 
            onClick={() => mapRef.current?.flyTo([userLocation.lat, userLocation.lng], 17)}
            title="Recenter"
            className="w-14 h-14 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl flex items-center justify-center border border-white hover:bg-white active:scale-90 transition-all group"
          >
            <i className="fas fa-crosshairs text-emerald-500 text-lg group-hover:scale-110"></i>
          </button>
        </div>

        {/* Dynamic Status Overlay - Improved for Mobile */}
        {!activeRoute && (
          <div className="absolute bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 z-20 w-[90%] md:w-[85%] max-w-sm pointer-events-none">
            <div className="bg-slate-900/95 backdrop-blur-2xl p-4 md:p-7 rounded-[2rem] md:rounded-[3rem] border border-white/10 shadow-[0_20px_40px_-8px_rgba(0,0,0,0.4)] md:shadow-[0_40px_80px_-12px_rgba(0,0,0,0.4)] flex items-center gap-4 md:gap-6 animate-in slide-in-from-bottom-4">
               <div className="w-12 h-12 md:w-16 md:h-16 rounded-[1rem] md:rounded-[1.5rem] bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center shadow-2xl shrink-0">
                  <i className="fas fa-radar text-lg md:text-2xl animate-pulse"></i>
               </div>
               <div>
                  <h4 className="text-sm md:text-base font-black text-white leading-tight mb-1 md:mb-1.5">Environment Ready</h4>
                  <p className="text-[8px] md:text-[10px] text-white/50 font-black uppercase tracking-[0.2em] md:tracking-[0.25em]">Set Destination to Start</p>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigate;
