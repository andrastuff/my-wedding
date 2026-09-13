import { ImageResponse } from "next/og";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const guestName = searchParams.get("for")?.trim().slice(0, 70) || "Bapak/Ibu/Saudara/i";
  const isUnduhMantu = searchParams.get("variant") === "unduhmantu";
  const coupleName = isUnduhMantu ? "Ardi & Ayu" : "Ayu & Ardi";
  const eventLabel = isUnduhMantu ? "Undangan Pernikahan" : "The Wedding of";
  const eventDate = isUnduhMantu ? "27 · 09 · 2026" : "26 · 09 · 2026";
  const background = isUnduhMantu
    ? "linear-gradient(145deg, #24130e 0%, #4f2d20 52%, #21110d 100%)"
    : "linear-gradient(145deg, #f9f0dc 0%, #ead5a8 52%, #d5b379 100%)";
  const foreground = isUnduhMantu ? "#fff4dc" : "#4a1820";
  const muted = isUnduhMantu ? "#dfbd76" : "#76594b";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "42px",
          color: foreground,
          background,
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "column",
            padding: "52px 70px 44px",
            border: `2px solid ${isUnduhMantu ? "#c99d50" : "#b48849"}`,
            borderRadius: "28px",
            boxShadow: "inset 0 0 0 8px rgba(255,255,255,.08)",
          }}
        >
          <div style={{ display: "flex", color: muted, fontSize: "24px", letterSpacing: "10px", textTransform: "uppercase" }}>
            {eventLabel}
          </div>
          <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: "92px", lineHeight: 1, letterSpacing: "-4px" }}>{coupleName}</div>
            <div style={{ display: "flex", marginTop: "24px", color: muted, fontSize: "24px", letterSpacing: "8px" }}>{eventDate}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
            <div style={{ display: "flex", color: muted, fontSize: "20px", letterSpacing: "4px", textTransform: "uppercase" }}>Kepada Yth.</div>
            <div style={{ display: "flex", marginTop: "10px", fontSize: "43px", lineHeight: 1.1, textAlign: "center" }}>{guestName}</div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" },
    },
  );
}
