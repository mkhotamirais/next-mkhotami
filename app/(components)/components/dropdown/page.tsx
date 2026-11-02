import React from "react";
import DropdownPanel from "./DropdownPanel";
import DropdownWithState from "./DropdownWithState";
import DropdownMultiple from "./DropdownMultiple";
import DropdownScreenDetection from "./DropdownScreenDetection";

export default function Dropdown() {
  return (
    <div>
      <div>halo</div>
      <DropdownPanel />
      <DropdownWithState />
      <DropdownMultiple />
      <DropdownScreenDetection />
    </div>
  );
}
