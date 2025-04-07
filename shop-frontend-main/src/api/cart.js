const API_URL = "http://localhost:8080";

export async function addToCart(product) {
  const response = await fetch(`${API_URL}/cart/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: JSON.parse(localStorage.getItem("user")).token,
    },
    body: JSON.stringify({ products: [product] }),
  });

  if (!response.ok) {
    throw new Error("Adding Product to Cart Failed");
  }

  return await response.json();
}

export async function getCart() {
  const response = await fetch(`${API_URL}/cart`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: JSON.parse(localStorage.getItem("user")).token,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return await response.json();
}

export async function updateQuantity(productID, quantity) {
  const response = await fetch(`${API_URL}/cart/update/quantity`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productID, quantity }),
  });

  if (!response.ok) {
    throw new Error("Updating Cart Quantity Failed");
  }

  return await response.json();
}

export async function removeFromCart(productID) {
  const response = await fetch(`${API_URL}/cart/product/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      token: JSON.parse(localStorage.getItem("user")).token,
    },
    body: JSON.stringify({ productID }),
  });

  if (!response.ok) {
    throw new Error("Deleting Product From Cart Failed");
  }

  return await response.json();
}

export async function demoAPi() {
  const response = await fetch(
    "https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=beng&api_key=REPLACE_ME",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "wasi",
      },
      // body: ""
    }
  );
  const result = await response.json();
  return result;
}
