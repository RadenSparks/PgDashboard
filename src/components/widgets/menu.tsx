"use client"

import {
  Menu as ChakraMenu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  MenuDivider,
  MenuOptionGroup,
  MenuItemOption,
  MenuIcon,
  Portal,
  Box,
} from "@chakra-ui/react"
import { forwardRef } from "react"
import { LuChevronRight } from "react-icons/lu"

// Example: MenuContent using Portal (optional)
export const MenuContent = forwardRef<HTMLDivElement, { children: React.ReactNode }>(
  function MenuContent({ children, ...rest }, ref) {
    return (
      <Portal>
        <Box ref={ref} {...rest}>
          {children}
        </Box>
      </Portal>
    )
  },
)

// Checkbox item using MenuOptionGroup and MenuItemOption
export const MenuCheckboxGroup = ({
  value,
  onChange,
  options,
  title,
}: {
  value: string[]
  onChange: (val: string[]) => void
  options: { label: string; value: string }[]
  title?: string
}) => (
  <MenuOptionGroup
    type="checkbox"
    value={value}
    onChange={(val) => {
      if (Array.isArray(val)) {
        onChange(val)
      }
    }}
    title={title}
  >
    {options.map((opt) => (
      <MenuItemOption key={opt.value} value={opt.value}>
        {opt.label}
      </MenuItemOption>
    ))}
  </MenuOptionGroup>
)

// Radio item using MenuOptionGroup and MenuItemOption
export const MenuRadioGroup = ({
  value,
  onChange,
  options,
  title,
}: {
  value: string
  onChange: (val: string) => void
  options: { label: string; value: string }[]
  title?: string
}) => (
  <MenuOptionGroup
    type="radio"
    value={value}
    onChange={(val) => {
      if (typeof val === "string") {
        onChange(val)
      }
    }}
    title={title}
  >
    {options.map((opt) => (
      <MenuItemOption key={opt.value} value={opt.value}>
        {opt.label}
      </MenuItemOption>
    ))}
  </MenuOptionGroup>
)

// Menu group with label
export const MenuItemGroup = ({
  title,
  children,
}: {
  title?: string
  children: React.ReactNode
}) => <MenuGroup title={title}>{children}</MenuGroup>

// Menu trigger item (with icon and chevron)
export const MenuTriggerItem = forwardRef<HTMLButtonElement, { startIcon?: React.ReactNode; children: React.ReactNode }>(
  function MenuTriggerItem({ startIcon, children, ...rest }, ref) {
    return (
      <MenuItem ref={ref} {...rest}>
        {startIcon}
        <Box as="span" flex="1" textAlign="left" mx={2}>
          {children}
        </Box>
        <LuChevronRight />
      </MenuItem>
    )
  },
)

// Export Chakra UI's menu primitives for convenience
export const MenuRoot = ChakraMenu
export const MenuButtonRoot = MenuButton
export const MenuListRoot = MenuList
export const MenuItemRoot = MenuItem
export const MenuDividerRoot = MenuDivider
export const MenuOptionGroupRoot = MenuOptionGroup
export const MenuItemOptionRoot = MenuItemOption
export const MenuGroupRoot = MenuGroup
export const MenuIconRoot = MenuIcon
export const MenuTrigger = MenuButton
