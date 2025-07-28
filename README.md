# Bayern Brandschutz Management System

Ein React-basiertes Verwaltungssystem für Brandschutz- und Löschwasserkonzepte gemäß der Bayerischen Bauordnung (BayBO).

## Features

- **Bayern-Compliance Engine**: Automatische Prüfung nach BayBO
- **Löschwasser-Calculator**: Berechnung nach DVGW W 405
- **Sachverständigen-Portal**: Verwaltung prüfpflichtiger Projekte
- **Dark Mode**: Unterstützung für dunkles Theme
- **Responsive Design**: Optimiert für alle Bildschirmgrößen

## Installation

```bash
# Repository klonen
cd bayern-brandschutz

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

## Entwicklung

Das Projekt nutzt:
- React 18
- Vite als Build-Tool
- Tailwind CSS für Styling
- Lucide React für Icons

## Verfügbare Scripts

- `npm run dev` - Startet den Entwicklungsserver
- `npm run build` - Erstellt die Produktionsversion
- `npm run preview` - Vorschau der Produktionsversion

## Struktur

```
bayern-brandschutz/
├── src/
│   ├── components/
│   │   └── BayernBrandschutzSystem.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```