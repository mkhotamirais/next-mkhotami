"use client";

import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { FaCaretRight, FaPause, FaRotateLeft } from "react-icons/fa6";

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [start, setStart] = useState(false);
  const intervalRef = useRef<number | undefined>(undefined);

  const toggleStart = () => {
    if (start) {
      // Stopping: clear directly, right where the user asked to stop.
      if (intervalRef.current !== undefined) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
      setStart(false);
    } else {
      // Starting: kick off the interval directly in response to the click.
      intervalRef.current = window.setInterval(() => {
        setTime((prev) => prev + 1);
      }, 10);
      setStart(true);
    }
  };

  const handleReset = () => setTime(0);

  const formatTime = (time: number) => {
    const miliseconds = `0${time}`.slice(-2);
    const seconds = `0${Math.floor((time / 100) % 60)}`.slice(-2);
    const minutes = `0${Math.floor((time / 100 / 60) % 60)}`.slice(-2);
    return `${minutes}:${seconds}:${miliseconds}`;
  };

  const formattedTime = formatTime(time);

  return (
    <section className="">
      <h2 className="h2">Stopwatch</h2>
      <div className="border flex flex-col gap-3 rounded-xl p-5">
        <div className="text-6xl">{formattedTime}</div>
        <div className="rounded flex gap-1 justify-center">
          <Button disabled={start} onClick={handleReset} className="text-xl">
            <FaRotateLeft />
          </Button>
          <Button className="text-4xl" onClick={toggleStart}>
            {start ? <FaPause /> : <FaCaretRight />}
          </Button>
        </div>
      </div>
    </section>
  );
}
