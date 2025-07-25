# Financial AI Assistant - Interactive Prototype

A modern, dark-themed financial management application with AI assistant integration, featuring smooth animations and interactive financial data visualization.

## 🎯 Features

### Updates Section
- **Horizontal Scrollable Cards**: Smooth horizontal scrolling with physics-based animations
- **Pagination Dots**: Interactive pagination with animated dots (active dot becomes a rounded rectangle)
- **Card Animations**: 
  - Staggered entrance animations for cards
  - Press feedback animations
  - Smooth transitions between cards
- **Physics-Based Animations**: Using react-native-reanimated for 60fps performance

### Animation System
- **Spring Configurations**: Predefined spring animations for consistent feel
- **Staggered Animations**: Cards animate in sequence for polished UX
- **Interactive Feedback**: Press animations provide immediate user feedback
- **Smooth Pagination**: Dots animate smoothly as you scroll through cards

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- iOS Simulator or Android Emulator

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd findemo

# Install dependencies
npm install

# Start the development server
npm start
```

### Running on Device
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 🎨 Animation Features

### Card Animations
- **Entrance**: Cards fade in with scale and translateY animations
- **Press**: Cards scale down slightly when pressed
- **Release**: Cards return to normal scale with spring animation

### Pagination Dots
- **Active State**: Dot expands to rounded rectangle (32px width)
- **Inactive State**: Dot shrinks to circle (8px width)
- **Smooth Transitions**: Physics-based spring animations
- **Opacity Changes**: Active dots are fully opaque, inactive dots are dimmed

### Physics Configuration
The app uses predefined spring configurations for consistent animations:
- **Light**: Subtle interactions (damping: 20, stiffness: 100)
- **Medium**: Standard interactions (damping: 15, stiffness: 150)
- **Heavy**: Impactful interactions (damping: 10, stiffness: 200)
- **Bouncy**: Playful interactions (damping: 8, stiffness: 300)

## 📱 Component Structure

```
src/
├── components/
│   ├── financial/
│   │   └── UpdatesSection.js     # Horizontal scrollable cards
│   └── common/
│       ├── Card.js               # Reusable card component
│       └── Typography.js         # Text component
├── utils/
│   └── animations.js             # Animation utilities
├── hooks/
│   └── useAnimations.js          # Animation hooks
└── constants/
    └── theme.js                  # Design system
```

## 🎭 Animation Implementation

### UpdatesSection Component
The main component features:
- **FlatList**: Horizontal scrolling with snap behavior
- **Animated Cards**: Each card has entrance and press animations
- **Pagination Dots**: Animated dots that respond to scroll position
- **Physics-Based**: All animations use spring physics for natural feel

### Key Animation Features
1. **Staggered Entrance**: Cards animate in sequence with delays
2. **Scroll-Based Pagination**: Dots update based on scroll position
3. **Press Feedback**: Immediate visual feedback on card press
4. **Smooth Transitions**: 60fps animations using native driver

## 🔧 Technical Details

### Dependencies
- **react-native-reanimated**: ~3.17.4 (Physics-based animations)
- **react-native-gesture-handler**: ~2.24.0 (Gesture handling)
- **expo**: ~53.0.20 (Development platform)

### Performance Optimizations
- **useNativeDriver**: All animations run on the native thread
- **getItemLayout**: Optimized FlatList performance
- **scrollEventThrottle**: Efficient scroll event handling
- **useCallback**: Memoized event handlers

### Animation Configuration
```javascript
// Spring configuration for smooth animations
const SPRING_CONFIG = {
  medium: {
    damping: 15,
    stiffness: 150,
    mass: 0.8,
  }
};
```

## 🎯 Future Enhancements

- [ ] Add swipe gestures for card dismissal
- [ ] Implement card stacking animations
- [ ] Add haptic feedback on interactions
- [ ] Create more card types with different animations
- [ ] Add accessibility features for animations

## 📄 License

This project is licensed under the MIT License. 