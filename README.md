# 2048 - Matrix Terminal Edition

Une application Electron du jeu 2048 avec un thème cyberpunk Matrix/terminal hacker et des animations fluides.

## 🎮 Fonctionnalités

### Gameplay
- **Jeu 2048 classique** : Fusionnez les tuiles pour atteindre 2048
- **Contrôles hybrides** : Clavier (flèches/WASD) + boutons souris
- **Annulation** : Revenez en arrière jusqu'à 10 coups
- **Sauvegarde automatique** : Votre partie est sauvegardée
- **Score persistant** : Meilleur score conservé

### Thème Matrix
- **Design cyberpunk** : Vert Matrix/terminal hacker
- **Effets visuels** : Scanlines, grid, néon glow
- **Animations fluides** : Glissement, fusion, effets glitch
- **Ambiance immersive** : Effets Matrix rain et hologram

### Interface
- **Terminal stylé** : Police monospace, couleurs néon
- **Réactivité** : Adapté aux différentes tailles d'écran
- **Feedback visuel** : Animations pour chaque action

## 🚀 Installation et Lancement

### Prérequis
- Node.js (version 16 ou supérieure)
- npm (inclus avec Node.js)

### Installation
```bash
# Clonez ou téléchargez le projet
cd 2048

# Installez les dépendances
npm install
```

### Lancement
```bash
# Lancez l'application
npm start

# Mode développement (avec outils de debug)
npm run dev
```

## 🎯 Contrôles

### Clavier
- **Flèches directionnelles** : Haut/Bas/Gauche/Droite
- **WASD** : Alternative aux flèches
- **Autres touches** : Fonctions futures

### Souris
- **Boutons directionnels** : Cliquez pour déplacer
- **Boutons de contrôle** : Nouvelle partie, Annuler, Quitter

## 🎨 Personnalisation

### Thème
Les couleurs et effets sont définis dans les fichiers CSS :
- `styles/main.css` : Styles principaux
- `styles/animations.css` : Animations
- `styles/matrix-effects.css` : Effets spéciaux Matrix

### Paramètres
Les préférences sont sauvegardées automatiquement :
- Animations activées/désactivées
- Effets sonores (futur)
- Lignes de grille (futur)

## 📁 Structure du Projet

```
2048/
├── main.js                 # Processus principal Electron
├── index.html              # Interface HTML
├── package.json            # Configuration npm
├── README.md               # Documentation
├── styles/                 # Feuilles de style CSS
│   ├── main.css           # Styles principaux
│   ├── animations.css     # Animations
│   └── matrix-effects.css # Effets Matrix
├── scripts/                # Logique JavaScript
│   ├── game.js            # Logique du jeu 2048
│   ├── ui.js              # Gestion interface
│   ├── animations.js      # Gestion animations
│   └── storage.js         # Stockage local
└── assets/                 # Ressources
    └── icons/             # Icônes application
```

## 🔧 Développement

### Architecture
- **Electron** : Application desktop cross-platform
- **Vanilla JS** : Pas de framework frontend lourd
- **CSS Grid** : Mise en page moderne
- **localStorage** : Stockage persistant

### Classes principales
- `Game2048` : Logique du jeu
- `UIManager` : Gestion interface
- `AnimationManager` : Animations et effets
- `StorageManager` : Sauvegarde/chargement

## 🐛 Dépannage

### Problèmes courants
1. **Application ne se lance pas**
   - Vérifiez l'installation de Node.js
   - Exécutez `npm install` à nouveau

2. **Animations lentes**
   - Désactivez les effets dans les paramètres
   - Vérifiez les performances de votre système

3. **Score non sauvegardé**
   - Vérifiez que localStorage est disponible
   - Effacez le cache si nécessaire

### Développeur
```bash
# Console de développement (dans Electron)
Ctrl+Shift+I (Windows/Linux)
Cmd+Option+I (macOS)
```

## 📝 License

Projet éducatif et personnel. Code libre d'utilisation.

## 🚀 Futures Améliorations

- [ ] Effets sonores cyberpunk
- [ ] Mode multijoueur réseau
- [ ] Thèmes supplémentaires (Synthwave, CyberBlue)
- [ ] Tableaux de bord statistiques
- [ ] Mode de jeu personnalisé (3x3, 5x5)
- [ ] Partage de scores en ligne

---

**Enjoy the Matrix! 🌊💚**
