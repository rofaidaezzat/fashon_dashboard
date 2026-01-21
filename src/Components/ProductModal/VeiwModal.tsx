import React, { useEffect, useState } from 'react';

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

interface ViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
}

const ViewModal: React.FC<ViewModalProps> = ({ isOpen, onClose, product }) => {
    const [sizes, setSizes] = useState<string[]>([]);
    const [colors, setColors] = useState<string[]>([]);
    const [selectedImg, setSelectedImg] = useState<string | null>(null);

    useEffect(() => {
        if (product) {
            let rawSizes: string[] = [];
            if (Array.isArray(product.sizes)) {
                rawSizes = product.sizes;
            } else if (typeof product.sizes === 'string') {
                rawSizes = (product.sizes as string).split(',');
            }

            const initialSizes = rawSizes.map(s => {
                const trimmed = s.trim().toLowerCase();
                const map: Record<string, string> = {
                    'small': 's', 'medium': 'm', 'large': 'l',
                    'sm': 's', 'md': 'm', 'lg': 'l', 
                    'xlg': 'xl', 'xxlg': 'xxl', '2xl': 'xxl'
                };
                return map[trimmed] || trimmed;
            });
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

            // Set initial selected image
            const imgs = product.images && product.images.length > 0 
                ? product.images 
                : product.image ? [product.image] : [];
            if (imgs.length > 0) setSelectedImg(imgs[0]);
        }
    }, [product]);

    if (!isOpen || !product) return null;

    const allImages = product.images && product.images.length > 0 
        ? product.images 
        : product.image ? [product.image] : [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50 p-4">
            <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-lg bg-white shadow-lg">
                <div className="flex items-center justify-between rounded-t border-b p-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                        Product Details
                    </h3>
                    <button
                        onClick={onClose}
                        type="button"
                        className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900"
                    >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </button>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <span className="block text-sm font-medium text-gray-500">Name</span>
                            <span className="text-lg font-medium text-gray-900">{product.name}</span>
                        </div>
                        <div>
                            <span className="block text-sm font-medium text-gray-500">Price</span>
                             <span className="text-lg font-medium text-gray-900">${product.price}</span>
                        </div>
                         <div>
                            <span className="block text-sm font-medium text-gray-500">Category</span>
                             <span className="text-lg text-gray-900">{product.category}</span>
                        </div>
                        <div>
                             <span className="block text-sm font-medium text-gray-500">Colors</span>
                             <div className="flex gap-2 flex-wrap mt-1">
                                {colors.length > 0 ? colors.map(color => (
                                      <div
                                        key={color}
                                        className="relative flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 shadow-sm"
                                        style={{ backgroundColor: color }}
                                        title={color}
                                    >
                                    </div>
                                )) : <span className="text-gray-400 text-sm">No colors</span>}
                             </div>
                        </div>
                        <div>
                             <span className="block text-sm font-medium text-gray-500">Sizes</span>
                             <div className="flex gap-2 flex-wrap mt-1">
                                {sizes.length > 0 ? sizes.map(size => (
                                     <span key={size} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded uppercase">
                                         {size}
                                     </span>
                                )) : <span className="text-gray-400 text-sm">No sizes</span>}
                             </div>
                        </div>
                    </div>
                    
                    <div>
                        <span className="block text-sm font-medium text-gray-500">Description</span>
                        <p className="text-gray-700 mt-1">{product.description || 'No description'}</p>
                    </div>

                    <div>
                        <span className="block text-sm font-medium text-gray-500 mb-2">Images</span>
                        
                        {selectedImg && (
                             <div className="mb-4 aspect-video w-full rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                                <img 
                                    src={selectedImg.startsWith('http') ? selectedImg : `https://lavishly-fogless-sang.ngrok-free.dev/${selectedImg}`} 
                                    alt="Selected product"
                                    className="h-full w-full object-contain" 
                                />
                             </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                            {allImages.map((img, index) => (
                                <img 
                                    key={index}
                                    src={img.startsWith('http') ? img : `https://lavishly-fogless-sang.ngrok-free.dev/${img}`} 
                                    alt={`${product.name} ${index + 1}`} 
                                    className={`h-20 w-20 rounded-lg object-cover border-2 cursor-pointer transition-all ${selectedImg === img ? 'border-primary-600 ring-2 ring-primary-100' : 'border-gray-200 hover:border-gray-300'}`}
                                    onClick={() => setSelectedImg(img)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                 <div className="flex items-center justify-end rounded-b border-t p-4 space-x-2">
                    <button
                        onClick={onClose}
                        type="button"
                        className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewModal;
