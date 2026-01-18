import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { theme } from './theme';
import { Home } from './pages/Home';

/**
 * Root application component
 */
function App() {
    return (
        <>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <ChakraProvider theme={theme}>
                <Home />
            </ChakraProvider>
        </>
    );
}

export default App;
