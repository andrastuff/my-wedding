"use client";

import { Check, Copy, Heart, Link2, MessageCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { wedding } from "@/lib/wedding-data";
import styles from "./page.module.css";

type MessageStyle = "muslim" | "general";

function formatGuestName(value: string) {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("id-ID")
    .replace(/(^|[\s/'-])\p{L}/gu, (letter) => letter.toLocaleUpperCase("id-ID"));
}

export default function GenerateInvitationPage() {
  const [name, setName] = useState("");
  const [messageStyle, setMessageStyle] = useState<MessageStyle>("muslim");
  const [copied, setCopied] = useState(false);
  const guestName = formatGuestName(name);

  const invitationUrl = useMemo(() => {
    if (!guestName || typeof window === "undefined") return "";
    const url = new URL("/", window.location.origin);
    url.searchParams.set("for", guestName);
    return url.toString();
  }, [guestName]);

  const whatsappMessage = useMemo(() => {
    if (!invitationUrl) return "";

    const coupleName = `${wedding.bride.shortName} & ${wedding.groom.shortName}`;
    const eventDetails = `*${coupleName}*\n\nYang akan dilaksanakan pada:\n🗓️ ${wedding.displayDate}\n⏰ Akad Nikah: ${wedding.akad}\n⏰ Resepsi: ${wedding.reception}\n📍 ${wedding.address}\n\nInformasi lengkap acara kami:\n${invitationUrl}\n\nMohon berkenan mengisi ucapan dan konfirmasi kehadiran. Terima kasih.`;

    if (messageStyle === "general") {
      return `Dengan penuh sukacita,\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i *${guestName}* untuk hadir dan memberikan doa restu pada acara pernikahan kami:\n\n${eventDetails}\n\nHormat kami,\n*${coupleName.toLocaleUpperCase("id-ID")}*`;
    }

    return `Assalamu'alaikum Wr. Wb.\nBismillahirrahmanirrahim.\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i *${guestName}* untuk hadir dan memberikan doa restu pada acara pernikahan kami:\n\n${eventDetails}\n\nWassalamu'alaikum Wr. Wb.\n\nHormat kami,\n*${coupleName.toLocaleUpperCase("id-ID")}*`;
  }, [guestName, invitationUrl, messageStyle]);

  async function copyInvitationUrl() {
    if (!whatsappMessage) return;
    await navigator.clipboard.writeText(whatsappMessage);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function shareToWhatsApp() {
    if (!whatsappMessage) return;
    window.open(`https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <main className={styles.page}>
      <div className={styles.pattern} aria-hidden="true" />
      <section className={styles.card}>
        <div className={styles.icon}><Heart size={21} fill="currentColor" /></div>
        <p className={styles.eyebrow}>Wedding Invitation</p>
        <h1>Buat Undangan Tamu</h1>
        <p className={styles.intro}>Masukkan nama penerima untuk membuat tautan undangan yang personal.</p>

        <label className={styles.label} htmlFor="guest-name">Nama tamu</label>
        <input
          id="guest-name"
          className={styles.input}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Contoh: Budi Santoso"
          autoComplete="name"
        />

        <fieldset className={styles.messageStyle}>
          <legend>Jenis pesan</legend>
          <div className={styles.styleOptions}>
            <button
              className={messageStyle === "muslim" ? styles.styleActive : styles.styleOption}
              type="button"
              aria-pressed={messageStyle === "muslim"}
              onClick={() => setMessageStyle("muslim")}
            >
              Muslim
            </button>
            <button
              className={messageStyle === "general" ? styles.styleActive : styles.styleOption}
              type="button"
              aria-pressed={messageStyle === "general"}
              onClick={() => setMessageStyle("general")}
            >
              Non-Muslim
            </button>
          </div>
        </fieldset>

        {guestName ? (
          <div className={styles.result}>
            <span className={styles.resultLabel}><Link2 size={15} /> Pesan untuk {guestName}</span>
            <output className={styles.message}>{whatsappMessage}</output>
            <div className={styles.actions}>
              <button className={styles.copy} type="button" onClick={copyInvitationUrl}>
                {copied ? <Check size={17} /> : <Copy size={17} />}
                {copied ? "Pesan tersalin" : "Salin pesan"}
              </button>
              <button className={styles.whatsapp} type="button" onClick={shareToWhatsApp}>
                <MessageCircle size={17} /> Bagikan ke WhatsApp
              </button>
            </div>
          </div>
        ) : (
          <p className={styles.hint}>Tautan undangan akan muncul setelah nama diisi.</p>
        )}
      </section>
    </main>
  );
}
