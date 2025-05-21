import { Toaster } from 'react-hot-toast';

const ToasterConfig = () => (
  <Toaster
    position="top-center"
    toastOptions={{
      duration: 5000,
      style: {
        background: '#fff',
        color: '#29457a',
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
        }
      },
      error: {
        style: {
          color: '#24242d',
        },
        iconTheme: {
          primary: '#a32a15',
          secondary: '#fff',
        }
      },
      loading: {
        style: {
          color: '#24242d',
        },
        iconTheme: {
          primary: '#383850',
          secondary: '#fff',
        }
      },
    }}
  />
)

export default ToasterConfig;
