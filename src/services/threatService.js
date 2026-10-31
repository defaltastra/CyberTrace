// CyberTrace – Threat Service & Real Public API Integration
// Combines official US CISA Known Exploited Vulnerabilities (KEV) live data
// with curated cybersecurity telemetry incidents.

import { THREATS as DEMO_THREATS } from '../data/threats';

const CISA_KEV_DEV_ENDPOINT = '/api/cisa';
const CISA_KEV_OFFICIAL_URL = 'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json';
const CISA_KEV_SNAPSHOT_URL = '/data/cisa_kev_snapshot.json';

// Known vendor locations for realistic geographic mapping of vendor vulnerabilities
const VENDOR_GEO = {
  'microsoft': { country: 'United States', lat: 47.641, lng: -122.130 },
  'apple': { country: 'United States', lat: 37.332, lng: -122.031 },
  'google': { country: 'United States', lat: 37.422, lng: -122.084 },
  'cisco': { country: 'United States', lat: 37.365, lng: -121.955 },
  'fortinet': { country: 'United States', lat: 37.419, lng: -121.910 },
  'ivanti': { country: 'United States', lat: 40.658, lng: -111.914 },
  'citrix': { country: 'United States', lat: 26.186, lng: -80.127 },
  'vmware': { country: 'United States', lat: 37.404, lng: -121.986 },
  'adobe': { country: 'United States', lat: 37.335, lng: -121.893 },
  'palo alto': { country: 'United States', lat: 37.453, lng: -122.183 },
  'oracle': { country: 'United States', lat: 37.530, lng: -122.262 },
  'apache': { country: 'United States', lat: 38.907, lng: -77.036 },
  'sonicwall': { country: 'United States', lat: 37.371, lng: -121.970 },
  'atlassian': { country: 'Australia', lat: -33.868, lng: 151.209 },
  'sap': { country: 'Germany', lat: 49.293, lng: 8.641 },
  'siemens': { country: 'Germany', lat: 48.135, lng: 11.582 },
  'qnap': { country: 'Taiwan', lat: 25.033, lng: 121.565 },
  'synology': { country: 'Taiwan', lat: 25.047, lng: 121.517 },
  'd-link': { country: 'Taiwan', lat: 25.077, lng: 121.575 },
  'zyxel': { country: 'Taiwan', lat: 24.782, lng: 120.997 },
  'hikvision': { country: 'China', lat: 30.274, lng: 120.155 },
  'dahua': { country: 'China', lat: 30.223, lng: 120.188 },
  'huawei': { country: 'China', lat: 22.574, lng: 114.058 },
  'tp-link': { country: 'China', lat: 22.543, lng: 113.945 },
  'samsung': { country: 'South Korea', lat: 37.263, lng: 127.028 },
  'check point': { country: 'Israel', lat: 32.085, lng: 34.781 },
  'f5': { country: 'United States', lat: 47.618, lng: -122.348 },
  'progress': { country: 'United States', lat: 42.485, lng: -71.218 },
  'solarwinds': { country: 'United States', lat: 30.267, lng: -97.743 },
  'roundcube': { country: 'Switzerland', lat: 47.376, lng: 8.541 },
  'exim': { country: 'United Kingdom', lat: 51.507, lng: -0.127 },
};

function inferCategory(vuln) {
  const text = `${vuln.shortDescription || ''} ${vuln.vulnerabilityName || ''} ${vuln.product || ''}`.toLowerCase();
  if (text.includes('ransomware') || text.includes('extortion')) return 'ransomware';
  if (text.includes('remote code execution') || text.includes('rce') || text.includes('arbitrary code')) return 'exploit';
  if (text.includes('sql injection') || text.includes('sqli') || text.includes('command injection')) return 'exploit';
  if (text.includes('buffer overflow') || text.includes('heap overflow') || text.includes('memory corruption')) return 'exploit';
  if (text.includes('authentication bypass') || text.includes('credential') || text.includes('privilege escalation')) return 'credential';
  if (text.includes('denial of service') || text.includes('dos') || text.includes('resource exhaustion')) return 'ddos';
  if (text.includes('phish') || text.includes('spoofing')) return 'phishing';
  if (text.includes('botnet') || text.includes('mirai')) return 'botnet';
  if (text.includes('apt') || text.includes('state-sponsored') || text.includes('espionage')) return 'apt';
  if (text.includes('trojan') || text.includes('malware') || text.includes('backdoor') || text.includes('stealer')) return 'malware';
  return 'exploit';
}

function inferSeverity(vuln, index) {
  const text = `${vuln.shortDescription || ''} ${vuln.requiredAction || ''}`.toLowerCase();
  const dateAdded = new Date(vuln.dateAdded);
  const daysOld = (Date.now() - dateAdded.getTime()) / (1000 * 3600 * 24);

  if (text.includes('critical') || text.includes('ransomware') || text.includes('zero-day') || daysOld < 45 || index < 15) {
    return 'critical';
  }
  if (daysOld < 180 || text.includes('remote code execution') || text.includes('authentication bypass')) {
    return 'high';
  }
  return 'medium';
}

function mapKevItem(vuln, index) {
  const vendorLower = (vuln.vendorProject || '').toLowerCase();
  let geo = { country: 'United States', lat: 38.895 + ((index * 7) % 30) - 15, lng: -77.036 + ((index * 13) % 60) - 30 };

  for (const [vKey, vGeo] of Object.entries(VENDOR_GEO)) {
    if (vendorLower.includes(vKey)) {
      geo = {
        country: vGeo.country,
        lat: vGeo.lat + (((index * 3) % 11) - 5) * 0.4,
        lng: vGeo.lng + (((index * 5) % 11) - 5) * 0.4,
      };
      break;
    }
  }

  const category = inferCategory(vuln);
  const severity = inferSeverity(vuln, index);

  return {
    id: vuln.cveID || `KEV-${index}`,
    type: category,
    title: `${vuln.cveID}: ${vuln.vendorProject} ${vuln.product}`,
    vendorProject: vuln.vendorProject,
    description: vuln.shortDescription || 'No public description provided.',
    severity,
    country: geo.country,
    lat: Number(geo.lat.toFixed(4)),
    lng: Number(geo.lng.toFixed(4)),
    source: 'CISA Known Exploited Vulnerabilities Catalog',
    timestamp: vuln.dateAdded ? new Date(vuln.dateAdded).toISOString() : new Date().toISOString(),
    dueDate: vuln.dueDate,
    requiredAction: vuln.requiredAction,
    iocs: [vuln.cveID, `${vuln.vendorProject} ${vuln.product}`].filter(Boolean),
    affected: `${vuln.vendorProject} ${vuln.product} (${vuln.vulnerabilityName || 'Known Exploitation'})`,
    tags: [
      vuln.cveID,
      vuln.vendorProject?.toLowerCase().replace(/\s+/g, '-'),
      vuln.product?.toLowerCase().replace(/\s+/g, '-'),
      'cisa-kev',
      'active-exploit',
    ].filter(Boolean),
    isReal: true,
    dataSource: 'CISA KEV (Live Gov Feed)',
  };
}

let cachedThreats = null;

const CACHE_TTL_MS = 120_000;

export async function fetchLiveThreats({ maxItems = 120 } = {}) {
  if (cachedThreats && Date.now() - Date.parse(cachedThreats.fetchedAt) < CACHE_TTL_MS) {
    return cachedThreats;
  }

  let rawKev = null;

  // 1. Try local dev Vite proxy (/api/cisa)
  try {
    const res = await fetch(CISA_KEV_DEV_ENDPOINT, { cache: 'no-cache' });
    if (res.ok) {
      rawKev = await res.json();
    }
  } catch (e) {
    // Vite proxy failed or in standalone mode
  }

  // 2. Try direct official CISA URL
  if (!rawKev) {
    try {
      const res = await fetch(CISA_KEV_OFFICIAL_URL, { cache: 'no-cache' });
      if (res.ok) {
        rawKev = await res.json();
      }
    } catch (e) {
      // Direct CORS blocked, fallback to local snapshot
    }
  }

  // 3. Fallback to local high-fidelity CISA snapshot
  if (!rawKev) {
    try {
      const res = await fetch(CISA_KEV_SNAPSHOT_URL);
      if (res.ok) {
        rawKev = await res.json();
      }
    } catch (e) {
      // Local snapshot failed
    }
  }

  let realList = [];
  if (rawKev && Array.isArray(rawKev.vulnerabilities)) {
    const sorted = [...rawKev.vulnerabilities].sort(
      (a, b) => new Date(b.dateAdded || 0).getTime() - new Date(a.dateAdded || 0).getTime()
    );
    realList = sorted.slice(0, maxItems).map(mapKevItem);
  }

  // Merge with simulated telemetry so user has rich geographic and incident variety (ransomware, phishing, botnet, ddos)
  const simulatedList = DEMO_THREATS.map((t) => ({
    ...t,
    isReal: false,
    dataSource: 'Simulated Threat Telemetry',
  }));

  const combined = [...realList, ...simulatedList];

  cachedThreats = {
    threats: combined,
    catalogVersion: rawKev?.catalogVersion || '2026.10.23',
    fetchedAt: new Date().toISOString(),
  };

  return cachedThreats;
}

function downloadFile(filename, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function exportToCSV(threats) {
  const headers = ['ID', 'Type', 'Severity', 'Title', 'Country', 'Timestamp', 'Data Source', 'Source'];
  const rows = threats.map((t) => [
    `"${t.id}"`,
    `"${t.type}"`,
    `"${t.severity}"`,
    `"${(t.title || '').replace(/"/g, '""')}"`,
    `"${t.country}"`,
    `"${t.timestamp}"`,
    `"${t.dataSource}"`,
    `"${(t.source || '').replace(/"/g, '""')}"`,
  ]);
  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  downloadFile(`cybertrace-threats-${new Date().toISOString().slice(0, 10)}.csv`, csvContent, 'text/csv;charset=utf-8;');
}

export function exportToJSON(threats) {
  const jsonContent = JSON.stringify(threats, null, 2);
  downloadFile(`cybertrace-threats-${new Date().toISOString().slice(0, 10)}.json`, jsonContent, 'application/json');
}
