import { Button, type ButtonProps } from "../ui/button.tsx";
import { Icon } from "@chakra-ui/react";

interface NavLinkProps extends ButtonProps {
  icon: React.ReactNode;
  active?: boolean;
}

export function NavLink(props: NavLinkProps) {
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
