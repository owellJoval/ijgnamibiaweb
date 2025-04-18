import mysql from 'mysql2/promise';
//connect to local host or use my online database
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Kalimbwejoel@01',
  database: 'ijgnamibia',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};


//my cloud database.

// Create a connection pool
const pool = mysql.createPool(dbConfig);

export default pool; 