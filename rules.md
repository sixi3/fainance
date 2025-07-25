# React Expo Development Rules & Guidelines

## 🚀 Project Overview
This document outlines the development rules, best practices, and guidelines for the React Expo project to ensure maintainable, performant, and smooth user experiences.

## 📁 Project Structure

```
findemo/
├── App.js                 # Main application entry point
├── app.json              # Expo configuration
├── package.json          # Dependencies and scripts
├── assets/               # Static assets (images, icons, fonts)
├── src/                  # Source code (create this directory)
│   ├── components/       # Reusable UI components
│   ├── screens/          # Screen components
│   ├── navigation/       # Navigation configuration
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── constants/        # App constants and theme
│   ├── services/         # API calls and external services
│   └── types/            # TypeScript type definitions (if using TS)
├── __tests__/            # Test files
└── docs/                 # Documentation
```

## 🎯 Core Development Principles

### 1. Performance First
- **Always measure performance** before and after changes
- **Use React DevTools Profiler** to identify bottlenecks
- **Implement lazy loading** for heavy components
- **Optimize bundle size** by analyzing with `expo build:analyze`

### 2. Code Quality
- **Follow ESLint rules** strictly
- **Use Prettier** for consistent formatting
- **Write meaningful commit messages** following conventional commits
- **Add JSDoc comments** for complex functions and components

### 3. User Experience
- **Implement proper loading states** for all async operations
- **Handle errors gracefully** with user-friendly messages
- **Ensure accessibility** with proper labels and navigation
- **Test on multiple devices** and screen sizes

## 🎨 Animation Guidelines

### Animation Performance Rules

#### 1. Use Native Driver
```javascript
// ✅ GOOD - Use native driver for better performance
Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 1000,
  useNativeDriver: true, // Always enable for opacity/transform
}).start();

// ❌ BAD - Avoid layout animations with native driver
Animated.timing(widthAnim, {
  toValue: 200,
  duration: 1000,
  useNativeDriver: true, // This will cause errors
}).start();
```

#### 2. Optimize Animation Values
```javascript
// ✅ GOOD - Use transform instead of layout properties
const animatedStyle = {
  transform: [
    { translateX: slideAnim },
    { scale: scaleAnim },
    { rotate: rotateAnim }
  ]
};

// ❌ BAD - Avoid animating layout properties
const badStyle = {
  width: widthAnim,
  height: heightAnim,
  left: leftAnim
};
```

#### 3. Batch Animation Updates
```javascript
// ✅ GOOD - Batch multiple animations
const runAnimations = () => {
  Animated.parallel([
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true })
  ]).start();
};
```

#### 4. Use InteractionManager for Heavy Operations
```javascript
// ✅ GOOD - Defer heavy operations until animations complete
const handlePress = () => {
  runAnimation();
  InteractionManager.runAfterInteractions(() => {
    // Heavy operation here
    loadData();
  });
};
```

### Animation Best Practices

#### 1. Consistent Timing
```javascript
// Define animation constants
const ANIMATION_CONFIG = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  EASING: Easing.bezier(0.25, 0.1, 0.25, 1)
};
```

#### 2. Smooth Transitions
```javascript
// ✅ GOOD - Use spring animations for natural feel
const springConfig = {
  tension: 100,
  friction: 8,
  useNativeDriver: true
};

Animated.spring(animValue, springConfig).start();
```

#### 3. Gesture-Based Animations
```javascript
// ✅ GOOD - Use PanGestureHandler for smooth gestures
import { PanGestureHandler } from 'react-native-gesture-handler';

const onGestureEvent = Animated.event(
  [{ nativeEvent: { translationX: translateX } }],
  { useNativeDriver: true }
);
```

## 📱 Component Development Rules

### 1. Component Structure
```javascript
// ✅ GOOD - Follow this structure
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

const ComponentName = ({ prop1, prop2, onPress }) => {
  // 1. Hooks
  const [state, setState] = useState(initialValue);
  const theme = useTheme();
  
  // 2. Memoized values
  const memoizedValue = useMemo(() => expensiveCalculation(prop1), [prop1]);
  
  // 3. Callbacks
  const handlePress = useCallback(() => {
    onPress?.();
  }, [onPress]);
  
  // 4. Effects
  useEffect(() => {
    // Side effects
    return () => {
      // Cleanup
    };
  }, []);
  
  // 5. Render
  return (
    <View style={[styles.container, theme.container]}>
      <Text style={[styles.text, theme.text]}>Content</Text>
    </View>
  );
};

// 6. Styles
const styles = StyleSheet.create({
  container: {
    // styles
  },
  text: {
    // styles
  }
});

// 7. PropTypes or TypeScript
ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
  onPress: PropTypes.func
};

export default ComponentName;
```

### 2. State Management Rules
```javascript
// ✅ GOOD - Use appropriate state management
// Local state for component-specific data
const [isVisible, setIsVisible] = useState(false);

// Context for shared state across components
const ThemeContext = createContext();

// Redux/Zustand for complex global state
const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user })
}));
```

### 3. Performance Optimization
```javascript
// ✅ GOOD - Memoize expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  return <View>{/* render data */}</View>;
});

// ✅ GOOD - Use useCallback for event handlers
const handlePress = useCallback(() => {
  // handler logic
}, [dependencies]);

// ✅ GOOD - Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);
```

## 🧪 Testing Guidelines

### 1. Unit Tests
```javascript
// ✅ GOOD - Test component behavior
import { render, fireEvent } from '@testing-library/react-native';

describe('ComponentName', () => {
  it('should render correctly', () => {
    const { getByText } = render(<ComponentName />);
    expect(getByText('Expected Text')).toBeTruthy();
  });
  
  it('should handle press events', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(<ComponentName onPress={onPress} />);
    fireEvent.press(getByTestId('button'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

### 2. Integration Tests
```javascript
// ✅ GOOD - Test component interactions
describe('Screen Integration', () => {
  it('should navigate correctly', async () => {
    const { getByText } = render(<App />);
    fireEvent.press(getByText('Navigate'));
    await waitFor(() => {
      expect(getByText('New Screen')).toBeTruthy();
    });
  });
});
```

## 🔧 Development Workflow

### 1. Git Workflow
```bash
# ✅ GOOD - Follow this workflow
git checkout -b feature/component-name
# Make changes
git add .
git commit -m "feat: add new component with smooth animations"
git push origin feature/component-name
# Create pull request
```

### 2. Commit Message Format
```
type(scope): description

feat(animations): add smooth slide-in animation for cards
fix(navigation): resolve navigation stack memory leak
docs(readme): update installation instructions
style(components): improve button styling consistency
refactor(hooks): extract animation logic into custom hook
test(components): add unit tests for animation components
```

### 3. Code Review Checklist
- [ ] Performance impact assessed
- [ ] Animations use native driver where possible
- [ ] Error handling implemented
- [ ] Accessibility features added
- [ ] Tests written and passing
- [ ] Code follows style guidelines
- [ ] Documentation updated

## 🚀 Performance Optimization

### 1. Bundle Optimization
```javascript
// ✅ GOOD - Use dynamic imports for code splitting
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

// ✅ GOOD - Use require for conditional imports
const getIcon = (name) => {
  return require(`../assets/icons/${name}.png`);
};
```

### 2. Image Optimization
```javascript
// ✅ GOOD - Use appropriate image formats and sizes
import { Image } from 'expo-image';

const OptimizedImage = () => (
  <Image
    source={require('../assets/icon.png')}
    style={styles.image}
    contentFit="cover"
    placeholder={blurhash}
    transition={200}
  />
);
```

### 3. List Optimization
```javascript
// ✅ GOOD - Use FlatList for large lists
import { FlatList } from 'react-native';

const OptimizedList = ({ data }) => (
  <FlatList
    data={data}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => <ListItem item={item} />}
    getItemLayout={(data, index) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    })}
    removeClippedSubviews={true}
    maxToRenderPerBatch={10}
    windowSize={10}
  />
);
```

## 🎨 UI/UX Guidelines

### 1. Design System
```javascript
// ✅ GOOD - Create a consistent design system
export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  background: '#FFFFFF',
  surface: '#F2F2F7',
  text: '#000000',
  textSecondary: '#8E8E93'
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
};

export const TYPOGRAPHY = {
  h1: { fontSize: 32, fontWeight: 'bold' },
  h2: { fontSize: 24, fontWeight: 'bold' },
  h3: { fontSize: 20, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: 'normal' },
  caption: { fontSize: 14, fontWeight: 'normal' }
};
```

### 2. Responsive Design
```javascript
// ✅ GOOD - Use responsive dimensions
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const responsiveStyle = {
  width: width * 0.9,
  height: height * 0.1,
  paddingHorizontal: width * 0.05
};
```

## 🔍 Debugging Guidelines

### 1. Performance Monitoring
```javascript
// ✅ GOOD - Monitor performance in development
import { PerformanceObserver } from 'react-native';

if (__DEV__) {
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      console.log(`${entry.name}: ${entry.duration}ms`);
    });
  });
  observer.observe({ entryTypes: ['measure'] });
}
```

### 2. Animation Debugging
```javascript
// ✅ GOOD - Debug animations
const debugAnimation = (animValue) => {
  if (__DEV__) {
    animValue.addListener(({ value }) => {
      console.log('Animation value:', value);
    });
  }
};
```

## 📚 Recommended Libraries

### Animation Libraries
- `react-native-reanimated` - Advanced animations
- `react-native-gesture-handler` - Gesture handling
- `lottie-react-native` - Lottie animations

### Performance Libraries
- `react-native-fast-image` - Optimized image loading
- `react-native-svg` - Vector graphics
- `react-native-vector-icons` - Icon library

### Development Tools
- `@testing-library/react-native` - Testing utilities
- `react-native-debugger` - Debugging tools
- `reactotron` - Development debugging

## 🚨 Common Pitfalls to Avoid

### 1. Animation Mistakes
```javascript
// ❌ BAD - Don't animate layout properties with native driver
Animated.timing(widthAnim, {
  toValue: 200,
  duration: 300,
  useNativeDriver: true // This will crash
}).start();

// ❌ BAD - Don't create animations in render
const Component = () => {
  const anim = new Animated.Value(0); // This recreates on every render
  return <Animated.View style={{ opacity: anim }} />;
};
```

### 2. Performance Mistakes
```javascript
// ❌ BAD - Don't use inline styles
const Component = () => (
  <View style={{ backgroundColor: 'red', padding: 10 }} />
);

// ❌ BAD - Don't create functions in render
const Component = () => {
  const handlePress = () => {}; // This recreates on every render
  return <Button onPress={handlePress} />;
};
```

## 📖 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Performance](https://reactnative.dev/docs/performance)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)

---

**Remember**: These rules are living guidelines. Update them as the project evolves and new best practices emerge. Always prioritize user experience and performance in your development decisions. 