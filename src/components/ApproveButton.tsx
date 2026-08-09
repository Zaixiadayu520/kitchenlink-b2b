"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ApproveButton({ applicationId, label }: { applicationId: string; label: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <button
      type="button"
      className="btn btn-primary !py-2 text-sm"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await fetch("/api/admin/approve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ applicationId }),
        });
        setLoading(false);
        router.refresh();
      }}
    >
      {label}
    </button>
  );
}
