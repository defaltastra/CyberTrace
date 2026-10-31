import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { THREAT_CATEGORIES, SEVERITY_LEVELS } from '../data/threats';
import { themeColor, resolveThemeColor } from '../utils/theme';
import { formatDate } from '../utils/format';
import { ExternalLink, MapPin, Info } from 'lucide-react';

const SEVERITY_RADIUS = { critical: 13, high: 10, medium: 7, low: 5 };

function MapController({ selected }) {
  const map = useMap();
  useEffect(() => {
    if (selected && selected.lat && selected.lng) {
      map.flyTo([selected.lat, selected.lng], Math.max(map.getZoom(), 4), {
        duration: 1.2,
      });
    }
  }, [selected, map]);
  return null;
}

export default function ThreatMap({
  threats = [],
  onInspect,
  selected,
}) {
  const handleInspect = (e, threat) => {
    e.preventDefault();
    e.stopPropagation();
    onInspect(threat);
  };

  const markerColors = Object.fromEntries(
    Object.entries(SEVERITY_LEVELS).map(([key, sev]) => [
      key,
      resolveThemeColor(sev.themeKey),
    ])
  );

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden border border-border-subtle shadow-2xl bg-bg"
      style={{ height: '100%' }}
    >
      {/* Top Floating Disclaimer & Live Counter */}
      <div className="absolute top-3 left-3 right-14 sm:right-auto z-[1000] flex flex-col gap-1.5 max-w-sm pointer-events-none">
        <div className="bg-bg/90 border border-border-subtle rounded-lg px-3 py-1.5 text-xs text-text flex items-center gap-2 backdrop-blur-md shadow-lg pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-[11px]">
            <strong className="text-accent">{threats.length}</strong> menaces cartographiées
          </span>
        </div>
        <div className="bg-bg/85 border border-amber/30 rounded-lg px-3 py-1.5 text-[11px] text-amber/90 backdrop-blur-md shadow-lg pointer-events-auto flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 shrink-0 text-amber" />
          <span>Géo-localisation indicative basée sur les infrastructures déclarées</span>
        </div>
      </div>

      {/* Bottom Floating Legend */}
      <div className="absolute bottom-3 left-3 z-[1000] hidden sm:flex items-center gap-3 bg-bg/90 border border-border-subtle rounded-lg px-3 py-2 text-xs backdrop-blur-md shadow-lg">
        <div className="text-[11px] font-mono text-text-muted uppercase">Gravité :</div>
        {Object.entries(SEVERITY_LEVELS).map(([k, v]) => (
          <div key={k} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: themeColor(v.themeKey) }}
            />
            <span className="text-[11px] text-text-muted capitalize">{v.label}</span>
          </div>
        ))}
      </div>

      <MapContainer
        center={[24, 10]}
        zoom={2}
        minZoom={2}
        maxZoom={11}
        style={{ height: '100%', width: '100%', background: 'rgb(var(--color-bg-rgb))' }}
        zoomControl={false}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <ZoomControl position="topright" />

        {threats.map((threat) => {
          if (!threat.lat || !threat.lng) return null;
          const cat = THREAT_CATEGORIES[threat.type] || { label: threat.type, color: '#48D597' };
          const sev = SEVERITY_LEVELS[threat.severity] || { label: threat.severity, themeKey: 'amber' };
          const markerColor = markerColors[threat.severity] || markerColors.medium;
          const isSelected = selected?.id === threat.id;
          const radius = (SEVERITY_RADIUS[threat.severity] || 8) + (isSelected ? 5 : 0);

          return (
            <CircleMarker
              key={threat.id}
              center={[threat.lat, threat.lng]}
              radius={radius}
              pathOptions={{
                color: isSelected ? '#FFFFFF' : markerColor,
                fillColor: markerColor,
                fillOpacity: isSelected ? 0.95 : threat.severity === 'critical' ? 0.75 : 0.55,
                weight: isSelected ? 3 : 1.5,
              }}
            >
              <Popup className="threat-marker-popup" closeButton={true}>
                <div className="text-sm min-w-[240px] max-w-[280px] p-1 font-sans">
                  <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                      style={{ backgroundColor: themeColor(sev.themeKey, 0.2), color: themeColor(sev.themeKey) }}
                    >
                      {sev.label}
                    </span>
                    <span className="text-[11px] text-text-muted">{cat.label}</span>
                    {threat.isReal && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-accent/20 text-accent font-mono ml-auto">
                        CISA LIVE
                      </span>
                    )}
                  </div>

                  <p className="font-bold text-text mb-1 text-xs leading-snug line-clamp-2">
                    {threat.title}
                  </p>

                  <div className="flex items-center gap-1 text-[11px] text-text-muted mb-2.5">
                    <MapPin className="w-3 h-3 text-accent" />
                    <span>{threat.country}</span>
                    <span className="mx-1">•</span>
                    <span>{formatDate(threat.timestamp)}</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleInspect(e, threat)}
                    className="w-full py-2 px-3 rounded-lg bg-accent text-bg hover:opacity-95 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-98"
                  >
                    <span>Inspecter l'incident</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        <MapController selected={selected} />
      </MapContainer>
    </div>
  );
}
