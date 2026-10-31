import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ThreatDetail from './components/ThreatDetail';
import ErrorBoundary from './components/ErrorBoundary';

// Views
import DashboardView from './views/DashboardView';
import AboutSection from './components/AboutSection';

import { DEFAULT_FILTERS } from './components/Filters';

import { fetchLiveThreats } from './services/threatService';
import { applyTheme } from './utils/theme';
import { THREATS as FALLBACK_THREATS } from './data/threats';

const GlobalMapView = lazy(() => import('./views/GlobalMapView'));
const ThreatExplorerView = lazy(() => import('./views/ThreatExplorerView'));
const LiveFeedView = lazy(() => import('./views/LiveFeedView'));
const SettingsView = lazy(() => import('./views/SettingsView'));

function Loader() {
  return (
    <div className="h-[60dvh] flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      <div className="text-sm font-mono text-text-muted">
        Initialisation de CyberTrace et synchronisation des flux CISA KEV...
      </div>
    </div>
  );
}

export default function App() {
  const [threats, setThreats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [catalogVersion, setCatalogVersion] = useState('2026.10');
  const [selectedThreat, setSelectedThreat] = useState(null);

  const [theme, setTheme] = useState(
    () => localStorage.getItem('cybertrace_theme') || 'toxic-earth'
  );

  const [refreshInterval, setRefreshInterval] = useState(() => {
    const saved = localStorage.getItem('cybertrace_refresh_interval');
    return saved !== null ? Number(saved) : 30;
  });

  const [countdown, setCountdown] = useState(refreshInterval || 30);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const handleRefreshIntervalChange = (val) => {
    setRefreshInterval(val);
    setCountdown(val);
    localStorage.setItem('cybertrace_refresh_interval', val);
  };

  const handleResetSettings = () => {
    setTheme('toxic-earth');
    handleRefreshIntervalChange(30);
    localStorage.removeItem('cybertrace_theme');
    localStorage.removeItem('cybertrace_refresh_interval');
  };

  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const loadThreats = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const data = await fetchLiveThreats({ maxItems: 140 });
      setThreats(data.threats);
      setCatalogVersion(data.catalogVersion);
    } catch (err) {
      console.warn('Threat fetch fallback to bundled telemetry:', err);
      setThreats(FALLBACK_THREATS);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadThreats(false);
  }, [loadThreats]);

  const handleManualRefresh = useCallback(() => {
    loadThreats(true);
    if (refreshInterval > 0) {
      setCountdown(refreshInterval);
    }
  }, [loadThreats, refreshInterval]);

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
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[999999] focus:px-3 focus:py-2 focus:rounded-lg focus:bg-accent focus:text-bg focus:text-xs focus:font-mono"
        >
          Aller au contenu principal
        </a>
        <div className="sticky top-0 z-50">
          <Header
            criticalCount={criticalCount}
            onRefresh={handleManualRefresh}
            isRefreshing={isRefreshing}
            catalogVersion={catalogVersion}
            refreshCountdown={countdown}
            refreshInterval={refreshInterval}
          />

          <Navbar />
        </div>

        <main
          id="main"
          tabIndex={-1}
          className="flex-1 px-4 sm:px-6 py-5 max-w-[1600px] w-full mx-auto"
        >
          {isLoading ? (
            <Loader />
          ) : (
            <ErrorBoundary>
              <Suspense fallback={<Loader />}>
                <Routes>
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

                  <Route
                    path="/explorer"
                    element={
                      <ThreatExplorerView
                        filteredThreats={filteredThreats}
                        filters={filters}
                        onFiltersChange={setFilters}
                        onSelectThreat={setSelectedThreat}
                      />
                    }
                  />

                  <Route
                    path="/feed"
                    element={
                      <LiveFeedView
                        threats={threats}
                        onRefresh={handleManualRefresh}
                        isRefreshing={isRefreshing}
                        onSelectThreat={setSelectedThreat}
                      />
                    }
                  />

                  <Route
                    path="/settings"
                    element={
                      <SettingsView
                        theme={theme}
                        onThemeChange={setTheme}
                        refreshInterval={refreshInterval}
                        onRefreshIntervalChange={handleRefreshIntervalChange}
                        onResetSettings={handleResetSettings}
                      />
                    }
                  />

                  <Route path="/about" element={<div className="max-w-5xl mx-auto py-2"><AboutSection /></div>} />

                  <Route
                    path="*"
                    element={
                      <div className="min-h-[60dvh] flex flex-col items-center justify-center gap-3 px-4 text-center">
                        <h1 className="text-lg font-semibold text-text">Page introuvable</h1>
                        <p className="max-w-md text-sm font-mono text-text-muted">
                          Cette adresse ne correspond à aucune vue de CyberTrace.
                        </p>
                        <Link to="/" className="text-sm font-mono text-accent hover:underline">
                          Retour au tableau de bord
                        </Link>
                      </div>
                    }
                  />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          )}
        </main>

        {selectedThreat && (
          <ThreatDetail
            threat={selectedThreat}
            onClose={() => setSelectedThreat(null)}
          />
        )}

        <Footer />
      </div>
    </BrowserRouter>
  );
}
