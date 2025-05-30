import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const RootLayout = () => {
  return (
    <Flex w="full" h="100vh" flexDir={{ base: "column", md: "row" }}>
      <Sidebar />
      <Flex flexDir="column" flex="1">
        <Navbar />
        <Box flex="1" h="full">
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
};

export default RootLayout;

