/** @format */

const API_URL = "http://localhost:8080";

export async function deleteProduct(product) {
	const response = await fetch(`${API_URL}/product/delete/${product}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			token: JSON.parse(localStorage.getItem("user")).token,
		},
		body: JSON.stringify({ productID: product }),
	});

	if (!response.ok) {
		throw new Error("Deleting Product Failed");
	}

	return await response.json();
}

export async function getProduct(id) {
	const response = await fetch(`${API_URL}/product/${id}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			token: JSON.parse(localStorage.getItem("user")).token,
		},
	});
	const data = await response.json();
	return data.product;
}

// export async function updateProduct(id, productData) {
// 	console.log("✌️productData --->", productData);
// 	const response = await fetch(`${API_URL}/product/edit/${id}`, {
// 		method: "PATCH",
// 		headers: {
// 			"Content-Type": "application/json",
// 			token: JSON.parse(localStorage.getItem("user")).token,
// 		},
// 		body: JSON.stringify({ productData }),
// 	});

// 	if (!response.ok) {
// 		throw new Error("Updating Product Failed");
// 	}

// 	const data = await response.json();
// 	console.log("✌️data --->", data);
// 	return data;
// }

export async function updateProduct(id, productData) {
	console.log("✌️productData --->", productData);

	const response = await fetch(`${API_URL}/product/edit/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			token: JSON.parse(localStorage.getItem("user")).token,
		},
		body: JSON.stringify({ productData }),
	});

	if (!response.ok) {
		throw new Error("Updating Product Failed");
	}

	const data = await response.json();
	
	console.log("✌️data --->", data);
	return data;
}

export async function payment() {
	const response = await fetch(`${API_URL}/cart/payment`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			token: JSON.parse(localStorage.getItem("user")).token,
		},
		body: JSON.stringify({}),
	});
	const data = await response.json();
	return data.url;
}
