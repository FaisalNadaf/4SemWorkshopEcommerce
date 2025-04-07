import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import { getProducts } from '../api/auth';
import { getCart } from '../api/cart';
import { demoAPi } from '../api/cart';
import { addToCart } from '../api/cart';

export default function Home() {
  const { user, setUser, isAuthenticated } = useAuth();
  const [allProducts, setAllProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  async function getProductsTwo() {
    const response = await getProducts();
    setAllProducts(response.products);
    setFilteredProducts(response.products);
  }

  useEffect(() => {
    getProductsTwo();
  }, []);

  const navigate = useNavigate();

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId);
      const updatedCart = await getCart();
      setCart(updatedCart);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Welcome Home</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <p className="text-gray-500 text-lg">
              This is your protected home page. Add your content here.
            </p>
          </div>
        </div>
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden flex flex-col h-[400px]">
              <div className="h-48 overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex-grow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm line-clamp-3">{product.description}</p>
              </div>
              <div className="p-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                  <button onClick={() => handleAddToCart(product._id)} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div> */}
      </main>
    </div>
  );
}