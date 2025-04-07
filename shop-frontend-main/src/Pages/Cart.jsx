import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { getCart, removeFromCart } from '../api/cart';
import { payment } from '../api/product';

export default function Cart() {
    const [cart, setCart] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);

    async function getCartsData() {
        return await getCart();
    }

    useEffect(() => {
        async function fetchCartData() {
            const currentCart = await getCartsData();
            console.log('✌️currentCart --->', currentCart);
            setCart(currentCart?.cart?.products);
            setCartTotal(currentCart?.cart?.products.reduce((total, item) => total + item.price, 0));
        }

        fetchCartData();
    }, []);

    const handleRemoveItem = async (itemId) => {
        await removeFromCart(itemId);
        const updatedCart = await getCart();
        setCart(updatedCart?.cart?.products);
        setCartTotal(updatedCart?.cart?.products.reduce((total, item) => total + item.price, 0));
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center py-16">
                        <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-600 mb-6">Looks like you haven't added any items yet.</p>
                        <Link
                            to="/products"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <ul className="divide-y divide-gray-200">
                                {cart.map((item) => (
                                    <li key={item._id} className="p-4">
                                        <div className="flex items-center space-x-4">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-20 w-20 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                                                <p className="text-lg font-medium text-gray-900">
                                                ₹{item.price.toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <button
                                                    onClick={() => handleRemoveItem(item._id)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="text-gray-900">₹{cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="text-gray-900">Free</span>
                                </div>
                                <div className="border-t pt-4">
                                    <div className="flex justify-between">
                                        <span className="text-lg font-medium text-gray-900">Total</span>
                                        <span className="text-lg font-medium text-gray-900">
                                            ₹{cartTotal.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                                <button onClick={async () => {
                                    const url = await payment()
                                    window.location.href = url
                                }} className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}