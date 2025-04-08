/** @format */

const mongoose = require("mongoose");

// Connect to MongoDB
mongoose
	.connect("mongodb://127.0.0.1:27017/4semEcommerce", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("MongoDB connected"))
	.catch((err) => console.error(err));

// Product schema
const productSchema = new mongoose.Schema({
	name: { type: String, required: true },
	price: { type: Number, required: true },
	image: { type: String, required: true },
	stock: { type: Number },
	brand: { type: String },
	description: { type: String, required: true },
	user: { type: mongoose.Schema.ObjectId, ref: "User" },
});

const Product = mongoose.model("Product", productSchema);

// Sample brands and categories
const brands = [
	"Nike",
	"Adidas",
	"Puma",
	"Zara",
	"H&M",
	"Levi’s",
	"Roadster",
	"HRX",
	"Gucci",
	"Prada",
];
const categories = [
	"T-Shirt",
	"Jeans",
	"Shoes",
	"Hoodie",
	"Jacket",
	"Shorts",
	"Cap",
	"Sunglasses",
	"Watch",
	"Backpack",
];
const images = {
	"T-Shirt":
		"https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDN8fHxlbnwwfHx8fHw%3D&fit=crop&w=500&h=500&q=80",
	Jeans:
		"https://plus.unsplash.com/premium_photo-1674828601362-afb73c907ebe?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8amVhbnN8ZW58MHx8MHx8fDA%3D&fit=crop&w=500&h=500&q=80",
	Shoes:
		"https://plus.unsplash.com/premium_photo-1682435561654-20d84cef00eb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8U2hvZXN8ZW58MHx8MHx8fDA%3D&fit=crop&w=500&h=500&q=80",
	Hoodie:
		"https://plus.unsplash.com/premium_photo-1673125287363-b4e837f1215f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG9vZHl8ZW58MHx8MHx8fDA%3D&fit=crop&w=500&h=500&q=80",
	Jacket:
		"https://media.istockphoto.com/id/1404654875/photo/various-vintage-jackets-on-clothing-rack-in-second-hand-store.webp?a=1&b=1&s=612x612&w=0&k=20&c=IBIeufgEWIhJMKLdj5Tko3OZDJLxLA3setMnr8TlSiE=&fit=crop&w=500&h=500&q=80",
	Shorts:
		"https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U2hvcnRzfGVufDB8fDB8fHww&fit=crop&w=500&h=500&q=80",
	Cap: "https://images.unsplash.com/photo-1560774358-d727658f457c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Q2FwfGVufDB8fDB8fHww &fit=crop&w=500&h=500&q=80",
	Sunglasses:
		"https://images.unsplash.com/photo-1608539733292-190446b22b83?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8U3VuZ2xhc3Nlc3xlbnwwfHwwfHx8MA%3D%3D&fit=crop&w=500&h=500&q=80",
	Watch:
		"https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fFdhdGNofGVufDB8fDB8fHww&fit=crop&w=500&h=500&q=80",
	Backpack:
		"https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8QmFja3BhY2t8ZW58MHx8MHx8fDA%3D&fit=crop&w=500&h=500&q=80",
};

// Generate dummy products
const generateProducts = () => {
	const products = [];
	for (let i = 0; i < 40; i++) {
		const category = categories[Math.floor(Math.random() * categories.length)];
		const brand = brands[Math.floor(Math.random() * brands.length)];
		const price = Math.floor(Math.random() * 3000) + 299;
		const stock = Math.floor(Math.random() * 50) + 10;

		products.push({
			name: `${brand} ${category}`,
			price,
			image: images[category],
			stock,
			brand,
			description: `High-quality ${category.toLowerCase()} by ${brand}, perfect for daily wear.`,
			user: "67f250eb52be25213f15a367", // Placeholder ObjectId
		});
	}
	return products;
};

// Save to MongoDB
const seedDB = async () => {
	await Product.deleteMany({});
	const sampleProducts = generateProducts();
	await Product.insertMany(sampleProducts);
	console.log("Dummy products added successfully!");
	mongoose.disconnect();
};

seedDB();
