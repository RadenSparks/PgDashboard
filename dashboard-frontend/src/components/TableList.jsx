import axios from 'axios';
import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

const TableList = ({ handleOpen, tableData, setTableData, searchTerm }) => {
  const [error, setError] = useState(null);

  const filteredData = tableData.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.job.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this client?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3000/api/clients/${id}`);
        setTableData((prevData) => prevData.filter(client => client.id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <>
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      <Box overflowX="auto" mt={10}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th></Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Job</Th>
              <Th>Rate</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredData.map((client) => (
                <Tr key={client.id}>
                    <Th>{client.id}</Th>
                    <Td>{client.name}</Td>
                    <Td>{client.email}</Td>
                    <Td>{client.job}</Td>
                    <Td>{client.rate}</Td>
                    <Td>
                        <Button
                            colorScheme={client.isactive ? "teal" : "gray"}
                            variant={client.isactive ? "solid" : "outline"}
                            width="full"
                        >
                            {client.isactive ? 'Active' : 'Inactive'}
                        </Button>
                    </Td>
                    <Td>
                        <Button colorScheme="blue" onClick={() => handleOpen('edit', client)}>
                            Update
                        </Button>
                        <Button colorScheme="red" ml={2} onClick={() => handleDelete(client.id)}>
                            Delete
                        </Button>
                    </Td>
                </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </>
  );
};


TableList.propTypes = {
  handleOpen: PropTypes.func.isRequired,
  tableData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      job: PropTypes.string.isRequired,
      rate: PropTypes.number.isRequired,
      isactive: PropTypes.bool.isRequired,
    })
  ).isRequired,
  setTableData: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
};


export default TableList;
