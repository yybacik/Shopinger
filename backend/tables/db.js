// db.js
import mysql from 'mysql2/promise';

const pool = await mysql.createPool({
  host: 'hasanbocek.com',
  user: 'hasanbocek_yusufbacik',
  password: 'yusufbacik12',
  database: 'hasanbocek_yusufbaciksql',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;