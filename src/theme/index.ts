import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
    initialColorMode: 'system',
    useSystemColorMode: true,
};

const colors = {
    brand: {
        50: '#e6f7ff',
        100: '#b3e0ff',
        200: '#80caff',
        300: '#4db3ff',
        400: '#1a9cff',
        500: '#0080e6',
        600: '#0063b3',
        700: '#004780',
        800: '#002a4d',
        900: '#000e1a',
    },
};

const fonts = {
    heading: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif`,
    body: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif`,
};

const styles = {
    global: {
        'html, body': {
            minHeight: '100vh',
        },
        '#root': {
            minHeight: '100vh',
        },
    },
};

const components = {
    Table: {
        variants: {
            striped: {
                tbody: {
                    tr: {
                        '&:nth-of-type(odd)': {
                            td: {
                                bg: 'gray.50',
                                _dark: {
                                    bg: 'gray.700',
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    Button: {
        defaultProps: {
            colorScheme: 'brand',
        },
    },
    Checkbox: {
        defaultProps: {
            colorScheme: 'brand',
        },
    },
};

export const theme = extendTheme({
    config,
    colors,
    fonts,
    styles,
    components,
});
