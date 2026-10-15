import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container">
      <div className="max-w-md mx-auto my-16 bg-background p-4 sm:p-8 rounded-xl">{children}</div>
    </div>
  );
}
