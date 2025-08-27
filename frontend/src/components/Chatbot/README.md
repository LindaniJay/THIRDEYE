# Chatbot Component

A simple, customizable chat interface for the Third Eye website that helps users get information about services.

## Features

- Toggleable chat interface
- Predefined responses for common questions
- Service information lookup
- Responsive design
- Animated messages
- Easy to customize and extend

## Installation

1. Install the required dependencies:
   ```bash
   npm install @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons
   ```

2. Import and use the Chatbot component in your main App component or layout:

```tsx
import Chatbot from './components/Chatbot/Chatbot';

function App() {
  return (
    <div className="App">
      {/* Your app content */}
      <Chatbot />
    </div>
  );
}
```

## Customization

### Adding New Responses

You can add new responses by updating the `serviceInfo` or `commonQuestions` objects in the Chatbot component.

```typescript
const serviceInfo = {
  // ... existing services
  'new-service': 'Information about the new service.'
};

const commonQuestions = {
  // ... existing questions
  'new-question': 'Answer to the new question.'
};
```

### Styling

The component uses Tailwind CSS for styling. You can customize the colors and layout by modifying the className props in the component.

## Dependencies

- React 16.8+
- TypeScript
- @fortawesome/react-fontawesome
- @fortawesome/free-solid-svg-icons

## License

MIT
