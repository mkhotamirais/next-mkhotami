"use client";

import { useState, type ReactNode } from "react";

function Dropdown({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <button onClick={onToggle} aria-expanded={open} className="rounded border px-3 py-1">
        {label}
      </button>
      {open && <div className="absolute left-0 top-full mt-1 w-40 rounded-lg border bg-popover p-1">{children}</div>}
    </div>
  );
}

export default function DropdownMultiple() {
  const [openId, setOpenId] = useState<string | null>(null);
  const toggle = (id: string) => setOpenId((current) => (current === id ? null : id));

  return (
    <div className="flex gap-3 p-10">
      <Dropdown label="Produk" open={openId === "produk"} onToggle={() => toggle("produk")}>
        Item A
      </Dropdown>
      <Dropdown label="Layanan" open={openId === "layanan"} onToggle={() => toggle("layanan")}>
        Item B
      </Dropdown>
      <Dropdown label="Bantuan" open={openId === "bantuan"} onToggle={() => toggle("bantuan")}>
        Item C
      </Dropdown>
    </div>
  );
}
