import { useState } from "react";
import { Button } from "../../widgets/button";
import { FaEye } from "react-icons/fa";

const mockContacts = [
	{
		id: 1,
		name: "Jane Doe",
		email: "jane.doe@email.com",
		phone: "+1 555-1234",
		message: "I have a question about my order.",
		date: "2025-06-01",
	},
	{
		id: 2,
		name: "John Smith",
		email: "john.smith@email.com",
		phone: "+1 555-5678",
		message: "Can you recommend a board game for kids?",
		date: "2025-06-02",
	},
	{
		id: 3,
		name: "Alice Johnson",
		email: "alice.j@email.com",
		phone: "+1 555-8765",
		message: "When will you restock UNO?",
		date: "2025-06-03",
	},
];

const ContactsPage = () => {
	const [contacts] = useState(mockContacts);
	const [selectedContact, setSelectedContact] = useState<
		typeof mockContacts[0] | null
	>(null);

	return (
		<div className="p-8">
			<h2 className="text-2xl font-bold mb-6">Contacts</h2>
			<div className="bg-white rounded-xl shadow p-6">
				<div className="overflow-x-auto">
					<table className="min-w-full text-sm">
						<thead>
							<tr className="text-left border-b">
								<th className="py-2 px-2">Name</th>
								<th className="py-2 px-2">Email</th>
								<th className="py-2 px-2">Phone</th>
								<th className="py-2 px-2">Date</th>
								<th className="py-2 px-2">Actions</th>
							</tr>
						</thead>
						<tbody>
							{contacts.map((contact) => (
								<tr
									key={contact.id}
									className="border-b hover:bg-gray-50"
								>
									<td className="py-2 px-2">{contact.name}</td>
									<td className="py-2 px-2">{contact.email}</td>
									<td className="py-2 px-2">{contact.phone}</td>
									<td className="py-2 px-2">{contact.date}</td>
									<td className="py-2 px-2 flex gap-2">
										<Button
											size="sm"
											className="bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200 px-3 py-1 rounded"
											onClick={() => setSelectedContact(contact)}
										>
											<FaEye className="mr-1" /> View
										</Button>
									</td>
								</tr>
							))}
							{contacts.length === 0 && (
								<tr>
									<td
										colSpan={5}
										className="py-6 text-center text-gray-400"
									>
										No contacts found.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Contact Details Modal */}
			{selectedContact && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
					<div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
						<button
							className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
							onClick={() => setSelectedContact(null)}
							aria-label="Close"
						>
							&times;
						</button>
						<h3 className="text-xl font-bold mb-2">Contact Details</h3>
						<div className="mb-2 text-sm text-gray-500">
							<span className="font-semibold">Name:</span> {selectedContact.name}
						</div>
						<div className="mb-2 text-sm text-gray-500">
							<span className="font-semibold">Email:</span> {selectedContact.email}
						</div>
						<div className="mb-2 text-sm text-gray-500">
							<span className="font-semibold">Phone:</span> {selectedContact.phone}
						</div>
						<div className="mb-2 text-sm text-gray-500">
							<span className="font-semibold">Date:</span> {selectedContact.date}
						</div>
						<div className="mb-2 text-sm text-gray-700">
							<span className="font-semibold">Message:</span>
							<div className="mt-1">{selectedContact.message}</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ContactsPage;