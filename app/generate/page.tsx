"use client";

import { Check, Copy, Heart, Link2, MessageCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { wedding } from "@/lib/wedding-data";
import styles from "./page.module.css";

type MessageStyle = "muslim" | "general" | "friend";
type RecipientTitle = "general" | "bapak" | "ibu" | "saudara" | "saudari";

const recipientTitles: Record<RecipientTitle, string> = {
  general: "Bapak/Ibu/Saudara/i",
  bapak: "Bapak",
  ibu: "Ibu",
  saudara: "Saudara",
  saudari: "Saudari",
};

function formatGuestName(value: string) {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("id-ID")
    .replace(/(^|[\s/'-])\p{L}/gu, (letter) => letter.toLocaleUpperCase("id-ID"));
}

export default function GenerateInvitationPage() {
  const [name, setName] = useState("");
  const [recipientTitle, setRecipientTitle] = useState<RecipientTitle>("general");
  const [messageStyle, setMessageStyle] = useState<MessageStyle>("muslim");
  const [copied, setCopied] = useState(false);
  const guestName = formatGuestName(name);

  const invitationUrl = useMemo(() => {
    if (!guestName || typeof window === "undefined") return "";
    const guestPath = encodeURIComponent(guestName).replaceAll("%20", "+");
    const url = new URL(`/to/${guestPath}`, window.location.origin);
    return url.toString();
  }, [guestName]);

  const whatsappMessage = useMemo(() => {
    if (!invitationUrl) return "";

    const coupleName = `${wedding.bride.shortName} & ${wedding.groom.shortName}`;
    const recipient = `Yth. ${recipientTitles[recipientTitle]} *${guestName}*,`;
    const eventDetails = `*${coupleName}*\n\nYang akan dilaksanakan pada:\n🗓️ ${wedding.displayDate}\n⏰ Akad Nikah: ${wedding.akad}\n📍 ${wedding.address}\n\nInformasi lengkap acara kami:\n${invitationUrl}`;
    const attendanceMessage = "Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.";

    if (messageStyle === "friend") {
      return `Assalamu'alaikum Wr. Wb.\nBismillahirrahmanirrahim.\n\n${recipient}\n\nDengan memohon rahmat dan rida Allah SWT, kami bermaksud mengundang ${recipientTitles[recipientTitle]} *${guestName}* untuk hadir dan menjadi bagian dari hari bahagia pernikahan kami:\n\n${eventDetails}\n\nKehadiran serta doa restu dari ${recipientTitles[recipientTitle]} akan menjadi kebahagiaan yang sangat berarti bagi kami.\n\nWassalamu'alaikum Wr. Wb.\n\nSalam hangat,\n*${coupleName.toLocaleUpperCase("id-ID")}*`;
    }

    if (messageStyle === "general") {
      return `Dengan penuh sukacita,\n\n${recipient}\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang ${recipientTitles[recipientTitle]} *${guestName}* untuk hadir dan memberikan doa restu pada acara pernikahan kami:\n\n${eventDetails}\n\n${attendanceMessage}\n\nHormat kami,\n*${coupleName.toLocaleUpperCase("id-ID")}*`;
    }

    return `Assalamu'alaikum Wr. Wb.\nBismillahirrahmanirrahim.\n\n${recipient}\n\nDengan memohon rahmat dan ridho Allah SWT, Tanpa mengurangi rasa hormat, perkenankan kami mengundang ${recipientTitles[recipientTitle]} *${guestName}* untuk hadir dan memberikan doa restu pada acara pernikahan kami:\n\n${eventDetails}\n\n${attendanceMessage}\n\nWassalamu'alaikum Wr. Wb.\n\nHormat kami,\n*${coupleName.toLocaleUpperCase("id-ID")}*`;
  }, [guestName, invitationUrl, messageStyle, recipientTitle]);

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

        <label className={styles.label} htmlFor="recipient-title">Sapaan penerima</label>
        <select
          id="recipient-title"
          className={styles.input}
          value={recipientTitle}
          onChange={(event) => setRecipientTitle(event.target.value as RecipientTitle)}
        >
          <option value="general">Umum (Bapak/Ibu/Saudara/i)</option>
          <option value="bapak">Bapak</option>
          <option value="ibu">Ibu</option>
          <option value="saudara">Saudara</option>
          <option value="saudari">Saudari</option>
        </select>

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
            <button
              className={messageStyle === "friend" ? styles.styleActive : styles.styleOption}
              type="button"
              aria-pressed={messageStyle === "friend"}
              onClick={() => setMessageStyle("friend")}
            >
              Sahabat
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
