import { ArrowLeft, FileQuestion, ShieldX } from "lucide-react";

export function AccessStatePage({ variant, onBack }: { variant: "access-denied" | "not-found"; onBack: () => void }) {
  const denied = variant === "access-denied";
  const Icon = denied ? ShieldX : FileQuestion;

  return (
    <div className="flex flex-1 items-center justify-center bg-white px-6">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded" style={{ backgroundColor: denied ? "#fef2f2" : "#f1f5f9", color: denied ? "#b91c1c" : "#475569" }}>
          <Icon size={24} />
        </div>
        <h2 className="text-[18px] font-semibold" style={{ color: "#1a2234" }}>{denied ? "Access Denied" : "Not Found"}</h2>
        <p className="mt-2 text-[12px] leading-5" style={{ color: "#697285" }}>
          {denied
            ? "You do not have permission to access this record or project context."
            : "The requested record is unavailable or no longer exists."}
        </p>
        <button onClick={onBack} className="mx-auto mt-5 flex items-center gap-1.5 rounded px-3 py-2 text-[11px] font-semibold" style={{ color: "#1d3f73", backgroundColor: "#edf2fb", border: "1px solid #bdd0ea" }}>
          <ArrowLeft size={13} /> Back to Backlog
        </button>
      </div>
    </div>
  );
}
