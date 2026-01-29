# Test de l'intégration API Kelvin DPE

## Fonctionnalités ajoutées

### 1. Utilitaire API Kelvin (`utils/kelvinApi.ts`)

- `fetchDpeData(dpeId: string)` : Récupère les données DPE via l'API Kelvin
- `formatDpeDate(dateString: string)` : Formate les dates en français
- `getEnergyClassColor(energyClass: string)` : Retourne la couleur pour chaque classe énergétique
- `getEnergyClassDescription(energyClass: string)` : Description de la performance énergétique

### 2. Composant DpeResults (`components/forms/DpeResults.tsx`)

- Affiche les informations DPE récupérées de l'API
- Classes énergétiques avec couleurs appropriées
- Informations du logement (adresse, surface, type)
- Actions de confirmation et retour

### 3. Modifications du formulaire DPE (`NewProjectDpeNumberForm.tsx`)

- Intégration de l'API Kelvin pour récupérer les vraies données DPE
- Nouvelle étape d'affichage des résultats DPE
- Enrichissement des données mock avec les vraies informations

### 4. Mise à jour du dialog (`NewProjectDialog.tsx`)

- Titre et description adaptés pour l'étape DPE
- Support du nouveau workflow avec résultats DPE

## Workflow utilisateur

1. L'utilisateur saisit son numéro DPE
2. L'application appelle l'API Kelvin pour récupérer les données
3. Les informations DPE sont affichées pour vérification
4. L'utilisateur confirme et continue vers les solutions énergétiques

## Configuration API

- **Endpoint** : `https://app.go-kelvin.com/api/v2/dpes`
- **Token** : `team-api-key-private-ajQB2M5iS7vPEguwNoZj6ncg`
- **Format réponse** : Tableau d'objets DPE avec informations détaillées

## Gestion des erreurs

- DPE non trouvé (404) : Message d'erreur approprié
- Erreurs API : Messages d'erreur informatifs
- Validation du numéro DPE : Vérification format et longueur

## Données récupérées

- ID DPE et version
- Classes énergétique et d'émissions GES
- Surface et type de bâtiment
- Adresse complète avec complément
- Date du rapport DPE
- BAN ID pour géolocalisation
