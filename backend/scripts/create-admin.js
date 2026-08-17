import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import readline from 'readline';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error('Error: MONGODB_URI not found in environment.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('--- AFP Technologies Admin Provisioning Tool ---');

  rl.question('Admin Name: ', (name) => {
    rl.question('Admin Email: ', (email) => {
      rl.question('Admin Password: ', async (password) => {
        try {
          const cleanEmail = email.trim().toLowerCase();
          const existing = await Admin.findOne({ email: cleanEmail });

          if (existing) {
            console.error('\nError: Admin user with this email already exists.');
            process.exit(1);
          }

          const salt = await bcrypt.genSalt(12);
          const passwordHash = await bcrypt.hash(password.trim(), salt);

          await Admin.create({
            name: name.trim(),
            email: cleanEmail,
            passwordHash,
            role: 'superadmin',
            active: true,
          });

          console.log(`\nSuccess: Admin account "${cleanEmail}" provisioned successfully.`);
        } catch (err) {
          console.error('\nProvisioning failed:', err.message);
        } finally {
          rl.close();
          await mongoose.disconnect();
        }
      });
    });
  });
}

main();