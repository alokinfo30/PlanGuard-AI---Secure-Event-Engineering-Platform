import React, { useState } from 'react';
import { 
  MapPin, 
  Compass, 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  Maximize2, 
  Users, 
  Navigation,
  CheckCircle,
  AlertCircle,
  Layers
} from 'lucide-react';
import { Venue } from '../../types';

interface VenueMapModuleProps {
  activeTenant: string;
}

export const VenueMapModule: React.FC<VenueMapModuleProps> = ({ activeTenant }) => {
  const [cityLocation, setCityLocation] = useState('San Francisco, CA');
  const [guestCapacity, setGuestCapacity] = useState('500');
  const [vibe, setVibe] = useState('Cyber Innovation & Security');
  const [budgetTier, setBudgetTier] = useState('Enterprise Tier');
  const [isLoading, setIsLoading] = useState(false);

  // Selected layout view
  const [layoutStyle, setLayoutStyle] = useState<'theater' | 'banquet' | 'hybrid'>('theater');
  const [selectedVenue, setSelectedVenue] = useState<string>('ven-1');

  // Candidate venues
  const [venues, setVenues] = useState<Venue[]>([
    {
      id: 'ven-1',
      name: 'The Citadel Cyber Pavilion',
      address: '780 Mission Street, Financial District, San Francisco',
      maxCapacity: 650,
      approxCostPerDay: 48000,
      securityRating: 'Tier 4 Enterprise Defense',
      highlights: ['Dual biometric security gates', 'Faraday shielded VIP room', '4K LED video wall', 'Multi-zone fire egress'],
      layoutRecommended: 'Theater with Plenary Stage',
      lat: 37.7857,
      lng: -122.4011
    },
    {
      id: 'ven-2',
      name: 'Grand Horizon Concourse',
      address: '1000 4th Street, Mission Bay, San Francisco',
      maxCapacity: 800,
      approxCostPerDay: 54000,
      securityRating: 'Tier 3 Corporate High-Security',
      highlights: ['Direct waterfront terrace', 'Subterranean secure loading dock', 'Redundant power grid'],
      layoutRecommended: 'Hybrid Banquet & Exhibition',
      lat: 37.7735,
      lng: -122.3925
    },
    {
      id: 'ven-3',
      name: 'Skyline Atrium & Glasshouse',
      address: '450 Sutter St, Downtown, San Francisco',
      maxCapacity: 350,
      approxCostPerDay: 32000,
      securityRating: 'Tier 3 Boutique Secure',
      highlights: ['Panoramic city view', 'Acoustically isolated break-outs', 'Natural skylight'],
      layoutRecommended: 'Executive Roundtables',
      lat: 37.7895,
      lng: -122.4069
    }
  ]);

  const handleSearchVenues = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/events/venues/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': activeTenant,
        },
        body: JSON.stringify({
          location: cityLocation,
          guestCount: Number(guestCapacity) || 500,
          vibe,
          budgetTier,
        }),
      });

      const data = await res.json();
      if (data.venues && data.venues.length > 0) {
        setVenues(data.venues);
        setSelectedVenue(data.venues[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const activeVenueObj = venues.find(v => v.id === selectedVenue) || venues[0];

  return (
    <div className="space-y-8">
      
      {/* Module Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Module C: Local Venues & Spatial Layout Engine
              </h2>
              <p className="text-xs text-slate-400">
                Security-rated regional venue intelligence and interactive floorplan egress modeling
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" />
            <span>Interactive Floorplan & Spatial GIS</span>
          </span>
        </div>

        {/* Search Parameters Form */}
        <form onSubmit={handleSearchVenues} className="mt-5 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Metropolitan Region</label>
            <input
              type="text"
              value={cityLocation}
              onChange={(e) => setCityLocation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Guest Capacity Threshold</label>
            <input
              type="number"
              value={guestCapacity}
              onChange={(e) => setGuestCapacity(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Atmosphere / Vibe</label>
            <input
              type="text"
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isLoading ? 'Querying Venues...' : 'Extract Venues'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Main Grid: Venues List + Interactive Floorplan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Venue Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span>Vetted Venue Candidates</span>
          </h3>

          <div className="space-y-3">
            {venues.map((venue) => {
              const isSelected = selectedVenue === venue.id;
              return (
                <div
                  key={venue.id}
                  onClick={() => setSelectedVenue(venue.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-500/10'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-white text-sm">{venue.name}</h4>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-cyan-400" />
                        <span>{venue.address}</span>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-200">
                      ${venue.approxCostPerDay?.toLocaleString()}/day
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 text-[10px] font-semibold">
                      {venue.securityRating}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      Cap: <strong className="text-white">{venue.maxCapacity}</strong> guests
                    </span>
                  </div>

                  {/* Highlights pills */}
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {venue.highlights?.map((h, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Floorplan Visualizer (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Architectural Floorplan & Egress Simulation</span>
            </h3>

            {/* Layout selector */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setLayoutStyle('theater')}
                className={`px-2.5 py-1 rounded transition text-[11px] font-medium ${
                  layoutStyle === 'theater' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Theater
              </button>
              <button
                onClick={() => setLayoutStyle('banquet')}
                className={`px-2.5 py-1 rounded transition text-[11px] font-medium ${
                  layoutStyle === 'banquet' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Banquet
              </button>
              <button
                onClick={() => setLayoutStyle('hybrid')}
                className={`px-2.5 py-1 rounded transition text-[11px] font-medium ${
                  layoutStyle === 'hybrid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Hybrid
              </button>
            </div>
          </div>

          {/* Interactive SVG Floorplan Canvas */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs mb-3 pb-2 border-b border-slate-800">
              <span className="font-semibold text-white">
                Venue: <span className="text-cyan-400">{activeVenueObj.name}</span>
              </span>
              <span className="text-slate-400 font-mono text-[11px]">
                Egress Safety: <span className="text-emerald-400 font-bold">100% Code Verified</span>
              </span>
            </div>

            {/* SVG Diagram */}
            <div className="w-full aspect-[16/10] bg-slate-900/80 rounded-xl border border-slate-800 relative flex items-center justify-center p-2">
              <svg viewBox="0 0 800 500" className="w-full h-full select-none">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                  </pattern>
                </defs>

                {/* Background Grid */}
                <rect width="800" height="500" fill="url(#grid)" rx="8" />

                {/* Emergency Egress Exits */}
                <g>
                  {/* Top Exit */}
                  <rect x="360" y="5" width="80" height="15" rx="3" fill="#10b981" />
                  <text x="400" y="16" fill="#022c22" fontSize="9" fontWeight="bold" textAnchor="middle">EXIT 1 (NORTH)</text>

                  {/* Left Exit */}
                  <rect x="5" y="220" width="15" height="60" rx="3" fill="#10b981" />
                  <text x="13" y="255" fill="#022c22" fontSize="8" fontWeight="bold" transform="rotate(-90 13 255)" textAnchor="middle">EXIT 2</text>

                  {/* Right Exit */}
                  <rect x="780" y="220" width="15" height="60" rx="3" fill="#10b981" />
                  <text x="787" y="255" fill="#022c22" fontSize="8" fontWeight="bold" transform="rotate(90 787 255)" textAnchor="middle">EXIT 3</text>
                </g>

                {/* Main Plenary Stage */}
                <rect x="220" y="40" width="360" height="70" rx="8" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" />
                <text x="400" y="70" fill="#a5b4fc" fontSize="14" fontWeight="bold" textAnchor="middle">PRIMARY KEYNOTE STAGE</text>
                <text x="400" y="90" fill="#818cf8" fontSize="10" textAnchor="middle">4K LED Video Backdrop &middot; Biometric Access</text>

                {/* AV Control Booth at Rear */}
                <rect x="320" y="420" width="160" height="50" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 2" />
                <text x="400" y="445" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">AV & BROADCAST BOOTH</text>
                <text x="400" y="460" fill="#94a3b8" fontSize="8" textAnchor="middle">Multi-track Audio & Streaming Switcher</text>

                {/* Security Registration Checkpoint at Entrance */}
                <rect x="60" y="420" width="180" height="50" rx="6" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
                <text x="150" y="445" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">SECURITY & RFID BADGING</text>
                <text x="150" y="460" fill="#a7f3d0" fontSize="8" textAnchor="middle">Fast-track QR Scan Lane</text>

                {/* VIP / Speaker Green Room */}
                <rect x="580" y="420" width="160" height="50" rx="6" fill="#312e81" stroke="#818cf8" strokeWidth="1.5" />
                <text x="660" y="445" fill="#c7d2fe" fontSize="11" fontWeight="bold" textAnchor="middle">VIP GREEN ROOM</text>
                <text x="660" y="460" fill="#e0e7ff" fontSize="8" textAnchor="middle">Faraday Shielded &middot; Keycard</text>

                {/* Seating Configurations dynamically based on layoutStyle */}
                {layoutStyle === 'theater' && (
                  <g transform="translate(140, 140)">
                    {/* Rows of theater seats */}
                    {[0, 1, 2, 3, 4].map(row => (
                      <g key={row} transform={`translate(0, ${row * 50})`}>
                        {/* Left block */}
                        <rect x="0" y="0" width="220" height="24" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                        <text x="110" y="16" fill="#94a3b8" fontSize="9" textAnchor="middle">Seating Block A - Row {row + 1}</text>
                        {/* Right block */}
                        <rect x="300" y="0" width="220" height="24" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                        <text x="410" y="16" fill="#94a3b8" fontSize="9" textAnchor="middle">Seating Block B - Row {row + 1}</text>
                        {/* Center Aisle */}
                        <line x1="260" y1="-10" x2="260" y2="40" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
                      </g>
                    ))}
                  </g>
                )}

                {layoutStyle === 'banquet' && (
                  <g transform="translate(120, 150)">
                    {/* Banquet Round Tables */}
                    {[
                      { x: 60, y: 30, label: 'Table 1' },
                      { x: 200, y: 30, label: 'Table 2' },
                      { x: 340, y: 30, label: 'Table 3' },
                      { x: 480, y: 30, label: 'Table 4' },
                      { x: 60, y: 150, label: 'Table 5' },
                      { x: 200, y: 150, label: 'Table 6' },
                      { x: 340, y: 150, label: 'Table 7' },
                      { x: 480, y: 150, label: 'Table 8' },
                    ].map((tbl, i) => (
                      <g key={i}>
                        <circle cx={tbl.x} cy={tbl.y} r="32" fill="#1e293b" stroke="#6366f1" strokeWidth="2" />
                        <circle cx={tbl.x} cy={tbl.y} r="10" fill="#312e81" />
                        <text x={tbl.x} y={tbl.y + 3} fill="#ffffff" fontSize="9" textAnchor="middle">{tbl.label}</text>
                      </g>
                    ))}
                  </g>
                )}

                {layoutStyle === 'hybrid' && (
                  <g transform="translate(100, 140)">
                    {/* Front Theater, Rear Networking Lounges */}
                    <rect x="40" y="10" width="520" height="35" rx="6" fill="#1e293b" stroke="#334155" />
                    <text x="300" y="32" fill="#cbd5e1" fontSize="11" textAnchor="middle">Front Plenary Priority Tier (200 Seats)</text>

                    <rect x="40" y="65" width="520" height="35" rx="6" fill="#1e293b" stroke="#334155" />
                    <text x="300" y="87" fill="#cbd5e1" fontSize="11" textAnchor="middle">Secondary Tier (150 Seats)</text>

                    {/* Exhibition / Networking pods */}
                    <g transform="translate(50, 130)">
                      <rect x="0" y="0" width="140" height="80" rx="8" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
                      <text x="70" y="45" fill="#34d399" fontSize="10" textAnchor="middle">Demo Pod A</text>
                      <rect x="180" y="0" width="140" height="80" rx="8" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
                      <text x="250" y="45" fill="#34d399" fontSize="10" textAnchor="middle">Demo Pod B</text>
                      <rect x="360" y="0" width="140" height="80" rx="8" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
                      <text x="430" y="45" fill="#34d399" fontSize="10" textAnchor="middle">Demo Pod C</text>
                    </g>
                  </g>
                )}
              </svg>
            </div>

            {/* Layout Specs Footer */}
            <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>Simulated Capacity: <strong className="text-white">{guestCapacity}</strong> / {activeVenueObj.maxCapacity}</span>
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>3 Independent ADA-Compliant Egress Corridors</span>
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
