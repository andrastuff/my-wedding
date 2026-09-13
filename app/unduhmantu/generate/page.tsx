"use client";

import { Check, Copy, Link2, MessageCircle, UsersRound } from "lucide-react";
import { useMemo, useState } from "react";
import { wedding } from "@/lib/wedding-data";
import styles from "./page.module.css";

type MessageStyle = "muslim" | "general";
type CopiedItem = "link" | "message" | null;

function formatGuestName(value: string) {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("id-ID")
    .replace(/(^|[\s/'-])\p{L}/gu, (letter) => letter.toLocaleUpperCase("id-ID"));
}

export default function GenerateUnduhMantuPage() {
  const [name, setName] = useState("");
  const [messageStyle, setMessageStyle] = useState<MessageStyle>("muslim");
  const [copiedItem, setCopiedItem] = useState<CopiedItem>(null);
  const guestName = formatGuestName(name);
  const hosts = wedding.unduhMantu.hosts;
  const coupleName = `${wedding.groom.shortName} & ${wedding.bride.shortName}`;

  const invitationUrl = useMemo(() => {
    if (!guestName || typeof window === "undefined") return "";
    const url = new URL("/unduhmantu", window.location.origin);
    url.searchParams.set("for", guestName);
    return url.toString();
  }, [guestName]);

  const shareMessage = useMemo(() => {
    if (!invitationUrl) return "";

    const invitation = `Tanpa mengurangi rasa hormat, kami ${hosts.father} & ${hosts.mother} bermaksud mengundang Bapak/Ibu/Saudara/i *${guestName}* untuk menghadiri acara Unduh Mantu dalam rangka pernikahan putra-putri kami:\n\n*${coupleName}*\n\nYang akan dilaksanakan pada:\n🗓️ ${wedding.unduhMantu.displayDate}\n📍 ${wedding.unduhMantu.address}\n\nInformasi lengkap acara:\n${invitationUrl}\n\nMohon berkenan mengisi ucapan dan konfirmasi kehadiran. Terima kasih.`;

    if (messageStyle === "general") {
      return `Dengan penuh sukacita,\n\n${invitation}\n\nHormat kami,\n*Keluarga ${hosts.father} & ${hosts.mother}*`;
    }

    return `Assalamu'alaikum Wr. Wb.\nBismillahirrahmanirrahim.\n\n${invitation}\n\nWassalamu'alaikum Wr. Wb.\n\nHormat kami,\n*Keluarga ${hosts.father} & ${hosts.mother}*`;
  }, [coupleName, guestName, hosts.father, hosts.mother, invitationUrl, messageStyle]);

  async function copyText(value: string, item: Exclude<CopiedItem, null>) {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopiedItem(item);
    window.setTimeout(() => setCopiedItem(null), 1800);
  }

  function shareToWhatsApp() {
    if (!shareMessage) return;
    window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <main className={styles.page}>
      <div className={styles.pattern} aria-hidden="true" />
      <section className={styles.card}>
        <div className={styles.icon}><UsersRound size={21} /></div>
        <p className={styles.eyebrow}>Unduh Mantu</p>
        <h1>Buat Undangan Tamu</h1>
        <p className={styles.intro}>Buat tautan personal dan pesan undangan atas nama keluarga.</p>

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
            <span className={styles.resultLabel}><Link2 size={15} /> Undangan untuk {guestName}</span>
            <a className={styles.url} href={invitationUrl} target="_blank" rel="noreferrer">{invitationUrl}</a>
            <output className={styles.message}>{shareMessage}</output>
            <div className={styles.actions}>
              <button type="button" onClick={() => copyText(invitationUrl, "link")}>
                {copiedItem === "link" ? <Check size={17} /> : <Link2 size={17} />}
                {copiedItem === "link" ? "Link tersalin" : "Salin link"}
              </button>
              <button type="button" onClick={() => copyText(shareMessage, "message")}>
                {copiedItem === "message" ? <Check size={17} /> : <Copy size={17} />}
                {copiedItem === "message" ? "Pesan tersalin" : "Salin pesan"}
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
