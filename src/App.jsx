import { useState, useEffect, useMemo, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ThreatDetail from './components/ThreatDetail';

// Views
import DashboardView from './views/DashboardView';
import GlobalMapView from './views/GlobalMapView';
import ThreatExplorerView from './views/ThreatExplorerView';
import LiveFeedView from './views/LiveFeedView';
import SettingsView from './views/SettingsView';
import AboutView from './views/AboutView';

import { fetchLiveThreats } from './services/threatService';
import { applyTheme } from './utils/theme';
import { THREATS as FALLBACK_THREATS } from './data/threats';

export default function App() {
  const [threats, setThreats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [catalogVersion, setCatalogVersion] = useState('2026.10');
  const [selectedThreat, setSelectedThreat] = useState(null);

  // Settings: Theme & Refresh Rate
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('cybertrace_theme') || 'toxic-earth';
  });

  const [refreshInterval, setRefreshInterval] = useState(() => {
    const saved = localStorage.getItem('cybertrace_refresh_interval');
    return saved !== null ? Number(saved) : 30;
  });

  // Countdown for auto-refresh in seconds
  const [countdown, setCountdown] = useState(refreshInterval || 30);

  // Apply theme to DOM and CSS variables immediately
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Handle theme switch
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  // Handle refresh interval change
  const handleRefreshIntervalChange = (val) => {
    setRefreshInterval(val);
    setCountdown(val);
    localStorage.setItem('cybertrace_refresh_interval', val);
  };

  const handleResetSettings = () => {
    handleThemeChange('toxic-earth');
    handleRefreshIntervalChange(30);
    localStorage.removeItem('cybertrace_theme');
    localStorage.removeItem('cybertrace_refresh_interval');
    localStorage.removeItem('cybertrace_otx_key');
  };

  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    severity: '',
    source: '',
    country: '',
  });

  // Load real CISA KEV + telemetry threats
  const loadThreats = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const data = await fetchLiveThreats({ maxItems: 140 });
      if (data && data.threats && data.threats.length > 0) {
        setThreats(data.threats);
        if (data.catalogVersion) setCatalogVersion(data.catalogVersion);
      } else {
        setThreats(FALLBACK_THREATS);
      }
    } catch (err) {
      console.warn('Threat fetch fallback to bundled telemetry:', err);
      setThreats(FALLBACK_THREATS);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadThreats(false);
  }, [loadThreats]);

  // Handle manual refresh from header button
  const handleManualRefresh = useCallback(() => {
    loadThreats(true);
    if (refreshInterval > 0) {
      setCountdown(refreshInterval);
    }
  }, [loadThreats, refreshInterval]);

  // Live countdown timer & auto-refresh execution
  useEffect(() => {
    if (!refreshInterval || refreshInterval <= 0) return;

    setCountdown(refreshInterval);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          loadThreats(true);
          return refreshInterval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [refreshInterval, loadThreats]);

  // Global filtering logic
  const filteredThreats = useMemo(() => {
    return threats.filter((threat) => {
      if (filters.type && threat.type !== filters.type) return false;
      if (filters.severity && threat.severity !== filters.severity) return false;
      if (filters.source === 'real' && !threat.isReal) return false;
      if (filters.source === 'demo' && threat.isReal) return false;
      if (filters.country && threat.country !== filters.country) return false;

      if (filters.search) {
        const query = filters.search.toLowerCase().trim();
        const inTitle = (threat.title || '').toLowerCase().includes(query);
        const inDesc = (threat.description || '').toLowerCase().includes(query);
        const inId = (threat.id || '').toLowerCase().includes(query);
        const inCountry = (threat.country || '').toLowerCase().includes(query);
        const inTags = threat.tags?.some((t) => (t || '').toLowerCase().includes(query));
        const inIocs = threat.iocs?.some((i) => (i || '').toLowerCase().includes(query));
        const inVendor = (threat.vendorProject || '').toLowerCase().includes(query);

        if (!inTitle && !inDesc && !inId && !inCountry && !inTags && !inIocs && !inVendor) {
          return false;
        }
      }

      return true;
    });
  }, [threats, filters]);

  const criticalCount = useMemo(() => {
    return threats.filter((t) => t.severity === 'critical').length;
  }, [threats]);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-bg text-text selection:bg-accent selection:text-bg">
        {/* 1. Header with Live Countdown next to Actualiser */}
        <Header
          criticalCount={criticalCount}
          onRefresh={handleManualRefresh}
          isRefreshing={isRefreshing}
          catalogVersion={catalogVersion}
          refreshCountdown={countdown}
          refreshInterval={refreshInterval}
        />

        {/* 2. Top Navigation Bar */}
        <Navbar criticalCount={criticalCount} />

        {/* 3. Main Views */}
        <main className="flex-1 px-4 sm:px-6 py-5 max-w-[1600px] w-full mx-auto">
          {isLoading ? (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              <div className="text-sm font-mono text-text-muted">
                Initialisation de CyberTrace et synchronisation des flux CISA KEV...
              </div>
            </div>
          ) : (
            <Routes>
              {/* 1. Tableau de Bord (Executive & Analytics Overview) */}
              <Route
                path="/"
                element={
                  <DashboardView
                    threats={threats}
                    selectedThreat={selectedThreat}
                    onSelectThreat={setSelectedThreat}
                    theme={theme}
                  />
                }
              />

              {/* 2. Carte Mondiale (Dedicated Full-Screen Interactive Map) */}
              <Route
                path="/map"
                element={
                  <GlobalMapView
                    threats={threats}
                    filteredThreats={filteredThreats}
                    filters={filters}
                    onFiltersChange={setFilters}
                    selectedThreat={selectedThreat}
                    onSelectThreat={setSelectedThreat}
                  />
                }
              />

              {/* 3. Explorateur (Search, Filter, Export) */}
              <Route
                path="/explorer"
                element={
                  <ThreatExplorerView
                    threats={threats}
                    filteredThreats={filteredThreats}
                    filters={filters}
                    onFiltersChange={setFilters}
                    selectedThreat={selectedThreat}
                    onSelectThreat={setSelectedThreat}
                  />
                }
              />

              {/* 4. Flux en Direct (Live Threat Stream) */}
              <Route
                path="/feed"
                element={
                  <LiveFeedView
                    threats={threats}
                    onRefresh={handleManualRefresh}
                    isRefreshing={isRefreshing}
                    catalogVersion={catalogVersion}
                    selectedThreat={selectedThreat}
                    onSelectThreat={setSelectedThreat}
                  />
                }
              />

              {/* 5. Paramètres (Themes Void, Gruvbox, Toxic Earth + Refresh Rate) */}
              <Route
                path="/settings"
                element={
                  <SettingsView
                    theme={theme}
                    onThemeChange={handleThemeChange}
                    refreshInterval={refreshInterval}
                    onRefreshIntervalChange={handleRefreshIntervalChange}
                    onResetSettings={handleResetSettings}
                  />
                }
              />

              {/* 6. À Propos & Créateurs */}
              <Route path="/about" element={<AboutView />} />
            </Routes>
          )}
        </main>

        {/* Global Inspection Modal for any threat clicked anywhere */}
        {selectedThreat && (
          <ThreatDetail
            threat={selectedThreat}
            onClose={() => setSelectedThreat(null)}
            isModal={true}
          />
        )}

        {/* 4. Footer with mandatory creators credits and LinkedIn links */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}
