"use client"

import type { IconButtonProps } from "@chakra-ui/react"
import { IconButton, chakra } from "@chakra-ui/react"
import { ThemeProvider, useTheme } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import * as React from "react"
import { LuMoon, LuSun } from "react-icons/lu"

export type ColorModeProviderProps = ThemeProviderProps

export function ColorModeProvider(props: ColorModeProviderProps) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange {...props} />
  )
}

export type ColorMode = "light" | "dark"

export interface UseColorModeReturn {
  colorMode: ColorMode
  setColorMode: (colorMode: ColorMode) => void
  toggleColorMode: () => void
}

// eslint-disable-next-line react-refresh/only-export-components
export function useColorMode(): UseColorModeReturn {
  const { resolvedTheme, setTheme, forcedTheme } = useTheme()
  const colorMode = forcedTheme || resolvedTheme
  const toggleColorMode = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }
  return {
    colorMode: colorMode as ColorMode,
    setColorMode: setTheme,
    toggleColorMode,
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export function useColorModeValue<T>(light: T, dark: T) {
  const { colorMode } = useColorMode()
  return colorMode === "dark" ? dark : light
}

export function ColorModeIcon() {
  const { colorMode } = useColorMode()
  return colorMode === "dark" ? <LuMoon /> : <LuSun />
}

type ColorModeButtonProps = Omit<IconButtonProps, "aria-label">

// Button to toggle color mode
export const ColorModeButton = React.forwardRef<
  HTMLButtonElement,
  ColorModeButtonProps
>(function ColorModeButton(props, ref) {
  const { toggleColorMode } = useColorMode()
  const icon = useColorModeValue(<LuSun />, <LuMoon />)
  return (
    <IconButton
      onClick={toggleColorMode}
      variant="ghost"
      aria-label="Toggle color mode"
      size="sm"
      ref={ref}
      icon={icon}
      {...props}
      css={{
        _icon: {
          width: "5",
          height: "5",
        },
      }}
    />
  )
})

export const LightMode = React.forwardRef<HTMLSpanElement, React.ComponentProps<typeof chakra.span>>(
  function LightMode(props, ref) {
    return (
      <chakra.span
        color="fg"
        display="contents"
        className="chakra-theme light"
        colorPalette="gray"
        colorScheme="light"
        ref={ref}
        {...props}
      />
    )
  },
)

export const DarkMode = React.forwardRef<HTMLSpanElement, React.ComponentProps<typeof chakra.span>>(
  function DarkMode(props, ref) {
    return (
      <chakra.span
        color="fg"
        display="contents"
        className="chakra-theme dark"
        colorPalette="gray"
        colorScheme="dark"
        ref={ref}
        {...props}
      />
    )
  },
)



// Utility hook to get color mode and toggler
export function useColorModeToggle() {
  const { colorMode, setColorMode, toggleColorMode } = useColorMode()
  return { colorMode, setColorMode, toggleColorMode }
}
