import {
  Box,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  Kbd,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  RiDashboardLine,
  RiShoppingCartLine,
  RiUserLine,
  RiCodeLine,
  RiSettingsLine,
  RiSearchLine,
} from "react-icons/ri";
import { Button, type ButtonProps } from "./components/ui/button.tsx";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from "./components/ui/menu.tsx";
import { Avatar } from "./components/ui/avatar.tsx";
import { InputGroup } from "./components/ui/input-group.tsx";
import React from "react";

function App() {
  const username = "Admin"; // Replace with dynamic username from user context

  return (
    <Stack flexDirection="row" height="100vh" alignItems="stretch" bg="bg.muted">
      <Stack
        width="250px"
        borderRightWidth="1"
        py="2"
        borderColor="border.emphasized"
        bg="bg.muted"
      >
        <Box px="2" py="4" textAlign="center">
          <Avatar size="lg" name={username} />
          <Text fontWeight="bold" mt="2">
            Welcome, {username}!
          </Text>
        </Box>
        <Box flex="1" overflow="auto">
          <Heading size="xs" fontWeight="semibold" color="fg.muted" px="4" py="2">
            Dashboard
          </Heading>
          <Stack px="2" alignItems="flex-start" gap="1">
            <NavLink icon={<RiDashboardLine />} active>
              Overview
            </NavLink>
            <NavLink icon={<RiShoppingCartLine />}>Products</NavLink>
            <NavLink icon={<RiCodeLine />}>Orders</NavLink>
            <NavLink icon={<RiUserLine />}>Customers</NavLink>
            <NavLink icon={<RiSettingsLine />}>Settings</NavLink>
          </Stack>
        </Box>
      </Stack>
      <Stack flexDirection="row" bg="bg.panel" flex="1" boxShadow="sm" gap="0" overflow="hidden">
        <Stack flex="1" overflow="auto">
          <PanelHeader>
            <HStack width="100%" alignItems="center" position="relative">
              {/* Center: Search bar absolutely centered */}
              <Box position="absolute" left="50%" top="50%" transform="translate(-50%, -50%)">
                <SearchInput />
              </Box>
              {/* Right: UserMenu and LanguageSwapButton */}
              <Box marginLeft="auto" display="flex" alignItems="center" gap={2}>
                <LanguageSwapButton />
                <UserMenu />
              </Box>
            </HStack>
          </PanelHeader>
          <Box flex="1" px="4" py="2">
            {/* Main content goes here, e.g., charts, stats */}
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}

function LanguageSwapButton() {
  const [language, setLanguage] = React.useState("English"); // Default language

  const handleLanguageChange = () => {
    // Toggle between languages
    const newLanguage = language === "English" ? "Vietnamese" : "English";
    setLanguage(newLanguage);
    console.log(`Language swapped to: ${newLanguage}`);
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleLanguageChange}>
      {language} {/* Display the current language */}
    </Button>
  );
}

function UserMenu() {
  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <IconButton variant="ghost" size="sm" px="0" borderRadius="full" aria-label="User menu">
          <Avatar size="sm" name="Admin" />
        </IconButton>
      </MenuTrigger>
      <MenuContent>
        <MenuItem value="profile">Profile</MenuItem>
        <MenuItem value="settings">Settings</MenuItem>
        <MenuSeparator />
        <MenuItem value="signout">Sign out</MenuItem>
      </MenuContent>
    </MenuRoot>
  );
}

function NavLink(props: ButtonProps & { icon: React.ReactNode; active?: boolean }) {
  const { icon, active, children, ...rest } = props;
  return (
    <Button
      variant="ghost"
      size="sm"
      fontSize="sm"
      fontWeight="normal"
      width="full"
      justifyContent="flex-start"
      _active={{ bg: "bg.emphasized" }}
      data-active={active ? "true" : undefined}
      {...rest}
    >
      <Icon color="blue.500" boxSize="4">
        {icon}
      </Icon>
      {children}
    </Button>
  );
}

function PanelHeader(props: { children: React.ReactNode }) {
  return (
    <Stack
      position="sticky"
      top="0"
      zIndex="sticky"
      flexDirection="row"
      flexShrink="0"
      height="12"
      px="4"
      alignItems="center"
      justifyContent="space-between"
      borderBottomWidth="1px"
      borderColor="transparent"
      transition="all 0.2s ease-in-out"
      backdropFilter="blur(10px)"
      _hover={{
        borderBottomWidth: "1px",
        borderColor: "border.emphasized/80",
        bg: "bg.muted/90",
        boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.08)",
      }}
    >
      {props.children}
    </Stack>
  );
}

function SearchInput() {
  return (
    <InputGroup startElement={<RiSearchLine />} endElement={<Kbd size="sm">⌘K</Kbd>}>
      <Input 
        placeholder="Search products..." 
        size="sm" 
        bg="transparent" 
        ps="8" 
        width="300px" 
      />
    </InputGroup>
  );
}

export default App;
