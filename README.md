# Design Patterns Test Automation Framework

A comprehensive **Playwright + TypeScript** test automation framework demonstrating **7 design patterns** for the [DemoBlaze](https://www.demoblaze.com) e-commerce website.

## 🎯 Project Overview

This framework showcases enterprise-level test automation architecture by implementing multiple design patterns that promote code reusability, maintainability, and scalability.

## 🏗️ Design Patterns Implemented

### 1. **Singleton Pattern** - Browser Management
- **Location**: `src/patterns/singleton/BrowserManager.ts`
- **Purpose**: Ensures only one browser instance exists throughout test execution
- **Benefits**: Reduces resource consumption, improves performance, centralized browser lifecycle management

### 2. **Factory Pattern** - Page Object Creation
- **Location**: `src/patterns/factory/PageFactory.ts`
- **Purpose**: Provides centralized page object instantiation with caching
- **Benefits**: Encapsulates creation logic, easy to extend, reduces coupling

### 3. **Builder Pattern** - Test Data Construction
- **Location**: `src/patterns/builder/`
  - `UserBuilder.ts` - User credentials
  - `ProductBuilder.ts` - Product data
- **Purpose**: Flexible construction of complex test data objects
- **Benefits**: Readable fluent API, supports optional fields, auto-generation capabilities

### 4. **Strategy Pattern** - Verification Strategies
- **Location**: `src/patterns/strategy/VerificationStrategy.ts`
- **Purpose**: Interchangeable verification algorithms
- **Strategies**:
  - `TitleOnlyStrategy` - Quick smoke tests
  - `TitleAndPriceStrategy` - Standard verification
  - `FullProductDetailsStrategy` - Comprehensive validation
- **Benefits**: Runtime strategy selection, easy to add new strategies, follows Open/Closed Principle

### 5. **Template Method Pattern** - Test Flows
- **Location**: `src/patterns/template/`
  - `BaseFlow.ts` - Abstract template
  - `SignUpFlow.ts` - Sign-up implementation
  - `LoginFlow.ts` - Login implementation
  - `AddToCartFlow.ts` - Add to cart implementation
- **Purpose**: Defines algorithm skeleton, allows step customization
- **Benefits**: Code reuse, consistent flow structure, customizable steps

### 6. **Command Pattern** - Action Encapsulation
- **Location**: `src/patterns/command/`
  - `Command.ts` - Command interface and implementations
  - `CommandExecutor.ts` - Command manager
- **Commands**: Click, Type, Navigate, Wait, Verify
- **Benefits**: Action queuing, command history, undo support, flexible execution

### 7. **Decorator Pattern** - Enhanced Functionality
- **Location**: `src/patterns/decorator/ActionDecorator.ts`
- **Decorators**:
  - `withLogging` - Action logging
  - `withScreenshot` - Screenshot on failure
  - `withRetry` - Automatic retry logic
  - `withTiming` - Performance monitoring
- **Benefits**: Dynamic behavior addition, composable decorators, non-invasive enhancement

## 📁 Project Structure

```
design-patterns-playwright-framework/
├── src/
│   ├── patterns/
│   │   ├── singleton/
│   │   │   └── BrowserManager.ts
│   │   ├── factory/
│   │   │   └── PageFactory.ts
│   │   ├── builder/
│   │   │   ├── UserBuilder.ts
│   │   │   └── ProductBuilder.ts
│   │   ├── strategy/
│   │   │   └── VerificationStrategy.ts
│   │   ├── template/
│   │   │   ├── BaseFlow.ts
│   │   │   ├── SignUpFlow.ts
│   │   │   ├── LoginFlow.ts
│   │   │   └── AddToCartFlow.ts
│   │   ├── command/
│   │   │   ├── Command.ts
│   │   │   └── CommandExecutor.ts
│   │   └── decorator/
│   │       └── ActionDecorator.ts
│   └── pages/
│       ├── BasePage.ts
│       ├── HomePage.ts
│       ├── SignUpPage.ts
│       ├── LoginPage.ts
│       ├── ProductPage.ts
│       └── CartPage.ts
├── tests/
│   └── demoblaze.spec.ts
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Running Tests

```bash
# Run all tests (headless)
npm test

# Run tests in headed mode
npm run test:headed

# Run tests with UI mode (interactive)
npm run test:ui

# Debug tests
npm run test:debug

# Type checking
npm run typecheck
```

## 📝 Test Scenario

The main test demonstrates a complete user journey:

1. **Navigate** to home page
2. **Sign up** a new user (using Builder pattern)
3. **Login** with created user (using Template Method pattern)
4. **Verify** username is displayed
5. **Navigate** to Monitors category (using Decorator pattern)
6. **Select** Apple monitor product (using Command pattern)
7. **Verify** product information (using Strategy pattern)
8. **Add** product to cart
9. **Verify** product in cart

## 🎓 Design Pattern Benefits

### Code Reusability
- Template Method pattern provides reusable flow structures
- Builder pattern eliminates duplicate data construction code
- Factory pattern centralizes object creation

### Maintainability
- Strategy pattern isolates verification logic
- Command pattern encapsulates actions for easy modification
- Decorator pattern adds functionality without changing existing code

### Scalability
- Factory pattern makes adding new pages trivial
- Strategy pattern allows easy addition of verification types
- Template Method pattern enables new flows with minimal code

### Testability
- Singleton pattern provides controlled browser management
- Command pattern enables action replay and testing
- All patterns promote loose coupling

## 📚 Pattern Usage Examples

### Builder Pattern
```typescript
const user = new UserBuilder()
  .withUsername('testuser')
  .withPassword('SecurePass123!')
  .withEmail('test@example.com')
  .build();
```

### Factory Pattern
```typescript
const factory = new PageFactory(page);
const homePage = factory.getHomePage();
const loginPage = factory.getLoginPage();
```

### Strategy Pattern
```typescript
const verifier = new ProductVerifier(new TitleOnlyStrategy());
await verifier.verify(page, product);

verifier.setStrategy(new FullProductDetailsStrategy());
await verifier.verify(page, product);
```

### Template Method Pattern
```typescript
const loginFlow = new LoginFlow(page, user);
await loginFlow.execute(); // Runs setup → actions → verify → cleanup
```

### Command Pattern
```typescript
const executor = new CommandExecutor();
executor
  .addCommand(new ClickCommand(page, '#button'))
  .addCommand(new TypeCommand(page, '#input', 'text'))
  .addCommand(new VerifyCommand(page, '#result', 'expected'));
await executor.executeAll();
```

### Decorator Pattern
```typescript
const action = withLogging(
  async () => await page.click('#button'),
  'Click submit button'
);
await action();
```

## 🔧 Configuration

### TypeScript Configuration
- Strict mode enabled for type safety
- Path aliases for clean imports
- ES2022 target for modern features

### Playwright Configuration
- Base URL: `https://www.demoblaze.com`
- Screenshot on failure
- Trace on first retry
- Multi-browser support (Chromium, Firefox, WebKit)

## 📊 Best Practices Demonstrated

✅ **Page Object Model (POM)** - Clean separation of page logic  
✅ **Type Safety** - Full TypeScript typing throughout  
✅ **DRY Principle** - No code duplication  
✅ **SOLID Principles** - Clean architecture  
✅ **Comprehensive Logging** - Detailed execution logs  
✅ **Error Handling** - Robust error management  
✅ **Code Documentation** - Extensive comments and JSDoc  

## 🎯 Learning Outcomes

This framework demonstrates:
- How to structure enterprise-level test automation
- When and how to apply design patterns
- Best practices for Playwright + TypeScript
- Clean code architecture principles
- Scalable and maintainable test design

## 📄 License

ISC

---

**Built with ❤️ using Playwright + TypeScript + Design Patterns**
