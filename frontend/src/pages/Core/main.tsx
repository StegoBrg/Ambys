import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/tiptap/styles.css';
import '@mantine/charts/styles.css';
import 'mantine-contextmenu/styles.css';
import 'mantine-datatable/styles.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import '../../i18n.ts';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ContextMenuProvider } from 'mantine-contextmenu';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider defaultColorScheme='dark'>
      <Notifications />
      <ContextMenuProvider>
        <App />
      </ContextMenuProvider>
    </MantineProvider>
  </StrictMode>
);
