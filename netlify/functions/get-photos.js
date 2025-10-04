// netlify/functions/get-photos.js
const { neon } = require('@netlify/neon');

// Fungsi ini akan otomatis membaca NETLIFY_DATABASE_URL
const sql = neon();

exports.handler = async (event, context) => {
  try {
    const data = await sql`SELECT * FROM photos ORDER BY created_at DESC`;
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Database error:', error); // Tambahkan log untuk debug
    return { statusCode: 500, body: error.toString() };
  }
};