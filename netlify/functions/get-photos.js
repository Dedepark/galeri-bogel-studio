// netlify/functions/get-photos.js

// 1. Impil library Neon untuk bisa ngobrol sama database
const { neon } = require('@netlify/neon');

// 2. Ambil "rahasia" koneksi database dari Netlify.
//    Netlify akan mengisi ini otomatis, jadi kamu aman.
const sql = neon(process.env.DATABASE_URL);

// 3. Ini adalah fungsi utama yang akan dijalankan Netlify
exports.handler = async (event, context) => {
  try {
    // 4. Kirim perintah ke database: "Ambil semua data dari tabel photos, urutkan dari yang terbaru"
    const data = await sql`SELECT * FROM photos ORDER BY created_at DESC`;
    
    // 5. Kirim hasilnya kembali ke website dengan status "berhasil"
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    // 6. Jika ada error, kirim status "gagal"
    return { statusCode: 500, body: error.toString() };
  }
};