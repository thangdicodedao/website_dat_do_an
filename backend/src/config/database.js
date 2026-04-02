const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

const query = (sql, params) => pool.execute(sql, params);

const getConnection = () => pool.getConnection();

const connectDB = async () => {
  // Test connection
  const conn = await pool.getConnection();
  console.log(`✅ MySQL Connected: ${process.env.MYSQL_HOST}:${process.env.MYSQL_PORT}/${process.env.MYSQL_DATABASE}`);
  conn.release();
};

module.exports = { pool, query, getConnection, connectDB };
