/** @format */

import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./Context/AuthContext";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Home from "./Pages/Home";
import Default from "./Pages/Default";
import AddProduct from "./Pages/AddProducts";
import Products from "./Pages/Products";
import Navbar from "./components/Navbar";
import Cart from "./Pages/Cart";
import EditProduct from "./Pages/EditProduct";
import Success from "./Pages/Success";
import Cancel from "./Pages/Cancel";

function PrivateRoute({ children }) {
	const { isAuthenticated } = useAuth();
	return localStorage.getItem("isAuthenticatedd") === "true" ? (
		<>{children}</>
	) : (
		<Navigate to="/login" />
	);
}

function PublicRoute({ children }) {
	const { isAuthenticated } = useAuth();
	return localStorage.getItem("isAuthenticatedd") !== "true" ? (
		<>{children}</>
	) : (
		<Navigate to="/home" />
	);
}

function AppRoutes() {
	return (
		<Routes>
			<Route
				path="/"
				element={
					<PublicRoute>
						<Default />
					</PublicRoute>
				}
			/>
			<Route
				path="/login"
				element={
					<PublicRoute>
						<Login />
					</PublicRoute>
				}
			/>
			<Route
				path="/register"
				element={
					<PublicRoute>
						<Register />
					</PublicRoute>
				}
			/>
			<Route
				path="/success"
				element={
					<PublicRoute>
						<Success />
					</PublicRoute>
				}
			/>
			<Route
				path="/cancel"
				element={
					<PublicRoute>
						<Cancel />
					</PublicRoute>
				}
			/>
			<Route
				path="/home"
				element={
					<PrivateRoute>
						<Home />
					</PrivateRoute>
				}
			/>
			<Route
				path="/products"
				element={
					<PrivateRoute>
						<Products />
					</PrivateRoute>
				}
			/>
			<Route
				path="/cart"
				element={
					<PrivateRoute>
						<Cart />
					</PrivateRoute>
				}
			/>
			<Route
				path="/product/add"
				element={
					<PrivateRoute>
						<AddProduct />
					</PrivateRoute>
				}
			/>
			<Route
				path="/product/edit/:id"
				element={
					<PrivateRoute>
						<EditProduct />
					</PrivateRoute>
				}
			/>
		</Routes>
	);
}

function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<Navbar />
				<AppRoutes />
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;
