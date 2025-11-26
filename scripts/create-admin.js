const mongoose = require("mongoose");
const readline = require("readline");
const argon2 = require("argon2");

async function TokenHasher(token) {
	try {
		const hashed = await argon2.hash(token, {
			type: argon2.argon2id,
			memoryCost: 2048,
			timeCost: 4,
			parallelism: 3,
		});
		if (!hashed) throw new Error("Failed to hash token");
		return hashed;
	} catch (err) {
		throw err;
	}
}

const adminSchema = new mongoose.Schema(
	{
		username: { type: String, unique: true },
		firstname: { type: String, default: null },
		lastname: { type: String, default: null },
		email: {
			type: String,
			unique: true,
			sparse: true,
		},
		password: { type: String, default: null, select: false },
		phone: { type: String, default: null },
		photo: {
			type: Object,
			default: {
				url: "",
				publicId: "",
				cloudinaryId: "",
				format: "",
				size: 0,
				width: 0,
				height: 0,
				uploaded_at: new Date(),
				resourceType: "image",
			},
		},
		is_online: { type: Boolean, default: false },
		role: {
			type: String,
			default: "admin",
			enum: ["student", "admin"],
		},
		created_at: { type: Date, default: Date.now },
		updated_at: { type: Date, default: Date.now },
	},
	{
		collection: "users",
	}
);

const Admin = mongoose.models.AdminScript || mongoose.model("AdminScript", adminSchema, "users");

const connectToMongoDB = async () => {
	const mongoUri =
		"mongodb+srv://202311807:8Py2uvdx4Gf5tGKA@gc-yofinder.rc8qogt.mongodb.net/gc-yofinder?retryWrites=true&w=majority";
	await mongoose.connect(mongoUri);
};

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const question = (prompt) =>
	new Promise((resolve) => {
		rl.question(prompt, resolve);
	});

async function createAdmin() {
	try {
		console.log("\n🛡️  Create Admin Account");
		console.log("==============================\n");

		console.log("📡 Connecting to database...");
		await connectToMongoDB();
		console.log("✅ Connected to database successfully!\n");

		const firstName = await question("Enter first name: ");
		const lastName = await question("Enter last name: ");
		const email = await question("Enter email (full email address): ");
		const password = await question("Enter password: ");

		if (!firstName.trim() || !lastName.trim()) {
			console.log("❌ First name and last name are required!");
			process.exit(1);
		}

		if (!email.trim()) {
			console.log("❌ Email is required!");
			process.exit(1);
		}

		if (!password.trim() || password.length < 8) {
			console.log("❌ Password must be at least 8 characters!");
			process.exit(1);
		}

		const username = (
			"admin_" +
			firstName.toLowerCase().trim().replace(/\s+/g, "_") +
			"_" +
			lastName.toLowerCase().trim().replace(/\s+/g, "_")
		).trim();

		// Check if admin already exists
		const existingAdmin = await Admin.findOne({ email: email.trim().toLowerCase() });
		if (existingAdmin) {
			console.log("❌ An account with this email already exists!");
			process.exit(1);
		}

		const hashedPassword = await TokenHasher(password);

		const admin = new Admin({
			username: username,
			firstname: firstName.trim(),
			lastname: lastName.trim(),
			email: email.trim().toLowerCase(),
			password: hashedPassword,
			role: "admin",
		});

		await admin.save();

		console.log("\n==============================");
		console.log("✅ Admin account created successfully!");
		console.log("==============================");
		console.log(`👤 Name: ${firstName.trim()} ${lastName.trim()}`);
		console.log(`📧 Email: ${email.trim().toLowerCase()}`);
		console.log(`🔑 Username: ${username}`);
		console.log(`🛡️  Role: Admin`);
		console.log("==============================\n");
	} catch (error) {
		console.error("❌ Error creating admin:", error.message);
	} finally {
		rl.close();
		mongoose.connection.close();
	}
}

process.on("SIGINT", async () => {
	console.log("\n\n👋 Process interrupted. Cleaning up...");
	rl.close();
	if (mongoose.connection.readyState === 1) {
		await mongoose.connection.close();
	}
	process.exit();
});

createAdmin().catch((error) => {
	console.error("❌ Fatal error:", error);
	process.exit(1);
});
