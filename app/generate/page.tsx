"use client";

import { Check, Copy, Heart, Link2 } from "lucide-react";
import { useMemo, useState } from "react";
import styles from "./page.module.css";

function formatGuestName(value: string) {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("id-ID")
    .replace(/(^|[\s/'-])\p{L}/gu, (letter) => letter.toLocaleUpperCase("id-ID"));
}

export default function GenerateInvitationPage() {
  const [name, setName] = useState("");
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
    return `Assalamu'alaikum Wr. Wb.\n\nDengan penuh kebahagiaan, kami bermaksud untuk mengundang Bpk/Ibu *${guestName}* untuk hadir dalam acara pernikahan kami.\n\nBerikut kami lampirkan undangan lengkapnya di bawah ini:\n${invitationUrl}\n\nTerima kasih atas doa dan kehadirannya.\n\nAyu & Ardi`;
  }, [guestName, invitationUrl]);

  async function copyInvitationUrl() {
    if (!whatsappMessage) return;
    await navigator.clipboard.writeText(whatsappMessage);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
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

        {guestName ? (
          <div className={styles.result}>
            <span className={styles.resultLabel}><Link2 size={15} /> Pesan untuk {guestName}</span>
            <output className={styles.message}>{whatsappMessage}</output>
            <div className={styles.actions}>
              <button className={styles.copy} type="button" onClick={copyInvitationUrl}>
                {copied ? <Check size={17} /> : <Copy size={17} />}
                {copied ? "Pesan tersalin" : "Salin pesan"}
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
