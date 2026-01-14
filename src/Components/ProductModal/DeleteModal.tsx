
import { useDeleteProductMutation } from '../../app/services/crudProduct';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    productId: string | null;
    productName?: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, productId, productName }) => {
    const [deleteProduct, { isLoading }] = useDeleteProductMutation();

    if (!isOpen || !productId) return null;

    const handleDelete = async () => {
        try {
            await deleteProduct(productId).unwrap();
            onClose();
        } catch (error) {
            console.error('Failed to delete product:', error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="relative w-full max-w-sm rounded-lg bg-white shadow-lg">
                <div className="p-6 text-center">
                    <svg className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                        Are you sure you want to delete {productName ? `"${productName}"` : 'this product'}?
                    </h3>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={handleDelete}
                            disabled={isLoading}
                            type="button"
                            className={`rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white ${isLoading ? 'bg-red-400' : 'bg-red-600 hover:bg-red-800'} focus:outline-none focus:ring-4 focus:ring-red-300`}
                        >
                            {isLoading ? 'Deleting...' : 'Yes, I\'m sure'}
                        </button>
                        <button
                            onClick={onClose}
                            type="button"
                            className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200"
                        >
                            No, cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
