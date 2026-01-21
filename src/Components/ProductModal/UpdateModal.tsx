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
    images?: string[];
    colors?: string | string[];
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
    const [images, setImages] = useState<File[]>([]);
    const [keptImages, setKeptImages] = useState<string[]>([]);
    // Add colors state
    const [colors, setColors] = useState<string[]>([]);

    const [updateProduct, { isLoading }] = useUpdateProductMutation();

    useEffect(() => {
        if (product) {
            console.log('UpdateModal received product:', product);
            setName(product.name);
            setPrice(product.price.toString());
            setDescription(product.description || ''); // Handle potential missing description
            setCategory(product.category || ''); // Handle potential missing category
            
            let rawSizes: string[] = [];
            if (Array.isArray(product.sizes)) {
                rawSizes = product.sizes;
            } else if (typeof product.sizes === 'string') {
                rawSizes = (product.sizes as string).split(',');
            }

            const initialSizes = rawSizes.map(s => {
                const trimmed = s.trim().toLowerCase();
                // Normalization map for legacy and varied size formats
                const map: Record<string, string> = {
                    'small': 's', 'medium': 'm', 'large': 'l',
                    'sm': 's', 'md': 'm', 'lg': 'l', 
                    'xlg': 'xl', 'xxlg': 'xxl', '2xl': 'xxl'
                };
                return map[trimmed] || trimmed;
            });
            console.log('Parsed initialSizes:', initialSizes);
            setSizes(initialSizes);
            
            // Handle colors
            let rawColors: string[] = [];
            if (Array.isArray(product.colors)) {
                rawColors = product.colors;
            } else if (typeof product.colors === 'string') {
                rawColors = (product.colors as string).split(',');
            }
             const initialColors = rawColors.map(c => c.trim().toLowerCase());
            setColors(initialColors);

            
            setImages([]); // Reset images on new product selection
            
            const existing = product.images && product.images.length > 0 
                ? product.images 
                : product.image ? [product.image] : [];
            setKeptImages(existing);
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
        
        sizes.forEach((size) => {
            formData.append('sizes', size);
        });

        colors.forEach((color) => {
            formData.append('colors', color);
        });

        keptImages.forEach((img) => {
            formData.append('images', img);
        });

        if (images && images.length > 0) {
             images.forEach((img) => {
                formData.append('images', img);
            });
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
            <div className="relative w-full max-w-md max-h-[90vh] flex flex-col rounded-lg bg-white shadow-lg">
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
                <div className="p-6 overflow-y-auto">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="update_name" className="mb-2 block text-sm font-medium text-gray-900">Name</label>
                            <input
                                type="text"
                                id="update_name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
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
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="update_category" className="mb-2 block text-sm font-medium text-gray-900">Category</label>
                            <select
                                id="update_category"
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
                                            className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500"
                                        />
                                        <label htmlFor={`update-size-${size}`} className="ml-2 text-sm font-medium text-gray-900 uppercase">
                                            {size}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                             <label className="mb-2 block text-sm font-medium text-gray-900">Colors</label>
                            <div className="flex flex-wrap gap-4">
                                {['red', 'blue', 'green', 'black', 'white', 'yellow', 'orange', 'purple', 'pink', 'gray', 'brown', 'beige', 'navy', 'teal', 'maroon', 'lime', 'olive', 'cyan', 'magenta', 'gold', 'silver', 'indigo', 'violet', 'turquoise', 'lavender', 'coral', 'crimson', 'khaki', 'plum', 'salmon', 'tan', 'wheat', 'burgundy', 'baby blue'].map((color) => (
                                    <div key={color} className="flex items-center">
                                         <label
                                            htmlFor={`update-color-${color}`}
                                            className={`relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-200 shadow-sm transition-all hover:scale-110 ${
                                                colors.includes(color) ? 'ring-2 ring-primary-500 ring-offset-2' : ''
                                            }`}
                                            style={{ backgroundColor: color === 'baby blue' ? '#89CFF0' : color === 'burgundy' ? '#800020' : color }}
                                            title={color}
                                        >
                                            <input
                                                id={`update-color-${color}`}
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
                                                    className={`h-4 w-4 ${['white', 'yellow', 'beige', 'lime', 'gold', 'silver', 'wheat', 'tan', 'khaki', 'lavender', 'cyan', 'baby blue'].includes(color) ? 'text-black' : 'text-white'}`}
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
                            <label htmlFor="update_description" className="mb-2 block text-sm font-medium text-gray-900">Description</label>
                            <textarea
                                id="update_description"
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                            ></textarea>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-900">Current Images</label>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {keptImages.map((img, index) => (
                                    <div key={index} className="relative">
                                        <img 
                                            src={img.startsWith('http') ? img : `https://lavishly-fogless-sang.ngrok-free.dev/${img}`} 
                                            alt={`Product ${index}`} 
                                            className="h-16 w-16 rounded object-cover border border-gray-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setKeptImages(keptImages.filter((_, i) => i !== index))}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                                            style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <label className="mb-2 block text-sm font-medium text-gray-900" htmlFor="update_file_input">Upload New Images</label>
                            <input 
                                className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none" 
                                id="update_file_input" 
                                type="file"
                                multiple
                                onChange={(e) => setImages([...images, ...Array.from(e.target.files || [])])}
                            />
                            <div className="mt-2 flex flex-wrap gap-2">
                                {images.length > 0 && images.map((img, index) => (
                                    <div key={index} className="relative">
                                        <span className="text-xs text-gray-500 border border-gray-200 rounded px-2 py-1 bg-gray-50 flex items-center gap-2">
                                            {img.name}
                                            <button
                                                type="button"
                                                onClick={() => setImages(images.filter((_, i) => i !== index))}
                                                className="text-red-500 hover:text-red-700 font-bold"
                                            >
                                                ✕
                                            </button>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white ${isLoading ? 'bg-primary-400' : 'bg-primary-600 hover:bg-primary-700'}`}
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
