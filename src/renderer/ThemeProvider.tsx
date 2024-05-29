import React from 'react';
import { MantineProvider, createTheme } from '@mantine/core';

const theme = createTheme({
  cursorType: 'pointer',
});

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <MantineProvider theme={theme}>{children}</MantineProvider>;
};

export default ThemeProvider;
