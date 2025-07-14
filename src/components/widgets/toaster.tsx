"use client"

import {
  Toast as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  useToast,
} from "@chakra-ui/react"
import React, { useEffect } from "react"

// Export a singleton toast function for use in your app
export const toaster = {
  show: ({
    title,
    description,
    type = "info",
    duration = 3000,
    position = "bottom-right",
  }: {
    title: string
    description?: string
    type?: "success" | "error" | "info" | "warning" | "loading"
    duration?: number
    position?:
      | "top"
      | "top-right"
      | "top-left"
      | "bottom"
      | "bottom-right"
      | "bottom-left"
  }) => {
    // Use Chakra's useToast hook inside a component
    // For global usage, you must wrap your app with <ToasterProvider />
    window.dispatchEvent(
      new CustomEvent("chakra-toast", {
        detail: { title, description, type, duration, position },
      })
    )
  },
}

// ToasterProvider component to listen for global toast events
export const ToasterProvider: React.FC = ({ children }) => {
  const toast = useToast()
  useEffect(() => {
    const handler = (e: any) => {
      const { title, description, type, duration, position } = e.detail
      toast({
        title,
        description,
        status: type === "loading" ? "info" : type,
        duration,
        position,
        isClosable: true,
      })
    }
    window.addEventListener("chakra-toast", handler)
    return () => window.removeEventListener("chakra-toast", handler)
  }, [toast])
  return <>{children}</>
}

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: "4" }}>
        {(toast) => (
          <Toast.Root width={{ md: "sm" }}>
            {toast.type === "loading" ? (
              <Spinner size="sm" color="blue.solid" />
            ) : (
              <Toast.Indicator />
            )}
            <Stack gap="1" flex="1" maxWidth="100%">
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description && (
                <Toast.Description>{toast.description}</Toast.Description>
              )}
            </Stack>
            {toast.action && (
              <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
            )}
            {toast.closable && <Toast.CloseTrigger />}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  )
}
