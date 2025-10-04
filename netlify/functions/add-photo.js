// netlify/functions/add-photo.js
const { Client } = require('pg');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const { title, url, uploader, keywords } = JSON.parse(event.body);
    
    if (!title || !url || !uploader) {
      return { statusCode: 400, body: 'Judul, URL, dan Pengunggah wajib diisi!' };
    }

    const query = 'INSERT INTO photos(id, title, url, uploader, keywords, created_at) VALUES($1, $2, $3, $4, $5, NOW()) RETURNING *';
    const values = [crypto.randomUUID(), title, url, uploader, keywords];
    
    const result = await client.query(query, values);
    await client.end();
    
    return {
      statusCode: 201,
      body: JSON.stringify(result.rows[0]),
    };
  } catch (error) {
    console.error('Database error:', error);
    return { statusCode: 500, body: error.toString() };
  }
};