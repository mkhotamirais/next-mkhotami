import React from "react";
import ApplyMultiInput from "./ApplyMultiInput";
import { ApplyCodeblockCopy } from "./ApplyCodeblockCopy";
import ApplyMultiSelect from "./ApplyMultiSelect";
import Link from "next/link";

export default function FormInputs() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="h2">Multi Input</h2>
        <ApplyMultiInput />
      </div>
      <div>
        <h2 className="h2">Codeblock Copy</h2>
        <ApplyCodeblockCopy />
      </div>
      <div>
        <h2 className="h2">Multi Select</h2>
        <ApplyMultiSelect />
      </div>
      <div>
        <h2 className="h2">Pagination</h2>
        <Link href="/public-api/dummyjson" className="text-link">
          Lihat Dummyjson
        </Link>
      </div>
    </div>
  );
}
