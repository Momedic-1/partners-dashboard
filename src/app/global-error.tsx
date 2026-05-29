"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: 24 }}>
        <h1>Application error</h1>
        <p style={{ color: "#475569" }}>
          {error.message || "An unexpected error occurred."}
        </p>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            marginTop: 16,
            padding: "10px 16px",
            background: "#020E7C",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Reload
        </button>
      </body>
    </html>
  );
}
