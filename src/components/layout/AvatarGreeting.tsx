import { Avatar } from "..//ui/avatar";
import { Box, Text } from "@chakra-ui/react";

export function AvatarGreeting({ username }: { username: string }) {
  return (
    <Box px="2" py="4" textAlign="center">
      <Avatar size="lg" name={username} />
      <Text fontWeight="bold" mt="2">Welcome, {username}!</Text>
    </Box>
  );
}