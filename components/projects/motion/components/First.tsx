"use client";

import { Button } from "@/components/ui/button";
import * as motion from "motion/react-client";
import { useState } from "react";

const boxCss = "border size-16 bg-pink-600 rounded-xl";

export default function First() {
  const [trigger, setTrigger] = useState(0);
  return (
    <div>
      <h1>Animate</h1>
      <p>motion unlock: animate, whileHove, exit etc</p>
      <ul key={trigger} className="flex items-start flex-wrap gap-2 [&>li]:border [&>li]:p-2">
        <li>
          First animation
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1 }} className={boxCss} />
        </li>
        <li>
          Enter animation
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 } }}
            className={boxCss}
          />
        </li>
        <li>
          Disable initial
          <motion.div initial={false} animate={{ scale: 1 }} className={boxCss} />
        </li>
        <li>
          Hover & tap animation
          <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }} className={boxCss} />
        </li>
        <li className="h-48">Scroll animation</li>
      </ul>
      <Button onClick={() => setTrigger(trigger + 1)}>Trigger: {trigger}</Button>
    </div>
  );
}
