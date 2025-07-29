import type { BoxProps, InputLeftElementProps, InputRightElementProps } from "@chakra-ui/react"
import { InputGroup as ChakraInputGroup, InputLeftElement, InputRightElement } from "@chakra-ui/react"
import { cloneElement, forwardRef } from "react"

export interface InputGroupProps extends BoxProps {
  startElementProps?: InputLeftElementProps
  endElementProps?: InputRightElementProps
  startElement?: React.ReactNode
  endElement?: React.ReactNode
  children: React.ReactElement
}

export const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(
  function InputGroup(props, ref) {
    const {
      startElement,
      startElementProps,
      endElement,
      endElementProps,
      children,
      ...rest
    } = props

    return (
      <ChakraInputGroup ref={ref} {...rest}>
        {startElement && (
          <InputLeftElement pointerEvents="none" {...startElementProps}>
            {startElement}
          </InputLeftElement>
        )}
        {cloneElement(children, {
          // Optionally add padding if needed
          ...(typeof children.props === "object" && children.props ? children.props : {}),
        })}
        {endElement && (
          <InputRightElement {...endElementProps}>
            {endElement}
          </InputRightElement>
        )}
      </ChakraInputGroup>
    )
  },
)
