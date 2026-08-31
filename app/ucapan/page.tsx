import Link from "next/link";
import { ArrowLeft, CalendarHeart, MessageCircleHeart, UsersRound } from "lucide-react";
import { readWishes } from "@/lib/wishes-store";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Jakarta",
});

export default async function WishesPage() {
  const wishes = await readWishes();
  const attending = wishes.filter((wish) => wish.attendance === "Hadir").length;

  return (
    <main className={styles.page}>
      <div className={styles.ornament} aria-hidden="true" />
      <section className={styles.container}>
        <Link className={styles.back} href="/#wishes"><ArrowLeft size={16} /> Kembali ke undangan</Link>

        <header className={styles.header}>
          <span><MessageCircleHeart size={18} /> Buku Tamu Digital</span>
          <h1>Ucapan & Kehadiran</h1>
          <p>Doa dan pesan hangat untuk Ayuu & Ardi.</p>
        </header>

        <div className={styles.summary}>
          <div><MessageCircleHeart size={19} /><strong>{wishes.length}</strong><span>Total ucapan</span></div>
          <div><UsersRound size={19} /><strong>{attending}</strong><span>Akan hadir</span></div>
        </div>

        <div className={styles.list}>
          {wishes.length === 0 ? (
            <div className={styles.empty}>
              <CalendarHeart size={30} />
              <p>Belum ada ucapan yang tersimpan.</p>
            </div>
          ) : wishes.map((wish) => (
            <article className={styles.card} key={wish.id}>
              <div className={styles.cardTop}>
                <div className={styles.avatar}>{wish.name.charAt(0).toUpperCase()}</div>
                <div><h2>{wish.name}</h2><time>{dateFormatter.format(new Date(wish.createdAt))} WIB</time></div>
                <span>{wish.attendance}</span>
              </div>
              <p>{wish.message}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
