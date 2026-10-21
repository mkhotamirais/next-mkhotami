import React from "react";

export default function Ts1() {
  // Dasar
  const x: string = "ahmad";
  const y: number = 10;
  const z = "abdul"; // tipe data implisit
  // z = true // tidak bisa dilakukan karena tipe data implisit z adalah string dari "abdul"

  // Union
  let a: string | number = "siti";
  a = 20;
  const b: { id: number } & { name: string } = { id: 1, name: "a" };

  // Array, Object, Union
  const c: string[] = ["a", "b", "c"];
  const d: (string | number)[] = ["a", "b", "c", 1, 2, 3];
  const e: { id: string; name: string }[] = [
    { id: "1", name: "ahmad" },
    { id: "2", name: "abdul" },
  ];

  //   Tuple
  const f: [string, number, boolean] = ["a", 1, true];

  // Readonly & Optional
  const g: { readonly id: number; name?: string } = { id: 1, name: "intan" };
  //   g.id = 2; // tidak bisa dilakukan karena readonly
  g.name = "ayu";

  // Default value biasanya digunakan di function atau destructuring object

  //   Void & Never
  //   const fn1 = (y: string): void => {
  //     console.log(y);
  //   };
  //   fn1("hello");

  //   const fn2 = (msg: string): never => {
  //     throw new Error(msg);
  //   };
  //   fn2("hello");

  return (
    <div>
      <p>
        Penulisan dasar:
        {x} | {y} | {z}
      </p>
      <p>
        Union: {a} {b.id} | {b.name}
      </p>
      <p>
        array: {c[0]} | {d[0]} | d[4] | {e[0].name}
      </p>
      <p>
        tuple: {f[0]} | {f[1]}
      </p>
      <p>
        readonly & optional: {g.id} | {g.name}
      </p>
      <p>void & never: void untuk tidak pernah kembalikan apapun, never untuk tidak pernah terjadi</p>
      <p>
        any & unknown, any anything, minimalisir penggunaannya atau jangan digunakan, unknown alternatif aman dari any
      </p>
      <pre className="text-xs bg-slate-800 text-white px-1 overflow-y-scroll">
        {`

-- any & unknown
:any // anything, minimalisir penggunaannya
:unknown // alternatif aman dari any

-- enum
// koleksi nilai konstan
// enum initializer default 0 (enum pertama diberi nilai)
// fully initialized (semuanya diberi nilai)
enum C1 {Red, Green, Blue}
enum C2 {Red=2, Green, Blue}
enum C3 {Red="merah", Green="hijau", Blue="biru"}
:C1=C1.Red // output 0
:C2=C2.Green // output 3

-- type aliases (type) & interfaces (interface)
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

-- casting (<> / as) fungsinya sama
// proses override tipe data tanpa mengubahnya.
:unknown = 'hello';
(x as string).length // output 5;
(<string>x).length // output 5
(x as number).length // output tidak bisa;
(5 as string).length // output tidak bisa;
      `}
      </pre>
    </div>
  );
}
