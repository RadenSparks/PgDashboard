import React, { useState } from "react";
import { Box, Button, Input, Select, Textarea, Badge, Spinner } from "@chakra-ui/react";
import { FaSearch, FaCheck, FaTimes, FaUndoAlt, FaEnvelopeOpenText } from "react-icons/fa";

// Dummy data for demonstration
const initialFeedbacks = [
  {
    id: 1,
    user: "john_doe",
    email: "john@example.com",
    type: "Refund",
    orderId: "ORD123456",
    message: "I would like a refund for my last order. The product was defective.",
    status: "Pending",
    submittedAt: "2025-08-15",
  },
  {
    id: 2,
    user: "jane_smith",
    email: "jane@example.com",
    type: "Feedback",
    orderId: "",
    message: "Great service, but the delivery was a bit slow.",
    status: "Reviewed",
    submittedAt: "2025-08-14",
  },
];

const statusColors: Record<string, string> = {
  Pending: "yellow",
  Reviewed: "blue",
  Approved: "green",
  Rejected: "red",
  Refunded: "purple",
};

const FeedbackRefundPage: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState(initialFeedbacks);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<typeof initialFeedbacks[0] | null>(null);
  const [processing, setProcessing] = useState(false);

  const filtered = feedbacks.filter(f =>
    (filter === "All" || f.type === filter) &&
    (f.user.toLowerCase().includes(search.toLowerCase()) ||
      f.email.toLowerCase().includes(search.toLowerCase()) ||
      f.orderId.toLowerCase().includes(search.toLowerCase()))
  );

  const handleStatus = (id: number, status: string) => {
    setProcessing(true);
    setTimeout(() => {
      setFeedbacks(fbs =>
        fbs.map(f => (f.id === id ? { ...f, status } : f))
      );
      setProcessing(false);
      setSelected(null);
    }, 800);
  };

  return (
    <Box className="p-6 sm:p-10 min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <h2 className="text-2xl font-bold mb-6 text-blue-800 flex items-center gap-3">
        <FaEnvelopeOpenText className="text-blue-500" /> User Feedback & Refund Requests
      </h2>
      {/* Search & Filter */}
      <Box className="flex flex-col md:flex-row gap-4 mb-6 bg-white rounded-xl shadow px-6 py-4 items-center">
        <div className="flex items-center gap-2 flex-1">
          <Input
            placeholder="Search by user, email, or order ID"
            value={search}
            onChange={e => setSearch(e.target.value)}
            size="md"
            bg="blue.50"
            borderColor="blue.200"
            _focus={{ borderColor: "blue.400", bg: "white" }}
          />
          <FaSearch className="text-blue-400" />
        </div>
        <Select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          size="md"
          maxW="200px"
          bg="blue.50"
          borderColor="blue.200"
          _focus={{ borderColor: "blue.400", bg: "white" }}
        >
          <option value="All">All Types</option>
          <option value="Feedback">Feedback</option>
          <option value="Refund">Refund</option>
        </Select>
      </Box>
      {/* Table */}
      <Box className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-blue-50 text-blue-800">
              <th className="py-3 px-4 text-left">User</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Type</th>
              <th className="py-3 px-4 text-left">Order ID</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Submitted</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-400">
                  No feedback or refund requests found.
                </td>
              </tr>
            )}
            {filtered.map(f => (
              <tr key={f.id} className="border-b last:border-b-0 hover:bg-blue-50 transition">
                <td className="py-3 px-4 font-medium">{f.user}</td>
                <td className="py-3 px-4">{f.email}</td>
                <td className="py-3 px-4">
                  <Badge colorScheme={f.type === "Refund" ? "red" : "blue"}>{f.type}</Badge>
                </td>
                <td className="py-3 px-4">{f.orderId || <span className="text-gray-400">—</span>}</td>
                <td className="py-3 px-4">
                  <Badge colorScheme={statusColors[f.status] || "gray"}>{f.status}</Badge>
                </td>
                <td className="py-3 px-4">{f.submittedAt}</td>
                <td className="py-3 px-4">
                  <Button
                    size="sm"
                    colorScheme="blue"
                    variant="outline"
                    onClick={() => setSelected(f)}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
      {/* Detail Modal */}
      {selected && (
        <Box
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 animate-fade-in"
          onClick={() => !processing && setSelected(null)}
        >
          <Box
            className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl"
              onClick={() => !processing && setSelected(null)}
              aria-label="Close"
            >
              <FaTimes />
            </button>
            <h3 className="text-xl font-bold mb-2 text-blue-800 flex items-center gap-2">
              {selected.type === "Refund" ? <FaUndoAlt className="text-red-400" /> : <FaEnvelopeOpenText className="text-blue-400" />}
              {selected.type} Request
            </h3>
            <div className="mb-2 text-gray-600 text-sm">
              <span className="font-semibold">User:</span> {selected.user} <br />
              <span className="font-semibold">Email:</span> {selected.email} <br />
              {selected.orderId && (
                <>
                  <span className="font-semibold">Order ID:</span> {selected.orderId} <br />
                </>
              )}
              <span className="font-semibold">Submitted:</span> {selected.submittedAt}
            </div>
            <Textarea
              value={selected.message}
              isReadOnly
              rows={5}
              className="mb-4 bg-blue-50 border-blue-200"
            />
            <div className="flex gap-3 mt-4">
              {selected.status === "Pending" && (
                <>
                  <Button
                    colorScheme="green"
                    leftIcon={<FaCheck />}
                    onClick={() => handleStatus(selected.id, selected.type === "Refund" ? "Refunded" : "Reviewed")}
                    isDisabled={processing}
                  >
                    {selected.type === "Refund" ? "Mark as Refunded" : "Mark as Reviewed"}
                  </Button>
                  <Button
                    colorScheme="red"
                    leftIcon={<FaTimes />}
                    onClick={() => handleStatus(selected.id, "Rejected")}
                    isDisabled={processing}
                  >
                    Reject
                  </Button>
                </>
              )}
              {selected.status !== "Pending" && (
                <Button
                  colorScheme="blue"
                  variant="outline"
                  onClick={() => setSelected(null)}
                >
                  Close
                </Button>
              )}
              {processing && <Spinner color="blue.500" size="md" />}
            </div>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default FeedbackRefundPage;