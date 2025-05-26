import { Button, type ButtonProps } from "../ui/button";
import { Icon } from "@chakra-ui/react";
import React from "react";

export function NavLink(props: ButtonProps & { icon: React.ReactNode; active?: boolean }) {
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
