

interface Message {
    _id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    createdAt?: string;
}

interface ViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    message: Message | null;
}

const ViewModal: React.FC<ViewModalProps> = ({ isOpen, onClose, message }) => {
    if (!isOpen || !message) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50 p-4">
            <div className="relative w-full max-w-2xl rounded-lg bg-white shadow-lg">
                <div className="flex items-center justify-between rounded-t border-b p-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                        Message Details
                    </h3>
                    <button
                        onClick={onClose}
                        type="button"
                        className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900"
                    >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </button>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Name</p>
                            <p className="text-lg text-gray-900">{message.name}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Email</p>
                            <p className="text-lg text-gray-900">{message.email}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Phone</p>
                            <p className="text-lg text-gray-900">{message.phone}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Date</p>
                            <p className="text-lg text-gray-900">
                                {message.createdAt ? new Date(message.createdAt).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <p className="text-sm font-medium text-gray-500">Message</p>
                            <p className="mt-2 text-base text-gray-900 whitespace-pre-wrap rounded-md bg-gray-50 p-3">
                                {message.message}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-2 rounded-b border-t border-gray-200 p-6">
                    <button
                        onClick={onClose}
                        type="button"
                        className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-center text-sm font-medium text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-300"
                    >
                        Close
                    </button>
                    <a
                        href={`mailto:${message.email}`}
                        className="rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
                    >
                        Reply via Email
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ViewModal;
