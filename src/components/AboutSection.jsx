import { Linkedin, Shield, ExternalLink, Database, Globe, Lock, Cpu, Server, CheckCircle2, AlertTriangle, Key } from 'lucide-react';

const creators = [
  {
    name: 'Oussama El Harti',
    role: 'Developer & Security Researcher',
    linkedin: 'https://www.linkedin.com/in/oussama-el-harti-b65682249/',
    image: '/oussama.jpg',
    bio: 'Passionné de cybersécurité, de renseignement sur les menaces (CTI) et de visualisation de données complexes. Concepteur d’outils d’analyse modernes et accessibles pour la communauté cyber.',
    skills: ['Cyber Threat Intelligence', 'React & Vite', 'Data Visualization', 'Network Security', 'SOC Operations'],
  },
  {
    name: 'Ilham Didih',
    role: 'Analyste SOC L1/L2 | SIEM | EDR/NDR | Threat Detection & Incident Response',
    linkedin: 'https://www.linkedin.com/in/ilham-didih-30a809354/',
    image: '/ilham.jpg',
  bio: 'Analyste SOC L1/L2 spécialisée dans la détection des menaces, la supervision de la sécurité et la réponse aux incidents. Intéressée par les solutions SIEM, EDR et NDR, l’analyse des événements de sécurité et le renforcement de la sécurité des systèmes d’information.',

skills: ['Analyse SOC L1/L2', 'SIEM', 'EDR / NDR', 'Threat Detection', 'Incident Response', 'Analyse de Logs', 'Surveillance de Sécurité'],
  },
];

export const PUBLIC_APIS = [
  {
    name: 'CISA Known Exploited Vulnerabilities (KEV)',
    type: 'Flux Public Officiel US Gov',
    status: 'Connecté en Direct',
    auth: 'Aucune clé requise',
    url: 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog',
    description: 'Catalogue officiel du gouvernement américain listant les failles de sécurité activement exploitées dans la nature par des cyberattaquants.',
  },
  {
    name: 'NIST NVD (National Vulnerability Database)',
    type: 'API REST Publique',
    status: 'Compatible / Accessible',
    auth: 'Gratuit (clé recommandée pour haut débit)',
    url: 'https://nvd.nist.gov/developers/vulnerabilities',
    description: 'Base de données nationale des vulnérabilités des États-Unis fournissant scores CVSS, vecteurs d’attaque et configurations affectées.',
  },
  {
    name: 'AlienVault OTX (Open Threat Exchange)',
    type: 'Renseignement Collaboratif (CTI)',
    status: 'Intégrable via Clé Utilisateur',
    auth: 'Clé API Gratuite sur compte AlienVault',
    url: 'https://otx.alienvault.com/',
    description: 'Plus grande communauté ouverte de partage d’IOCs (indicateurs de compromission : IPs, hashes malveillants, domaines C2).',
  },
  {
    name: 'abuse.ch (URLhaus & ThreatFox)',
    type: 'Flux de Malwares & IOCs',
    status: 'Requiert Proxy Backend (CORS)',
    auth: 'Accès public communautaire',
    url: 'https://threatfox.abuse.ch/',
    description: 'Projets de recherche suisses traquant les serveurs C2 de botnets, URLs de malwares et payloads malveillants récents.',
  },
];

export default function AboutSection() {
  return (
    <section className="space-y-8 animate-fade-in">
      {/* Hero / About the Project */}
      <div className="panel p-8 text-center relative overflow-hidden border-border-subtle">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono mb-4">
            <Shield className="w-4 h-4" />
            <span>CYBERTRACE THREAT INTELLIGENCE PORTFOLIO</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-text mb-4">
            À propos de <span className="text-accent">CyberTrace</span>
          </h2>
          <p className="text-text-muted text-sm lg:text-base leading-relaxed mb-6">
            CyberTrace est une plateforme web moderne conçue pour visualiser, analyser et explorer la répartition mondiale
            des cybermenaces. Destinée à démontrer des compétences avancées en cybersécurité, développement réactif et
            ergonomie visuelle dans le cadre d'un portfolio LinkedIn.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="panel-light p-3 border border-border-subtle">
              <Globe className="w-4 h-4 text-accent mb-1" />
              <div className="text-xs font-semibold text-text">Cartographie</div>
              <div className="text-[11px] text-text-muted">Géo-localisation Leaflet</div>
            </div>
            <div className="panel-light p-3 border border-border-subtle">
              <Database className="w-4 h-4 text-amber mb-1" />
              <div className="text-xs font-semibold text-text">APIs Réelles</div>
              <div className="text-[11px] text-text-muted">CISA KEV + Télémétrie</div>
            </div>
            <div className="panel-light p-3 border border-border-subtle">
              <Cpu className="w-4 h-4 text-accent mb-1" />
              <div className="text-xs font-semibold text-text">Architecture</div>
              <div className="text-[11px] text-text-muted">React 18 + Tailwind v3</div>
            </div>
            <div className="panel-light p-3 border border-border-subtle">
              <Lock className="w-4 h-4 text-red-400 mb-1" />
              <div className="text-xs font-semibold text-text">Design Système</div>
              <div className="text-[11px] text-text-muted">Toxic Earth Palette</div>
            </div>
          </div>
        </div>
      </div>

      {/* Creators Section */}
      <div>
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-text mb-2">Les Créateurs</h3>
          <p className="text-sm text-text-muted">
            Projet conçu et développé par deux spécialistes passionnés par la sécurité des réseaux et le développement logiciel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {creators.map((creator) => (
            <div
              key={creator.name}
              className="panel p-6 flex flex-col items-center text-center group hover:border-accent/40 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-colors pointer-events-none" />

              {/* Photo */}
              <div className="relative mb-4">
<div className="w-36 h-36 rounded-full overflow-hidden border-2 border-accent/40">                  <img
                    src={creator.image}
                    alt={creator.name}
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div
                    className="w-full h-full bg-panel-light items-center justify-center text-3xl font-bold text-accent hidden"
                  >
                    {creator.name.charAt(0)}
                  </div>
                </div>
                <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-panel border-2 border-accent flex items-center justify-center text-accent">
                  <Shield className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Identity */}
              <h4 className="text-xl font-bold text-text mb-1">{creator.name}</h4>
              <p className="text-sm font-semibold text-accent mb-3">{creator.role}</p>
              <p className="text-xs text-text-muted leading-relaxed mb-5 max-w-sm">{creator.bio}</p>

              {/* Skills tags */}
              <div className="flex flex-wrap justify-center gap-1.5 mb-6">
                {creator.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[11px] px-2.5 py-1 bg-panel-light border border-border-subtle rounded-full text-text-muted group-hover:border-accent/20 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* LinkedIn Button */}
              <a
                href={creator.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0A66C2]/15 border border-[#0A66C2]/40 text-[#70B5F9] hover:bg-[#0A66C2]/25 hover:border-[#0A66C2]/60 text-xs font-semibold transition-all group/btn"
              >
                <Linkedin className="w-4 h-4 fill-current" />
                <span>Profil LinkedIn</span>
                <ExternalLink className="w-3 h-3 opacity-60 group-hover/btn:translate-x-0.5 transition-transform" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Public APIs and Data Sources Documentation */}
      <div className="panel p-6 border-border-subtle">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-bold text-text">Sources de Données & APIs Publiques</h3>
        </div>
        <p className="text-xs text-text-muted mb-6 leading-relaxed">
          CyberTrace privilégie l'accès transparent aux données publiques sans exposer de clés API sensibles côté client.
          Voici l'état des intégrations pour ce projet de démonstration :
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PUBLIC_APIS.map((api) => (
            <div key={api.name} className="panel-light p-4 flex flex-col justify-between border border-border-subtle">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-sm font-semibold text-text">{api.name}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono shrink-0">
                    {api.status}
                  </span>
                </div>
                <div className="text-[11px] text-amber mb-2 font-mono flex items-center gap-1.5">
                  <Key className="w-3 h-3" />
                  <span>{api.auth}</span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed mb-3">{api.description}</p>
              </div>
              <a
                href={api.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-accent hover:underline mt-2 self-start font-mono"
              >
                <span>Documentation source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimers & Ethics */}
      <div className="panel p-5 border-amber/20 bg-amber/5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-amber mb-1">Avertissement Éthique & Limites Techniques</h4>
            <p className="text-xs text-text-muted leading-relaxed">
              Les coordonnées géographiques associées aux incidents sont basées sur la localisation déclarée des constructeurs ou
              des serveurs observés. <strong className="text-text">Une localisation IP ne constitue en aucun cas une preuve certaine
              de l'emplacement physique ou de l'identité réelle d'un attaquant</strong> (recours fréquent aux VPNs, TOR et nœuds relais).
              Les données simulées sont identifiées par le badge <strong>SIMULÉ</strong> pour garantir une rigueur scientifique.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
