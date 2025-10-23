# Dashboard Setup Anleitung

Diese Anleitung hilft dir, das Dashboard mit Supabase und Retell AI zu konfigurieren.

## Inhaltsverzeichnis

1. [Supabase Setup](#supabase-setup)
2. [Retell AI Setup](#retell-ai-setup)
3. [Lokale Installation](#lokale-installation)
4. [Verwendung](#verwendung)
5. [Troubleshooting](#troubleshooting)

---

## Supabase Setup

Supabase bietet kostenlose Authentication und Datenbank für dein Projekt.

### Schritt 1: Supabase Konto erstellen

1. Gehe zu [supabase.com](https://supabase.com)
2. Klicke auf "Start your project"
3. Registriere dich mit GitHub oder E-Mail

### Schritt 2: Neues Projekt erstellen

1. Nach der Anmeldung klicke auf "New Project"
2. Wähle eine Organization (oder erstelle eine neue)
3. Gib deinem Projekt einen Namen: z.B. "receptionist-dashboard"
4. Setze ein sicheres Datenbank-Passwort (speichere es sicher!)
5. Wähle eine Region (am besten in deiner Nähe, z.B. "Europe - Frankfurt")
6. Klicke auf "Create new project"
7. Warte ca. 2 Minuten bis das Projekt erstellt ist

### Schritt 3: API Keys kopieren

1. Gehe in deinem Projekt zu "Settings" (Zahnrad-Icon links unten)
2. Klicke auf "API" im linken Menü
3. Du siehst zwei wichtige Informationen:
   - **Project URL**: Sieht aus wie `https://xyz123abc.supabase.co`
   - **anon public** Key: Ein langer String

4. Öffne die Datei `.env.local` in deinem Projekt und füge diese Werte ein:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xyz123abc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dein-anon-key-hier
```

### Schritt 4: Email Templates konfigurieren (Optional)

1. Gehe zu "Authentication" → "Email Templates"
2. Passe die E-Mail-Templates nach deinen Wünschen an
3. Du kannst Logo, Farben und Texte anpassen

### Schritt 5: Datenbank Tabellen erstellen (Optional)

Für erweiterte Features kannst du zusätzliche Tabellen erstellen:

1. Gehe zu "SQL Editor"
2. Klicke auf "New Query"
3. Füge folgendes SQL ein:

```sql
-- User Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  company_name TEXT,
  phone_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

4. Klicke auf "Run" um die Queries auszuführen

---

## Retell AI Setup

Retell AI bietet die Voice AI Technologie für deine Telefon-Rezeption.

### Schritt 1: Retell AI Konto erstellen

1. Gehe zu [retellai.com](https://www.retellai.com)
2. Klicke auf "Get Started" oder "Sign Up"
3. Registriere dich mit deiner E-Mail

### Schritt 2: API Key erstellen

1. Nach der Anmeldung gehe zum Dashboard
2. Navigiere zu "Settings" oder "API Keys"
3. Klicke auf "Create API Key"
4. Kopiere den API Key (du siehst ihn nur einmal!)

5. Füge den Key in `.env.local` ein:

```env
RETELL_API_KEY=dein-retell-api-key-hier
```

### Schritt 3: Agent erstellen

1. Gehe zu "Agents" im Dashboard
2. Klicke auf "Create Agent"
3. Konfiguriere deinen AI Agent:
   - **Name**: z.B. "Receptionist DE"
   - **Language**: Deutsch
   - **Voice**: Wähle eine angenehme Stimme
   - **Instructions**: Gib Anweisungen wie der Agent sich verhalten soll

Beispiel Instructions:
```
Du bist eine freundliche und professionelle Rezeptionistin für [Dein Firmenname].

Deine Aufgaben:
- Beantworte Kundenanfragen höflich und kompetent
- Buche Termine wenn gewünscht (Öffnungszeiten: Mo-Fr 9-18 Uhr)
- Bei dringenden Fällen: Notiere Details und sage, dass jemand zurückruft
- Beende das Gespräch freundlich

Wichtig:
- Bleibe professionell
- Sprich klar und deutlich
- Bei komplexen Fragen: Leite an einen Mitarbeiter weiter
```

4. Speichere den Agent
5. Kopiere die Agent ID - du brauchst sie später

### Schritt 4: Telefonnummer einrichten

1. Gehe zu "Phone Numbers"
2. Klicke auf "Buy Number" oder verbinde eine existierende Nummer
3. Verknüpfe die Nummer mit deinem Agent
4. Teste die Nummer indem du anrufst!

---

## Lokale Installation

### Voraussetzungen

- Node.js 18+ installiert
- Git installiert
- Code Editor (VS Code empfohlen)

### Installation

1. **Dependencies installieren**

Öffne ein Terminal (Git Bash oder CMD, NICHT PowerShell) und führe aus:

```bash
cd C:\Users\tntth\Projects\receptionist-website
npm install
```

Dies installiert alle benötigten Packages:
- React & Next.js
- Supabase Client
- Recharts (für Statistiken)
- date-fns (für Datumsformatierung)

2. **Umgebungsvariablen konfigurieren**

Stelle sicher, dass `.env.local` alle benötigten Werte hat:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://dein-projekt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dein-anon-key

# Retell AI
RETELL_API_KEY=dein-retell-key
NEXT_PUBLIC_RETELL_API_URL=https://api.retellai.com/v1
```

3. **Development Server starten**

```bash
npm run dev
```

4. **Öffne im Browser**

```
http://localhost:3000
```

---

## Verwendung

### Registrierung & Login

1. **Registrieren**:
   - Gehe zu `/register` oder klicke "Kostenlos starten"
   - Fülle das Formular aus
   - Du wirst automatisch eingeloggt

2. **Login**:
   - Gehe zu `/login` oder klicke "Anmelden"
   - Gib E-Mail und Passwort ein

### Dashboard Navigation

Nach dem Login hast du Zugriff auf:

- **Übersicht** (`/dashboard`): Statistiken und letzte Anrufe
- **Anrufe** (`/dashboard/calls`): Vollständige Liste aller Anrufe mit Transkripten
- **Analytics** (`/dashboard/analytics`): [Noch zu erstellen]
- **Einstellungen** (`/dashboard/settings`): [Noch zu erstellen]

### Anrufe ansehen

1. Gehe zu "Anrufe" im Dashboard
2. Filtere nach Status (Alle, Beantwortet, Verpasst, Weitergeleitet)
3. Klicke auf einen Anruf um Details zu sehen:
   - Anrufer-Informationen
   - Gesprächsdauer
   - Datum & Uhrzeit
   - Zusammenfassung
   - Vollständiges Transkript

---

## Retell AI Integration

### Aktuelle Implementierung

Die Retell AI Integration ist vorbereitet in `lib/retell-api.ts`:

- `getCalls()`: Hole Liste aller Anrufe
- `getCall(id)`: Hole Details eines spezifischen Anrufs
- `getCallRecording(id)`: Hole Audio-Aufnahme
- `getCallTranscript(id)`: Hole Transkript

### Live-Daten anzeigen

Um echte Daten aus Retell AI anzuzeigen:

1. Öffne `app/dashboard/calls/page.tsx`
2. Ersetze die Mock-Daten in `fetchCalls()`:

```typescript
import { retellAPI, formatCallForDashboard } from '@/lib/retell-api';

const fetchCalls = async () => {
  try {
    const response = await retellAPI.getCalls({ limit: 50 });
    const formattedCalls = response.calls.map(formatCallForDashboard);
    setCalls(formattedCalls);
  } catch (error) {
    console.error('Error fetching calls:', error);
  } finally {
    setLoading(false);
  }
};
```

3. Gleiche Anpassung in `app/dashboard/page.tsx` für die Statistiken

---

## Troubleshooting

### Problem: "Supabase URL not configured"

**Lösung**:
- Überprüfe ob `.env.local` existiert
- Stelle sicher, dass die Variablen mit `NEXT_PUBLIC_` beginnen
- Starte den Dev-Server neu (`npm run dev`)

### Problem: "Authentication failed"

**Lösung**:
- Prüfe ob dein Supabase API Key korrekt ist
- Gehe zu Supabase Dashboard → Settings → API
- Kopiere den Key erneut

### Problem: "Retell API error"

**Lösung**:
- Stelle sicher, dass `RETELL_API_KEY` in `.env.local` gesetzt ist
- Überprüfe ob der Key gültig ist
- Prüfe dein Retell AI Dashboard auf aktive Subscription

### Problem: PowerShell Execution Policy Error

**Lösung**:
- Verwende Git Bash statt PowerShell
- Oder verwende Command Prompt (CMD)
- Siehe Hauptdokument für Details

### Problem: Seite lädt nicht / White Screen

**Lösung**:
1. Öffne Browser DevTools (F12)
2. Schaue in die Console nach Fehlern
3. Häufige Ursachen:
   - Supabase nicht konfiguriert
   - JavaScript Fehler
   - Netzwerk-Probleme

**Lösung für spezifische Fehler**: Kontaktiere Support oder öffne ein Issue auf GitHub

---

## Nächste Schritte

1. **Teste die Registrierung**: Erstelle einen Test-Account
2. **Teste Retell AI**: Rufe deine Nummer an und prüfe ob der Anruf im Dashboard erscheint
3. **Customization**: Passe Farben, Texte und Features an deine Bedürfnisse an
4. **Deployment**: Deploye auf Vercel (siehe README.md)

---

## Support & Hilfe

- **Supabase Docs**: https://supabase.com/docs
- **Retell AI Docs**: https://docs.retellai.com
- **Next.js Docs**: https://nextjs.org/docs

Bei Fragen oder Problemen, öffne ein Issue auf GitHub!
