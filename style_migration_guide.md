# React to Flutter Style Migration Guide

This document explains how the styles from `card_react.js` were converted to `card_flutter.dart`.

## Key Style Mappings

### 1. Container Styles

| React CSS | Flutter Equivalent |
|-----------|-------------------|
| `background: #ffffff` | `Card(color: Colors.white)` |
| `border-radius: 12px` | `BorderRadius.circular(12)` |
| `box-shadow: 0 4px 6px rgba(0,0,0,0.1)` | `Card(elevation: 4.0, shadowColor: Colors.black.withOpacity(0.1))` |
| `max-width: 320px` | `Container(constraints: BoxConstraints(maxWidth: 320))` |
| `margin: 16px` | `Container(margin: EdgeInsets.all(16))` |
| `border: 1px solid #e2e8f0` | `RoundedRectangleBorder(side: BorderSide(color: Color(0xFFE2E8F0)))` |

### 2. Hover Effects

| React CSS | Flutter Equivalent |
|-----------|-------------------|
| `:hover { transform: translateY(-2px) }` | `MouseRegion + AnimationController + Transform.scale` |
| `:hover { box-shadow: 0 8px 15px... }` | `Animation<double> _elevationAnimation` |

### 3. Image Styles

| React CSS | Flutter Equivalent |
|-----------|-------------------|
| `width: 100%; height: 200px` | `Container(height: 200, width: double.infinity)` |
| `object-fit: cover` | `DecorationImage(fit: BoxFit.cover)` |

### 4. Typography

| React CSS | Flutter Equivalent |
|-----------|-------------------|
| `font-size: 20px; font-weight: 600` | `TextStyle(fontSize: 20, fontWeight: FontWeight.w600)` |
| `color: #1a202c` | `TextStyle(color: Color(0xFF1A202C))` |
| `line-height: 1.3` | `TextStyle(height: 1.3)` |

### 5. Padding & Spacing

| React CSS | Flutter Equivalent |
|-----------|-------------------|
| `padding: 20px` | `Padding(padding: EdgeInsets.all(20))` |
| `margin: 0 0 8px 0` | `SizedBox(height: 8)` between widgets |

### 6. Button Styles

| React CSS | Flutter Equivalent |
|-----------|-------------------|
| `background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)` | `Container(decoration: BoxDecoration(gradient: LinearGradient(...)))` |
| `border-radius: 8px` | `BorderRadius.circular(8)` |
| `padding: 10px 20px` | `Container(height: 44) + Center widget` |
| `cursor: pointer` | `InkWell(onTap: ...)` |

### 7. Color System

All hex colors were converted to Flutter Color objects:
- `#ffffff` → `Colors.white`
- `#1a202c` → `Color(0xFF1A202C)`
- `#718096` → `Color(0xFF718096)`
- `#4a5568` → `Color(0xFF4A5568)`
- `#f7fafc` → `Color(0xFFF7FAFC)`
- `#e2e8f0` → `Color(0xFFE2E8F0)`
- `#667eea` → `Color(0xFF667EEA)`
- `#764ba2` → `Color(0xFF764BA2)`

## Key Differences and Considerations

### 1. Animation Implementation
- **React**: CSS transitions handle hover effects automatically
- **Flutter**: Requires `AnimationController`, `Animation` objects, and `MouseRegion`

### 2. Layout Structure
- **React**: Uses CSS flexbox and positioning
- **Flutter**: Uses `Column`, `Container`, and explicit widget hierarchy

### 3. Responsive Design
- **React**: CSS media queries
- **Flutter**: `MediaQuery` and responsive layouts (can be added as needed)

### 4. State Management
- **React**: CSS pseudo-classes (`:hover`)
- **Flutter**: Explicit state management with `StatefulWidget`

## Usage

To use the Flutter card:

```dart
CardFlutter(
  title: 'Your Title',
  subtitle: 'Optional subtitle',
  content: 'Your content here',
  imageUrl: 'https://example.com/image.jpg',
  buttonText: 'Action Button',
  onButtonPressed: () {
    // Handle button press
  },
)
```

The Flutter implementation maintains all the visual characteristics of the React component while being fully native to Flutter's widget system.