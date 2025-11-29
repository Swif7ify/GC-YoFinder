const mongoose = require("mongoose");
const argon2 = require("argon2");

// 1. DATA ENTRY: The list of students you provided
const studentsData = [
	{ last: "NEPOMUCENO", first: "NIKOLAI ROMAN", email: "202312259@gordoncollege.edu.ph" },
	{ last: "ONG", first: "ROSELYN LEI", email: "202312260@gordoncollege.edu.ph" },
	{ last: "ONG", first: "VINCENT DAVID", email: "202310779@gordoncollege.edu.ph" },
	{ last: "ORDOVEZ", first: "EARL ROMEO", email: "202311807@gordoncollege.edu.ph" },
	{ last: "ORMIDES", first: "JOHN IAN", email: "202311310@gordoncollege.edu.ph" },
	{ last: "PANGANIBAN", first: "LARISSA EUNICE", email: "202311183@gordoncollege.edu.ph" },
	{ last: "ROSETE", first: "FRANCIS EMIL", email: "202312263@gordoncollege.edu.ph" },
	{ last: "RUMERAL", first: "LEBRON JAMES", email: "202310376@gordoncollege.edu.ph" },
	{ last: "SARIO", first: "AARON PAUL", email: "202310230@gordoncollege.edu.ph" },
	{ last: "SIMON", first: "SHAINA KYLA", email: "202310167@gordoncollege.edu.ph" },
	{ last: "SORIO", first: "JANICO GYLE", email: "202310727@gordoncollege.edu.ph" },
	{ last: "TAMONDONG", first: "SEANN PATRICK", email: "202310319@gordoncollege.edu.ph" },
	{ last: "UDANI", first: "VARNARD PAULO", email: "202312266@gordoncollege.edu.ph" },
	{ last: "VENCILAO", first: "JOHARA KARYLLE", email: "202311308@gordoncollege.edu.ph" },
	{ last: "ABANES", first: "ALJHUN", email: "202310704@gordoncollege.edu.ph" },
	{ last: "ANGELES", first: "RIDLEY", email: "202310177@gordoncollege.edu.ph" },
	{ last: "ARCEGA", first: "FRANCHESCA LEI", email: "202310202@gordoncollege.edu.ph" },
	{ last: "CAMASO", first: "MARINA", email: "202312246@gordoncollege.edu.ph" },
	{ last: "CAOLBOY", first: "RAYMUND LEEAN", email: "202310784@gordoncollege.edu.ph" },
	{ last: "CATBAGAN", first: "AAKIM", email: "202310335@gordoncollege.edu.ph" },
	{ last: "CORDOVA", first: "PAULO", email: "202311378@gordoncollege.edu.ph" },
	{ last: "DE JESUS", first: "JOHANNES RANDHALL", email: "202311027@gordoncollege.edu.ph" },
	{ last: "DE JESUS", first: "KHARL RYAN", email: "202311564@gordoncollege.edu.ph" },
	{ last: "DEL CARMEN", first: "RICHARD JR.", email: "202310589@gordoncollege.edu.ph" },
	{ last: "DEL ROSARIO", first: "JUSTIN", email: "202310385@gordoncollege.edu.ph" },
	{ last: "DILAG", first: "PAUL JAN", email: "202220002@gordoncollege.edu.ph" },
	{ last: "ECAL", first: "KENT ANN", email: "202310323@gordoncollege.edu.ph" },
	{ last: "ESTACIO", first: "AARON JAN", email: "202310341@gordoncollege.edu.ph" },
	{ last: "GARCIA", first: "ROSARY JANE", email: "202310293@gordoncollege.edu.ph" },
	{ last: "MON", first: "CATHERINE", email: "202312299@gordoncollege.edu.ph" },
];

// 2. HELPER FUNCTIONS
async function TokenHasher(token) {
	try {
		const hashed = await argon2.hash(token, {
			type: argon2.argon2id,
			memoryCost: 2048,
			timeCost: 4,
			parallelism: 3,
		});
		return hashed;
	} catch (err) {
		throw err;
	}
}

// Helper to convert "NIKOLAI ROMAN" -> "Nikolai Roman"
function toTitleCase(str) {
	return str.replace(/\w\S*/g, function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}

// 3. MONGOOSE SCHEMA
const studentSchema = new mongoose.Schema(
	{
		username: { type: String, unique: true },
		firstname: { type: String, default: null },
		lastname: { type: String, default: null },
		email: { type: String, unique: true, sparse: true },
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
		role: { type: String, default: "student", enum: ["student", "admin"] },
		created_at: { type: Date, default: Date.now },
		updated_at: { type: Date, default: Date.now },
	},
	{ collection: "users" }
);

const Student = mongoose.models.StudentScript || mongoose.model("StudentScript", studentSchema, "users");

const connectToMongoDB = async () => {
	const mongoUri =
		"mongodb+srv://202311807:8Py2uvdx4Gf5tGKA@gc-yofinder.rc8qogt.mongodb.net/gc-yofinder?retryWrites=true&w=majority";
	await mongoose.connect(mongoUri);
};

// 4. MAIN BATCH PROCESS
async function seedStudents() {
	try {
		console.log("\n📡 Connecting to database...");
		await connectToMongoDB();
		console.log("✅ Connected to database successfully!\n");
		console.log(`🚀 Starting batch creation for ${studentsData.length} students...\n`);

		let successCount = 0;
		let errorCount = 0;

		for (const data of studentsData) {
			try {
				// Formatting Names (Title Case)
				const formattedFirst = toTitleCase(data.first.trim());
				const formattedLast = toTitleCase(data.last.trim());

				// Extract ID from email (remove @gordoncollege.edu.ph)
				const emailPrefix = data.email.split("@")[0];

				// Generate Username logic from your original code
				const username = (
					emailPrefix.slice(0, 4) +
					"_" +
					formattedFirst.toLowerCase().replace(/\s+/g, "_") +
					"_" +
					formattedLast.toLowerCase().replace(/\s+/g, "_")
				)
					.replace(/\s+/g, "_")
					.trim();

				// Generate Password logic from your original code
				const rawPassword = emailPrefix + "_GC";
				const hashedPassword = await TokenHasher(rawPassword);

				// Check if user exists (to avoid crashing script on duplicates)
				const existing = await Student.findOne({ email: data.email });
				if (existing) {
					console.log(`⚠️  Skipping ${formattedFirst} ${formattedLast} - Already exists.`);
					errorCount++;
					continue;
				}

				const student = new Student({
					username: username,
					firstname: formattedFirst,
					lastname: formattedLast,
					email: data.email.trim(),
					password: hashedPassword,
					role: "student",
				});

				await student.save();
				console.log(`✅ Created: ${formattedFirst} ${formattedLast}`);
				successCount++;
			} catch (innerError) {
				console.error(`❌ Failed to create ${data.first} ${data.last}:`, innerError.message);
				errorCount++;
			}
		}

		console.log("\n==============================");
		console.log(`🎉 Batch Process Complete`);
		console.log(`✅ Successful: ${successCount}`);
		console.log(`⚠️  Skipped/Failed: ${errorCount}`);
		console.log("==============================\n");
	} catch (error) {
		console.error("❌ Fatal error:", error);
	} finally {
		await mongoose.connection.close();
		process.exit();
	}
}

// Run the script
seedStudents();
