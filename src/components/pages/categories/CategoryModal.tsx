import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { Button } from "../../widgets/button";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  newCategory: string;
  setNewCategory: (v: string) => void;
  newDescription: string;
  setNewDescription: (v: string) => void;
  handleAdd: () => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  newCategory,
  setNewCategory,
  newDescription,
  setNewDescription,
  handleAdd,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} isCentered>
    <ModalOverlay bg="rgba(0,0,32,0.12)" />
    <ModalContent rounded="2xl" shadow="xl">
      <ModalHeader fontWeight="bold" fontSize="xl">Tạo danh mục mới</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <FormControl mb={4}>
          <FormLabel>Tên danh mục</FormLabel>
          <Input
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            placeholder="Nhập tên danh mục"
            autoFocus
          />
        </FormControl>
        <FormControl>
          <FormLabel>Mô tả</FormLabel>
          <Input
            value={newDescription}
            onChange={e => setNewDescription(e.target.value)}
            placeholder="Nhập mô tả danh mục"
          />
        </FormControl>
      </ModalBody>
      <ModalFooter>
        <Button
          className="bg-blue-600 text-white hover:bg-blue-700 mr-3 px-6 py-2 rounded-lg font-bold shadow-md"
          onClick={handleAdd}
        >
          Tạo
        </Button>
        <Button variant="ghost" onClick={onClose}>
          Hủy
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default CategoryModal;