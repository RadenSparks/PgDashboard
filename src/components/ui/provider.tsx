import React from 'react';
import { ChakraProvider as ChakraUIProvider } from '@chakra-ui/react';

const ChakraProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <ChakraUIProvider>
      {children}
    </ChakraUIProvider>
  );
};

export default ChakraProvider;
