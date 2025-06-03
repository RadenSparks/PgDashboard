import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const colors = {
  brand: {
    50:  '#e3f9e5',
    100: '#c1eac5',
    200: '#a3d9a5',
    300: '#7bc47f',
    400: '#57ae5b',
    500: '#3f9142', // Main accent: green for "play"
    600: '#2f8132',
    700: '#207227',
    800: '#0e5814',
    900: '#05400a',
  },
  accent: {
    100: '#ffe5b4',
    200: '#ffd580',
    300: '#ffc04d',
    400: '#ffad1f', // Gold accent for fun
    500: '#ff9900',
  },
  gray: {
    50:  '#f9fafb',
    100: '#f4f5f7',
    200: '#e5e7eb',
    300: '#d5d6d7',
    400: '#9e9e9e',
    500: '#707275',
    600: '#4c4f52',
    700: '#24262d',
    800: '#1a1c23',
    900: '#121317',
  },
};

const fonts = {
  heading: `'Luckiest Guy', 'Montserrat', cursive, sans-serif`, // playful heading
  body: `'Inter', 'Segoe UI', sans-serif`,
};

const components = {
  Button: {
    baseStyle: {
      fontWeight: 'bold',
      borderRadius: 'lg',
    },
    variants: {
      solid: {
        bg: 'brand.500',
        color: 'white',
        _hover: { bg: 'brand.600' },
      },
      accent: {
        bg: 'accent.400',
        color: 'gray.900',
        _hover: { bg: 'accent.500' },
      },
    },
  },
  Input: {
    variants: {
      filled: {
        field: {
          bg: 'gray.100',
          _focus: { bg: 'gray.50', borderColor: 'brand.400' },
        },
      },
    },
  },
  Heading: {
    baseStyle: {
      fontFamily: 'heading',
      color: 'brand.700',
    },
  },
};

const theme = extendTheme({
  config,
  colors,
  fonts,
  components,
});

export default theme;
