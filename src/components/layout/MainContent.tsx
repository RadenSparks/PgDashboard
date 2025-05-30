import { Box, HStack, Stack } from "@chakra-ui/react";
import { PanelHeader } from "./PanelHeader";
import SearchInput from "./SearchInput";
import { LanguageSwapButton } from "./LanguageSwapButton";
import UserMenu  from "./UserMenu";

export function MainContent() {
  return (
    <Stack flexDirection="row" bg="bg.panel" flex="1" boxShadow="sm" gap="0" overflow="hidden">
      <Stack flex="1" overflow="auto">
        <PanelHeader>
          <HStack width="100%" alignItems="center" position="relative">
            <Box position="absolute" left="50%" top="50%" transform="translate(-50%, -50%)">
              <SearchInput />
            </Box>
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
  );
}
