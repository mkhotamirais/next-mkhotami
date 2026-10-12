---
title: "Typescript 1"
date: "2026-07-12"
category: "coding"
tags: ["templae", "en"]
excerpt: "Ini adalah post pertama saya di blog portfolio."
---

# Typescript 1
- Syaratya terinstall nodejs [nodejs.org](https://nodejs.org/en), lalu cek dengan `node -v`, `npm -v`, `npx -v`, dan terinstall typescrypt dengan `npm i -g typescript` lalu cek `tsx -v`.
- buat folder bebas di mana saja lalu buat file, contoh index.ts.
- isi apa saja lalu jalankan terminal `tsc index.ts` maka akan terbentuk file index.js hasil kompilasi index.ts.
- selanjutnya coba buat yang baru dengan tsconfig.json.
- caranya buat folder, buka di terminal, jalankan `tsc --init` akan terbentuk tsconfig.json yang berisi banyak kofigurasi.
- Setiap nilai memiliki tipe data tertentu, jika tipe suatu variabel telah ditentukan maka nilainya tidak bisa diubah dengan nilai yang memiliki tipe data lain.

## penulisan dasar
```
let x;
x = 'john';
x = 10;
valid dalam js, tidak vali dalam ts, karena x tipe datanya tak jelas: any
```

```
let x: string = 'a'
x: number;
x = 1
untuk persingkat, deklarasi tidak ditulis, pelajarinya tidak perlu berurutan.
```

## Tipe data dan tools (: = let x:)
Tipe Data: string | number | boolean | array | null | undefined | object | function

### 1. union (|) and intersection (&)
string | number = 'a' | 1
:{id: number} & {name: string} = {id: 1 name: "a"}

### 2. array array of - string, number, obj, union, tuple
- :string[] = ['a', 'b', 'c', '..'] - string
- :number[] = [1, 2, 3, ..] - number
- :{id:number, name:string}[] - obj
- :[{id: 1, name: "john"}, {id:2, name: "doe"}] - obj
- :(number|string)[] = [1, "a", "b", 2, 3] - union
- :[string, number, boolean]=['a', 1, true] - tuple

### 3. object
- :{id: number, name:string}: {id: 1, name: "a"}
- readonly & optional (?) & default value
- :{readonly id: number, name?:string = 'john'}: {id:1}
- obj.id = 1 // tidak bisa karna readonly
- obj.name; // tanpa diisi, otomatis terisi 'john'

### 4. function (let fn)
let fn = (y:string):void => {console.log(y)}
let fn = (msg): never => {throw new Error(msg)}
// :void artinya tidak mengembalikan apapun
// :never artika tidak pernah terjadi

### 5. any & unknown
:any // anything, minimalisir penggunaannya
:unknown // alternatif aman dari any

### 6. enum
// koleksi nilai konstan
// enum initializer default 0 (enum pertama diberi nilai)
// fully initialized (semuanya diberi nilai)
enum C1 {Red, Green, Blue}
enum C2 {Red=2, Green, Blue}
enum C3 {Red="merah", Green="hijau", Blue="biru"}
:C1=C1.Red // output 0
:C2=C2.Green // output 3

### 7. type aliases (type) & interfaces (interface)
// keduanya digunakan untuk menyimpan tipe
// type bisa untuk semua tipe
// interface hanya bisa untuk tipe objek
type tName = string;
let x:tName = 'ahmad';
interface Id {id: number}
interface IdName extends Id {name: string}
interface IdAge extends Id {age: number}
:IdName = {id: 1, name: "john"}
:idAge = {id: 1, age: 10}

### 8. casting (<> / as) fungsinya sama
// proses override tipe data tanpa mengubahnya.
:unknown = 'hello';
(x as string).length // output 5;
(<string>x).length // output 5
(x as number).length // output tidak bisa;
(5 as string).length // output tidak bisa;