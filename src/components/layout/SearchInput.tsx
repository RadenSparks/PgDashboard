import { Input } from "@chakra-ui/react";
import { Kbd } from "@chakra-ui/react";
import { RiSearchLine } from "react-icons/ri";
import { InputGroup } from "../ui/input-group";

export function SearchInput() {
  return (
    <InputGroup startElement={<RiSearchLine />} endElement={<Kbd size="sm">⌘K</Kbd>}>
      <Input 
        placeholder="Search products..." 
        size="sm" 
        bg="transparent" 
        ps="8" 
        width="300px" 
      />
    </InputGroup>
  );
}
