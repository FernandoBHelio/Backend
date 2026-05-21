const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

pool.on('error', (err) => {
  console.error('mysql pool error:', err);
});

class DbService {
  static async query(sql, params = []) {
    try {
      const [rows] = await pool.query(sql, params);
      return rows;
    } catch (error) {
      console.error('Error en consulta SQL:', error);

      // Reconectar automáticamente si Railway cerró conexión
      if (
        error.code === 'PROTOCOL_CONNECTION_LOST' ||
        error.code === 'ECONNRESET'
      ) {
        console.log('Reconectando a MySQL...');
      }

      throw error;
    }
  }
}

module.exports = DbService;