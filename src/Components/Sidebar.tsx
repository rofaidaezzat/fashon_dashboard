
import { NavLink, useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../app/services/crudAuth';
import toast from 'react-hot-toast';

const Sidebar = () => {
    const navigate = useNavigate();
    const [logout] = useLogoutMutation();

    const handleLogout = async () => {
        try {
            await logout().unwrap();
            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Logout failed on server', error);
            // Optional: toast.error('Logout failed on server, but logging out locally');
        } finally {
            localStorage.removeItem('accessToken');
            navigate('/login');
        }
    };
    return (
        <div className="flex h-screen w-64 flex-col bg-white text-gray-900 border-r border-gray-200">
            <div className="flex w-full items-center justify-center border-b border-gray-200 bg-white p-4">
                <img src="/photo_2026-01-12_18-02-23.jpg" alt="Logo" className="w-full h-auto object-cover" />
            </div>
            <nav className="flex-1 px-2 py-4 space-y-2">
                <NavLink
                    to="/dashboard/product"
                     className={({ isActive }) =>
                        `group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                            isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`
                    }
                >
                    Products
                </NavLink>
                <NavLink
                    to="/dashboard/contact-us"
                   className={({ isActive }) =>
                        `group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                            isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`
                    }
                >
                    Contact Us
                </NavLink>
            </nav>
            <div className="border-t border-gray-200 p-4">
                <button 
                    onClick={handleLogout}
                    className="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
