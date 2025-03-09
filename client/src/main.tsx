import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Loading from './views/components/loading_page_components.tsx'
import './index.css'
import 'antd/dist/reset.css';
import { MantineProvider } from '@mantine/core';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider>
      <Loading />
    </MantineProvider>
  </StrictMode>,
)
