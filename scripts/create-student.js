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

const studentSchema = new mongoose.Schema(
	{
		firstname: { type: String, default: null },
		lastname: { type: String, default: null },
		email: {
			type: String,
			unique: true,
			sparse: true,
		},
		password: { type: String, default: null, select: false },
		phone: { type: String, default: null },
		is_online: { type: Boolean, default: false },
		role: {
			type: String,
			default: "student",
			enum: ["student", "admin"],
		},
		created_at: { type: Date, default: Date.now },
		updated_at: { type: Date, default: Date.now },
	},
	{
		collection: "users",
	}
);

const Student =
	mongoose.models.StudentScript ||
	mongoose.model("StudentScript", studentSchema, "users");

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

const validateEmail = (email) => {
	if (!email) return false;
	const normalized = email.trim().toLowerCase();
	const emailRegex = /^[a-z0-9._%+-]+@gordoncollege\.edu\.ph$/i;
	return emailRegex.test(normalized);
};

async function createStudent() {
	try {
		console.log("\n🔐 Create Student Account");
		console.log("==============================\n");

		console.log("📡 Connecting to database...");
		await connectToMongoDB();
		console.log("✅ Connected to database successfully!\n");

		const firstName = await question("Enter first name: ");
		const lastName = await question("Enter last name: ");
		const email = await question("Enter email address: ");
		const password = await question("Enter password (min 8 characters): ");

		if (!firstName.trim() || !lastName.trim()) {
			console.log("❌ First name and last name are required!");
			process.exit(1);
		}

		if (!validateEmail(email)) {
			console.log("❌ Invalid email format!");
			process.exit(1);
		}

		if (password.length < 8) {
			console.log("❌ Password must be at least 8 characters long!");
			process.exit(1);
		}

		const hashedPassword = await TokenHasher(password);

		const student = new Student({
			firstname: firstName.trim(),
			lastname: lastName.trim(),
			email: email.trim(),
			password: hashedPassword,
			role: "student",
		});

		await student.save();
		console.log("✅ Status: Active & Verified");
	} catch (error) {
		console.error("Error creating student:", error);
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

createStudent().catch((error) => {
	console.error("❌ Fatal error:", error);
	process.exit(1);
});
