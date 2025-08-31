# Aplicación Avanzada de Enfermería - Advanced Nursing Application

## Overview
SaludPro es una plataforma clínica avanzada diseñada para profesionales de enfermería, que proporciona acceso a procedimientos médicos, información sobre enfermedades, verificación de interacciones medicamentosas y recursos educativos.

## Features

### 🎨 Enhanced Design System
- **Comprehensive Color Palette**: Consistent color variables with light and dark theme support
- **Typography Hierarchy**: Well-defined text scales and font weights using Google Fonts
- **Component-Based Styling**: Modular CSS architecture for better maintainability

### 🌙 Dark Mode Support
- Toggle between light and dark themes
- Persistent theme preference storage
- Automatic system preference detection
- Smooth transitions between themes

### 📱 Fully Responsive Design
- Mobile-first approach with comprehensive media queries
- Optimized layouts for mobile (320px+), tablet (768px+), and desktop (1024px+)
- Touch-friendly interface with appropriate spacing and sizing

### ♿ Accessibility Features
- ARIA labels and semantic HTML structure
- Keyboard navigation support (Tab, Enter, Escape, Ctrl+Shift+D for theme toggle)
- Screen reader compatibility with descriptive text
- High contrast mode support
- Focus management for modals and interactive elements
- Sufficient color contrast ratios

### ✨ Enhanced Interactions
- Smooth animations and transitions
- Hover effects with visual feedback
- Loading states and micro-interactions
- Button states (hover, active, disabled)
- Modal animations with backdrop blur

### 🎯 User Experience Improvements
- Consistent iconography using Material Symbols
- Enhanced navigation with grid layout
- Improved modal system with better positioning
- Visual hierarchy with shadows and elevation
- Color-coded severity levels for medical information

## Technical Implementation

### CSS Variables System
```css
:root {
  /* Color Palette */
  --primary-color: var(--blue-600);
  --surface: var(--grey-0);
  --text-primary: var(--grey-900);
  
  /* Typography */
  --font-primary: 'Google Sans';
  --text-base: 1rem;
  
  /* Spacing */
  --spacer-md: 16px;
  
  /* Transitions */
  --transition-normal: 250ms ease-in-out;
}
```

### Responsive Breakpoints
- **Mobile**: 480px and below
- **Tablet**: 768px and below
- **Desktop**: 1024px and above
- **Large Desktop**: 1200px and above

### Theme Toggle
- JavaScript-powered theme switching
- localStorage persistence
- Automatic icon updates
- Smooth color transitions

## Browser Compatibility
- Modern browsers supporting CSS Grid and Custom Properties
- Progressive enhancement for older browsers
- Graceful degradation of animations with `prefers-reduced-motion`

## Performance Optimizations
- Optimized CSS with minimal specificity
- Efficient animations using transforms
- Lazy loading considerations for images
- Minimal JavaScript for theme management

## Accessibility Compliance
- WCAG 2.1 AA compliant color contrast
- Keyboard navigation patterns
- Screen reader optimization
- Focus management
- Semantic HTML structure

## Usage

### Theme Toggle
- Click the theme toggle button in the top-right corner
- Use keyboard shortcut: `Ctrl+Shift+D`
- Theme preference is automatically saved

### Navigation
- Use Tab to navigate through interactive elements
- Enter to activate buttons and links
- Escape to close modals

### Responsive Behavior
The application automatically adapts to different screen sizes:
- Navigation collapses to vertical layout on mobile
- Image grids adjust from 3 columns to 2 to 1 based on screen size
- Typography scales appropriately for readability

## Development

### File Structure
```
├── index.html          # Main HTML file with semantic structure
├── main.css           # Enhanced CSS with design system
├── main.js            # JavaScript with theme toggle and accessibility
├── data-*.js          # Data files for different sections
└── assets/            # Images and media files
```

### Color System
The application uses a comprehensive color system with semantic naming:
- Primary colors (blue palette)
- Semantic colors (red for danger, yellow for warning, green for success)
- Neutral grays for text and surfaces
- Alpha variants for transparency effects

### Animations
All animations respect user preferences:
- `prefers-reduced-motion: reduce` disables animations
- Smooth transitions for better user experience
- Performance-optimized transform animations

## Future Enhancements
- [ ] Additional language support
- [ ] Enhanced search functionality
- [ ] Offline mode capabilities
- [ ] Print-friendly styling
- [ ] Additional theme variants