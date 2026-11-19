import type { ReactNode } from "react";

/** Shared centered card used by the small auth pages (check email, reset password, errors). */
export default function AuthCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-card text-card-foreground rounded-2xl shadow-xl p-8 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center">{title}</h1>
        {children}
      </div>
    </div>
  );
}

export const primaryButtonClass =
  "bg-[#AF80FF] rounded-md px-4 py-2 text-white text-center hover:bg-[#6a5dd5] transition-colors disabled:opacity-60";
export const secondaryButtonClass =
  "border border-foreground/20 rounded-md px-4 py-2 text-center hover:bg-foreground/5 transition-colors disabled:opacity-60";
export const inputClass =
  "rounded-md px-4 py-2 bg-background border-foreground border-2 focus:outline-none focus:ring-2 focus:ring-[#7B6EF6] focus:border-transparent transition-all";
