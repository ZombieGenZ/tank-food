import { createRoot } from 'react-dom/client'
import './index.css'
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <MantineProvider>
    <Notifications />
    <App />
  </MantineProvider>
)
