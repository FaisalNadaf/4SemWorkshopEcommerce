/** @format */

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { User } = require("./model/User");
const morgan = require("morgan");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Product } = require("./model/Product");
const { Cart } = require("./model/Cart");
const dotenv = require("dotenv");
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

mongoose
	.connect(process.env.MONGODB_URL)
	.then(() => {
		console.log("db is connected");
	})
	.catch((error) => {
		console.log("db is not connectd", error);
	});

app.post("/register", async (req, res) => {
	try {
		let { name, email, password } = req.body;

		//check if any field missingt
		if (!email || !name || !password) {
			res.status(400).json({
				message: "Field is missing",
			});
		}
		//check if user allready have account
		const user = await User.findOne({ email });

		if (user) {
			return res.status(400).json({
				message: "User already has a account",
			});
		} else {
			//hash the password ->  secure password
			const salt = bcrypt.genSaltSync(10);
			const hashedPassword = bcrypt.hashSync(password, salt);

			//user authentication
			const token = jwt.sign({ email }, "supersecret", { expiresIn: "365d" });

			//create user in database
			await User.create({
				name,
				password: hashedPassword,
				email,
				token,
				role: "user",
			});

			return res.status(200).json({
				message: "User created successfully",
			});
		}
	} catch (error) {
		console.log(error);
		res.status(400).json({
			message: "Internal server error",
		});
	}
});

app.post("/login", async (req, res) => {
	try {
		let { email, password } = req.body;

		//check all fields are there or not
		if (!email || !password) {
			return res.status(400).json({
				message: "Field is missing",
			});
		}
		//checking user having account
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({
				message: "User not Registered",
			});
		}
		const isPasswordMatched = bcrypt.compareSync(password, user.password);

		if (!isPasswordMatched) {
			return res.status(404).json({
				message: "Password is wrong",
			});
		}

		return res.status(200).json({
			message: "User loged in successfully",
			id: user._id,
			name: user.name,
			token: user.token,
			email: user.email,
			role: user.role,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({
			message: "Internal server error",
		});
	}
});

app.get("/products", async (req, res) => {
	try {
		const products = await Product.find();
		res.status(200).json({
			message: "Product found seccussfully",
			products: products,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({
			message: "Internal server error",
		});
	}
});

app.post("/add-product", async (req, res) => {
	try {
		let { name, image, description, stock, brand, price } = req.body;
		const { token } = req.headers;
		const decodedToken = jwt.verify(token, "supersecret");
		const user = await User.findOne({ email: decodedToken.email });
		const product = await Product.create({
			name,
			stock,
			price,
			image,
			description,
			brand,
			user: user._id,
		});
		return res.status(200).json({
			message: "Product created successfully",
			product: product,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({
			message: "Internal server error",
		});
	}
});

app.get("/product/:id", async (req, res) => {
	try {
		let { id } = req.params;
		if (!id) {
			return res.status(400).json({
				message: "Product id not found",
			});
		}
		let { token } = req.headers;
		const decodedToken = jwt.verify(token, "supersecret");
		if (decodedToken.email) {
			const product = await Product.findById(id);
			if (!product) {
				res.status(400).json({
					message: "Product not found",
				});
			}
			return res.status(200).json({
				message: "Product found successfully",
				product,
			});
		}
	} catch (error) {
		console.log(error);
		res.status(400).json({
			message: "Internal server error",
		});
	}
});

app.put("/product/edit/:id", async (req, res) => {
	const { id } = req.params;
	const { token } = req.headers;
	const { name, description, image, price, brand, stock } =
		req.body.productData;
	const decodedToken = jwt.verify(token, "supersecret");
	try {
		if (decodedToken.email) {
			const updatedProduct = await Product.findByIdAndUpdate(id, {
				name,
				description,
				image,
				price,
				brand,
				stock,
			});
			if (!updatedProduct) {
				return res.status(400).json({
					message: "Product not found",
				});
			}
			return res.status(200).json({
				message: "Product Updated Succesfully",
				product: updatedProduct,
			});
		}
	} catch (error) {
		res.status(400).json({
			message: "Internal Server Error Occured While Updating Product",
		});
	}
});

app.delete("/product/delete/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { token } = req.headers;
		if (!id) {
			return res.status(400).json({
				message: "ID not found",
			});
		}
		let deletedProduct = await Product.findByIdAndDelete(id);
		if (!deletedProduct) {
			return res.status(400).json({
				message: "Product not found",
			});
		}
		res.status(200).json({
			message: "Product Deleted Sucessfully",
			product: deletedProduct,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({
			message: "Internal server error in delete",
		});
	}
});

app.get("/cart", async (req, res) => {
	const { token } = req.headers;
	const decodedtoken = jwt.verify(token, "supersecret");
	const user = await User.findOne({ email: decodedtoken.email }).populate({
		path: "cart",
		populate: {
			path: "products",
			model: "Product",
		},
	});
	if (!user) {
		return res.status(400).json({ message: "User not found" });
	}

	return res.status(200).json({
		message: "user found",
		cart: user.cart,
	});
});

app.post("/cart/add", async (req, res) => {
	const body = req.body;
	const productArray = body.products;
	let totalPrice = 0;
	try {
		for (const item of productArray) {
			const product = await Product.findById(item);

			if (product) {
				totalPrice += product.price;
			}
		}

		const { token } = req.headers;
		const decodedtoken = jwt.verify(token, "supersecret");
		const user = await User.findOne({ email: decodedtoken.email });

		if (!user) {
			res.status(404).json({ message: "User not found" });
		}
		let cart;
		if (user.cart) {
			cart = await Cart.findById(user.cart).populate("products");
			const existingProductIds = cart.products.map((product) => {
				product._id.toString();
			});

			productArray.forEach(async (productId) => {
				if (!existingProductIds.includes(productId)) {
					cart.products.push(productId);

					const product = await Product.findById(productId);
					totalPrice += product.price;
				}
			});
			cart.total = totalPrice;
			await cart.save();
		} else {
			cart = new Cart({
				products: productArray,
				total: totalPrice,
			});
			await cart.save();
			user.cart = cart._id;
			await user.save();
		}
		res.status(201).json({ message: "cart updated succcesfully", cart: cart });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Inernal server Error" });
	}
});
app.delete("/cart/product/delete", async (req, res) => {
	const { productID } = req.body;
	const { token } = req.headers;

	try {
		const decodedToken = jwt.verify(token, "supersecret");
		const user = await User.findOne({ email: decodedToken.email }).populate(
			"cart",
		);

		if (!user) {
			return res.status(404).json({ message: "User Not Found" });
		}

		const cart = await Cart.findById(user.cart).populate("products");

		if (!cart) {
			return res.status(404).json({ message: "Cart Not Found" });
		}

		const productIndex = cart.products.findIndex(
			(product) => product._id.toString() === productID,
		);

		if (productIndex === -1) {
			return res.status(404).json({ message: "Product Not Found in Cart" });
		}

		cart.products.splice(productIndex, 1);
		cart.total = cart.products.reduce(
			(total, product) => total + product.price,
			0,
		);

		await cart.save();

		res.status(200).json({
			message: "Product Removed from Cart Successfully",
			cart: cart,
		});
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error Removing Product from Cart", error });
	}
});

let PORT = 8080;
app.listen(PORT, () => {
	console.log(`server is connected to port ${PORT}`);
});
