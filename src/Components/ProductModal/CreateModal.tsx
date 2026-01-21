import  { useState } from 'react';
import { useAddProductMutation } from '../../app/services/crudProduct';

interface CreateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateModal: React.FC<CreateModalProps> = ({ isOpen, onClose }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [sizes, setSizes] = useState<string[]>([]);
    const [colors, setColors] = useState<string[]>([]);
    const [images, setImages] = useState<File[]>([]);

    const [addProduct, { isLoading }] = useAddProductMutation();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('category', category);
        // formData.append('sizes', sizes.join(','));
        sizes.forEach((size) => {
            formData.append('sizes', size);
        });

        colors.forEach((color) => {
            formData.append('colors', color);
        });
        
        if (images && images.length > 0) {
             images.forEach((img) => {
                formData.append('images', img);
            });
        }

        try {
            await addProduct(formData).unwrap();
            onClose();
            // Reset form
            setName('');
            setPrice('');
            setDescription('');
            setCategory('');
            setSizes([]);
            setColors([]);
            setImages([]);
        } catch (error) {
            console.error('Failed to create product:', error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50 p-4">
            <div className="relative w-full max-w-md max-h-[90vh] flex flex-col rounded-lg bg-white shadow-lg">
                <div className="flex items-center justify-between rounded-t border-b p-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                        Create New Product
                    </h3>
                    <button
                        onClick={onClose}
                        type="button"
                        className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900"
                    >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-900">Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="price" className="mb-2 block text-sm font-medium text-gray-900">Price</label>
                            <input
                                type="number"
                                id="price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="category" className="mb-2 block text-sm font-medium text-gray-900">Category</label>
                            <select
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
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
                                            id={`size-${size}`}
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
                                            className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500"
                                        />
                                        <label htmlFor={`size-${size}`} className="ml-2 text-sm font-medium text-gray-900 uppercase">
                                            {size}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                             <label className="mb-2 block text-sm font-medium text-gray-900">Colors</label>
                            <div className="flex flex-wrap gap-4">
                                {['red', 'blue', 'green', 'black', 'white', 'yellow', 'orange', 'purple', 'pink', 'gray', 'brown', 'beige', 'navy', 'teal', 'maroon', 'lime', 'olive', 'cyan', 'magenta', 'gold', 'silver', 'indigo', 'violet', 'turquoise', 'lavender', 'coral', 'crimson', 'khaki', 'plum', 'salmon', 'tan', 'wheat'].map((color) => (
                                    <div key={color} className="flex items-center">
                                        <label
                                            htmlFor={`color-${color}`}
                                            className={`relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-200 shadow-sm transition-all hover:scale-110 ${
                                                colors.includes(color) ? 'ring-2 ring-primary-500 ring-offset-2' : ''
                                            }`}
                                            style={{ backgroundColor: color }}
                                            title={color}
                                        >
                                            <input
                                                id={`color-${color}`}
                                                type="checkbox"
                                                value={color}
                                                checked={colors.includes(color)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setColors([...colors, color]);
                                                    } else {
                                                        setColors(colors.filter((c) => c !== color));
                                                    }
                                                }}
                                                className="sr-only" // Hide the default checkbox
                                            />
                                            {/* Optional: Checkmark for better visibility on selection */}
                                            {colors.includes(color) && (
                                                <svg
                                                    className={`h-4 w-4 ${['white', 'yellow', 'beige', 'lime', 'gold', 'silver', 'wheat', 'tan', 'khaki', 'lavender', 'cyan'].includes(color) ? 'text-black' : 'text-white'}`}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={3}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            )}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-900">Description</label>
                            <textarea
                                id="description"
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                            ></textarea>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-900" htmlFor="file_input">Upload Images</label>
                            <input 
                                className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none" 
                                id="file_input" 
                                type="file"
                                multiple
                                onChange={(e) => setImages(e.target.files ? Array.from(e.target.files) : [])}
                            />
                            <div className="mt-2 flex flex-wrap gap-2">
                                {images.length > 0 && images.map((img, index) => (
                                    <span key={index} className="text-xs text-gray-500">{img.name}</span>
                                ))}
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white ${isLoading ? 'bg-primary-400' : 'bg-primary-600 hover:bg-primary-700'}`}
                        >
                            {isLoading ? 'Creating...' : 'Create Product'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateModal;
