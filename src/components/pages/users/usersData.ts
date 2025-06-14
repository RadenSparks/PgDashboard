export type User = {
  id: number;
  username: string;
  full_name: string;
  password: string;
  email: string;
  role: string;
  phone_number?: string | null;
  avatar_url?: string | null;
  status: boolean;
  address?: string | null;
  joined?: string; // For dashboard display, not in backend entity but useful for UI
};

export const initialUsers: User[] = [
  {
    id: 1,
    username: "admin",
    full_name: "Admin User",
    password: "",
    email: "admin@email.com",
    role: "ADMIN",
    phone_number: "1234567890",
    avatar_url: "",
    status: true,
    address: "123 Admin St",
    joined: "2025-06-01",
  },
  {
    id: 2,
    username: "johndoe",
    full_name: "John Doe",
    password: "",
    email: "john@email.com",
    role: "USER",
    phone_number: "0987654321",
    avatar_url: "",
    status: true,
    address: "456 John St",
    joined: "2025-06-07",
  },
  {
    id: 3,
    username: "janedoe",
    full_name: "Jane Doe",
    password: "",
    email: "jane@email.com",
    role: "USER",
    phone_number: "1112223333",
    avatar_url: "",
    status: false,
    address: "789 Jane St",
    joined: "2025-06-12",
  },
  {
    id: 4,
    username: "emilycarter",
    full_name: "Emily Carter",
    password: "",
    email: "emily.carter@email.com",
    role: "USER",
    phone_number: "2223334444",
    avatar_url: "/assets/image/profile5.jpg",
    status: true,
    address: "101 Emily St",
    joined: "2025-06-12",
  },
  {
    id: 5,
    username: "samuellee",
    full_name: "Samuel Lee",
    password: "",
    email: "samuel.lee@email.com",
    role: "USER",
    phone_number: "3334445555",
    avatar_url: "/assets/image/profile6.jpg",
    status: true,
    address: "202 Samuel St",
    joined: "2025-06-11",
  },
  {
    id: 6,
    username: "oliviasmith",
    full_name: "Olivia Smith",
    password: "",
    email: "olivia.smith@email.com",
    role: "USER",
    phone_number: "4445556666",
    avatar_url: "/assets/image/profile7.jpg",
    status: true,
    address: "303 Olivia St",
    joined: "2025-06-10",
  },
  {
    id: 7,
    username: "davidkim",
    full_name: "David Kim",
    password: "",
    email: "david.kim@email.com",
    role: "USER",
    phone_number: "5556667777",
    avatar_url: "/assets/image/profile8.jpg",
    status: true,
    address: "404 David St",
    joined: "2025-06-09",
  },
];