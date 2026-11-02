import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Sparkles, Filter, ExternalLink, Plus, AlertCircle, Crosshair } from 'lucide-react';

const escapeMapHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}[character]));

export const MemoryMapPage = ({ geoMemories, onAddGeoMemory, onNavigate, isRealTimeMode = false, darkMode }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [activeMemory, setActiveMemory] = useState(geoMemories[0] || null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState(null);
  const [isAddingModal, setIsAddingModal] = useState(false);

  // New location form state
  const [newTitle, setNewTitle] = useState('');
  const [newLocationName, setNewLocationName] = useState('');
  const [newLat, setNewLat] = useState('');
  const [newLng, setNewLng] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newType, setNewType] = useState('note');
  const [validationError, setValidationError] = useState('');
  const [savingMemory, setSavingMemory] = useState(false);

  useEffect(() => {
    setActiveMemory((current) => geoMemories.find((memory) => memory.id === current?.id) || geoMemories[0] || null);
  }, [geoMemories]);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: geoMemories[0] ? [geoMemories[0].lat, geoMemories[0].lng] : [37.7749, -122.4194],
      zoom: 3,
      minZoom: 2,
      maxZoom: 18,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const filtered = geoMemories.filter(
      (m) => selectedFilter === 'ALL' || m.type === selectedFilter.toLowerCase()
    );

    filtered.forEach((item) => {
      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `<div style="
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #6366f1;
          border: 2px solid #ffffff;
          box-shadow: 0 0 16px rgba(99,102,241,0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 11px;
          font-weight: bold;
          cursor: pointer;
        ">📍</div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

      const marker = L.marker([item.lat, item.lng], { icon: customIcon }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; padding: 4px; min-width: 160px;">
          <div style="font-weight: bold; margin-bottom: 3px; color: #6366f1;">${escapeMapHtml(item.title)}</div>
          <div style="color: #64748b; font-size: 10px; margin-bottom: 5px;">📍 ${escapeMapHtml(item.locationName)}</div>
          <div style="font-size: 11px; line-height: 1.4; color: #1e293b;">${escapeMapHtml(item.summary)}</div>
        </div>
      `);

      marker.on('click', () => {
        setActiveMemory(item);
      });

      markersRef.current.push(marker);
    });
  }, [geoMemories, selectedFilter]);

  // Real browser GPS location fetch
  const handleGetCurrentGps = () => {
    setGpsLoading(true);
    setGpsError(null);

    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setGpsLoading(false);

        // Pre-fill form or create pin
        setNewLat(Number(latitude.toFixed(4)));
        setNewLng(Number(longitude.toFixed(4)));
        setNewLocationName(`Live Location (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°)`);
        setIsAddingModal(true);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 12, { duration: 1.5 });
        }
      },
      (error) => {
        setGpsLoading(false);
        setGpsError(`GPS error: ${error.message}. Please allow location access in your browser settings.`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleFlyTo = (item) => {
    setActiveMemory(item);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([item.lat, item.lng], 11, { duration: 1.2 });
    }
  };

  const handleSaveNewMemory = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setValidationError('Title is required');
      return;
    }
    if (!newLocationName.trim()) {
      setValidationError('Location name is required');
      return;
    }
    if (!Number.isFinite(Number(newLat)) || !Number.isFinite(Number(newLng))
      || Number(newLat) < -90 || Number(newLat) > 90
      || Number(newLng) < -180 || Number(newLng) > 180) {
      setValidationError('Enter valid coordinates: latitude −90 to 90 and longitude −180 to 180.');
      return;
    }

    const created = {
      id: `geo-${Date.now()}`,
      title: newTitle.trim(),
      type: newType,
      locationName: newLocationName.trim(),
      lat: Number(newLat),
      lng: Number(newLng),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      summary: newSummary.trim(),
      tags: ['real-time', 'live-gps'],
    };

    setSavingMemory(true);
    setValidationError('');
    try {
      await onAddGeoMemory(created);
      setActiveMemory(created);
      setIsAddingModal(false);
      setNewTitle('');
      setNewSummary('');
      setNewLat('');
      setNewLng('');
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([created.lat, created.lng], 10, { duration: 1.2 });
      }
    } catch (error) {
      setValidationError(error.message || 'The location memory could not be saved.');
    } finally {
      setSavingMemory(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-4 lg:p-8 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Real-Time Geo-Spatial Memory Map
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800/60 text-[10px] font-semibold text-cyan-300">
              {isRealTimeMode ? 'PRIVATE LOCATIONS' : 'DEMO DATA'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Capture your coordinates only after you request browser location permission. Map tiles load from OpenStreetMap.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleGetCurrentGps}
            disabled={gpsLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Crosshair className={`w-3.5 h-3.5 ${gpsLoading ? 'animate-spin' : ''}`} />
            <span>{gpsLoading ? 'Acquiring GPS...' : 'Capture My GPS Location'}</span>
          </button>

          <button
            onClick={() => setIsAddingModal(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              darkMode ? 'bg-[#0c1024] border-indigo-950 text-slate-200 hover:bg-indigo-900/30' : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Plus className="w-3.5 h-3.5 text-indigo-400" />
            <span>Add Pin</span>
          </button>
        </div>

        <p className="text-[11px] leading-relaxed text-slate-400">
          Your browser will ask before sharing precise GPS coordinates. Coordinates are saved only when you submit a pin. Map tiles are requested from OpenStreetMap; see the privacy note in README.
        </p>
      </div>

      {/* GPS Error Notification if blocked */}
      {gpsError && (
        <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{gpsError}</span>
        </div>
      )}

      {/* Filter Pills */}
      <div className="flex items-center gap-2">
        {['ALL', 'MEETING', 'VOICE', 'NOTE'].map((f) => (
          <button
            key={f}
            onClick={() => setSelectedFilter(f)}
            className={`px-3 py-1 text-xs rounded-lg border font-medium transition-colors cursor-pointer ${
              selectedFilter === f
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                : darkMode
                ? 'bg-[#0c1024] text-slate-400 border-indigo-950 hover:text-white'
                : 'bg-white text-slate-600 border-slate-300 hover:text-slate-900'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Main Map & Memory List Split */}
      <div className={`flex-1 rounded-2xl border overflow-hidden flex flex-col lg:flex-row ${
        darkMode ? 'border-indigo-950/80 bg-[#070914]' : 'border-slate-200 bg-white shadow-sm'
      }`}>
        {/* Leaflet Map Canvas */}
        <div className="flex-1 relative min-h-[300px]">
          <div ref={mapContainerRef} className="w-full h-full z-10" />
        </div>

        {/* Right Memory Drawer */}
        <div className={`w-full lg:w-80 border-t lg:border-t-0 lg:border-l p-5 flex flex-col justify-between overflow-y-auto ${
          darkMode ? 'border-indigo-950/80 bg-[#090d20]/95 text-white' : 'border-slate-200 bg-slate-50 text-slate-900'
        }`}>
          <div className="space-y-4">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>REAL-TIME MEMORIES ({geoMemories.length})</span>
            </div>

            <div className="space-y-2.5">
              {geoMemories.map((mem) => {
                const isActive = activeMemory?.id === mem.id;
                return (
                  <div
                    key={mem.id}
                    onClick={() => handleFlyTo(mem)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isActive
                        ? darkMode
                          ? 'bg-[#101638] border-indigo-500 shadow-sm text-white'
                          : 'bg-indigo-50 border-indigo-500 text-slate-900'
                        : darkMode
                        ? 'bg-[#0c1024] border-indigo-950/80 hover:border-indigo-800 text-slate-300'
                        : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold truncate pr-2">{mem.title}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 uppercase shrink-0">
                        {mem.type}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span className="truncate">{mem.locationName}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 font-mono">
                      {mem.lat.toFixed(2)}°, {mem.lng.toFixed(2)}° · {mem.date}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {activeMemory && (
            <div className="pt-4 border-t border-indigo-950/60 mt-4">
              <button
                onClick={() => {
                  if (activeMemory.type === 'meeting') onNavigate('meetings');
                  else if (activeMemory.type === 'voice') onNavigate('voice');
                  else onNavigate('notes');
                }}
                className="w-full py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Open Memory in Vault</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add New Geotagged Memory Modal */}
      {isAddingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl border p-6 space-y-4 ${
            darkMode ? 'bg-[#0c1024] border-indigo-900 text-white' : 'bg-white border-slate-300 text-slate-900 shadow-xl'
          }`}>
            <h3 className="text-sm font-bold">Add Real-Time Memory Pin</h3>

            {validationError && (
              <div className="p-2.5 rounded-lg bg-rose-950/50 border border-rose-800 text-rose-300 text-xs">
                {validationError}
              </div>
            )}

            <form onSubmit={handleSaveNewMemory} className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Memory Title</label>
                <input
                  type="text"
                  placeholder="e.g. Brainstorming session at cafe"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border focus:outline-none focus:border-indigo-500 ${
                    darkMode ? 'bg-[#0e1329] border-indigo-950 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Location Name</label>
                <input
                  type="text"
                  placeholder="e.g. San Francisco Market Street"
                  value={newLocationName}
                  onChange={(e) => setNewLocationName(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border focus:outline-none focus:border-indigo-500 ${
                    darkMode ? 'bg-[#0e1329] border-indigo-950 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newLat}
                    onChange={(e) => setNewLat(parseFloat(e.target.value))}
                    className={`w-full px-3 py-2 text-xs rounded-lg border font-mono focus:outline-none ${
                      darkMode ? 'bg-[#0e1329] border-indigo-950 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newLng}
                    onChange={(e) => setNewLng(parseFloat(e.target.value))}
                    className={`w-full px-3 py-2 text-xs rounded-lg border font-mono focus:outline-none ${
                      darkMode ? 'bg-[#0e1329] border-indigo-950 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Memory Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border focus:outline-none ${
                    darkMode ? 'bg-[#0e1329] border-indigo-950 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="note">Note</option>
                  <option value="meeting">Meeting</option>
                  <option value="voice">Voice Memo</option>
                  <option value="screenshot">Screenshot</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Summary / Note</label>
                <textarea
                  rows={2}
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Key takeaway, decision, or coordinates detail..."
                  className={`w-full px-3 py-2 text-xs rounded-lg border focus:outline-none ${
                    darkMode ? 'bg-[#0e1329] border-indigo-950 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-sm"
                >
                  Save Pin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
