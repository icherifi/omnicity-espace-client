# Refactorisation AddressOnlyForm

## Structure après refactorisation

Le fichier `AddressOnlyForm.tsx` de ~800 lignes a été intelligemment divisé en plusieurs composants modulaires et réutilisables :

### 🧩 Composants créés

#### 1. `AddressForm.tsx` (71 lignes)

- **Responsabilité** : Formulaire de saisie d'adresse
- **Props** : address, loading, onAddressChange, onSubmit, onQuit
- **Interface** : Simple et focalisée sur la saisie d'adresse

#### 2. `KelvinMapComponent.tsx` (95 lignes)

- **Responsabilité** : Affichage de la carte Kelvin et sélection de bâtiment
- **Props** : address, selectedData, loading, onSelectionChange, onConfirmSelection, onBackToAddress
- **Fonctionnalités** : Gestion de la carte, affichage des coordonnées sélectionnées

#### 3. `SimulationResults.tsx` (65 lignes)

- **Responsabilité** : Affichage des résultats de simulation avec EnergyMixSolutions
- **Props** : address, selectedData, simulationResults, onBackToMap, onFinish
- **Interface** : Gestion de l'affichage des bouquets énergétiques

### 🔧 Hooks personnalisés

#### 1. `useKelvinMap.ts` (183 lignes)

- **Responsabilité** : Logique de gestion de la carte Kelvin
- **Fonctionnalités** :
  - Chargement du script Kelvin
  - Géocodage d'adresse via API locale
  - Initialisation et configuration de la carte
  - Gestion des événements de sélection de polygone
  - Navigation automatique vers l'adresse géocodée

#### 2. `useKelvinSimulation.ts` (268 lignes)

- **Responsabilité** : Logique de simulation énergétique
- **Fonctionnalités** :
  - Orchestration du workflow de simulation Kelvin (create → run → projected-state → dpe)
  - Mapping des données Kelvin vers format EnergyMixSolutions
  - Gestion d'état de chargement
  - Formatage des bouquets énergétiques

### 📁 AddressOnlyForm.tsx refactorisé (120 lignes)

- **Rôle** : Orchestrateur principal
- **Responsabilités** :
  - Gestion des états globaux (currentStep, address, selectedData, simulationResults)
  - Navigation entre les étapes (address → map → results)
  - Coordination entre les composants
  - Gestion des callbacks et événements

## 🎯 Avantages de la refactorisation

### ✅ Maintenabilité

- **Séparation des responsabilités** : Chaque composant a un rôle bien défini
- **Lisibilité améliorée** : Fichiers plus courts et focalisés
- **Réutilisabilité** : Les composants peuvent être réutilisés ailleurs

### ✅ Structure modulaire

- **AddressForm** : Réutilisable pour d'autres workflows nécessitant une adresse
- **KelvinMapComponent** : Peut être utilisé dans d'autres contextes de sélection de bâtiment
- **useKelvinSimulation** : Hook réutilisable pour toute simulation Kelvin

### ✅ Testabilité

- **Isolation** : Chaque composant peut être testé indépendamment
- **Mocking facilité** : Les hooks peuvent être mockés facilement
- **Responsabilités claires** : Plus facile d'écrire des tests unitaires

### ✅ Performance

- **Code splitting** : Possibilité de lazy loading des composants
- **Optimisation ciblée** : React.memo peut être appliqué sélectivement
- **Rerenders réduits** : États localisés dans les bons composants

## 🔄 Workflow après refactorisation

```
AddressOnlyForm (orchestrateur)
├── AddressForm (étape 1: saisie adresse)
├── KelvinMapComponent (étape 2: sélection bâtiment)
│   └── useKelvinMap (logique carte)
└── SimulationResults (étape 3: affichage résultats)
    └── useKelvinSimulation (logique simulation)
```

## 🔧 Points techniques

### État partagé

- **currentStep** : Gestion des transitions entre étapes
- **selectedData** : Données de sélection partagées entre carte et résultats
- **address** : Adresse partagée dans tout le workflow

### Hooks personnalisés

- **useKelvinMap** : Encapsule toute la logique de carte (géocodage, initialisation, événements)
- **useKelvinSimulation** : Encapsule la logique de simulation et formatage

### Props drilling éliminé

- Chaque composant reçoit uniquement les props nécessaires
- Les callbacks sont bien typés et ciblés
- Communication parent-enfant claire et documentée

## 🚀 Extensions futures possibles

1. **React.memo** pour optimiser les rerenders
2. **Lazy loading** des composants pour le code splitting
3. **Tests unitaires** facilités par la modularité
4. **Storybook** pour documenter les composants isolés
5. **Hook de cache** pour éviter les re-simulations identiques
