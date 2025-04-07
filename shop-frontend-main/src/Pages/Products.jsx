/** @format */

"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { deleteProduct } from "../api/product";
import { addToCart, getCart } from "../api/cart";
import { getProducts } from "../api/auth";

export default function Products() {
	const [allProducts, setAllProducts] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [cart, setCart] = useState([]);
	const [loading, setLoading] = useState(true); // Add loading state
	const [error, setError] = useState(null); // Add error state

	// const { user, setUser, isAuthenticated } = useAuth();

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
			navigate("/cart");
		} catch (error) {
			console.error("Error adding to cart:", error);
		}
	};

	async function getProductsTwo() {
		setLoading(true); // Set loading to true before fetching data
		setError(null); // Reset error state
		try {
			const response = await getProducts();
			setAllProducts(response.products);
			setFilteredProducts(response.products);
		} catch (error) {
			setError(error); // Set error state if fetching fails
			console.error("Error fetching products:", error);
		} finally {
			setLoading(false); // Set loading to false after fetching data, regardless of success or failure
		}
	}

	useEffect(() => {
		getProductsTwo();
	}, []); //Added [] to specify dependencies

	const handleSearch = (event) => {
		const term = event.target.value;
		setSearchTerm(term);

		const filtered = allProducts.filter(
			(product) =>
				product.name.toLowerCase().includes(term.toLowerCase()) ||
				product.description.toLowerCase().includes(term.toLowerCase()),
		);
		setFilteredProducts(filtered);
	};

	// const handleAddToCart = async (productId) => {
	//   try {
	//     await addToCart(productId)
	//     const updatedCart = await getCart()
	//     setCart(updatedCart)
	//   } catch (error) {
	//     console.error("Error adding to cart:", error)
	//   }
	// }

	const handleDeleteProduct = async (productId) => {
		try {
			await deleteProduct(productId);
			await getProductsTwo(); // Refresh the product list
		} catch (error) {
			console.error("Error deleting product:", error);
		}
	};

	if (loading) {
		return <div>Loading...</div>; // Display loading indicator while fetching data
	}

	if (error) {
		return <div>Error: {error.message}</div>; // Display error message if fetching fails
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-7xl mx-auto px-4">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
					<div className="flex items-center">
						<input
							type="text"
							placeholder="Search products..."
							value={searchTerm}
							onChange={handleSearch}
							className="px-4 py-2 border border-gray-300 rounded-md mr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
						/>
						<Link
							to="/product/add"
							className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
							<Plus className="h-5 w-5 mr-2" />
							Add Product
						</Link>
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{filteredProducts.map((product) => (
						<div
							key={product.id}
							className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform transform hover:scale-105">
							<div className="h-56 overflow-hidden">
								<img
									src={product.image || "/placeholder.svg"}
									alt={product.name}
									className="w-full h-full object-cover"
								/>
							</div>
							<div className="p-4 flex-grow">
								<h3 className="text-lg font-semibold text-gray-900 mb-2">
									{product.name}
								</h3>
								<p className="text-gray-600 text-sm line-clamp-2 overflow-hidden mb-4">
									{product.description}
								</p>
								<span className="text-xl font-bold text-gray-900">
									₹{product.price.toFixed(2)}
								</span>
							</div>
							<div className="p-4 border-t">
								<div className="flex justify-between items-center">
									<div className="flex space-x-2">
										<button
											onClick={() => handleAddToCart(product._id)}
											className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
											Add to Cart
										</button>
										{JSON.parse(localStorage.getItem("user")).id ===
											product.user && (
											<Link
												to={`/product/edit/${product._id}`}
												className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
												<Edit className="h-5 w-5" />
											</Link>
										)}
										{JSON.parse(localStorage.getItem("user")).id ===
											product.user && (
											<button
												onClick={() => handleDeleteProduct(product._id)}
												className="p-2 bg-red-500 text-white rounded hover:bg-red-600">
												<Trash2 className="h-5 w-5" />
											</button>
										)}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
