import { useState } from 'react';
import { useGetProductsQuery } from '../app/services/crudProduct';
import CreateModal from '../Components/ProductModal/CreateModal';
import UpdateModal from '../Components/ProductModal/UpdateModal';
import DeleteModal from '../Components/ProductModal/DeleteModal';
import Paginator from '../Components/Paginator';
import ViewModal from '../Components/ProductModal/VeiwModal';

const Product = () => {
    const [page, setPage] = useState(1);
    const limit = 300000;
    const { data: productsData, isLoading, error } = useGetProductsQuery({ page, limit });
    
    // Modal states 
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    const handleEdit = (product: any) => {
        setSelectedProduct(product);
        setIsUpdateModalOpen(true);
    };

    const handleDelete = (product: any) => {
        setSelectedProduct(product);
        setIsDeleteModalOpen(true);
    };

    const handleView = (product: any) => {
        setSelectedProduct(product);
        setIsViewModalOpen(true);
    };

    const products = productsData?.data || [];
    const pagination = productsData?.paginationResult || {};

    console.log('DEBUG: productsData:', productsData);
    console.log('DEBUG: pagination:', pagination);
    console.log('DEBUG: page:', page);

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
                Error loading products. Please try again later.
            </div>
        );
    }

    return (
        <div className="h-full bg-gray-50 flex-1 overflow-auto p-8">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="rounded-lg bg-indigo-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300"
                >
                    Add Product
                </button>
            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3">Image</th>
                                <th scope="col" className="px-6 py-3">Name</th>
                                <th scope="col" className="px-6 py-3">Price</th>
                                <th scope="col" className="px-6 py-3">Category</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center">No products found.</td>
                                </tr>
                            ) : (
                                products.map((product: any) => (
                                    <tr key={product._id} className="border-b hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2 flex-wrap">
                                                {product.images && product.images.length > 0 ? (
                                                    product.images.map((img: string, index: number) => (
                                                        <img 
                                                            key={index}
                                                            src={img.startsWith('http') ? img : `https://lavishly-fogless-sang.ngrok-free.dev/${img}`} 
                                                            alt={`${product.name} ${index + 1}`} 
                                                            className="h-12 w-12 rounded object-cover"
                                                        />
                                                    ))
                                                ) : product.image && (
                                                    <img 
                                                        src={product.image.startsWith('http') ? product.image : `https://lavishly-fogless-sang.ngrok-free.dev/${product.image}`} 
                                                        alt={product.name} 
                                                        className="h-12 w-12 rounded object-cover"
                                                    />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                        <td className="px-6 py-4">${product.price}</td>
                                        <td className="px-6 py-4">{product.category}</td>
                                        <td className="px-6 py-4 space-x-3">
                                            <button 
                                                onClick={() => handleView(product)}
                                                className="font-medium text-gray-600 hover:underline"
                                                title="View Details"
                                            >
                                               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </button>
                                            <button 
                                                onClick={() => handleEdit(product)}
                                                className="font-medium text-blue-600 hover:underline"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(product)}
                                                className="font-medium text-red-600 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>



                <Paginator 
                    page={page} 
                    setPage={setPage} 
                    numberOfPages={pagination.numberOfPages} 
                />

            {/* Modals */}
            <CreateModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
            />
            <UpdateModal 
                isOpen={isUpdateModalOpen} 
                onClose={() => setIsUpdateModalOpen(false)} 
                product={selectedProduct}
            />
            <DeleteModal 
                isOpen={isDeleteModalOpen} 
                onClose={() => setIsDeleteModalOpen(false)} 
                productId={selectedProduct?._id}
                productName={selectedProduct?.name}
            />
            <ViewModal 
                isOpen={isViewModalOpen} 
                onClose={() => setIsViewModalOpen(false)} 
                product={selectedProduct}
            />
        </div>
    );
};

export default Product;
