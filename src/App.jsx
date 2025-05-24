import { useState, useEffect } from 'react';
import { Box, Text, Alert, AlertIcon, Spinner } from '@chakra-ui/react';
import './App.css';
import ModalForm from './components/ModalForm';
import NavBar from './components/NavBar';
import TableList from './components/TableList';
import axios from 'axios';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [searchTerm, setSearchTerm] = useState('');
  const [clientData, setClientData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state

  const fetchClients = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get('http://localhost:3000/api/clients');
      setTableData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleOpen = (mode, client) => {
    setClientData(client);
    setModalMode(mode);
    setIsOpen(true);
  };

  const handleSubmit = async (newClientData) => {
    if (modalMode === 'add') {
      try {
        const response = await axios.post('http://localhost:3000/api/clients', newClientData);
        setTableData((prevData) => [...prevData, response.data]);
      } catch (error) {
        console.error('Error adding client:', error);
      }
    } else {
      try {
        const response = await axios.put(`http://localhost:3000/api/clients/${clientData.id}`, newClientData);
        setTableData((prevData) =>
          prevData.map((client) => (client.id === clientData.id ? response.data : client))
        );
      } catch (error) {
        console.error('Error updating client:', error);
      }
    }
  };

  return (
    <Box>
      {error && (
        <Alert status="error">
          <AlertIcon />
          <Text>{error}</Text>
        </Alert>
      )}
      <NavBar onOpen={() => handleOpen('add')} onSearch={setSearchTerm} />
      {loading ? (
        <Spinner size="lg" />
      ) : (
        <TableList setTableData={setTableData} tableData={tableData}
                   handleOpen={handleOpen} searchTerm={searchTerm} />
      )}
      <ModalForm 
        isOpen={isOpen} onSubmit={handleSubmit}
        onClose={() => setIsOpen(false)}
        mode={modalMode} clientData={clientData}
      />
    </Box>
  );
}

export default App;
