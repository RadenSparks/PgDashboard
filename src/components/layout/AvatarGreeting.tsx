import { Box, Text } from "@chakra-ui/react";
import { Avatar } from "../ui/avatar.tsx";

interface AvatarGreetingProps {
  username: string;
}

export function AvatarGreeting({ username }: AvatarGreetingProps) {
  return (
    <Box px="2" py="4" textAlign="center">
      <Avatar size="lg" name={username} />
      <Text fontWeight="bold" mt="2">
        Welcome, {username}!
      </Text>
    </Box>
  );
}
