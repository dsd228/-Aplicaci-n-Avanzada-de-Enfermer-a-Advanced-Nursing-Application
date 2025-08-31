# CareTrack Pro - Advanced Nursing Application

<div align="center">

![CareTrack Pro Logo](https://img.shields.io/badge/CareTrack-Pro-16a34a?style=for-the-badge&logo=heart&logoColor=white)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://www.javascript.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Responsive](https://img.shields.io/badge/Responsive-Design-38B2AC?logo=responsive&logoColor=white)](https://web.dev/responsive-web-design-basics/)

**A comprehensive, modern nursing application for patient management and care tracking**

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [Development](#development) • [Contributing](#contributing)

</div>

## 📋 Overview

CareTrack Pro is an advanced nursing application designed to streamline patient care management. Built with modern web technologies, it provides healthcare professionals with tools to track vital signs, manage medications, monitor fluid balance, and maintain comprehensive patient records.

### Key Highlights

- **🏥 Comprehensive Patient Management** - Complete patient profiles with medical history
- **📊 Vital Signs Monitoring** - Real-time tracking with Early Warning Score (EWS) calculation
- **💊 Medication Management** - Detailed medication tracking and administration records
- **📱 Progressive Web App** - Works offline and can be installed on any device
- **🌐 Bilingual Support** - Spanish and English interface
- **♿ Accessibility First** - WCAG compliant with screen reader support
- **📱 Responsive Design** - Optimized for desktop, tablet, and mobile devices

## ✨ Features

### Patient Management
- Create and manage patient profiles
- Track patient demographics and medical conditions
- Record allergies and important medical notes
- Patient selection and switching interface

### Vital Signs Monitoring
- Temperature, heart rate, blood pressure tracking
- Oxygen saturation and respiratory rate monitoring
- Pain assessment and Glasgow Coma Scale (GCS)
- Automatic Early Warning Score (EWS) calculation
- Visual alerts for abnormal readings

### Medication Administration
- Comprehensive medication tracking
- Dosage, route, and frequency management
- Administration status tracking
- Medication history and compliance monitoring

### Clinical Documentation
- Progress notes and clinical observations
- Fluid balance monitoring (intake/output)
- Task management and care planning
- Comprehensive audit trail

### Technical Features
- **Modular Architecture** - Clean, maintainable ES6+ modules
- **Robust Error Handling** - Comprehensive error management
- **Data Persistence** - Local storage with import/export capabilities
- **PWA Capabilities** - Offline functionality and app installation
- **Responsive UI** - Mobile-first design approach
- **Accessibility** - ARIA labels, keyboard navigation, screen reader support

## 🚀 Installation

### Prerequisites
- Modern web browser (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)
- Node.js 16+ (for development)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/dsd228/-Aplicaci-n-Avanzada-de-Enfermer-a-Advanced-Nursing-Application.git
   cd -Aplicaci-n-Avanzada-de-Enfermer-a-Advanced-Nursing-Application
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

### Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to web server**
   Upload the built files to your web server or use services like:
   - GitHub Pages
   - Netlify
   - Vercel
   - Apache/Nginx

### PWA Installation

Users can install CareTrack Pro as a Progressive Web App:

1. Open the application in a supported browser
2. Look for the "Install" button in the address bar or app interface
3. Follow the installation prompts
4. Access the app from your device's home screen

## 🖥️ Usage

### Getting Started

1. **Set Up Professional Profile**
   - Enter your name in the "Profesional" section
   - Configure temperature units (Celsius/Fahrenheit)
   - Choose language preference (Spanish/English)

2. **Create Patients**
   - Click "Nuevo Paciente" to add new patients
   - Fill in patient demographics and medical information
   - Select patients from the dropdown to view their data

3. **Record Vital Signs**
   - Navigate to the Vital Signs section
   - Enter temperature, heart rate, blood pressure, etc.
   - Review automatic EWS calculations and alerts

4. **Manage Medications**
   - Add medications with dosage and administration details
   - Track administration status and timing
   - Review medication history and compliance

### Screenshots

<div align="center">

| Dashboard View | Patient Management | Vital Signs |
|:--------------:|:------------------:|:-----------:|
| ![Dashboard](docs/images/dashboard.png) | ![Patients](docs/images/patients.png) | ![Vitals](docs/images/vitals.png) |

| Medication Tracking | Mobile View | Dark Theme |
|:-------------------:|:-----------:|:----------:|
| ![Medications](docs/images/medications.png) | ![Mobile](docs/images/mobile.png) | ![Dark](docs/images/dark-theme.png) |

</div>

### Data Management

- **Export**: Download patient data as JSON for backup or transfer
- **Import**: Restore data from previously exported files
- **Print**: Generate printable reports for physical records

## 🛠️ Development

### Project Structure

```
├── modules/                 # ES6 modules
│   ├── utilities.js         # Helper functions and utilities
│   ├── dataManager.js       # State management and persistence
│   ├── i18n.js             # Internationalization support
│   ├── renderer.js         # UI rendering functions
│   └── eventHandlers.js    # Event handling and user interactions
├── tests/                  # Jest test files
│   ├── setup.js           # Test environment setup
│   ├── utilities.test.js  # Utility function tests
│   └── dataManager.test.js # Data management tests
├── app.js                 # Main application entry point
├── index.html             # Application HTML structure
├── styles.css             # Enhanced responsive styles
├── manifest.webmanifest   # PWA manifest
├── sw.js                  # Service worker for offline functionality
└── package.json           # Dependencies and scripts
```

### Development Scripts

```bash
# Start development server
npm start

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Build for production
npm run build
```

### Code Quality

The project includes:
- **ESLint** for code quality and consistency
- **Jest** for unit testing with DOM testing utilities
- **ES6+ Modules** for clean, maintainable architecture
- **Comprehensive error handling** throughout the application
- **JSDoc comments** for code documentation

### Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test utilities.test.js
```

### Architecture Principles

- **Modular Design**: Separated concerns into focused modules
- **Error Resilience**: Comprehensive error handling with user-friendly messages
- **Accessibility First**: WCAG compliance and inclusive design
- **Progressive Enhancement**: Works on all devices and network conditions
- **Performance Optimization**: Efficient rendering and minimal dependencies

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following our coding standards
4. Add tests for new functionality
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines

- Follow ES6+ standards and modern JavaScript practices
- Write tests for new features and bug fixes
- Ensure accessibility compliance (WCAG 2.1 AA)
- Maintain responsive design principles
- Document complex functionality with JSDoc comments

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web standards and progressive enhancement
- Designed with healthcare professionals in mind
- Accessibility guidelines based on WCAG 2.1
- Early Warning Score calculations based on clinical standards

---

<div align="center">

**[Report Bug](https://github.com/dsd228/-Aplicaci-n-Avanzada-de-Enfermer-a-Advanced-Nursing-Application/issues)** • **[Request Feature](https://github.com/dsd228/-Aplicaci-n-Avanzada-de-Enfermer-a-Advanced-Nursing-Application/issues)** • **[View Documentation](docs/)**

Made with ❤️ for healthcare professionals

</div>