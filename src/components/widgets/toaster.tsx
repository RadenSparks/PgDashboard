"use client"

import {
  useToast,
  type ToastId,
} from "@chakra-ui/react"
import React, { useEffect, useRef } from "react"

// Export a singleton toaster object for use in your app
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
    window.dispatchEvent(
      new CustomEvent("chakra-toast", {
        detail: { title, description, type, duration, position },
      })
    )
  },
  dismiss: () => {
    window.dispatchEvent(new CustomEvent("chakra-toast-dismiss"))
  },
}

// ToasterProvider component to listen for global toast events
export const ToasterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toast = useToast()
  const toastIds = useRef<ToastId[]>([])

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      const { title, description, type, duration, position } = e.detail
      const id = toast({
        title,
        description,
        status: type === "loading" ? "info" : type,
        duration,
        position,
        isClosable: true,
      })
      toastIds.current.push(id)
    }
    const dismissHandler = () => {
      toastIds.current.forEach(id => toast.close(id))
      toastIds.current = []
    }
    window.addEventListener("chakra-toast", handler as EventListener)
    window.addEventListener("chakra-toast-dismiss", dismissHandler)
    return () => {
      window.removeEventListener("chakra-toast", handler as EventListener)
      window.removeEventListener("chakra-toast-dismiss", dismissHandler)
    }
  }, [toast])
  return <>{children}</>
}

// (Optional) If you use the Toaster component for custom rendering, keep it as is or remove if unused.
export const Toaster = () => null
