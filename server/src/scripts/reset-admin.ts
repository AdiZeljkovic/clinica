import bcrypt from 'bcryptjs';
import { query } from '../db/connection.js';

const hash = await bcrypt.hash('admin123', 10);
await query('UPDATE admin_users SET password_hash = ? WHERE username = ?', [hash, 'admin']);
const rows = await query<any[]>('SELECT id, username, email FROM admin_users WHERE username = ?', ['admin']);
console.log('Admin ažuriran:', rows[0]);
process.exit(0);
