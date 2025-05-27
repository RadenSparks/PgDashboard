import { Box, Heading, Stack } from "@chakra-ui/react";
import { RiDashboardLine, RiShoppingCartLine, RiCodeLine, RiUserLine, RiSettingsLine } from "react-icons/ri";
import { AvatarGreeting } from "./AvatarGreeting";
import { NavLink } from "./NavLink";

export function Sidebar() {
  const username = "Admin";

  return (
    <Stack
      width="250px"
      borderRightWidth="1"
      py="2"
      borderColor="border.emphasized"
      bg="bg.muted"
    >
      <AvatarGreeting username={username} />
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
  );
}
