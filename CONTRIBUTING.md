# Contributing to CareTrack Pro

First off, thank you for considering contributing to CareTrack Pro! It's people like you that make this application a great tool for healthcare professionals.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Accessibility Requirements](#accessibility-requirements)
- [Submitting Changes](#submitting-changes)
- [Issue Reporting](#issue-reporting)
- [Feature Requests](#feature-requests)

## 🤝 Code of Conduct

This project and everyone participating in it is governed by our commitment to creating a welcoming, inclusive environment for all contributors. By participating, you are expected to uphold these values:

- **Be respectful** - Treat everyone with respect and consideration
- **Be inclusive** - Welcome diverse perspectives and experiences
- **Be collaborative** - Work together constructively
- **Be professional** - Maintain appropriate communication standards

## 🚀 Getting Started

### Ways to Contribute

There are many ways you can contribute to CareTrack Pro:

- 🐛 **Report bugs** - Help us identify and fix issues
- 💡 **Suggest features** - Propose new functionality or improvements
- 📝 **Improve documentation** - Help make our docs clearer and more comprehensive
- 🎨 **Design improvements** - Enhance UI/UX or accessibility
- 🧪 **Write tests** - Increase test coverage and reliability
- 🔧 **Fix bugs** - Submit pull requests for known issues
- ✨ **Add features** - Implement new functionality

### First Time Contributors

If you're new to contributing to open source projects:

1. Look for issues labeled `good first issue` - these are designed for newcomers
2. Start with documentation improvements or small bug fixes
3. Ask questions if you're unsure about anything
4. Don't worry about making mistakes - we're here to help!

## 🛠️ Development Setup

### Prerequisites

- **Node.js** 16 or higher
- **npm** 7 or higher
- **Git** for version control
- **Modern web browser** for testing

### Setting Up Your Development Environment

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub, then:
   git clone https://github.com/YOUR-USERNAME/-Aplicaci-n-Avanzada-de-Enfermer-a-Advanced-Nursing-Application.git
   cd -Aplicaci-n-Avanzada-de-Enfermer-a-Advanced-Nursing-Application
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your environment**
   ```bash
   # Add the original repository as upstream
   git remote add upstream https://github.com/dsd228/-Aplicaci-n-Avanzada-de-Enfermer-a-Advanced-Nursing-Application.git
   
   # Verify the setup
   git remote -v
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run tests to ensure everything works**
   ```bash
   npm test
   ```

## 📝 Making Changes

### Workflow

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-number-description
   ```

2. **Keep your fork updated**
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

3. **Make your changes**
   - Write clear, concise code
   - Follow our coding standards
   - Add tests for new functionality
   - Update documentation as needed

4. **Test your changes**
   ```bash
   npm test
   npm run lint
   npm run build
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add patient search functionality"
   ```

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(patients): add patient search functionality
fix(vitals): correct EWS calculation for edge cases
docs(readme): update installation instructions
test(utils): add tests for temperature conversion functions
```

## 🎯 Coding Standards

### JavaScript Guidelines

#### ES6+ Features
- Use `const` and `let` instead of `var`
- Use arrow functions where appropriate
- Use template literals for string interpolation
- Use destructuring for object and array operations
- Use ES6 modules (import/export)

#### Code Style
```javascript
// ✅ Good
const calculateEWS = (vitals) => {
  const { temperature, heartRate, respiratoryRate } = vitals;
  
  let score = 0;
  
  if (temperature < 36.0 || temperature > 38.0) {
    score += 1;
  }
  
  return score;
};

// ❌ Avoid
var calculateEWS = function(vitals) {
  var temp = vitals.temperature;
  var hr = vitals.heartRate;
  var score = 0;
  if(temp<36||temp>38){score++;}
  return score;
}
```

#### Error Handling
- Always handle errors gracefully
- Provide meaningful error messages to users
- Log errors for debugging while protecting user privacy

```javascript
// ✅ Good
try {
  const data = JSON.parse(jsonString);
  return data;
} catch (error) {
  handleError(error, 'Data parsing');
  return null;
}

// ❌ Avoid
const data = JSON.parse(jsonString); // Can crash the app
```

#### Function Documentation
Use JSDoc for complex functions:

```javascript
/**
 * Calculates the Early Warning Score based on vital signs
 * @param {Object} vitals - The patient's vital signs
 * @param {number} vitals.temperature - Temperature in Celsius
 * @param {number} vitals.heartRate - Heart rate in BPM
 * @param {number} vitals.respiratoryRate - Respiratory rate per minute
 * @returns {number} The calculated EWS score
 */
const calculateEWS = (vitals) => {
  // Implementation
};
```

### CSS Guidelines

#### Naming Convention
Use BEM (Block Element Modifier) methodology:

```css
/* Block */
.patient-card { }

/* Element */
.patient-card__header { }
.patient-card__content { }

/* Modifier */
.patient-card--highlighted { }
.patient-card__header--large { }
```

#### Responsive Design
- Mobile-first approach
- Use CSS Grid and Flexbox for layouts
- Use CSS custom properties for theming

```css
/* ✅ Good - Mobile first */
.patient-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacer-md);
}

@media (min-width: 768px) {
  .patient-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1200px) {
  .patient-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### HTML Guidelines

#### Semantic HTML
- Use semantic elements (`<main>`, `<section>`, `<article>`, etc.)
- Proper heading hierarchy (`<h1>` to `<h6>`)
- Meaningful `alt` attributes for images

#### Accessibility
- Always include proper ARIA labels
- Ensure keyboard navigation works
- Maintain sufficient color contrast
- Use `role` attributes where appropriate

```html
<!-- ✅ Good -->
<section aria-labelledby="vitals-heading">
  <h2 id="vitals-heading">Vital Signs</h2>
  <table role="table" aria-label="Patient vital signs">
    <thead>
      <tr>
        <th scope="col">Date</th>
        <th scope="col">Temperature</th>
      </tr>
    </thead>
  </table>
</section>
```

## 🧪 Testing Guidelines

### Writing Tests

#### Test Structure
- Follow the Arrange-Act-Assert (AAA) pattern
- Use descriptive test names
- Group related tests with `describe` blocks

```javascript
describe('Temperature Conversion', () => {
  describe('Celsius to Fahrenheit', () => {
    test('should convert 37°C to 98.6°F', () => {
      // Arrange
      const celsius = 37;
      
      // Act
      const fahrenheit = toF(celsius);
      
      // Assert
      expect(fahrenheit).toBe('98.6');
    });
  });
});
```

#### Test Coverage
- Aim for high test coverage (>80%)
- Test both happy paths and edge cases
- Test error conditions and recovery

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm test -- --coverage

# Run specific test file
npm test utilities.test.js
```

## ♿ Accessibility Requirements

### WCAG 2.1 AA Compliance

All contributions must maintain accessibility standards:

#### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Logical tab order
- Visible focus indicators

#### Screen Reader Support
- Proper semantic markup
- ARIA labels and descriptions
- Live regions for dynamic content

#### Color and Contrast
- Minimum 4.5:1 contrast ratio for normal text
- Minimum 3:1 contrast ratio for large text
- Don't rely on color alone to convey information

#### Responsive Design
- Text must be readable at 200% zoom
- Touch targets minimum 44x44 pixels
- Content must reflow properly

### Testing Accessibility

```bash
# Manual testing checklist:
# - Tab through the interface
# - Test with screen reader (NVDA, JAWS, VoiceOver)
# - Check color contrast
# - Test at 200% zoom
# - Verify with keyboard only
```

## 📤 Submitting Changes

### Pull Request Process

1. **Ensure your branch is up to date**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push your changes**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request**
   - Use a clear, descriptive title
   - Fill out the PR template completely
   - Reference any related issues
   - Include screenshots for UI changes

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Other (please describe)

## Testing
- [ ] Tests pass locally
- [ ] Added tests for new functionality
- [ ] Manual testing completed

## Accessibility
- [ ] Keyboard navigation tested
- [ ] Screen reader compatibility verified
- [ ] Color contrast verified
- [ ] Responsive design tested

## Screenshots
(Include screenshots for UI changes)

## Related Issues
Fixes #(issue number)
```

### Review Process

1. **Automated checks** - All tests and linting must pass
2. **Code review** - At least one maintainer will review your code
3. **Accessibility review** - UI changes will be tested for accessibility
4. **Manual testing** - New features will be manually tested

## 🐛 Issue Reporting

### Before Reporting a Bug

1. **Search existing issues** - Check if the bug has already been reported
2. **Try the latest version** - Ensure you're using the most recent code
3. **Reproduce the issue** - Confirm you can consistently reproduce the problem

### Bug Report Template

```markdown
## Bug Description
A clear description of what the bug is.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Environment
- Browser: [e.g., Chrome 96, Firefox 95]
- Device: [e.g., Desktop, iPhone 12]
- Screen Size: [e.g., 1920x1080, 375x812]

## Additional Context
Any other context about the problem.
```

## 💡 Feature Requests

### Before Requesting a Feature

1. **Check existing requests** - Look for similar feature requests
2. **Consider the scope** - Ensure the feature aligns with project goals
3. **Think about implementation** - Consider how it might be implemented

### Feature Request Template

```markdown
## Feature Description
A clear description of the feature you'd like to see.

## Problem Solved
What problem does this feature solve?

## Proposed Solution
How would you like this feature to work?

## Alternatives Considered
Any alternative solutions you've considered.

## Use Cases
Specific scenarios where this feature would be useful.

## Additional Context
Any other context or screenshots about the feature request.
```

## 🎉 Recognition

Contributors will be recognized in:
- The project README
- Release notes for significant contributions
- Our contributors page

## 📞 Getting Help

If you need help:

1. **Check the documentation** - Look through README and existing docs
2. **Search issues** - Look for similar questions or problems
3. **Ask questions** - Open an issue with the "question" label
4. **Join discussions** - Participate in GitHub Discussions

## 📜 License

By contributing to CareTrack Pro, you agree that your contributions will be licensed under the same MIT License that covers the project.

---

Thank you for contributing to CareTrack Pro! Your efforts help make healthcare technology more accessible and effective for professionals worldwide. 🏥❤️