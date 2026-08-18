import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: 'admin' },
  active: { type: Boolean, default: true },
  lastLoginAt: { type: Date },
}, { timestamps: true });

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (q) => new Promise((resolve) => rl.question(q, resolve));

async function createAdmin() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ Error: MONGODB_URI .env file me set nahi hai.');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB database.\n');

    const name = (await question('Enter Admin Name: ')).trim();
    const email = (await question('Enter Admin Email: ')).trim().toLowerCase();
    const password = (await question('Enter Admin Password: ')).trim();

    if (!name || !email || !password) {
      console.log('❌ All fields (Name, Email, Password) are required.');
      process.exit(1);
    }

    // Check existing email
    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log(`⚠️ Admin with email "${email}" already exists!`);
      const update = await question('Do you want to update password? (y/n): ');
      if (update.toLowerCase() === 'y') {
        existing.passwordHash = await bcrypt.hash(password, 12);
        existing.name = name;
        existing.active = true;
        await existing.save();
        console.log(`✅ Admin "${email}" updated successfully!`);
      }
      process.exit(0);
    }

    // Hash password with bcrypt (salt rounds: 12)
    const passwordHash = await bcrypt.hash(password, 12);

    const newAdmin = await Admin.create({
      name,
      email,
      passwordHash,
      role: 'admin',
      active: true,
    });

    console.log('\n======================================');
    console.log('🎉 New Admin Created Successfully!');
    console.log(`👤 Name:     ${newAdmin.name}`);
    console.log(`📧 Email:    ${newAdmin.email}`);
    console.log(`🛡️ Role:     ${newAdmin.role}`);
    console.log('======================================\n');
  } catch (err) {
    console.error('❌ Error creating admin:', err.message);
  } finally {
    rl.close();
    await mongoose.disconnect();
    process.exit(0);
  }
}

createAdmin();