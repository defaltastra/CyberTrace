<div align="center">

# 🛡️ CyberTrace

### *Real-Time Cyber Threat Intelligence & Global SOC Analytics Platform*

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Recharts](https://img.shields.io/badge/Recharts-2.13-22B5BF?style=for-the-badge)](https://recharts.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](#license)

<p align="center">
  <b>CyberTrace</b> is an interactive, modern <b>Cyber Threat Intelligence (CTI)</b> and <b>Security Operations Center (SOC)</b> dashboard designed to visualize, filter, and analyze real-world vulnerabilities, active exploits, and global cyber incidents in real time.
</p>

[Key Features](#-key-features) •
[Architecture](#-architecture--views) •
[Data Sources](#-threat-intelligence-sources) •
[Getting Started](#-getting-started) •
[Authors](#-creators--contributors)

---

</div>

## 📌 Overview

In the modern threat landscape, security analysts and SOC teams face an overwhelming deluge of indicators of compromise (IOCs), vulnerability catalogs, and threat actor campaigns. **CyberTrace** aggregates and presents complex cybersecurity intelligence into actionable, intuitive visualizations:

- **Geospatial Threat Mapping**: Pinpoint affected regions, origin vectors, and critical assets across an interactive world map.
- **Dynamic Threat Explorer**: Deep-dive into active exploits, CVE details, CVSS scores, remediation tactics, and MITRE ATT&CK vectors.
- **Analytics & Metrics**: Statistical breakdown of attack vectors, severity distributions, affected sectors, and timeline trends.
- **Live Feed & Real-Time Monitoring**: Streaming incident updates and real-time operational feeds for security analysts.

---

## ✨ Key Features

- 🗺️ **Interactive Global Map**
  - Built with Leaflet & React-Leaflet with custom dark cyber themes.
  - Geo-located threat markers with color-coded severity rings (Critical, High, Medium, Low).
  - Detailed popup modals with threat profiles and direct action links.

- 📊 **Security Operations Analytics**
  - Interactive charts powered by Recharts (radial charts, bar distributions, severity heatmaps).
  - Categorization across Ransomware, APT campaigns, Zero-Days, Phishing, Supply Chain, and DDoS.

- 🔍 **Advanced Filtering & Search**
  - Search across CVEs, malware families, threat actors, and impacted industries.
  - Multi-criteria filtering by Severity, Category, Protocol, and Country.

- ⚡ **Live Feed & Incident Explorer**
  - Chronological incident tracking with severity tags.
  - Deep inspection modal detailing impact analysis, IOCs, and remediation steps.

- 🎨 **Sleek Cyber/SOC Dark UI**
  - Custom Tailwind CSS styling tailored for operations centers and ambient monitors.
  - High-contrast visual cues, neon accents, and responsive layout across all resolutions.

---

## 🏛️ Architecture & Views

```
CyberTrace/
├── 📁 public/                 # Static assets, icons, and portraits
├── 📁 src/
│   ├── 📁 components/         # Reusable UI widgets & charts
│   │   ├── ThreatMap.jsx      # Leaflet geospatial visualization
│   │   ├── Charts.jsx         # Recharts analytics widgets
│   │   ├── ThreatList.jsx     # Incident list view with pagination & sort
│   │   ├── ThreatDetail.jsx   # Modal view for granular threat intelligence
│   │   ├── StatsBar.jsx       # Quick KPI banner (Active threats, Critical count, etc.)
│   │   ├── Filters.jsx        # Multi-attribute filter drawer
│   │   ├── Navbar.jsx         # Header navigation bar
│   │   └── AboutSection.jsx   # Project & author information
│   ├── 📁 views/              # Route-level views
│   │   ├── DashboardView.jsx        # Unified SOC overview
│   │   ├── GlobalMapView.jsx        # Fullscreen interactive map
│   │   ├── ThreatExplorerView.jsx   # Searchable catalog of threats & CVEs
│   │   ├── AnalyticsView.jsx        # Deep analytical graphs & sector breakdown
│   │   ├── LiveFeedView.jsx         # Live telemetry & incident events
│   │   ├── SettingsView.jsx         # API keys & integration settings
│   │   └── AboutView.jsx            # Creators, documentation, and source credits
│   ├── 📁 services/           # Threat intelligence data services
│   ├── 📁 data/               # Preloaded CTI telemetry and datasets
│   ├── 📁 utils/              # Helper utilities & theme configs
│   ├── App.jsx                # Core router & layout shell
│   └── main.jsx               # Application entrypoint
├── index.html
├── tailwind.config.js
└── vite.config.js
```

---

## 🌐 Threat Intelligence Sources

CyberTrace integrates and references data structures compatible with top open-source threat intelligence feeds:

| Provider | Type | Description |
|---|---|---|
| **CISA KEV** | Official US Gov Feed | Known Exploited Vulnerabilities Catalog listing actively targeted zero-days & flaws. |
| **NIST NVD** | Public REST API | National Vulnerability Database containing official CVSS ratings and CVE references. |
| **AlienVault OTX** | Collaborative CTI | Crowd-sourced open threat exchange for pulses, malware signatures, and IOCs. |
| **abuse.ch** | Malware / IOC Feed | Real-time threat feeds from URLhaus, ThreatFox, and MalwareBazaar. |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/CyberTrace.git
   cd CyberTrace
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:5173` to launch the platform.

### Build for Production

To generate an optimized production bundle:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

---

## 👥 Creators & Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://www.linkedin.com/in/oussama-el-harti-b65682249/">
        <b>Oussama El Harti</b>
      </a>
      <br />
      <sub>Developer & Security Researcher</sub>
      <br />
      <sub>Cyber Threat Intelligence (CTI) • React & Vite • Data Visualization</sub>
    </td>
    <td align="center">
      <a href="https://www.linkedin.com/in/ilham-didih-30a809354/">
        <b>Ilham Didih</b>
      </a>
      <br />
      <sub>SOC Analyst L1/L2</sub>
      <br />
      <sub>Threat Detection • Incident Response • SIEM • EDR / NDR</sub>
    </td>
  </tr>
</table>

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute it for personal, educational, or commercial projects.
