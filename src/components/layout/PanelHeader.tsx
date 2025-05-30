import { Stack , type StackProps } from "@chakra-ui/react";

export function PanelHeader(props: StackProps) {
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
      {...props}
    />
  );
}
