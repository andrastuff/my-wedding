# Rencana Arsitektur: Modular Invitation Template Builder

## Konsep Utama

Project undangan **Ayu & Ardi yang ada saat ini adalah satu template**, bukan fondasi data tunggal untuk seluruh jenis undangan.

Setiap template adalah sebuah **Template Kit** mandiri. Kit dapat membawa:

- Layout dan renderer sendiri
- Daftar section yang boleh dipakai
- Section khusus yang tidak dimiliki template lain
- Default section dan urutan awal
- Theme/palette warna
- Font heading, handwriting, dan body
- Asset dekoratif, icon, pattern, dan animasi
- Schema data serta panel edit untuk setiap section

Dengan model ini, template Wedding Lampung dapat mempunyai amplop pembuka, galeri adat, akad/resepsi, dan unduh mantu; sedangkan template ulang tahun dapat mempunyai cover confetti, agenda pesta, dan daftar hadiah. Keduanya memakai editor yang sama, tetapi tidak perlu memakai section, font, atau theme yang sama.

---

## Model Produk

```text
Invitation Builder Engine
  ├── Template Kit: wedding-lampung-elegance     ← template saat ini
  │     ├── section: opening-envelope
  │     ├── section: hero
  │     ├── section: couple
  │     ├── section: wedding-events
  │     ├── section: unduh-mantu
  │     ├── section: gallery
  │     ├── theme: maroon-gold / ivory-gold / sage-gold
  │     └── font set: Great Vibes / Dancing Script / Manrope
  │
  ├── Template Kit: wedding-modern-editorial
  │     ├── section: photo-cover
  │     ├── section: couple
  │     ├── section: timeline
  │     ├── section: event-details
  │     ├── theme dan font khusus template ini
  │     └── tanpa opening-envelope dan unduh-mantu
  │
  ├── Template Kit: birthday-confetti
  │     ├── section: birthday-cover
  │     ├── section: party-details
  │     ├── section: agenda
  │     ├── section: gallery
  │     └── theme dan font khusus ulang tahun
  │
  └── Template Kit: khitanan-ceria
        ├── section: child-profile
        ├── section: acara-khitanan
        ├── section: doa
        └── theme dan font khusus khitanan
```

---

## Aturan Template Kit

1. **Template menentukan section yang tersedia.**
   Editor tidak menampilkan section dari template lain.

2. **Template menentukan theme yang tersedia.**
   Pengguna dapat mengganti warna dan font hanya dari pilihan yang sudah dikurasi pada template tersebut.

3. **Setiap section punya data schema sendiri.**
   Section `wedding-events` tidak dapat dipakai pada template ulang tahun kecuali template ulang tahun secara eksplisit mendaftarkannya.

4. **Pengguna dapat drag-and-drop hanya di section yang dapat dipindah.**
   Misalnya `opening-envelope` dan `hero` dapat dikunci di bagian awal, tetapi galeri, quote, peta, dan hadiah dapat diurutkan ulang.

5. **Template memiliki versi.**
   Undangan lama tetap stabil walaupun template diperbarui.

---

## Kontrak Template Kit

Setiap kit harus mengekspor satu manifest. Manifest ini adalah kontrak antara template dan builder engine.

```ts
export type TemplateKit = {
  id: string;
  version: number;
  category: "wedding" | "birthday" | "khitanan" | "aqiqah";
  name: string;
  description: string;
  preview: { cover: string; thumbnail: string };

  // Hanya section ini yang terlihat pada panel "Tambah section".
  sections: SectionDefinition[];

  // Susunan awal ketika pengguna membuat undangan baru.
  defaultSectionOrder: string[];

  // Warna dan font yang boleh dipilih di template ini.
  themes: TemplateTheme[];

  // Renderer halaman publik dan editor preview untuk template ini.
  renderInvitation: TemplateRenderer;

  capabilities: {
    guestName: boolean;
    music: boolean;
    openingExperience: boolean;
  };
};

export type TemplateTheme = {
  id: string;
  label: string;
  colors: {
    background: string;
    surface: string;
    primary: string;
    accent: string;
    text: string;
  };
  fonts: {
    display: "great-vibes" | "dancing-script" | "playfair";
    heading: "cormorant" | "playfair" | "manrope";
    body: "manrope" | "lora" | "inter";
  };
};
```

Theme dapat mengganti **kombinasi warna dan font** sekaligus. Namun pilihan font tidak boleh bebas agar desain template tidak rusak.

---

## Kontrak Section

Section adalah modul kecil yang berada di dalam template kit. Satu section memiliki renderer, editor, schema validasi, dan aturan drag-and-drop.

```ts
export type SectionDefinition<TData = unknown> = {
  type: string;
  label: string;
  icon: string;
  required: boolean;
  reorderable: boolean;
  maxInstances: number;
  defaultData: TData;
  schema: ZodSchema<TData>;
  Renderer: React.ComponentType<SectionRendererProps<TData>>;
  Editor: React.ComponentType<SectionEditorProps<TData>>;
};
```

Contoh section yang dapat dipakai ulang bila desainnya cocok:

```text
gallery, map, rsvp, gift, quote, audio, closing
```

Contoh section yang hanya milik template/kategori tertentu:

```text
wedding: opening-envelope, couple, wedding-events, unduh-mantu
birthday: birthday-cover, party-details, agenda
khitanan: child-profile, acara-khitanan, doa
```

Section reusable dapat dipaketkan sebagai `shared`, tetapi hanya tersedia jika didaftarkan oleh template kit.

---

## Struktur Folder Modular

Struktur berikut memisahkan engine, data undangan, dan template kit. Nama folder dapat disesuaikan, tetapi batas tanggung jawabnya dipertahankan.

```text
app/
  (public)/
    i/[slug]/page.tsx                 # Render undangan yang sudah publish
  (studio)/
    templates/page.tsx                # Katalog template
    editor/[draftId]/page.tsx         # Editor utama
    preview/[draftId]/page.tsx        # Preview tanpa panel editor
  api/
    drafts/route.ts                   # Buat draft anonim
    drafts/[draftId]/route.ts         # Baca/simpan draft dengan edit token
    drafts/[draftId]/publish/route.ts # Validasi dan publish
    assets/sign/route.ts              # Signed upload URL

src/
  builder/                            # Engine, tidak bergantung pada satu template
    contracts/
      template.ts
      section.ts
      invitation.ts
    editor/
      BuilderShell.tsx
      SectionCanvas.tsx
      SectionLibrary.tsx
      ThemePicker.tsx
      inspector/
    renderer/
      InvitationRenderer.tsx
      ThemeProvider.tsx
    state/
      draft-store.ts
      undo-redo.ts
    validation/
      validate-draft.ts

  templates/                          # Semua Template Kit terisolasi
    registry.ts                        # Daftar kit yang tersedia di produk
    shared/
      sections/
        gallery/
          definition.ts
          GalleryRenderer.tsx
          GalleryEditor.tsx
          schema.ts
        map/
        rsvp/
        gift/
      fonts.ts                         # Registry font yang diizinkan

    wedding-lampung-elegance/          # Template Ayu & Ardi saat ini
      manifest.ts
      themes.ts
      assets/
        ornaments/
        icons/
        preview.jpg
      sections/
        opening-envelope/
          definition.ts
          OpeningEnvelopeRenderer.tsx
          OpeningEnvelopeEditor.tsx
          schema.ts
        hero/
        couple/
        wedding-events/
        unduh-mantu/
        closing/
      WeddingLampungRenderer.tsx

    wedding-modern-editorial/
      manifest.ts
      themes.ts
      assets/
      sections/
      WeddingModernRenderer.tsx

    birthday-confetti/
      manifest.ts
      themes.ts
      assets/
      sections/
      BirthdayRenderer.tsx

  modules/
    invitations/
      repository.ts
      service.ts
      publish-service.ts
    assets/
      upload-service.ts
      image-processing.ts
    anonymous-access/
      draft-token.ts
      recovery-code.ts

  db/
    schema.ts
    migrations/
```

### Mengapa Struktur Ini Penting

- Menambah template baru berarti menambah satu folder kit dan mendaftarkannya di `templates/registry.ts`.
- Template baru tidak perlu mengubah editor inti.
- Section template A tidak bocor ke template B.
- Theme dan font tersimpan bersama template yang membutuhkannya.
- Template dapat diuji, dikembangkan, dan dihapus secara terisolasi.

---

## Contoh: Template Ayu & Ardi sebagai Kit Pertama

Template sekarang dimigrasikan menjadi:

```text
src/templates/wedding-lampung-elegance/
  manifest.ts
  themes.ts
  sections/
    opening-envelope/
    hero/
    couple/
    wedding-events/
    unduh-mantu/
    gallery/
    quote/
    gift/
    wishes/
    closing/
```

Theme contoh:

```text
maroon-gold
  primary: maroon
  accent: gold
  display font: Dancing Script

ivory-gold
  primary: ivory
  accent: antique gold
  display font: Great Vibes

sage-gold
  primary: sage green
  accent: gold
  display font: Dancing Script
```

Pengguna template ini dapat:

- Menukar `maroon-gold` ke `ivory-gold` atau `sage-gold`.
- Menukar font dari daftar yang aman untuk template tersebut.
- Mengedit isi hero, nama mempelai, acara, galeri, peta, rekening, dan ucapan.
- Menambah/menghapus/mengurutkan section opsional yang tersedia.
- Tidak dapat menghapus section wajib atau menambahkan section milik template ulang tahun.

---

## Data Undangan yang Disimpan

Data undangan tidak menyimpan komponen React; hanya menyimpan referensi template, theme, urutan, dan isi section.

```ts
type InvitationDraft = {
  id: string;
  editTokenHash: string;
  templateId: string;
  templateVersion: number;
  themeId: string;
  status: "draft" | "published" | "archived";
  slug: string | null;
  sections: Array<{
    id: string;
    type: string;
    order: number;
    enabled: boolean;
    data: Record<string, unknown>;
  }>;
  assets: AssetReference[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
};
```

Saat editor dibuka, engine melakukan:

```text
draft.templateId
  → ambil Template Kit dari registry
  → ambil theme sesuai draft.themeId
  → validasi setiap section terhadap schema kit
  → render editor dan preview
```

---

## Alur Pengguna Tanpa Login

```text
Pilih template
  → server membuat draft anonim
  → edit token aman disimpan di cookie HttpOnly
  → pengguna edit, drag-and-drop, upload, dan ganti theme
  → autosave ke server
  → publish menjadi /i/[slug]
```

Untuk pemulihan ganti perangkat:

- Berikan URL kelola khusus atau kode pemulihan saat draft dibuat/publish.
- Simpan hanya hash token/kode di database.
- Tambahkan email/WhatsApp recovery pada fase lanjutan tanpa memaksa login.

---

## Upload Foto dan Audio

Setiap template dapat menentukan batas assetnya, misalnya:

```ts
assets: {
  gallery: { max: 8, accepted: ["image/jpeg", "image/webp"] },
  music: { max: 1, accepted: ["audio/mpeg", "audio/webm"] }
}
```

Alur upload:

```text
Editor → minta signed URL → upload ke object storage → simpan URL asset pada draft → renderer memakai asset tersebut
```

Gunakan Cloudflare R2, S3, atau Cloudinary; lakukan validasi ukuran/tipe file dan optimasi gambar.

---

## Publish dan Keamanan

Sebelum publish:

1. Pastikan template dan versinya tersedia.
2. Validasi theme milik template tersebut.
3. Pastikan section wajib aktif.
4. Validasi data section dengan schema milik kit.
5. Pastikan slug unik.
6. Pastikan asset masih tersedia.

Halaman publik hanya membaca snapshot data yang sudah berstatus `published`. Editor tidak pernah mengubah halaman publik secara langsung tanpa penyimpanan yang valid.

---

## Fase Implementasi

### Fase 1 — Engine dan Template Kit Pertama

- Pisahkan undangan Ayu & Ardi menjadi `wedding-lampung-elegance`.
- Buat kontrak template, theme, dan section.
- Buat draft anonim serta autosave.
- Buat editor teks/foto untuk section awal.
- Buat preview dan publish slug.

### Fase 2 — Builder yang Dapat Disusun

- `dnd-kit` untuk urutkan section.
- Tambah/hapus/sembunyikan section berdasarkan manifest template.
- Theme picker (warna + font) berdasarkan theme template.
- Undo/redo dan validasi editor.

### Fase 3 — Template Kedua

- Buat `wedding-modern-editorial` dengan renderer, section, palette, dan font berbeda.
- Pastikan tidak ada perubahan pada engine ketika template baru ditambahkan selain registrasi kit.

### Fase 4 — Kategori Lain

- Tambahkan `birthday-confetti`, `khitanan-ceria`, dan `aqiqah` sebagai kit terpisah.
- Tambahkan section khusus kategori masing-masing.

### Fase 5 — Operasional dan Pembayaran

- Admin template catalog.
- Rate limiting, masa aktif draft, dan cleanup asset.
- Paket gratis/premium.
- Midtrans atau Xendit dengan webhook idempotent.
- Pemulihan draft melalui email/WhatsApp opsional.

---

## Keputusan yang Diperlukan Sebelum Fase 1

1. Domain publik dan format URL: misalnya `/i/[slug]`.
2. Provider database (PostgreSQL) dan object storage (R2/S3/Cloudinary).
3. Daftar section wajib, opsional, dan terkunci untuk Template Kit pertama.
4. Daftar theme warna dan kombinasi font yang diizinkan untuk Template Kit pertama.
5. Masa hidup draft anonim dan metode recovery.
