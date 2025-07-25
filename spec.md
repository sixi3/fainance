# Financial AI Assistant - Interactive Prototype Specification

## 🎯 Project Overview

This document outlines the comprehensive specification for building an interactive prototype of a modern, dark-themed financial management application with AI assistant integration. The prototype will demonstrate advanced UI/UX patterns, smooth animations, and interactive financial data visualization.

**Design Reference**: [Figma Design](https://www.figma.com/design/slFrBezYPx8IoUL0HmjAlA/Untitled?node-id=111-1557&t=v2Akwf1DWZD2zrk8-11)

## 📱 Design Analysis & Requirements

### Visual Theme & Brand Identity
- **Primary Theme**: Dark financial interface with sophisticated green accents
- **Color Palette**:
  - **Background**: Very dark green (#090A09) - Main app background
  - **Surface**: Dark green gradients (#232523 to #1A1E1C) - Card backgrounds
  - **Primary Accent**: Light green (#E3FFBB) - Highlights and important text
  - **Secondary**: Grey tones (#4D5753, #9AABA0) - Secondary elements
  - **Success**: Green (#2C8249) - Positive indicators and gains
  - **Currency**: Orange (#F15A29) - Currency symbols and bank branding
  - **Investment**: Blue (#003874) - Investment-related elements
  - **Gold**: (#D2AB67) - Company icons and premium elements

### Typography System
- **Primary Font**: Hiragino Sans (iOS system font equivalent)
- **Currency Font**: Inknut Antiqua - For currency symbols
- **Status Font**: SF Pro - For status bar elements
- **Font Weights**: 250 (light), 300 (regular), 400 (medium), 500 (semibold), 600 (bold)
- **Font Sizes**: 10px, 12px, 14px, 16px, 20px, 22px, 28px

### Layout Specifications
- **Device**: iPhone 16 - 4 (393px × 852px)
- **Border Radius**: 52px (device frame), 16px (main cards), 12px (investment cards)
- **Spacing System**: 4px, 8px, 12px, 16px, 20px, 24px
- **Padding**: 12px horizontal for main content, 8px between sections

## 🏗️ Technical Architecture

### Technology Stack
- **Framework**: React Native with Expo
- **Navigation**: React Navigation 6
- **Animations**: React Native Reanimated 3
- **State Management**: React Context + Hooks
- **Styling**: StyleSheet with custom theme system
- **Icons**: Lucide React Native icons
- **Testing**: Jest + React Native Testing Library

### Project Structure
```
src/
├── components/
│   ├── common/
│   │   ├── Card.js              # Reusable card component
│   │   ├── Button.js            # Custom button component
│   │   ├── Icon.js              # Icon wrapper component
│   │   └── Typography.js        # Text component with theme
│   ├── layout/
│   │   ├── StatusBar.js         # Custom status bar
│   │   ├── HeaderSection.js     # Greeting and profile
│   │   └── SafeAreaWrapper.js   # Safe area handling
│   ├── financial/
│   │   ├── BankBalanceSection.js    # Bank balance display
│   │   ├── InvestmentSection.js     # Investment overview
│   │   ├── UpdatesSection.js        # Latest updates
│   │   └── DistributionProgressBar.js # Progress visualization
│   ├── assistant/
│   │   ├── VoiceAssistant.js    # Voice input component
│   │   ├── ChatScreen.js        # Chat interface
│   │   └── ChatMessage.js       # Individual message component
│   └── animations/
│       ├── FadeInView.js        # Fade animation wrapper
│       ├── SlideInView.js       # Slide animation wrapper
│       └── PulseAnimation.js    # Pulse effect component
├── screens/
│   ├── HomeScreen.js            # Main homescreen
│   ├── ChatScreen.js            # AI chat interface
│   ├── InvestmentDetailScreen.js # Investment details
│   └── SettingsScreen.js        # App settings
├── constants/
│   ├── theme.js                 # Color and typography system
│   ├── spacing.js               # Spacing constants
│   ├── animations.js            # Animation configurations
│   └── icons.js                 # Icon definitions
├── hooks/
│   ├── useBalance.js            # Balance data management
│   ├── useInvestments.js        # Investment data management
│   ├── useVoiceInput.js         # Voice assistant functionality
│   ├── useAnimations.js         # Animation utilities
│   └── useFinancialData.js      # Financial data fetching
├── utils/
│   ├── formatters.js            # Currency and number formatting
│   ├── animations.js            # Animation utilities
│   ├── validators.js            # Input validation
│   └── storage.js               # Local storage utilities
├── services/
│   ├── api.js                   # API client
│   ├── voiceService.js          # Voice processing
│   └── financialService.js      # Financial data service
└── assets/
    ├── icons/                   # Custom icons
    ├── images/                  # App images
    └── fonts/                   # Custom fonts
```

## 🎨 Component Specifications

### 1. Status Bar Component
**Purpose**: Custom status bar with time and system indicators
**Features**:
- Time display (9:41 format)
- Signal strength indicator
- Wi-Fi indicator
- Battery level with percentage
- Custom styling to match design

**Implementation**:
```javascript
// Custom status bar with exact Figma styling
const StatusBar = () => {
  return (
    <View style={styles.statusBar}>
      <Text style={styles.time}>9:41</Text>
      <View style={styles.indicators}>
        <SignalIcon />
        <WifiIcon />
        <BatteryIndicator />
      </View>
    </View>
  );
};
```

### 2. Header Section Component
**Purpose**: Greeting and profile section with notification bell
**Features**:
- Personalized greeting ("Hello, Anand")
- Main title ("Latest Updates")
- Notification bell icon
- Circular profile picture
- Background gradient ellipses

**Interactive Elements**:
- Notification bell tap → Open notifications
- Profile picture tap → Open profile/settings
- Smooth hover effects

### 3. Updates Section Component
**Purpose**: Latest financial updates with source attribution
**Features**:
- AI-generated financial advice
- Source tags (bloomberg.com, moneycontrol.com, +3)
- Chat bubble icon
- Chevron for details
- Carousel navigation dots

**Interactive Elements**:
- Card tap → Expand details
- Source tag tap → Open source website
- Swipe gestures for carousel
- Smooth transitions between updates

### 4. Bank Balance Section Component
**Purpose**: Bank balance display with visibility toggle
**Features**:
- Large balance amount (₹27,92,30,392.86)
- Currency symbol styling
- Eye icon for visibility toggle
- Update timestamp
- Bank icons (Bank of Baroda, Kotak Bank, +2)

**Interactive Elements**:
- Eye icon tap → Toggle balance visibility
- Bank icon tap → Open bank details
- Smooth fade animations (150ms)
- Haptic feedback on toggle

**Animation Specifications**:
- Fade transition: 150ms duration
- Use `useNativeDriver: true`
- Fixed-width container (160px) for layout stability
- Horizontal centering for balance text

### 5. Investment Section Component
**Purpose**: Investment overview with tabs and progress visualization
**Features**:
- Tab switching (Stock Holdings / Mutual Funds)
- Progress bar (63% filled)
- Net value display with change percentage
- Investment cards with company icons
- Animated value transitions

**Interactive Elements**:
- Tab switching with smooth animations
- Horizontal scroll for investment cards
- Card tap → Investment details
- Edge detection for tab switching

**Animation Specifications**:
- Tab switch: Slide transition with indicators
- Value changes: Animated number transitions
- Card appearance: Slide from bottom
- Progress bar: Animated fill

### 6. Voice Assistant Component
**Purpose**: Voice input interface with AI assistant
**Features**:
- Large microphone button (64x64px)
- Gradient background (#2A4E2A to #011A01)
- Instruction text with separator
- Keyboard icon for alternative input
- Pulse animation when recording

**Interactive Elements**:
- Microphone press and hold → Start recording
- Keyboard icon tap → Open keyboard input
- Swipe down gesture → Keyboard mode
- Visual feedback during recording

**Animation Specifications**:
- Pulse animation: 2s duration, infinite loop
- Scale animation: 0.95 on press
- Recording state: Enhanced pulse effect

## 🎭 Animation System

### Animation Principles
- **Smooth**: 60fps performance target
- **Responsive**: Immediate feedback on interactions
- **Consistent**: Unified timing and easing curves
- **Accessible**: Respect reduced motion preferences

### Animation Specifications
```javascript
export const ANIMATIONS = {
  // Timing functions
  easing: {
    easeInOut: Easing.inOut(Easing.cubic),
    easeOut: Easing.out(Easing.cubic),
    easeIn: Easing.in(Easing.cubic),
  },
  
  // Duration presets
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
    verySlow: 800,
  },
  
  // Common animations
  fadeIn: {
    duration: 300,
    easing: Easing.out(Easing.cubic),
  },
  
  slideUp: {
    duration: 400,
    easing: Easing.out(Easing.cubic),
  },
  
  scale: {
    duration: 150,
    easing: Easing.out(Easing.cubic),
  },
  
  pulse: {
    duration: 2000,
    easing: Easing.inOut(Easing.cubic),
  },
};
```

### Micro-interactions
1. **Button Press**: Scale down to 0.95 with haptic feedback
2. **Card Hover**: Subtle elevation increase
3. **Tab Switching**: Smooth slide with directional indicators
4. **Balance Toggle**: Fade with blur effect
5. **Voice Recording**: Enhanced pulse animation
6. **Loading States**: Skeleton screens with shimmer effect

## 📊 Data Management

### State Structure
```javascript
const appState = {
  user: {
    name: 'Anand',
    avatar: 'profile-image-url',
    preferences: {
      balanceVisibility: true,
      notifications: true,
      theme: 'dark',
    },
  },
  
  financial: {
    balance: {
      amount: 279230392.86,
      currency: 'INR',
      isVisible: true,
      lastUpdated: '2024-01-15T10:30:00Z',
    },
    
    investments: {
      totalValue: 279230392.86,
      change: 19.2,
      changePeriod: '7 days',
      stockHoldings: 63,
      mutualFunds: 37,
      holdings: [
        {
          id: '1',
          name: 'Reliance Industries Ltd',
          symbol: 'RELIANCE',
          invested: 14760.3,
          current: 16928.3,
          change: 9.8,
          icon: 'gold-icon',
          type: 'stock',
        },
        // ... more holdings
      ],
    },
    
    banks: [
      {
        id: '1',
        name: 'Bank of Baroda',
        icon: 'bob-icon',
        color: '#F15A29',
        balance: 15000000,
      },
      {
        id: '2',
        name: 'Kotak Bank',
        icon: 'kotak-icon',
        color: '#003874',
        balance: 129230392.86,
      },
      // ... more banks
    ],
  },
  
  updates: [
    {
      id: '1',
      message: 'Consider reallocating some of your IT stocks to banking.',
      sources: ['bloomberg.com', 'moneycontrol.com'],
      timestamp: '2024-01-15T10:28:00Z',
      type: 'investment_advice',
    },
    // ... more updates
  ],
  
  assistant: {
    isRecording: false,
    isListening: false,
    messages: [],
    lastInteraction: null,
  },
};
```

### Data Flow
1. **Initial Load**: Fetch user data and financial information
2. **Real-time Updates**: WebSocket connection for live data
3. **Local Storage**: Cache frequently accessed data
4. **Offline Support**: Graceful degradation when offline

## 🔧 Technical Implementation

### Performance Optimizations
1. **React.memo()**: For all card components
2. **useCallback**: For event handlers
3. **useMemo**: For expensive calculations
4. **FlatList**: For scrollable lists
5. **Image Optimization**: Lazy loading and caching
6. **Animation Performance**: useNativeDriver for transforms

### Accessibility Features
1. **Screen Reader Support**: Proper accessibility labels
2. **Dynamic Type**: Support for larger text sizes
3. **High Contrast**: Maintain WCAG AA compliance
4. **Reduced Motion**: Respect user preferences
5. **Voice Control**: Support for voice navigation

### Error Handling
1. **Network Errors**: Graceful fallbacks
2. **Data Validation**: Input sanitization
3. **Loading States**: Skeleton screens
4. **Error Boundaries**: Component-level error catching
5. **User Feedback**: Clear error messages

## 🧪 Testing Strategy

### Unit Tests
- Component rendering tests
- Animation behavior tests
- Data formatting tests
- Accessibility compliance tests

### Integration Tests
- Screen navigation tests
- Data flow tests
- Voice input tests
- Performance benchmarks

### Device Testing
- iOS device compatibility
- Android device compatibility
- Different screen sizes
- Performance on lower-end devices

## 📱 Interactive Prototype Features

### Phase 1: Core UI (Week 1)
- [ ] Status bar with system indicators
- [ ] Header section with greeting and profile
- [ ] Updates section with carousel
- [ ] Bank balance section with toggle
- [ ] Investment section with tabs
- [ ] Voice assistant interface

### Phase 2: Animations & Interactions (Week 2)
- [ ] Smooth tab switching animations
- [ ] Balance visibility toggle with fade
- [ ] Voice recording pulse animation
- [ ] Card hover and press effects
- [ ] Loading states and transitions
- [ ] Micro-interactions throughout

### Phase 3: Advanced Features (Week 3)
- [ ] Voice input processing
- [ ] Chat interface for AI assistant
- [ ] Real-time data updates
- [ ] Offline functionality
- [ ] Settings and preferences
- [ ] Error handling and feedback

### Phase 4: Polish & Testing (Week 4)
- [ ] Performance optimization
- [ ] Accessibility implementation
- [ ] Cross-device testing
- [ ] User feedback integration
- [ ] Final refinements

## 🎯 Success Metrics

### Performance Targets
- **60fps animations** on all supported devices
- **< 2 second** initial load time
- **< 100ms** interaction response time
- **< 50MB** app bundle size

### User Experience Goals
- **Intuitive navigation** with clear visual hierarchy
- **Smooth animations** that enhance usability
- **Accessible design** for all users
- **Responsive layout** across devices

### Technical Quality
- **Clean, maintainable code** following best practices
- **Comprehensive test coverage** (>80%)
- **Performance monitoring** and optimization
- **Security compliance** for financial data

## 🚀 Development Guidelines

### Code Standards
- **ESLint + Prettier**: Consistent code formatting
- **TypeScript**: Type safety for all components
- **Component Documentation**: JSDoc comments
- **Git Workflow**: Feature branches with PR reviews

### Design System
- **Consistent Spacing**: Use spacing constants
- **Color Usage**: Follow theme color guidelines
- **Typography**: Use defined font styles
- **Component Reusability**: Build modular components

### Animation Guidelines
- **Performance First**: Always use native driver when possible
- **Consistent Timing**: Use predefined duration values
- **User Feedback**: Provide immediate visual feedback
- **Accessibility**: Respect reduced motion preferences

---

## 📋 Implementation Checklist

### Setup & Configuration
- [ ] Initialize React Native Expo project
- [ ] Set up project structure and folders
- [ ] Configure ESLint, Prettier, and TypeScript
- [ ] Install required dependencies
- [ ] Set up navigation structure
- [ ] Configure theme and constants

### Core Components
- [ ] StatusBar component
- [ ] HeaderSection component
- [ ] UpdatesSection component
- [ ] BankBalanceSection component
- [ ] InvestmentSection component
- [ ] VoiceAssistant component
- [ ] Common components (Card, Button, Icon)

### Animations & Interactions
- [ ] Tab switching animations
- [ ] Balance toggle animations
- [ ] Voice recording animations
- [ ] Card hover effects
- [ ] Loading state animations
- [ ] Micro-interactions

### Data & State Management
- [ ] Financial data structure
- [ ] User preferences management
- [ ] Real-time data updates
- [ ] Local storage implementation
- [ ] Error handling

### Testing & Quality Assurance
- [ ] Unit tests for components
- [ ] Integration tests
- [ ] Performance testing
- [ ] Accessibility testing
- [ ] Cross-device testing

### Documentation
- [ ] Component documentation
- [ ] API documentation
- [ ] User guide
- [ ] Developer guide
- [ ] Deployment guide

---

This specification provides a comprehensive roadmap for building an interactive prototype that demonstrates advanced UI/UX patterns, smooth animations, and sophisticated financial data visualization. The implementation will showcase modern React Native development practices while maintaining the exact visual design from the Figma reference. 