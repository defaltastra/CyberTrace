import { Shield, Linkedin, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-bg/90 backdrop-blur-sm px-6 py-5 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-accent" />
          <span className="font-semibold text-text">
            Cyber<span className="text-accent">Trace</span>
          </span>
          <span className="text-text-muted/60">| Carte mondiale interactive des cybermenaces</span>
        </div>

        {/* Mandatory credit string */}
        <div className="text-center sm:text-right">
          <p className="font-medium text-text">
            CyberTrace — Made by{' '}
            <a
              href="https://www.linkedin.com/in/oussama-el-harti-b65682249/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline inline-flex items-center gap-1 font-semibold"
            >
              Oussama El Harti
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>
            {' '}&amp;{' '}
            <a
              href="https://www.linkedin.com/in/ilham-didih-30a809354/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline inline-flex items-center gap-1 font-semibold"
            >
              Ilham Didih
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>
          </p>
          <p className="text-[11px] text-text-muted/60 mt-0.5">
            Toxic Earth Edition • Données publiques officielles CISA KEV & Télémétrie
          </p>
        </div>
      </div>
    </footer>
  );
}
