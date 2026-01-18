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
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-600"></div>
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
                    className="rounded-lg bg-primary-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300"
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
                                            <div className="flex gap-2 flex-wrap items-center">
                                                {product.images && product.images.length > 0 ? (
                                                    <>
                                                        {product.images.slice(0, 3).map((img: string, index: number) => (
                                                            <img 
                                                                key={index}
                                                                src={img.startsWith('http') ? img : `https://lavishly-fogless-sang.ngrok-free.dev/${img}`} 
                                                                alt={`${product.name} ${index + 1}`} 
                                                                className="h-12 w-12 rounded object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                                                onClick={() => handleView(product)}
                                                            />
                                                        ))}
                                                        {product.images.length > 3 && (
                                                            <div 
                                                                className="h-12 w-12 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 cursor-pointer hover:bg-gray-200 transition-colors"
                                                                onClick={() => handleView(product)}
                                                            >
                                                                +{product.images.length - 3}
                                                            </div>
                                                        )}
                                                    </>
                                                ) : product.image && (
                                                    <img 
                                                        src={product.image.startsWith('http') ? product.image : `https://lavishly-fogless-sang.ngrok-free.dev/${product.image}`} 
                                                        alt={product.name} 
                                                        className="h-12 w-12 rounded object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                                        onClick={() => handleView(product)}
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
                                                className="font-medium text-blue-600 hover:text-blue-800"
                                                title="Edit Product"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                </svg>
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(product)}
                                                className="font-medium text-red-600 hover:text-red-800"
                                                title="Delete Product"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>
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
