// netlify/functions/get-photos.js
const { Client } = require('pg');

exports.handler = async (event, context) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Ini sering diperlukan untuk koneksi ke Neon
  });
  
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM photos ORDER BY created_at DESC');
    await client.end();
    
    return {
      statusCode: 200,
      body: JSON.stringify(result.rows), // Data ada di result.rows
    };
  } catch (error) {
    console.error('Database error:', error);
    return { statusCode: 500, body: error.toString() };
  }
};