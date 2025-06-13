export type User = {
  id: number;
  full_name: string;
  username: string;
  password: string;
  phone_number: string;
  address: string;
  avatar_url: string;
  email: string;
  role: string;
  status: string;
};

export const initialUsers: User[] = [
  {
    id: 1,
    full_name: "Admin User",
    username: "admin",
    password: "",
    phone_number: "1234567890",
    address: "123 Admin St",
    avatar_url: "",
    email: "admin@email.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    full_name: "John Doe",
    username: "johndoe",
    password: "",
    phone_number: "0987654321",
    address: "456 John St",
    avatar_url: "",
    email: "john@email.com",
    role: "User",
    status: "Active",
  },
  {
    id: 3,
    full_name: "Jane Doe",
    username: "janedoe",
    password: "",
    phone_number: "1112223333",
    address: "789 Jane St",
    avatar_url: "",
    email: "jane@email.com",
    role: "User",
    status: "Suspended",
  },
];