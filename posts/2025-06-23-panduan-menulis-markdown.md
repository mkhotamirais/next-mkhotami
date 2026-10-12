---
title: "Panduan Lengkap Markdown"
date: "2025-06-23"
excerpt: "Pelajari semua sintaks dan fitur Markdown mulai dari dasar hingga lanjutan."
category: "markdown"
tags: ["id", "panduan"]
---

# Panduan Lengkap Markdown

Markdown adalah bahasa markup ringan yang digunakan untuk menulis teks dengan struktur yang bersih dan mudah dibaca. Markdown banyak digunakan di GitHub, Notion, serta cocok untuk membuat blog statis di Next.js.

## 📑 Daftar Isi

- [Dasar Penulisan](#dasar-penulisan)
- [Penataan dan Pemformatan](#penataan-dan-pemformatan)
- [Kode dan Data](#kode-dan-data)
- [Konten Interaktif dan HTML](#konten-interaktif-dan-html)
- [Fitur Tambahan Markdown](#fitur-tambahan-markdown)

## Dasar Penulisan

### Heading

```md
# h1 judul
## h2 sub-judul
###### h6 hingga h6
```
# heading1
## heading2
###### heading6

### Paragraf dan Baris Baru
Tulis paragraf langsung.

baris baru bisa dengan dua spasi di akhir baris

### Garis Horizontal
```md
---
```
---

### Blockquote
```md
> Kutipan
>> Kutipan bersarang
```
> Kutipan

>> Kutipan bersarang


## Penataan dan Pemformatan

### Penekanan
```md
**tebal1** __tebal2__ *miring1* _miring2_ **_tebal miring_** ~~coret~~ `kode inline`
```
**tebal1** __tebal2__ *miring1* _miring2_ **_tebal miring_** ~~coret~~ `kode inline`

### Daftar
```md
- List tak berurut
- List tak berurut
1. List berurut
2. List berurut
- [x] Checklist
```
- List tak berurut
- List tak berurut
1. List berurut
2. List berurut
- [x] Checklist
- [ ] Checklist kosong

### Link dan Gambar
```md
[Go to Google](https://google.com)
![Gambar Saya](/logo-mkhotami.png)
```
[Go to Google](https://google.com)
![Gambar Saya](/logo-mkhotami.png)
<!-- kecilkan gambarnya -->

## Kode dan Data

### Code Block
```js
console.log("hello, markdown!")
```
console.log("hello, markdown!")

### Tabel
```md
| Nama | Umur |
|------|------|
| Ahmad  | 24   |
| Siti | 22   |
```
| Nama | Umur |
|------|------|
| Ahmad  | 24   |
| Siti | 22   |

## Konten Interaktif dan HTML
```md
<u>Garis bawah</u>
<mark>Highlight</mark>
<small>Teks kecil</small>

<details>
  <summary>Lihat Detail</summary>
  Ini adalah konten tersembunyi.
</details>
```
<u>Garis bawah</u>
<mark>Highlight</mark>
<small>Teks kecil</small>

<details>
  <summary>Lihat Detail</summary>
  Ini adalah konten tersembunyi.
</details>

## Fitur Tambahan Markdown
### Formatter Metadata
```md
---
title: "Judul Artikel"
date: "2025-06-25"
excerpt: "Ringkasan isi artikel."
tags: ["markdown", "nextjs"]
---
```

### Daftar Isi Manual
```md
- [Judul](#judul)
- [Subjudul](#subjudul)
```