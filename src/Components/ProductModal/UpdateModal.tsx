import  { useState, useEffect } from 'react';
import { useUpdateProductMutation } from '../../app/services/crudProduct';

interface Product {
    _id: string;
    name: string;
    price: number;
    description: string;
    category: string;
    sizes?: string | string[];
    image?: string;
}

interface UpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
}

const UpdateModal: React.FC<UpdateModalProps> = ({ isOpen, onClose, product }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [sizes, setSizes] = useState<string[]>([]);
    const [image, setImage] = useState<File | null>(null);

    const [updateProduct, { isLoading }] = useUpdateProductMutation();

    useEffect(() => {
        if (product) {
            console.log('UpdateModal received product:', product);
            setName(product.name);
            setPrice(product.price.toString());
            setDescription(product.description || ''); // Handle potential missing description
            setCategory(product.category || ''); // Handle potential missing category
            
            let initialSizes: string[] = [];
            if (Array.isArray(product.sizes)) {
                initialSizes = product.sizes;
            } else if (typeof product.sizes === 'string') {
                // Split by comma and trim whitespace to ensure accurate matching
                initialSizes = (product.sizes as string).split(',').map(s => {
                    const trimmed = s.trim().toLowerCase();
                    // Normalization map for legacy sizes
                    const map: Record<string, string> = {
                        'sm': 's', 'md': 'm', 'lg': 'l', 'xlg': 'xl', 'xxlg': 'xxl'
                    };
                    return map[trimmed] || trimmed;
                });
            }
            console.log('Parsed initialSizes:', initialSizes);
            setSizes(initialSizes);
            
            setImage(null); // Reset image on new product selection
        }
    }, [product]);

    if (!isOpen || !product) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('sizes', sizes.join(','));
        if (image) {
            formData.append('image', image);
        }

        try {
            await updateProduct({ id: product._id, formData }).unwrap();
            onClose();
        } catch (error) {
            console.error('Failed to update product:', error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50 p-4">
            <div className="relative w-full max-w-md rounded-lg bg-white shadow-lg">
                <div className="flex items-center justify-between rounded-t border-b p-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                        Update Product
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
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="update_name" className="mb-2 block text-sm font-medium text-gray-900">Name</label>
                            <input
                                type="text"
                                id="update_name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="update_price" className="mb-2 block text-sm font-medium text-gray-900">Price</label>
                            <input
                                type="number"
                                id="update_price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="update_category" className="mb-2 block text-sm font-medium text-gray-900">Category</label>
                            <select
                                id="update_category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                                required
                            >
                                <option value="" disabled>Select category</option>
                                <option value="رمضان كريم">رمضان كريم</option>
                                <option value="ملابس اطفال">ملابس اطفال</option>
                                <option value="سوت">سوت</option>
                                <option value="سواريه">سواريه</option>
                                <option value="جامبسوت">جامبسوت</option>
                                <option value="كاجول">كاجول</option>
                                <option value="فورمال او كلاسيك">فورمال او كلاسيك</option>
                            </select>
                        </div>
                        <div>
                             <label className="mb-2 block text-sm font-medium text-gray-900">Sizes</label>
                             <div className="flex flex-wrap gap-4">
                                {['s', 'm', 'l', 'xl', 'xxl'].map((size) => (
                                    <div key={size} className="flex items-center">
                                        <input
                                            id={`update-size-${size}`}
                                            type="checkbox"
                                            value={size}
                                            checked={sizes.includes(size)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSizes([...sizes, size]);
                                                } else {
                                                    setSizes(sizes.filter((s) => s !== size));
                                                }
                                            }}
                                            className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                        />
                                        <label htmlFor={`update-size-${size}`} className="ml-2 text-sm font-medium text-gray-900 uppercase">
                                            {size}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="update_description" className="mb-2 block text-sm font-medium text-gray-900">Description</label>
                            <textarea
                                id="update_description"
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                            ></textarea>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-900" htmlFor="update_file_input">Upload Image</label>
                            <input 
                                className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none" 
                                id="update_file_input" 
                                type="file"
                                onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white ${isLoading ? 'bg-blue-400' : 'bg-blue-700 hover:bg-blue-800'}`}
                        >
                            {isLoading ? 'Updating...' : 'Update Product'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateModal;
