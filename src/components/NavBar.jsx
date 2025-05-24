import { Button, Input, Flex, Box, Text } from "@chakra-ui/react";
import PropTypes from 'prop-types'; // Import PropTypes

export default function NavBar({ onOpen, onSearch }) {
  const handleSearchChange = (event) => {
    onSearch(event.target.value); // Call the onSearch callback with the input value
  };

  return (
    <Flex
      as="nav"
      bg="base.100"
      p={4}
      justify="space-between"
      align="center"
    >
      <Box>
        <Text as="button" fontSize="xl" variant="ghost">
          Clients
        </Text>
      </Box>
      <Box>
        <Input
          placeholder="Search"
          onChange={handleSearchChange}
          width={{ base: "48", md: "auto" }}
          variant="outline"
        />
      </Box>
      <Box>
        <Button colorScheme="teal" onClick={onOpen}>
          Add Client
        </Button>
      </Box>
    </Flex>
  );
}

// PropTypes validation
NavBar.propTypes = {
  onOpen: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
};
