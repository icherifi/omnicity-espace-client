# Omnicity – espace client

Application web d'Omnicity pour les courtiers immobiliers : visualiser un logement scanné sur iPhone, le meubler virtuellement et préparer un dossier de rénovation énergétique. L'API associée est dans [omnicity-express-server](https://github.com/icherifi/omnicity-express-server).

- **Visualisation 2D/3D des scans RoomPlan** (React Three Fiber) : plan, murs, ouvertures, calcul des surfaces par pièce.
- **Home staging virtuel** : rendu de la scène meublée par l'agent IA du back-end, aussi utilisé en headless pour son auto-vérification.
- **Exports** du plan en DXF et IFC, et récapitulatifs de projet en PDF.
- **Rénovation énergétique** : récupération du DPE, carte, simulations de travaux via l'API Kelvin et estimation des coûts.
- **Authentification** Supabase (e-mail et Google).

**Stack :** Next.js (App Router) · React · TypeScript · Tailwind CSS · Three.js / React Three Fiber · Supabase · Mapbox

## Lancer en local

```bash
cp .env.example .env.local   # renseigner les clés
npm install
npm run dev                  # http://localhost:3000
```
