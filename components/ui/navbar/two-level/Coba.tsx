"use client";

import React, { useRef } from "react";
import { Button } from "../../button";

export default function Coba() {
  const panelRef = useRef<HTMLDivElement>(null);

  const measure = () => {};
  return (
    <div className="fixed top-0 right-0">
      <Button>Trigger</Button>
    </div>
  );
}
