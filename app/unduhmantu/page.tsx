"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, Copy, Gift, Heart, LoaderCircle, MailOpen, MapPin, Sparkles, UsersRound, Volume2, VolumeX, X } from "lucide-react";
import { Suspense, useEffect, useRef, useState } from "react";
import { wedding } from "@/lib/wedding-data";
import styles from "./page.module.css";

const unduhMantuGallery = [
  { src: "/assets/my/DSC_0889%20(1).jpg.jpeg", alt: "Ayu dan Ardi dalam busana Jawa 1" },
  { src: "/assets/my/DSC_0838%20(1).jpg.jpeg", alt: "Ayu dan Ardi dalam busana Jawa 2" },
  { src: "/assets/my/DSC_0872%20(1).jpg.jpeg", alt: "Ayu dan Ardi dalam busana Jawa 3" },
  { src: "/assets/my/DSC_0701%20(1).jpg.jpeg", alt: "Ayu dan Ardi dalam busana adat Lampung 1" },
  { src: "/assets/my/DSC_0680%20(2).jpg.jpeg", alt: "Ayu dan Ardi dalam busana adat Lampung 2" },
];

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
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [lightboxLoaded, setLightboxLoaded] = useState(false);

  useEffect(() => {
    if (activePhotoIndex === null) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActivePhotoIndex(null);
      if (event.key === "ArrowLeft") {
        setLightboxLoaded(false);
        setActivePhotoIndex((current) => current === null ? null : (current - 1 + unduhMantuGallery.length) % unduhMantuGallery.length);
      }
      if (event.key === "ArrowRight") {
        setLightboxLoaded(false);
        setActivePhotoIndex((current) => current === null ? null : (current + 1) % unduhMantuGallery.length);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhotoIndex]);

  function openPhoto(index: number) {
    setLightboxLoaded(false);
    setActivePhotoIndex(index);
  }

  function movePhoto(direction: number) {
    setLightboxLoaded(false);
    setActivePhotoIndex((current) => current === null ? 0 : (current + direction + unduhMantuGallery.length) % unduhMantuGallery.length);
  }

  async function copyAccountNumber(accountNumber: string) {
    await navigator.clipboard.writeText(accountNumber.replace(/\s/g, ""));
    setCopiedAccount(accountNumber);
    window.setTimeout(() => setCopiedAccount(null), 1800);
  }

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
          {unduhMantuGallery.map((photo, index) => (
            <button
              type="button"
              key={photo.src}
              className={index === 1 ? styles.galleryTall : undefined}
              onClick={() => openPhoto(index)}
              aria-label={`Buka ${photo.alt}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 720px) 45vw, 300px"
              />
            </button>
          ))}
        </div>
      </section>

      {activePhotoIndex !== null && (
        <div className={styles.lightbox} role="dialog" aria-modal="true" aria-label="Galeri foto">
          <button className={styles.lightboxClose} type="button" onClick={() => setActivePhotoIndex(null)} aria-label="Tutup galeri">
            <X size={22} />
          </button>
          <button
            className={`${styles.lightboxNav} ${styles.lightboxPrevious}`}
            type="button"
            onClick={() => movePhoto(-1)}
            aria-label="Foto sebelumnya"
          >
            <ChevronLeft size={25} />
          </button>
          <figure>
            <div className={`${styles.lightboxLoader} ${lightboxLoaded ? styles.lightboxLoaderHidden : ""}`} role="status">
              <LoaderCircle size={28} />
              <span>Memuat foto…</span>
            </div>
            <Image
              className={`${styles.lightboxImage} ${lightboxLoaded ? styles.lightboxImageLoaded : ""}`}
              src={unduhMantuGallery[activePhotoIndex].src}
              alt={unduhMantuGallery[activePhotoIndex].alt}
              fill
              priority
              sizes="95vw"
              onLoad={() => setLightboxLoaded(true)}
              onError={() => setLightboxLoaded(true)}
            />
          </figure>
          <button
            className={`${styles.lightboxNav} ${styles.lightboxNext}`}
            type="button"
            onClick={() => movePhoto(1)}
            aria-label="Foto berikutnya"
          >
            <ChevronRight size={25} />
          </button>
          <span className={styles.lightboxCount}>{activePhotoIndex + 1} / {unduhMantuGallery.length}</span>
        </div>
      )}

      {wedding.giftAccounts.length > 0 && (
        <>
          <div className={styles.giftDivider} aria-hidden="true">
              <Image src="/assets/javanese-section-transition.svg" alt="" width={680} height={70} unoptimized />
          </div>
          <section className={styles.giftSection}>
            <div className={styles.giftIcon}><Gift size={21} /></div>
            <p className={styles.kicker}>Tanda Kasih</p>
            <h2>Wedding Gift</h2>
            <p className={styles.giftLead}>
              Doa restu Anda merupakan hadiah terindah bagi kami. Namun apabila hendak memberikan tanda kasih,
              dapat disampaikan melalui rekening berikut.
            </p>
            <div className={styles.bankCards}>
              {wedding.giftAccounts.map((account) => (
                <div className={styles.bankCard} key={account.number}>
                  <div className={styles.bankCardTop}>
                    <span>{account.bank}</span>
                    <i aria-hidden="true">A&A</i>
                  </div>
                  <strong>{account.number}</strong>
                  <small>{account.holder}</small>
                  <button type="button" onClick={() => copyAccountNumber(account.number)}>
                    {copiedAccount === account.number ? <Check size={16} /> : <Copy size={16} />}
                    {copiedAccount === account.number ? "Nomor tersalin" : "Salin nomor rekening"}
                  </button>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

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
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  function openInvitation() {
    setOpened(true);
    if (!audioRef.current) return;
    audioRef.current.volume = .6;
    void audioRef.current.play().then(() => setMusicPlaying(true)).catch(() => setMusicPlaying(false));
  }

  function toggleMusic() {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      void audioRef.current.play().then(() => setMusicPlaying(true)).catch(() => setMusicPlaying(false));
      return;
    }
    audioRef.current.pause();
    setMusicPlaying(false);
  }

  return (
    <div className={styles.page}>
      <audio ref={audioRef} src="/assets/audio/Banda-Neira-Sampai-Jadi-Debu.mp3" loop preload="auto" />
      {!opened && <OpeningCover guestName={guestName} onOpen={openInvitation} />}
      <div className={opened ? styles.contentVisible : styles.contentHidden}>
        <UnduhMantuContent guestName={guestName} />
      </div>
      {opened && (
        <button
          className={styles.musicControl}
          type="button"
          onClick={toggleMusic}
          aria-label={musicPlaying ? "Matikan musik" : "Putar musik"}
        >
          {musicPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
          <span>{musicPlaying ? "Musik" : "Putar"}</span>
        </button>
      )}
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
