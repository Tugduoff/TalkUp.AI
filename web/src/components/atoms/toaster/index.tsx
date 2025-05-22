import { Toaster } from 'react-hot-toast';

/**
 * Component for configuring toast notifications.
 * 
 * Renders a Toaster component with specific configurations for position,
 * duration, styling, and different toast types (success, error, loading).
 * 
 * Toast notifications appear at the top-center of the screen for 5 seconds
 * with custom styling including background colors, text colors, and icons
 * for different notification states.
 * 
 * @returns {JSX.Element} A configured Toaster component
 */
const ToasterConfig = () => (
  <Toaster
    position="top-center"
    toastOptions={{
      duration: 5000,
      style: {
        background: '#fff',
        color: '#24242d',
      },
      iconTheme: {
        primary: '#29457a',
        secondary: '#fff',
      },
      className: 'font-display p-4',
      success: {
        style: {
          color: '#24242d',
        },
        iconTheme: {
          primary: '#0f7b16',
          secondary: '#fff',
        },
      },
      error: {
        style: {
          color: '#24242d',
        },
        iconTheme: {
          primary: '#a32a15',
          secondary: '#fff',
        },
      },
      loading: {
        style: {
          color: '#24242d',
        },
        iconTheme: {
          primary: '#383850',
          secondary: '#fff',
        },
      },
    }}
  />
);

export default ToasterConfig;
