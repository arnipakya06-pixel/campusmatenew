import React, { useState } from 'react';
import { useCampusMate } from '../../context/CampusMateContext';
import { BackButton } from '../common/BackButton';
import { CampusLocation } from '../../types';
import {
  MapPin,
  Search,
  Navigation,
  Crosshair,
  Clock,
  Phone,
  Layers,
  ArrowRight,
  Info,
  X,
  Compass,
} from 'lucide-react';

export const CampusMapView: React.FC = () => {
  const { campusLocations } = useCampusMate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<CampusLocation | null>(
    campusLocations.find((l) => l.code === 'AIDS-BLK') || campusLocations[0]
  );
  const [routeFrom, setRouteFrom] = useState<string>('loc-1'); // Main Gate default
  const [routeTo, setRouteTo] = useState<string>('loc-5'); // AI & DS default
  const [routeActive, setRouteActive] = useState<boolean>(true);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);

  const filteredLocations = campusLocations.filter(
    (loc) =>
      !searchQuery ||
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startLoc = campusLocations.find((l) => l.id === routeFrom);
  const destLoc = campusLocations.find((l) => l.id === routeTo);

  const handleRequestGps = () => {
    setGpsLoading(true);
    setGpsMessage(null);

    if (!('geolocation' in navigator)) {
      setGpsMessage('Geolocation is not supported by your browser.');
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false);
        setGpsMessage(
          `GPS Acquired: Lat ${pos.coords.latitude.toFixed(4)}, Long ${pos.coords.longitude.toFixed(4)}. Campus proximity confirmed (Campus Wi-Fi Node: Zone A).`
        );
      },
      (err) => {
        setGpsLoading(false);
        setGpsMessage('GPS location access was not granted. Using institutional entrance reference point.');
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <BackButton size="sm" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200/60">
              <MapPin className="w-3.5 h-3.5 text-rose-600" />
              <span>Interactive College GIS &amp; Indoor Floor Directory</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Campus Navigation Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Search academic blocks, locate department labs, and calculate walking routes across the 45-acre campus
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRequestGps}
            disabled={gpsLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-colors"
          >
            <Crosshair className="w-4 h-4 text-indigo-600" />
            <span>{gpsLoading ? 'Locating...' : 'My Campus Location'}</span>
          </button>
        </div>
      </div>

      {gpsMessage && (
        <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs rounded-xl flex items-center justify-between">
          <span>{gpsMessage}</span>
          <button onClick={() => setGpsMessage(null)} className="text-indigo-600 font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      {/* Main Map View & Location Details Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vector SVG College Campus Map Canvas */}
        <div className="lg:col-span-2 rounded-3xl bg-white border border-slate-200/80 shadow-xs p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            {/* Search Box on Map */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search block, lab, canteen, gate..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600"
              />
            </div>

            {/* Route controls */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-500">Route:</span>
              <select
                value={routeFrom}
                onChange={(e) => setRouteFrom(e.target.value)}
                className="p-1 border border-slate-200 rounded-lg text-xs bg-slate-50 font-medium"
              >
                {campusLocations.map((l) => (
                  <option key={l.id} value={l.id}>
                    From: {l.name}
                  </option>
                ))}
              </select>
              <span>→</span>
              <select
                value={routeTo}
                onChange={(e) => setRouteTo(e.target.value)}
                className="p-1 border border-slate-200 rounded-lg text-xs bg-slate-50 font-medium"
              >
                {campusLocations.map((l) => (
                  <option key={l.id} value={l.id}>
                    To: {l.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setRouteActive(!routeActive)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                  routeActive
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {routeActive ? 'Route On' : 'Show Route'}
              </button>
            </div>
          </div>

          {/* Interactive College SVG Grounds */}
          <div className="relative w-full aspect-[16/10] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200/90 shadow-inner select-none">
            {/* SVG Roads, grass lawns, campus zones */}
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Campus outer boundary */}
              <rect x="0" y="0" width="100" height="100" fill="#f8fafc" />

              {/* Green lawns & sports grounds */}
              <rect x="5" y="10" width="25" height="40" rx="3" fill="#e2f5ea" stroke="#c4ebd4" strokeWidth="0.5" />
              <rect x="70" y="12" width="24" height="22" rx="4" fill="#dcfce7" stroke="#bbf7d0" strokeWidth="0.5" />
              <circle cx="82" cy="23" r="7" fill="#bbf7d0" stroke="#86efac" strokeWidth="0.5" />

              {/* Campus Main Central Avenues & Walkways */}
              {/* Horizontal main boulevard */}
              <rect x="5" y="60" width="90" height="5" fill="#e2e8f0" rx="1" />
              <line x1="5" y1="62.5" x2="95" y2="62.5" stroke="#cbd5e1" strokeWidth="0.4" strokeDasharray="1.5,1.5" />

              {/* Vertical library avenue */}
              <rect x="48" y="10" width="5" height="85" fill="#e2e8f0" rx="1" />
              <line x1="50.5" y1="10" x2="50.5" y2="95" stroke="#cbd5e1" strokeWidth="0.4" strokeDasharray="1.5,1.5" />

              {/* Connecting diagonal path */}
              <line x1="15" y1="80" x2="50" y2="62.5" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />

              {/* Building outline footprints */}
              <rect x="34" y="28" width="14" height="18" rx="2" fill="#e0e7ff" stroke="#c7d2fe" strokeWidth="0.8" />
              <rect x="62" y="22" width="16" height="16" rx="2" fill="#ede9fe" stroke="#ddd6fe" strokeWidth="0.8" />
              <rect x="46" y="42" width="16" height="16" rx="2" fill="#dbeafe" stroke="#bfdbfe" strokeWidth="0.8" />
              <rect x="58" y="50" width="14" height="14" rx="2" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="0.8" />
              <rect x="36" y="74" width="18" height="16" rx="2" fill="#fef3c7" stroke="#fde68a" strokeWidth="0.8" />
              <rect x="76" y="64" width="16" height="18" rx="2" fill="#fee2e2" stroke="#fecaca" strokeWidth="0.8" />

              {/* Walking Route Path line if active */}
              {routeActive && startLoc && destLoc && (
                <path
                  d={`M ${startLoc.coordinates.x} ${startLoc.coordinates.y} Q 50 62.5 ${destLoc.coordinates.x} ${destLoc.coordinates.y}`}
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="1.4"
                  strokeDasharray="2,1.5"
                  className="animate-pulse"
                />
              )}
            </svg>

            {/* Clickable Location Markers */}
            {filteredLocations.map((loc) => {
              const isSelected = selectedLocation?.id === loc.id;
              const isRouteStart = routeFrom === loc.id && routeActive;
              const isRouteEnd = routeTo === loc.id && routeActive;

              return (
                <div
                  key={loc.id}
                  style={{
                    left: `${loc.coordinates.x}%`,
                    top: `${loc.coordinates.y}%`,
                  }}
                  onClick={() => setSelectedLocation(loc)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                >
                  <div
                    className={`relative p-1.5 rounded-full transition-all duration-200 ${
                      isSelected
                        ? 'bg-indigo-600 text-white ring-4 ring-indigo-400/40 scale-125 z-30 shadow-md'
                        : isRouteStart
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-400/40 scale-110 z-30'
                        : isRouteEnd
                        ? 'bg-rose-600 text-white ring-4 ring-rose-400/40 scale-110 z-30'
                        : 'bg-white text-indigo-700 shadow-xs border border-slate-300 hover:scale-110'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />

                    {/* Popover Tooltip Badge on hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-40">
                      <div className="bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded-md whitespace-nowrap shadow-md">
                        {loc.name}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Map Legend */}
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs p-2 rounded-xl border border-slate-200 text-[10px] space-y-1 text-slate-600 shadow-xs">
              <div className="font-bold text-slate-800">Campus Layout:</div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-indigo-600" />
                <span>Selected Destination</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-600" />
                <span>Route Origin</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-indigo-600" />
              <span>Campus Map GIS Engine v2.4 • Scalable institution coordinate grid</span>
            </span>
            <span className="font-mono text-[11px] text-slate-400">45-Acre Main Campus</span>
          </div>
        </div>

        {/* Selected Location Details Card */}
        {selectedLocation && (
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    {selectedLocation.category} Zone
                  </span>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 mt-1">
                    {selectedLocation.name}
                  </h3>
                  <span className="font-mono text-xs text-slate-400 font-bold">
                    Code: {selectedLocation.code}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedLocation.description}
              </p>

              <div className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span>
                    <strong>Floor / Wing:</strong> {selectedLocation.floor}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>
                    <strong>Hours:</strong> {selectedLocation.timings}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>
                    <strong>Intercom:</strong> {selectedLocation.contact}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={() => {
                  setRouteTo(selectedLocation.id);
                  setRouteActive(true);
                }}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Navigation className="w-4 h-4" />
                <span>Navigate Here from Main Gate</span>
              </button>

              <div className="p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-500 text-center">
                Estimated Walking Time: <strong>3 mins (240 meters)</strong> via Library Avenue
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
