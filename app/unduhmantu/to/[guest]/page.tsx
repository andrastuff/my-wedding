import type { Metadata } from "next";
import { headers } from "next/headers";
import UnduhMantuPage from "@/app/unduhmantu/page";

type GuestPageProps = {
  params: Promise<{ guest: string }>;
};

function decodeGuestName(value: string) {
  try {
    return decodeURIComponent(value).replaceAll("+", " ");
  } catch {
    return value.replaceAll("+", " ");
  }
}

async function getRequestOrigin() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${protocol}://${host}`;
}

export async function generateMetadata({ params }: GuestPageProps): Promise<Metadata> {
  const { guest } = await params;
  const guestName = decodeGuestName(guest).slice(0, 70);
  const origin = await getRequestOrigin();
  const imageUrl = new URL("/api/og", origin);
  imageUrl.searchParams.set("for", guestName);
  imageUrl.searchParams.set("variant", "unduhmantu");

  return {
    title: `Undangan Pernikahan Ardi & Ayu untuk ${guestName}`,
    description: "Minggu, 27 September 2026",
    openGraph: {
      title: "Undangan Pernikahan Ardi & Ayu",
      description: `Kepada Yth. ${guestName}`,
      type: "website",
      images: [{ url: imageUrl.toString(), width: 1200, height: 630, alt: `Undangan untuk ${guestName}` }],
    },
  };
}

export default async function GuestUnduhMantuPage({ params }: GuestPageProps) {
  const { guest } = await params;
  return <UnduhMantuPage initialGuestName={decodeGuestName(guest)} />;
}
