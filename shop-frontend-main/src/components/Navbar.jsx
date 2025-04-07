import { LogOut, ShoppingCart } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Navbar() {
    const isLoggedIn = localStorage.getItem("isAuthenticatedd");
    // console.log('✌️isLoggedIn --->', isLoggedIn);
    const [cartItems, setCartItems] = useState(0);
    const navigate = useNavigate()

    function handleLogout() {
        // setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticatedd');
        navigate('/login');
    }

    useEffect(() => {
        // Assuming you store cart items in localStorage
        const items = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItems(items.length);
    }, []);

    return (
        <nav className="bg-white border-gray-200">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="KLE Logo" />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap">KLE-Commerce</span>
                </a>
                <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200" aria-controls="navbar-default" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>
                <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                    <ul className="font-medium flex flex-col justify-center items-center p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white">
                        {isLoggedIn && <li>
                            <a href="/products" className="block py-2 px-3 text-black rounded-sm md:bg-transparent md:p-0" aria-current="page">Products</a>
                        </li>}
                        {isLoggedIn && <li>
                            <a href="/product/add" className="block py-2 px-3 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-black md:p-0">Add Products</a>
                        </li>}
                        {!isLoggedIn && <li>
                            <a href="/login" className="block py-2 px-3 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-black md:p-0">Login/Register</a>
                        </li>}
                        {isLoggedIn && <li className="relative">
                            <a href="/cart" className="block py-2 px-3 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-black md:p-0">
                                <ShoppingCart className="h-5 w-5" />
                                {cartItems > 0 && <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">{cartItems}</span>}
                            </a>
                        </li>}
                        {isLoggedIn && <button
                            onClick={handleLogout}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </button>}
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar