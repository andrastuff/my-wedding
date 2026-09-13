import type { Metadata } from "next";
import { headers } from "next/headers";
import WeddingPage from "@/app/page";

type GuestPageProps = {
  params: Promise<{ guest: string }>;
};

async function getRequestOrigin() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${protocol}://${host}`;
}

export async function generateMetadata({ params }: GuestPageProps): Promise<Metadata> {
  const { guest } = await params;
  const guestName = guest.slice(0, 70);
  const origin = await getRequestOrigin();
  const imageUrl = new URL("/api/og", origin);
  imageUrl.searchParams.set("for", guestName);

  return {
    title: `Undangan Pernikahan Ayu & Ardi untuk ${guestName}`,
    description: "Sabtu, 26 September 2026",
    openGraph: {
      title: "The Wedding of Ayu & Ardi",
      description: `Kepada Yth. ${guestName}`,
      type: "website",
      images: [{ url: imageUrl.toString(), width: 1200, height: 630, alt: `Undangan untuk ${guestName}` }],
    },
  };
}

export default async function GuestInvitationPage({ params }: GuestPageProps) {
  const { guest } = await params;
  return <WeddingPage initialGuestName={guest} />;
}
