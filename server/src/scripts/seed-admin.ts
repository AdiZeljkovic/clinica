import bcrypt from 'bcryptjs';
import { query } from '../db/connection.js';

const hash = await bcrypt.hash('admin123', 12);
await query(
  'INSERT IGNORE INTO admin_users (username, email, password_hash) VALUES (?, ?, ?)',
  ['admin', 'admin@bioclinica.ba', hash]
);
console.log('Admin user kreiran: admin / admin123');
process.exit(0);
