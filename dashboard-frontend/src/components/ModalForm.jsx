import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormLabel,
  Input,
  Select,
  Button,
} from "@chakra-ui/react";

export default function ModalForm({ isOpen, onClose, mode, OnSubmit, clientData }) {
  const [rate, setRate] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [job, setJob] = useState('');
  const [status, setStatus] = useState(false);

  const handleStatusChange = (e) => {
    setStatus(e.target.value === 'Active');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const clientData = { name, email, job, rate: Number(rate), isactive: status };
      await OnSubmit(clientData);
      onClose();
    } catch (err) {
      console.error("Error adding client", err);
    }
  };

  useEffect(() => {
    if (mode === 'edit' && clientData) {
      setName(clientData.name);
      setEmail(clientData.email);
      setJob(clientData.job);
      setRate(clientData.rate);
      setStatus(clientData.isactive);
    } else {
      setName('');
      setEmail('');
      setJob('');
      setRate('');
      setStatus(false);
    }
  }, [mode, clientData]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{mode === 'edit' ? 'Edit Client' : 'Client Details'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <FormLabel>Name</FormLabel>
              <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <FormLabel>Email</FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <FormLabel>Job</FormLabel>
              <Input type="text" value={job} onChange={(e) => setJob(e.target.value)} />
            </div>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
              <FormLabel>Rate</FormLabel>
              <Input type="number" value={rate} onChange={(e) => setRate(e.target.value)} />
              <Select value={status ? 'Active' : 'Inactive'} onChange={handleStatusChange} width="auto">
                <option>Inactive</option>
                <option>Active</option>
              </Select>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button colorScheme="teal" onClick={handleSubmit}>
            {mode === 'edit' ? 'Save Changes' : 'Add Client'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}


ModalForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['add', 'edit']).isRequired,
  OnSubmit: PropTypes.func.isRequired,
  clientData: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    job: PropTypes.string,
    rate: PropTypes.number,
    isactive: PropTypes.bool,
  }),
};
