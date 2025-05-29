import * as React from "react"
import { Box, Heading, Text, Flex, BoxProps } from "@chakra-ui/react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ className, ...props }, ref) => (
    <Box
      ref={ref}
      rounded="xl"
      border="1px solid"
      borderColor="card"
      bg="card"
      color="card-foreground"
      shadow="base"
      className={cn(className)}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ className, ...props }, ref) => (
    <Box
      ref={ref}
      display="flex"
      flexDirection="column"
      space={{ base: 1.5 }}
      p={6}
      className={cn(className)}
      {...props}
    />
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLHeadingElement, BoxProps>(
  ({ className, ...props }, ref) => (
    <Heading
      ref={ref}
      fontWeight="semibold"
      lineHeight="none"
      letterSpacing="tight"
      className={cn(className)}
      {...props}
    />
  )
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, BoxProps>(
  ({ className, ...props }, ref) => (
    <Text
      ref={ref}
      fontSize="sm"
      color="muted-foreground"
      className={cn(className)}
      {...props}
    />
  )
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ className, ...props }, ref) => (
    <Box ref={ref} pt={0} p={6} className={cn(className)} {...props} />
  )
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ className, ...props }, ref) => (
    <Flex
      ref={ref}
      items="center"
      pt={0}
      p={6}
      className={cn(className)}
      {...props}
    />
  )
)
CardFooter.displayName = "CardFooter"
