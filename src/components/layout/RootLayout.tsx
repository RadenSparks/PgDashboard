import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const RootLayout = () => {
  return (
    <Flex w="full" h="100vh" flexDir={{ base: "column", md: "row" }} overflow="hidden">
      {/* Sidebar: Hide on mobile, show on md+ */}
      <Box display={{ base: "none", md: "block" }} h="full">
        <Sidebar isOpen={undefined} onClose={undefined} />
      </Box>
      <Flex flexDir="column" flex="1" minW={0} h="full">
        {/* Navbar: Sticky on mobile */}
        <Box position={{ base: "sticky", md: "static" }} top="0" zIndex="10" boxShadow="sm">
          <Navbar />
        </Box>
        <Box flex="1" h="full" overflowY="auto">
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
};

export default RootLayout;

