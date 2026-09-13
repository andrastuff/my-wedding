import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unduh Mantu Ayu & Ardi",
  description: "Undangan Unduh Mantu Ayu dan Ardi — 27 September 2026",
  openGraph: {
    title: "Unduh Mantu Ayu & Ardi",
    description: "Minggu, 27 September 2026",
    images: ["/assets/my/DSC_0838%20(1).jpg.jpeg"],
  },
};

export default function UnduhMantuLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
