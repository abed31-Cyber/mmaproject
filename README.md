# 🥊 MMA Universe

<div align="center">
  <img src="assets/logo.png" alt="MMA Universe Logo" width="200" />
  
  **L'application mobile premium dédiée aux passionnés de MMA**
  
  [![React Native](https://img.shields.io/badge/React%20Native-0.73-blue.svg)](https://reactnative.dev/)
  [![Expo](https://img.shields.io/badge/Expo-50-black.svg)](https://expo.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
</div>

---

## 📖 Description

**MMA Universe** est une application mobile haut de gamme conçue pour les fans de MMA. Elle combine un design sombre premium avec des fonctionnalités sociales avancées, offrant une expérience complète inspirée d'UFC Fight Pass et des meilleures applications sociales.

### ✨ Fonctionnalités Principales

- 🏠 **Dashboard Personnalisé** - Accueil avec événements à venir, combattants tendance, actualités
- 👤 **Profils Combattants** - Statistiques détaillées, historique des combats, palmarès
- 📅 **Calendrier Événements** - Vue calendrier/liste, rappels, détails des cartes de combat
- 📰 **Actualités & Médias** - Articles, vidéos, highlights en streaming
- 💬 **Réseau Social** - Feed, posts, commentaires, stories à la manière d'Instagram
- 💌 **Messagerie** - Conversations privées et groupes en temps réel
- 🏆 **Pronostics** - Prédictions de combats avec classement
- 👤 **Profil Utilisateur** - Stats, combattants suivis, personnalisation

---

## 🎨 Design System

### Palette de Couleurs

| Couleur | Hex | Usage |
|---------|-----|-------|
| Dark | `#0B0B0D` | Fond principal |
| Charcoal | `#1A1A1F` | Cartes, surfaces |
| Red | `#C72C2C` | Accent principal |
| Red Light | `#E63946` | Accent secondaire |
| Gold | `#FFD700` | Badges champions |

### Typographie

- **Titres**: Montserrat (Bold, SemiBold)
- **Corps**: Inter (Regular, Medium, SemiBold)
- **Tailles**: 12px - 32px avec échelle harmonieuse

### Composants

- Boutons (Primary, Secondary, Ghost, Danger)
- Inputs avec validation
- Cards (Fighter, Event, Video, Article)
- Badges (Result, Rank, Champion, Win Streak)
- Avatar avec indicateur en ligne
- Loading states & Skeletons

---

## 🛠 Stack Technique

### Frontend Mobile
- **React Native** 0.73 avec **Expo** SDK 50
- **TypeScript** 5.3 (mode strict)
- **React Navigation** v6 (tabs, stack)

### State Management & Data
- **Zustand** - State management léger
- **React Query** v5 - Cache & data fetching
- **AsyncStorage** - Persistance locale

### UI & Animations
- **Expo Image** - Chargement optimisé
- **Expo Linear Gradient** - Dégradés
- **Expo Blur** - Effets de flou
- **React Native Reanimated** - Animations fluides
- **Expo Haptics** - Retour haptique

### Backend (à implémenter)
- **Node.js** avec Express/Fastify
- **PostgreSQL** - Base de données
- **Redis** - Cache & sessions
- **Socket.io** - Temps réel

---

## 📁 Structure du Projet

```
mmaproject/
├── App.tsx                    # Point d'entrée
├── app.json                   # Configuration Expo
├── package.json               # Dépendances
├── tsconfig.json              # Configuration TypeScript
├── babel.config.js            # Configuration Babel
│
├── src/
│   ├── api/                   # Services API
│   │   ├── client.ts          # Client HTTP
│   │   ├── config.ts          # Configuration API
│   │   ├── services.ts        # Services par domaine
│   │   └── index.ts
│   │
│   ├── components/            # Composants réutilisables
│   │   ├── ui/                # Composants UI de base
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── social/            # Composants sociaux
│   │   │   ├── SocialComponents.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── navigation/            # Configuration navigation
│   │   ├── AppNavigator.tsx
│   │   └── index.ts
│   │
│   ├── screens/               # Écrans de l'app
│   │   ├── onboarding/        # Onboarding
│   │   ├── auth/              # Authentification
│   │   ├── home/              # Accueil
│   │   ├── fighters/          # Combattants
│   │   ├── events/            # Événements
│   │   ├── social/            # Feed social
│   │   ├── chat/              # Messagerie
│   │   ├── profile/           # Profil utilisateur
│   │   └── index.ts
│   │
│   ├── store/                 # State management (Zustand)
│   │   ├── authStore.ts
│   │   ├── appStore.ts
│   │   └── index.ts
│   │
│   ├── theme/                 # Design system
│   │   ├── tokens.ts          # Design tokens
│   │   ├── ThemeProvider.tsx
│   │   └── index.ts
│   │
│   └── types/                 # Types TypeScript
│       └── index.ts
│
├── database/                  # Schéma BDD
│   └── schema.sql
│
└── assets/                    # Ressources statiques
    ├── fonts/
    ├── images/
    └── icons/
```

---

## 🚀 Installation

### Prérequis

- Node.js 18+
- npm ou yarn
- Expo CLI
- iOS Simulator (Mac) ou Android Studio

### Étapes

```bash
# 1. Cloner le repository
git clone https://github.com/your-username/mma-universe.git
cd mma-universe

# 2. Installer les dépendances
npm install

# 3. Lancer l'application
npx expo start

# 4. Scanner le QR code avec Expo Go
# ou appuyer sur 'i' pour iOS / 'a' pour Android
```

### Scripts Disponibles

```bash
npm start          # Démarrer Expo Dev Server
npm run ios        # Lancer sur iOS Simulator
npm run android    # Lancer sur Android Emulator
npm run web        # Lancer version web
npm run lint       # Vérifier le code
npm run typecheck  # Vérifier les types TypeScript
```

---

## 📱 Écrans

### Onboarding
- 4 slides de présentation
- Animations de transition
- Skip / Continuer

### Authentification
- **Login** - Email + Mot de passe, connexion sociale
- **Register** - Création de compte avec validation
- **Forgot Password** - Récupération par email

### Home (Dashboard)
- Header avec avatar et notifications
- Prochain événement en vedette
- Filtres rapides (À venir, Live, UFC, Bellator)
- Événements à venir (carousel)
- Combattants tendance
- Dernières vidéos
- Articles récents

### Fighters
- Liste avec recherche et filtres
- Vue grille / liste
- Filtres: catégorie de poids, organisation, champions
- **Détail Fighter**: Hero section, stats, historique combats, médias

### Events
- Vue liste et calendrier
- Événements live, à venir, passés
- **Détail Event**: Poster, infos, carte des combats, rappels

### Social Feed
- Stories en haut
- Feed infini avec posts
- Tabs: Pour vous, Abonnements, Tendances
- FAB pour créer un post

### Chat
- Liste des conversations
- Contacts en ligne
- **Chat Room**: Messages en temps réel, envoi médias

### Profile
- Cover + Avatar éditable
- Stats (posts, followers, following)
- Combattants suivis
- Tabs: Posts, Pronostics, Favoris
- **Settings**: Notifications, thème, langue, déconnexion

---

## 🗄 Base de Données

Le schéma PostgreSQL complet se trouve dans `/database/schema.sql` et inclut:

- **users** - Utilisateurs et authentification
- **fighters** - Combattants avec stats détaillées
- **events** - Événements MMA
- **fights** - Combats avec résultats
- **posts** - Publications du feed social
- **comments** - Commentaires sur les posts
- **conversations/messages** - Messagerie
- **notifications** - Système de notifications
- **predictions** - Pronostics utilisateurs

---

## 🔧 Configuration

### Variables d'Environnement

Créer un fichier `.env`:

```env
API_BASE_URL=http://localhost:3000/api/v1
EXPO_PUBLIC_API_URL=https://api.mma-universe.com

# OAuth (optionnel)
GOOGLE_CLIENT_ID=your-google-client-id
APPLE_CLIENT_ID=your-apple-client-id
```

### Path Aliases

Configurés dans `tsconfig.json`:

```json
{
  "@components/*": ["src/components/*"],
  "@screens/*": ["src/screens/*"],
  "@theme/*": ["src/theme/*"],
  "@navigation": ["src/navigation"],
  "@store/*": ["src/store/*"],
  "@api/*": ["src/api/*"],
  "@/types": ["src/types"]
}
```

---

## 📦 Build & Déploiement

### Build de développement

```bash
# iOS
npx expo run:ios

# Android
npx expo run:android
```

### Build de production (EAS)

```bash
# Configuration EAS
npx eas build:configure

# Build iOS
npx eas build --platform ios

# Build Android
npx eas build --platform android

# Soumission aux stores
npx eas submit --platform ios
npx eas submit --platform android
```

---

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push sur la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

---

## 📄 License

MIT License - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

<div align="center">
  <p>Made with ❤️ for MMA fans</p>
  <p>© 2024 MMA Universe. All rights reserved.</p>
</div>