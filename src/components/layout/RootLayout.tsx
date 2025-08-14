import { useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const RootLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Flex
      w="full"
      h="100vh"
      flexDir={{ base: "column", md: "row" }}
      overflow="hidden"
      bgGradient="linear(to-br, blue.50, white)"
    >
      {/* Sidebar: Hide on mobile, show on md+ */}
      <Box
        display={{ base: "none", md: "block" }}
        h="full"
        bg="white"
        boxShadow="xl"
        borderRight="1px solid"
        borderColor="gray.100"
        zIndex={20}
      >
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </Box>
      <Flex flexDir="column" flex="1" minW={0} h="full">
        {/* Navbar: Sticky on mobile */}
        <Box
          position={{ base: "sticky", md: "static" }}
          top="0"
          zIndex="30"
          boxShadow="md"
          bg="white"
        >
          <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
        </Box>
        <Box
          flex="1"
          h="full"
          overflowY="auto"
          px={{ base: 2, md: 8 }}
          py={{ base: 2, md: 6 }}
          bg={["white", "transparent"]}
          borderRadius={{ base: "none", md: "2xl" }}
          transition="background 0.2s"
        >
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
};

export default RootLayout;

