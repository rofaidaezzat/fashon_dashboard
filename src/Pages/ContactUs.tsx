import { useState } from 'react';
import { useGetContactUsQuery } from '../app/services/crudContactus';
import Paginator from '../Components/Paginator';
import ViewModal from '../Components/ContactModal/VeiwModal';

const ContactUs = () => {
    const [page, setPage] = useState(1);
    const limit = 300000;
    const { data: contactMessages, isLoading, error } = useGetContactUsQuery({ page, limit });
    const [selectedMessage, setSelectedMessage] = useState<any>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const handleView = (message: any) => {
        setSelectedMessage(message);
        setIsViewModalOpen(true);
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center text-red-500">
                Error loading messages. Please try again later.
            </div>
        );
    }

    let messages: any[] = [];
    if (contactMessages?.data && Array.isArray(contactMessages.data)) {
        messages = contactMessages.data;
    } else if (Array.isArray(contactMessages)) {
        messages = contactMessages;
    }
    const pagination = contactMessages?.paginationResult || {};

    return (
        <div className="min-h-screen bg-gray-50 flex-1 p-8">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
            </div>
            
            <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Name</th>
                                    <th scope="col" className="px-6 py-3">Email</th>
                                    <th scope="col" className="px-6 py-3">Phone</th>
                                    <th scope="col" className="px-6 py-3">Message Preview</th>
                                    <th scope="col" className="px-6 py-3">Date</th>
                                    <th scope="col" className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {messages.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 text-center">
                                            No messages found.
                                        </td>
                                    </tr>
                                ) : (
                                    messages.map((msg: any) => (
                                        <tr key={msg._id} className="border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{msg.name}</td>
                                            <td className="px-6 py-4">{msg.email}</td>
                                            <td className="px-6 py-4">{msg.phone}</td>
                                            <td className="px-6 py-4">
                                                <div className="max-w-xs truncate" title={msg.message}>
                                                    {msg.message}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleView(msg)}
                                                    className="font-medium text-indigo-600 hover:underline"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>



            <Paginator 
                page={page} 
                setPage={setPage} 
                numberOfPages={pagination.numberOfPages} 
            />

            <ViewModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                message={selectedMessage}
            />
        </div>
    );
};

export default ContactUs;
