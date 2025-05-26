import {
  Box,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  Kbd,
  Stack,
} from "@chakra-ui/react";
import {
  RiDashboardLine,
  RiShoppingCartLine,
  RiUserLine,
  RiCodeLine,
  RiProductHuntLine,
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
import { Tooltip } from "./components/ui/tooltip.tsx";

function App() {
  return (
    <Stack flexDirection="row" height="100vh" alignItems="stretch" bg="bg.muted">
      <Stack
        width="250px"
        borderRightWidth="1"
        py="2"
        borderColor="border.emphasized"
        bg="bg.muted"
      >
        <Box flex="1" overflow="auto">
          <HStack px="2" alignItems="center" justifyContent="space-between" gap="1">
            <UserMenu />
            <IconButton
              variant="surface"
              bg="bg.panel"
              size="sm"
              boxSize="7"
              minW="7"
              boxShadow="sm"
              aria-label="New product"
              borderRadius="lg"
              _hover={{ bg: "bg.muted" }}
            >
              <Icon as={RiProductHuntLine} />
            </IconButton>
          </HStack>
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
        <Stack
          width="300px"
          borderRightWidth="1px"
          gap="0"
          overflow="auto"
        >
          <PanelHeader>
            <Heading size="sm" fontWeight="medium">
              Products
            </Heading>
            <IconButton size="sm" variant="ghost" aria-label="Filter" borderRadius="full">
              <Icon as={RiSettingsLine} />
            </IconButton>
          </PanelHeader>
          <Box flex="1" px="2" py="2">
            {/* Product items go here */}
          </Box>
        </Stack>
        <Stack
          flex="1"
          overflow="auto"
        >
          <PanelHeader>
            <Tooltip content="Search" openDelay={0}>
              <SearchInput />
            </Tooltip>
          </PanelHeader>
          <Box flex="1" px="4" py="2">
            {/* Main content goes here, e.g., charts, stats */}
          </Box>
        </Stack>
      </Stack>
    </Stack>
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
  return (
    <Button
      variant="ghost"
      size="sm"
      fontSize="sm"
      fontWeight="normal"
      width="full"
      justifyContent="flex-start"
      _active={{ bg: "bg.emphasized" }}
      data-active={props.active ? "true" : undefined}
    >
      <Icon color="blue.500" boxSize="4">
        {props.icon}
      </Icon>
      {props.children}
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
      <Input placeholder="Search products..." size="sm" bg="transparent" ps="8" />
    </InputGroup>
  );
}

export default App;
