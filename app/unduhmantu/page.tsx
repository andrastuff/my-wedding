"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { CalendarDays, ChevronDown, Heart, MailOpen, MapPin, Sparkles, UsersRound } from "lucide-react";
import { Suspense, useState } from "react";
import { wedding } from "@/lib/wedding-data";
import styles from "./page.module.css";

function formatGuestName(value: string) {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("id-ID")
    .replace(/(^|[\s/'-])\p{L}/gu, (letter) => letter.toLocaleUpperCase("id-ID"));
}

function OpeningCover({ guestName, onOpen }: { guestName: string; onOpen: () => void }) {
  return (
    <section className={styles.cover} aria-label="Pembuka undangan Unduh Mantu">
      <div className={styles.coverPortrait}>
        <Image
          className={styles.coverPhoto}
          src={wedding.unduhMantu.parentPortrait}
          alt={`${wedding.unduhMantu.hosts.father} dan ${wedding.unduhMantu.hosts.mother}`}
          fill
          priority
          sizes="(max-width: 680px) 76vw, 420px"
        />
      </div>
      <div className={styles.coverShade} />
      <div className={styles.batikWash} aria-hidden="true" />
      <Image
        className={`${styles.coverOrnament} ${styles.coverOrnamentRight}`}
        src="/assets/javanese-gunungan.svg"
        alt=""
        width={240}
        height={360}
        aria-hidden="true"
      />
      <Image
        className={`${styles.coverOrnament} ${styles.coverOrnamentLeft}`}
        src="/assets/javanese-gunungan.svg"
        alt=""
        width={240}
        height={360}
        aria-hidden="true"
      />
      <div className={styles.coverFrame} aria-hidden="true"><i /><i /><i /><i /></div>

      <div className={styles.coverTop}>
        <span className={styles.javaneseLabel}>Ngunduh Mantu</span>
        <p>Undangan Pernikahan</p>
        <strong className={styles.coverFamily}>Keluarga Agus Hartoyo & Sri Suwarni</strong>
      </div>

      <div className={styles.coverNames}>
        <span>Putra-putri kami</span>
        <h1>{wedding.groom.shortName} <i>&</i> {wedding.bride.shortName}</h1>
        <p>27 · 09 · 2026</p>
      </div>

      <div className={styles.coverInvitation}>
        <small>Kepada Yth.</small>
        <strong>{guestName}</strong>
        <button type="button" onClick={onOpen}>
          <MailOpen size={17} /> Buka Undangan
        </button>
      </div>
    </section>
  );
}

function UnduhMantuContent({ guestName }: { guestName: string }) {
  const hosts = wedding.unduhMantu.hosts;

  return (
    <main className={styles.invitation}>
      <section className={styles.hero}>
        <Image
          src="/assets/my/DSC_0838%20(1).jpg.jpeg"
          alt="Ayu dan Ardi mengenakan busana adat Jawa"
          fill
          priority
          sizes="(max-width: 720px) 100vw, 680px"
        />
        <div className={styles.heroShade} />
        <div className={styles.heroContent}>
          <p>Unduh Mantu</p>
          <h1>{wedding.groom.shortName} <i>&</i> {wedding.bride.shortName}</h1>
          <span>{wedding.unduhMantu.displayDate}</span>
          <div className={styles.heroGuest}>
            <small>Kepada Yth.</small>
            <strong>{guestName}</strong>
          </div>
          <a href="#pangestu" aria-label="Lihat isi undangan"><ChevronDown size={22} /></a>
        </div>
      </section>

      <section className={`${styles.paperSection} ${styles.welcome}`} id="pangestu">
        <div className={styles.ornament}><span>ꦥ</span></div>
        <p className={styles.kicker}>Nyuwun Pangestu</p>
        <h2>Dengan penuh rasa syukur</h2>
        <p className={styles.greeting}>Assalamu&apos;alaikum Warahmatullahi Wabarakatuh</p>
        <p className={styles.copy}>
          Dengan memohon rahmat dan rida Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i
          untuk menghadiri acara Unduh Mantu dalam rangka pernikahan putra-putri kami.
        </p>

        <figure className={styles.parentPortrait}>
          <Image
            src={wedding.unduhMantu.parentPortrait}
            alt={`${hosts.father} dan ${hosts.mother}`}
            fill
            sizes="(max-width: 720px) 78vw, 430px"
          />
        </figure>
        <div className={styles.hostNames}>
          <small>Yang mengundang</small>
          <h3>{hosts.father}</h3>
          <span>&</span>
          <h3>{hosts.mother}</h3>
        </div>
      </section>

      <section className={styles.coupleSection}>
        <div className={styles.sectionHeading}>
          <Sparkles size={16} />
          <p>Putra-putri Kami</p>
          <h2>Tumbuh dalam kasih,<br />bersatu dalam janji</h2>
        </div>
        <div className={styles.coupleCard}>
          <div>
            <small>Putra pertama</small>
            <h3>{wedding.groom.fullName}</h3>
            <p>dari {hosts.father} & {hosts.mother}</p>
          </div>
          <Heart size={24} fill="currentColor" />
          <div>
            <small>Putri kedua</small>
            <h3>{wedding.bride.fullName}</h3>
            <p>dari {wedding.bride.parents}</p>
          </div>
        </div>
      </section>

      <section className={`${styles.paperSection} ${styles.eventSection}`}>
        <p className={styles.kicker}>Wanci Ingkang Sampun Pinilih</p>
        <h2>Acara Unduh Mantu</h2>
        <p className={styles.eventLead}>Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.</p>

        <div className={styles.dateCard}>
          <span>Minggu</span>
          <strong>27</strong>
          <span>September 2026</span>
        </div>

        <div className={styles.locationCard}>
          <div><CalendarDays size={20} /></div>
          <small>Tempat Acara</small>
          <p>{wedding.unduhMantu.address}</p>
          <a href={wedding.unduhMantu.mapUrl} target="_blank" rel="noreferrer">
            <MapPin size={17} /> Buka Google Maps
          </a>
        </div>
      </section>

      <section className={styles.philosophy}>
        <Image src="/assets/my/DSC_0872%20(1).jpg.jpeg" alt="Ayu dan Ardi dalam busana Jawa" fill sizes="(max-width: 720px) 100vw, 680px" />
        <div className={styles.philosophyShade} />
        <blockquote>
          <span>ꦩꦼꦩꦪꦸ</span>
          “Memayu hayuning bebrayan”
          <small>Merawat keindahan hidup bersama dengan kasih, hormat, dan kesetiaan.</small>
        </blockquote>
      </section>

      <section className={`${styles.paperSection} ${styles.gallerySection}`}>
        <p className={styles.kicker}>Crita Katresnan</p>
        <h2>Sepenggal Kisah Kami</h2>
        <div className={styles.gallery}>
          {[
            "/assets/my/DSC_0889%20(1).jpg.jpeg",
            "/assets/my/DSC_0838%20(1).jpg.jpeg",
            "/assets/my/DSC_0872%20(1).jpg.jpeg",
          ].map((photo, index) => (
            <figure key={photo} className={index === 1 ? styles.galleryTall : undefined}>
              <Image src={photo} alt={`Foto Ayu dan Ardi ${index + 1}`} fill sizes="(max-width: 720px) 45vw, 300px" />
            </figure>
          ))}
        </div>
      </section>

      <footer className={styles.closing}>
        <div className={styles.closingIcon}><UsersRound size={22} /></div>
        <p>Atas kehadiran dan doa restu Bapak/Ibu/Saudara/i, kami mengucapkan terima kasih.</p>
        <span>Wassalamu&apos;alaikum Warahmatullahi Wabarakatuh</span>
        <small>Hormat kami</small>
        <h2>Keluarga Besar<br />{hosts.father} & {hosts.mother}</h2>
        <div className={styles.closingNames}>{wedding.groom.shortName} <i>&</i> {wedding.bride.shortName}</div>
      </footer>
    </main>
  );
}

function UnduhMantuPageContent() {
  const searchParams = useSearchParams();
  const requestedGuest = searchParams.get("for")?.slice(0, 70) ?? "";
  const guestName = formatGuestName(requestedGuest) || "Bapak/Ibu/Saudara/i";
  const [opened, setOpened] = useState(false);

  return (
    <div className={styles.page}>
      {!opened && <OpeningCover guestName={guestName} onOpen={() => setOpened(true)} />}
      <div className={opened ? styles.contentVisible : styles.contentHidden}>
        <UnduhMantuContent guestName={guestName} />
      </div>
    </div>
  );
}

export default function UnduhMantuPage() {
  return (
    <Suspense fallback={<div className={styles.loading}>Menyiapkan undangan…</div>}>
      <UnduhMantuPageContent />
    </Suspense>
  );
}
