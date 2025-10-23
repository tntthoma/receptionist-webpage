# AI Receptionist Website

Eine moderne, responsive Landing Page für dein AI Receptionist Business mit Retell AI.

## Features

- Modern und professionell gestaltete Single-Page-Application
- Fully responsive (Mobile, Tablet, Desktop)
- Next.js 15 mit TypeScript
- Tailwind CSS für modernes Styling
- Smooth Scrolling zwischen Sektionen
- Kontaktformular für Demo-Anfragen
- Optimiert für Performance

## Sektionen

1. **Hero Section** - Aufmerksamkeitsstarker Einstieg mit Call-to-Action
2. **Features** - 6 wichtige Features der AI-Rezeption
3. **Use Cases** - Branchen-spezifische Anwendungsfälle
4. **Pricing** - 3 Preispakete (Starter, Professional, Enterprise)
5. **Contact** - Kontaktformular für Demo-Anfragen
6. **Footer** - Navigation und rechtliche Links

## Installation

### Voraussetzungen

- Node.js (Version 18 oder höher)
- npm oder yarn

### Schritte

1. Navigiere zum Projektordner:
```bash
cd C:\Users\tntth\Projects\receptionist-website
```

2. Installiere die Dependencies:
```bash
npm install
```

3. Starte den Development Server:
```bash
npm run dev
```

4. Öffne deinen Browser und gehe zu:
```
http://localhost:3000
```

## Verfügbare Scripts

- `npm run dev` - Startet den Development Server
- `npm run build` - Erstellt eine Production-Build
- `npm run start` - Startet den Production Server
- `npm run lint` - Führt ESLint aus

## Anpassungen

### Farben ändern

Die Hauptfarben können in `tailwind.config.ts` angepasst werden:

```typescript
colors: {
  primary: {
    // Passe die Farben hier an
  },
}
```

### Inhalte anpassen

Alle Inhalte befinden sich in `app/page.tsx`. Du kannst:
- Texte ändern
- Preise anpassen
- Features hinzufügen/entfernen
- Use Cases erweitern

### Kontaktformular

Das Kontaktformular zeigt aktuell nur eine Alert-Nachricht. Um es funktionsfähig zu machen:

1. Backend-API erstellen oder Service wie EmailJS, SendGrid, etc. integrieren
2. Die `handleSubmit` Funktion in `app/page.tsx` anpassen
3. Umgebungsvariablen für API-Keys in `.env.local` hinzufügen

Beispiel für `.env.local`:
```
NEXT_PUBLIC_API_ENDPOINT=your-api-endpoint
```

## Deployment

### Vercel (Empfohlen)

1. Pushe dein Projekt zu GitHub
2. Gehe zu [vercel.com](https://vercel.com)
3. Importiere dein Repository
4. Vercel erkennt automatisch Next.js und deployt die App

### Andere Plattformen

- **Netlify**: Ähnlich wie Vercel, automatische Next.js Erkennung
- **AWS Amplify**: Unterstützt Next.js Apps
- **Docker**: Dockerfile kann erstellt werden für Container-Deployment

## Technologie-Stack

- **Framework**: Next.js 15
- **Sprache**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons (als SVG eingebettet)

## Browser-Unterstützung

- Chrome (neueste Version)
- Firefox (neueste Version)
- Safari (neueste Version)
- Edge (neueste Version)

## Nächste Schritte

1. **Branding anpassen**: Logo, Farben und Texte an deine Marke anpassen
2. **Bilder hinzufügen**: Produktbilder oder Screenshots integrieren
3. **Backend verbinden**: Kontaktformular mit Backend/CRM verbinden
4. **Analytics**: Google Analytics oder ähnliches Tool integrieren
5. **SEO optimieren**: Meta-Tags in `app/layout.tsx` vervollständigen
6. **Domain**: Eigene Domain verbinden nach Deployment

## Support & Kontakt

Bei Fragen zur Website-Anpassung oder technischen Problemen, kontaktiere deinen Entwickler.

## Lizenz

Dieses Projekt wurde für dein Business erstellt. Alle Rechte vorbehalten.
