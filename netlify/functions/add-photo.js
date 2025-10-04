// netlify/functions/add-photo.js
const { neon } = require('@netlify/neon');
const sql = neon(process.env.DATABASE_URL);

exports.handler = async (event, context) => {
  // Pastikan hanya request POST yang bisa pakai fungsi ini
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    // Ambil data yang dikirim dari form upload website
    const { title, url, uploader, keywords } = JSON.parse(event.body);
    
    // Cek apakah data yang penting sudah diisi
    if (!title || !url || !uploader) {
      return { statusCode: 400, body: 'Judul, URL, dan Pengunggah wajib diisi!' };
    }

    // Kirim perintah ke database: "Masukkan data foto baru"
    const newPhoto = await sql`
      INSERT INTO photos (id, title, url, uploader, keywords)
      VALUES (${crypto.randomUUID()}, ${title}, ${url}, ${uploader}, ${keywords})
      RETURNING *;
    `;
    
    return {
      statusCode: 201, // 201 artinya "berhasil membuat sesuatu yang baru"
      body: JSON.stringify(newPhoto[0]),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};