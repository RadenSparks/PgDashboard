// Move mockOrders to its own file for sharing and to avoid Fast Refresh warning

const mockOrders = [
  {
    id: "ORD-1001",
    customer: "Alice Johnson",
    date: "2025-06-01",
    status: "Completed",
    total: 120.0,
    items: 3,
  },
  {
    id: "ORD-1002",
    customer: "Bob Smith",
    date: "2025-06-02",
    status: "Pending",
    total: 80.0,
    items: 2,
  },
  {
    id: "ORD-1003",
    customer: "Charlie Lee",
    date: "2025-06-03",
    status: "Cancelled",
    total: 50.0,
    items: 1,
  },
];

export default mockOrders;