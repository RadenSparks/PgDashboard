import { MenuContent, MenuItem, MenuRoot, MenuSeparator, MenuTrigger } from "../ui/menu";
import { IconButton } from "@chakra-ui/react";
import { Avatar } from "../ui/avatar";

export function UserMenu() {
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