import React from "react";
import Ts1 from "./Ts1";
import Ts2 from "./Ts2";
import Ts3 from "./Ts3";

export default function TypescriptPage() {
  return (
    <div>
      <p>Persyaratan dan langkah awal</p>
      <ul>
        <li>nodejs dan typescript, nodejs.org npm i -g typescript, node -v; npm -v; npx -v; tsx -v</li>
        <li>buka code editor, buat folder bebas di mana saja, lalu buat file, contoh index.ts, isi apa saja</li>
        <li>jalankan termilan, ketik `tsc index.ts`, maka akan terbentuk file index.js hasil kompilasi index.ts</li>
        <li>buat lagi yang baru dengan tsconfig.json, dengan cara ketik `tsc init` di terminal</li>
        <li>
          Setiap nilai memiliki tipe data tertentu, jika tipe suatu variabel telah ditentukan maka nilainya tidak bisa
          diubah dengan nilai yang memiliki tipe data lain.
        </li>
        <li>tipe data: Tipe Data: string | number | boolean | array | null | undefined | object | function</li>
      </ul>
      <Ts1 />
      <Ts2 />
      <Ts3 />
    </div>
  );
}
