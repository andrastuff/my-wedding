# Undangan Pernikahan Ayuu & Ardi

Undangan one-page berbasis Next.js dengan pembuka amplop, nama tamu dari URL, countdown, detail acara, galeri, wedding gift, ucapan lokal, dan animasi penutup.

## Menjalankan proyek

```bash
npm install
npm run dev
```

Buka `http://localhost:3000/?for=Budi` untuk menguji nama tamu. Spasi dan karakter lain boleh digunakan, misalnya `?for=Keluarga%20Bapak%20Budi`.

## Mengganti data

Seluruh data utama ada di `lib/wedding-data.ts`, termasuk:

- nama dan orang tua mempelai;
- tanggal, jam, dan alamat;
- tautan Google Maps;
- urutan foto;
- rekening wedding gift.

Nomor rekening saat ini masih placeholder `0000 0000 0000` dan harus diganti sebelum undangan dibagikan.

Ucapan tersimpan di `localStorage` browser pengunjung. Jika ucapan perlu terlihat oleh semua tamu dan masuk ke admin, sambungkan form ke database/API sebelum deployment.

## Pemeriksaan

```bash
npm run lint
npm run build
```
