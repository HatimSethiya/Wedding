import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowDown, ArrowUpRight, CalendarDays, Clock3, MapPin, Music2,
  Pause, Play, Heart, Flower2, Menu, X, Sparkles, ChevronDown
} from "lucide-react";

const wedding = {
  bride: "Zainab",
  groom: "Mufaddal",
  date: new Date("2026-12-20T17:00:00"),
  dateLabel: "Sunday, 20 December 2026",
  venue: "The Royal Courtyard",
  address: "Udaipur, Rajasthan, India",
  story: [
    { number: "01", title: "A beautiful beginning", year: "THE FIRST CHAPTER", body: "Some stories begin with a glance, others with a conversation. Ours began quietly, then grew into something we knew we wanted to keep choosing, every day." },
    { number: "02", title: "Growing together", year: "THE JOURNEY", body: "Through little moments, long conversations and the kindness of our families, two separate journeys slowly became one shared path." },
    { number: "03", title: "Forever starts here", year: "THE NEXT CHAPTER", body: "Now, with grateful hearts and our favourite people beside us, we invite you to celebrate the beginning of our forever." }
  ],
  events: [
    { name: "Mehndi Evening", date: "Saturday, 19 December", time: "5:30 PM onwards", description: "An evening of colour, music and joyful traditions.", icon: "✺" },
    { name: "Wedding Ceremony", date: "Sunday, 20 December", time: "5:00 PM onwards", description: "A heartfelt celebration as two families become one.", icon: "❋" },
    { name: "Dinner & Celebration", date: "Sunday, 20 December", time: "8:00 PM onwards", description: "Good food, warm wishes and memories to take home.", icon: "✧" }
  ],
  family: [
    { name: "A loving family", relation: "With blessings and gratitude" },
    { name: "Our parents", relation: "Our first teachers in love" },
    { name: "Our loved ones", relation: "The people who make it home" }
  ]
};

const galleryImages = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1000&q=85"
];

function OrnamentalRule({ className = "" }) {
  return <div className={`ornamental-rule ${className}`} aria-hidden="true"><span /><i>✦</i><span /></div>;
}

function SectionTitle({ eyebrow, title, note }) {
  return (
    <header className="section-title">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <OrnamentalRule />
      {note && <p>{note}</p>}
    </header>
  );
}

function useCountdown(date) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return useMemo(() => {
    const delta = Math.max(0, date.getTime() - now);
    return [
      ["Days", Math.floor(delta / 86400000)],
      ["Hours", Math.floor((delta % 86400000) / 3600000)],
      ["Minutes", Math.floor((delta % 3600000) / 60000)],
      ["Seconds", Math.floor((delta % 60000) / 1000)]
    ];
  }, [date, now]);
}

function ScratchReveal({ dateLabel }) {
  const canvasRef = useRef(null);
  const scratchState = useRef({ active: false, strokes: 0 });
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return undefined;

    const paintCover = () => {
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;

      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(bounds.width * ratio);
      canvas.height = Math.round(bounds.height * ratio);

      const context = canvas.getContext("2d");
      if (!context) return;
      context.scale(ratio, ratio);

      const cover = context.createLinearGradient(0, 0, bounds.width, bounds.height);
      cover.addColorStop(0, "#f0e2bd");
      cover.addColorStop(0.5, "#d9c18b");
      cover.addColorStop(1, "#f4ead3");
      context.fillStyle = cover;
      context.fillRect(0, 0, bounds.width, bounds.height);

      context.strokeStyle = "rgba(116, 81, 35, 0.7)";
      context.lineWidth = 1;
      context.strokeRect(9, 9, bounds.width - 18, bounds.height - 18);
      context.fillStyle = "#36513d";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = "10px Marcellus, Georgia, serif";
      context.fillText("✦  SCRATCH TO REVEAL  ✦", bounds.width / 2, bounds.height / 2 - 5);
      context.font = "italic 12px Georgia, serif";
      context.fillStyle = "#66512f";
      context.fillText("A little surprise awaits", bounds.width / 2, bounds.height / 2 + 14);
    };

    paintCover();
    window.addEventListener("resize", paintCover);
    return () => window.removeEventListener("resize", paintCover);
  }, [revealed]);

  const scratch = (event) => {
    const canvas = canvasRef.current;
    if (!canvas || !scratchState.current.active || revealed) return;

    const bounds = canvas.getBoundingClientRect();
    const context = canvas.getContext("2d");
    if (!context) return;

    context.globalCompositeOperation = "destination-out";
    context.beginPath();
    context.arc(event.clientX - bounds.left, event.clientY - bounds.top, 21, 0, Math.PI * 2);
    context.fill();

    scratchState.current.strokes += 1;
    if (scratchState.current.strokes >= 24) {
      scratchState.current.active = false;
      setRevealed(true);
    }
  };

  const beginScratch = (event) => {
    if (revealed) return;
    scratchState.current.active = true;
    scratchState.current.strokes = 0;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    scratch(event);
  };

  const endScratch = () => {
    scratchState.current.active = false;
  };

  return (
    <div className={`scratch-card ${revealed ? "is-revealed" : ""}`}>
      <div className="scratch-card-content">
        <span className="eyebrow">A DATE TO REMEMBER</span>
        <strong>{dateLabel}</strong>
        <span className="scratch-card-note">With joy in our hearts, we invite you</span>
      </div>
      {!revealed && (
        <canvas
          ref={canvasRef}
          className="scratch-reveal-canvas"
          aria-label="Scratch this card to reveal the wedding date"
          onPointerDown={beginScratch}
          onPointerMove={scratch}
          onPointerUp={endScratch}
          onPointerCancel={endScratch}
        />
      )}
    </div>
  );
}

function GateReveal({ onOpen }) {
  const [opening, setOpening] = useState(false);
  const open = () => {
    if (opening) return;
    setOpening(true);
    window.setTimeout(onOpen, 1450);
  };
  return (
    <motion.div className={`gate-screen ${opening ? "is-opening" : ""}`}
      initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .7 }}>
      <div className="gate-glow" />
      <div className="gate-caption">
        <span className="eyebrow">A CELEBRATION OF LOVE</span>
        <div className="gate-monogram">Z<span>&</span>M</div>
        <p className="script">A new chapter begins</p>
      </div>
      <div className="gate-sparkles" aria-hidden="true">
        <span>✦</span><span>✧</span><span>✥</span><span>✧</span><span>✦</span>
      </div>
      <div className="gate-doors" aria-hidden="true">
        <div className="gate-door gate-door-left">
          <div className="door-inner">
            <span className="door-crown">❦</span>
            <div className="door-arch"><span>ZM</span></div>
            <div className="door-ornament">❧</div>
            <span className="door-handle"><i /></span>
          </div>
        </div>
        <div className="gate-door gate-door-right">
          <div className="door-inner">
            <span className="door-crown">❦</span>
            <div className="door-arch"><span>✦</span></div>
            <div className="door-ornament">❧</div>
            <span className="door-handle"><i /></span>
          </div>
        </div>
      </div>
      <button className="gate-open-button" onClick={open} disabled={opening}>
        <span>{opening ? "Welcome, with love" : "Enter the celebration"}</span><ArrowUpRight size={16} />
      </button>
      <span className="gate-bottom-note">PLEASE JOIN US AS WE BEGIN OUR FOREVER</span>
    </motion.div>
  );
}

function App() {
  const [opened, setOpened] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [rsvp, setRsvp] = useState({ name: "", guests: "2", attendance: "yes", message: "" });
  const [rsvpSent, setRsvpSent] = useState(false);
  const countdown = useCountdown(wedding.date);

  useEffect(() => {
    document.body.classList.toggle("invitation-open", opened);
    return () => document.body.classList.remove("invitation-open");
  }, [opened]);

  const navItems = [
    ["Our Story", "#story"], ["The Celebration", "#events"], ["Gallery", "#gallery"], ["Venue", "#venue"]
  ];

  const submitRsvp = (event) => {
    event.preventDefault();
    setRsvpSent(true);
  };

  return (
    <main className="site-shell">
      <AnimatePresence>{!opened && <GateReveal onOpen={() => { setOpened(true); window.scrollTo({ top: 0, behavior: "instant" }); }} />}</AnimatePresence>
      <div className={`invitation-site ${opened ? "is-visible" : ""}`} aria-hidden={!opened}>
        <div className="topbar"><span>TOGETHER WITH THEIR FAMILIES</span><span className="topbar-star">✦</span><span>JOYFULLY INVITE YOU</span></div>
        <nav className="site-nav">
          <a className="brand-mark" href="#top" aria-label="Back to top">Z<span>&</span>M</a>
          <div className={`nav-links ${mobileMenu ? "nav-links-open" : ""}`}>
            {navItems.map(([label, href]) => <a key={href} href={href} onClick={() => setMobileMenu(false)}>{label}</a>)}
            <a className="nav-rsvp" href="#rsvp" onClick={() => setMobileMenu(false)}>RSVP <ArrowUpRight size={14} /></a>
          </div>
          <button className="mobile-menu-button" aria-label={mobileMenu ? "Close menu" : "Open menu"} onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <X /> : <Menu />}</button>
        </nav>

        <section className="hero" id="top">
          <div className="hero-side-note">THE BEGINNING OF ALWAYS <span>—</span> EST. 2026</div>
          <div className="hero-frame">
            <span className="frame-corner corner-tl" /><span className="frame-corner corner-tr" />
            <span className="frame-corner corner-bl" /><span className="frame-corner corner-br" />
            <motion.p className="script hero-script" initial={{ opacity: 0, y: 14 }} animate={opened ? { opacity: 1, y: 0 } : {}} transition={{ delay: .25, duration: .8 }}>With the blessings of our families</motion.p>
            <p className="eyebrow">REQUEST THE PLEASURE OF YOUR COMPANY</p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={opened ? { opacity: 1, y: 0 } : {}} transition={{ delay: .4, duration: .9 }}>
              <span>{wedding.bride}</span><em>&</em><span>{wedding.groom}</span>
            </motion.h1>
            <OrnamentalRule className="hero-rule" />
            <ScratchReveal dateLabel={wedding.dateLabel} />
            <div className="hero-image-wrap">
              <img src={galleryImages[0]} alt="Romantic wedding floral arrangement" loading="eager" />
              <span className="image-stamp">THE<br />WEDDING<br />CELEBRATION</span>
            </div>
            <p className="hero-venue">{wedding.venue} <span>·</span> {wedding.address}</p>
            <a className="scroll-cue" href="#story"><span><ArrowDown size={16} /></span> DISCOVER OUR STORY</a>
          </div>
          <div className="hero-botanical botanical-left" aria-hidden="true">❧</div>
          <div className="hero-botanical botanical-right" aria-hidden="true">❧</div>
        </section>

        <section className="welcome-band">
          <Flower2 size={22} strokeWidth={1} />
          <p>Two hearts, two families, one beautiful beginning. We would be honoured to celebrate this cherished moment with you.</p>
          <Flower2 size={22} strokeWidth={1} />
        </section>

        <section className="story-section section-pad" id="story">
          <SectionTitle eyebrow="A TALE OF TWO HEARTS" title="Our Story" note="A thousand little moments led us here. These are a few of our favourites." />
          <div className="story-list">
            {wedding.story.map((item, index) => (
              <motion.article className={`story-row ${index % 2 ? "story-row-reverse" : ""}`} key={item.number}
                initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .75 }}>
                <div className="story-photo"><img src={galleryImages[index + 1]} alt="Wedding story moment" loading="lazy" /><span className="photo-index">{item.number}</span></div>
                <div className="story-copy"><span className="eyebrow">{item.year}</span><h3>{item.title}</h3><OrnamentalRule /><p>{item.body}</p></div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="countdown-section">
          <div className="countdown-text"><span className="script">The day draws near</span><SectionTitle eyebrow="COUNTING EVERY MOMENT" title="Until We Say I Do" /></div>
          <div className="countdown-grid">{countdown.map(([label, value]) => <div className="countdown-unit" key={label}><strong>{String(value).padStart(2, "0")}</strong><span>{label}</span></div>)}</div>
          <span className="countdown-flourish" aria-hidden="true">❧</span>
        </section>

        <section className="events-section section-pad" id="events">
          <SectionTitle eyebrow="SAVE THE DATE" title="Wedding Festivities" note="A few meaningful gatherings, made even more special with you by our side." />
          <div className="event-grid">
            {wedding.events.map((event, index) => <motion.article className="event-card" key={event.name}
              initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .65, delay: index * .12 }}>
              <div className="event-top"><span>CELEBRATION {String(index + 1).padStart(2, "0")}</span><i>{event.icon}</i></div>
              <h3>{event.name}</h3><OrnamentalRule />
              <p className="event-date"><CalendarDays size={15} />{event.date}</p>
              <p className="event-time"><Clock3 size={15} />{event.time}</p>
              <p className="event-description">{event.description}</p>
              <a href="#venue" className="text-link">EVENT DETAILS <ArrowUpRight size={14} /></a>
            </motion.article>)}
          </div>
        </section>

        <section className="family-section">
          <div className="family-pattern" aria-hidden="true" />
          <SectionTitle eyebrow="ROOTED IN LOVE" title="Our Families" note="With gratitude for the people whose love brought us here." />
          <div className="family-grid">{wedding.family.map((member) => <article className="family-card" key={member.name}><span>✧</span><h3>{member.name}</h3><p>{member.relation}</p></article>)}</div>
          <p className="family-signoff script">With their love and blessings</p>
        </section>

        <section className="gallery-section section-pad" id="gallery">
          <SectionTitle eyebrow="LITTLE MOMENTS, FOREVER MEMORIES" title="Captured with Love" note="A glimpse into the beauty of the moments that brought us here." />
          <div className="gallery-grid">{galleryImages.map((image, index) => <motion.figure key={image} className={`gallery-item gallery-item-${index % 6}`}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .65, delay: (index % 3) * .08 }}>
            <img src={image} alt={`Wedding memory ${index + 1}`} loading="lazy" /><figcaption><span>MEMORY NO. 0{index + 1}</span><Heart size={13} /></figcaption>
          </motion.figure>)}</div>
        </section>

        <section className="venue-section" id="venue">
          <div className="venue-card">
            <span className="eyebrow">WE'LL SAVE YOU A SEAT</span>
            <div className="venue-symbol"><MapPin size={24} strokeWidth={1} /></div>
            <SectionTitle eyebrow="A PLACE TO GATHER" title={wedding.venue} note={wedding.address} />
            <p className="venue-copy">Come share the warmth, the joy and the beginning of our next chapter in a place as special as the occasion.</p>
            <a className="gold-button" href="https://maps.google.com/?q=Udaipur+Rajasthan+India" target="_blank" rel="noreferrer">EXPLORE THE LOCATION <ArrowUpRight size={15} /></a>
          </div>
        </section>

        <section className="rsvp-section section-pad" id="rsvp">
          <div className="rsvp-intro"><span className="script">Your presence is our present</span><SectionTitle eyebrow="KINDLY REPLY" title="Will You Join Us?" note="Please let us know if we can save you a seat. We can't wait to celebrate together." /></div>
          {rsvpSent ? <div className="rsvp-success"><Sparkles size={28} /><h3>Thank you, {rsvp.name || "dear friend"}.</h3><p>Your response has been noted in this preview. Once connected to a backend, it can be delivered to the hosts.</p><button className="text-link" onClick={() => setRsvpSent(false)}>EDIT RESPONSE</button></div> :
            <form className="rsvp-form" onSubmit={submitRsvp}>
              <label>Your name<input required value={rsvp.name} onChange={(e) => setRsvp({ ...rsvp, name: e.target.value })} placeholder="Full name" /></label>
              <div className="form-row">
                <label>Will you attend?<select value={rsvp.attendance} onChange={(e) => setRsvp({ ...rsvp, attendance: e.target.value })}><option value="yes">Joyfully accepts</option><option value="no">Regretfully declines</option></select></label>
                <label>Guests<select value={rsvp.guests} onChange={(e) => setRsvp({ ...rsvp, guests: e.target.value })}><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></label>
              </div>
              <label>A little note (optional)<textarea rows="3" value={rsvp.message} onChange={(e) => setRsvp({ ...rsvp, message: e.target.value })} placeholder="Send the couple your wishes..." /></label>
              <button className="gold-button submit-button" type="submit">SEND YOUR RESPONSE <ArrowUpRight size={15} /></button>
              <p className="form-note">DEMO PREVIEW · RESPONSES ARE NOT SAVED TO A SERVER YET</p>
            </form>}
        </section>

        <footer className="site-footer">
          <OrnamentalRule />
          <p className="script">A lifetime of love starts here</p>
          <h2>{wedding.bride} <span>&</span> {wedding.groom}</h2>
          <p className="footer-date">{wedding.dateLabel}</p>
          <div className="footer-seal">ZM</div>
          <small>MADE WITH LOVE · DECEMBER 2026</small>
        </footer>

        <button className={`music-button ${musicPlaying ? "music-playing" : ""}`} onClick={() => setMusicPlaying(!musicPlaying)} aria-label={musicPlaying ? "Pause music preview" : "Play music preview"}>
          {musicPlaying ? <Pause size={15} /> : <Play size={15} />}<span>{musicPlaying ? "Music on" : "Music"}</span><span className="music-bars"><i /><i /><i /><i /></span>
        </button>
      </div>
    </main>
  );
}

export default App;
