import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowDown, ArrowUpRight, CalendarDays, Clock3, MapPin, Music2,
  Pause, Play, Heart, Flower2, Menu, X, Sparkles, ChevronDown,
  ChevronLeft, ChevronRight, Volume2, VolumeX
} from "lucide-react";

const wedding = {
  bride: "Zayn",
  groom: "Nora",
  date: new Date("2027-01-31T10:30:00"),
  dateLabel: "Sunday, 31 January 2027",
  venue: "Grand Palace Hall",
  address: "City Centre, London",
  story: [
    { number: "01", title: "A beautiful beginning", year: "WITH LOVE", body: "Two hearts, two families, and a thousand little moments have brought us to this day. We would be honoured to have you with us." },
    { number: "02", title: "A day to remember", year: "THE CELEBRATION", body: "Join us for a joyful celebration filled with warm wishes, beautiful traditions, and the people who mean the most to us." },
    { number: "03", title: "Forever begins here", year: "OUR NEXT CHAPTER", body: "Your presence is the most special gift. We look forward to celebrating this new beginning with you." }
  ],
  events: [
    { name: "Mehndi", date: "Thursday, 28 January 2027", time: "3:30 PM onwards", description: "A joyful afternoon of colour, music, and beautiful traditions.", icon: "✺" },
    { name: "Haldi", date: "Friday, 29 January 2027", time: "8:00 PM onwards", description: "An intimate evening with family, laughter, and blessings.", icon: "❋" },
    { name: "Wedding Reception", date: "Sunday, 31 January 2027", time: "10:30 AM onwards", description: "Please join us as two families become one.", icon: "✧" }
  ],
  family: [
    { name: "Mr. & Mrs. Malik", relation: "Parents of the groom" },
    { name: "Mr. & Mrs. Noor", relation: "Parents of the bride" },
    { name: "Our loved ones", relation: "With love and blessings" }
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
      cover.addColorStop(0, "#c5c6a7");
      cover.addColorStop(.48, "#879777");
      cover.addColorStop(1, "#b8bea0");
      context.fillStyle = cover;
      context.fillRect(0, 0, bounds.width, bounds.height);

      for (let i = 0; i < 55; i += 1) {
        const x = (i * 37) % bounds.width;
        const y = (i * 61) % bounds.height;
        context.beginPath();
        context.arc(x, y, (i % 3) + .5, 0, Math.PI * 2);
        context.fillStyle = "rgba(247, 240, 214, .22)";
        context.fill();
      }

      context.strokeStyle = "rgba(245, 232, 194, .8)";
      context.lineWidth = 1;
      context.strokeRect(8, 8, bounds.width - 16, bounds.height - 16);
      context.fillStyle = "#f7efd6";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = "10px Marcellus, Georgia, serif";
      context.fillText("✦  SCRATCH HERE  ✦", bounds.width / 2, bounds.height / 2);
      context.font = "italic 10px Georgia, serif";
      context.fillText("to reveal your date", bounds.width / 2, bounds.height / 2 + 18);
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
    context.arc(event.clientX - bounds.left, event.clientY - bounds.top, 19, 0, Math.PI * 2);
    context.fill();

    scratchState.current.strokes += 1;
    if (scratchState.current.strokes >= 25) {
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
    <div className={`scratch-panel ${revealed ? "is-revealed" : ""}`}>
      <p className="script scratch-heading">Scratch to Reveal</p>
      <div className="scratch-intro">A little surprise is waiting for you</div>
      <div className="scratch-card">
        <div className="scratch-heart">
          <div className="scratch-card-content">
            <span>You're Invited</span>
            <strong>{dateLabel.replace("Sunday, ", "")}</strong>
            <small>Sunday<br />10:30 AM</small>
          </div>
          {!revealed && (
            <canvas
              ref={canvasRef}
              className="scratch-reveal-canvas"
              aria-label="Scratch the heart to reveal the wedding date"
              onPointerDown={beginScratch}
              onPointerMove={scratch}
              onPointerUp={endScratch}
              onPointerCancel={endScratch}
            />
          )}
        </div>
      </div>
      <a className="save-date-button" href="#countdown"><Heart size={14} /> SAVE THE DATE</a>
    </div>
  );
}


function GateReveal({ onOpen }) {
  const videoRef = useRef(null);
  const fallbackTimers = useRef([]);
  const [opening, setOpening] = useState(false);
  const [curtainsOpen, setCurtainsOpen] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => () => {
    fallbackTimers.current.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const runCssFallback = () => {
    setVideoFailed(true);
    setVideoPlaying(false);
    setOpening(true);
    fallbackTimers.current.forEach((timer) => window.clearTimeout(timer));
    fallbackTimers.current = [
      window.setTimeout(() => setCurtainsOpen(true), 720),
      window.setTimeout(onOpen, 2800)
    ];
  };

  const open = () => {
    if (opening) return;
    setOpening(true);

    const video = videoRef.current;
    if (video && !videoFailed) {
      video.currentTime = 0;
      video.muted = muted;
      const playback = video.play();
      if (playback && typeof playback.then === "function") {
        playback.then(() => setVideoPlaying(true)).catch(runCssFallback);
      } else {
        setVideoPlaying(true);
      }
      return;
    }

    runCssFallback();
  };

  const handleVideoError = () => {
    setVideoFailed(true);
    setVideoReady(false);
    if (opening) runCssFallback();
  };

  const handleVideoEnded = () => {
    setVideoPlaying(false);
    onOpen();
  };

  const toggleSound = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    if (videoRef.current) videoRef.current.muted = nextMuted;
  };

  return (
    <motion.div
      className={`gate-screen ${opening ? "is-opening" : ""} ${curtainsOpen ? "curtains-open" : ""} ${videoReady && !videoFailed ? "has-video-frame" : ""} ${videoFailed ? "video-failed" : ""} ${videoPlaying ? "is-video-playing" : ""}`}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: .65 }}
    >
      <video
        ref={videoRef}
        className="gate-opening-video"
        src="/wedding-opening.mp4"
        playsInline
        preload="auto"
        muted={muted}
        onLoadedData={() => setVideoReady(true)}
        onCanPlay={() => setVideoReady(true)}
        onEnded={handleVideoEnded}
        onError={handleVideoError}
        onClick={open}
        onKeyDown={(event) => {
          if ((event.key === "Enter" || event.key === " ") && !opening) {
            event.preventDefault();
            open();
          }
        }}
        role="button"
        tabIndex={videoReady && !videoFailed ? 0 : -1}
        aria-label="Tap to open and play the wedding invitation"
      />

      <div className="gate-glow" />
      <div className="gate-backdrop">
        <div className="gate-backdrop-curtain gate-backdrop-curtain-left" />
        <div className="gate-backdrop-curtain gate-backdrop-curtain-right" />
        <div className="gate-backdrop-copy">
          <span className="eyebrow">WE'RE GETTING MARRIED</span>
          <span className="script">Zayn <i>&</i> Nora</span>
          <span className="gate-backdrop-date">31 · 01 · 2027</span>
        </div>
        <div className="gate-backdrop-flowers" aria-hidden="true">
          <span>❀</span><span>❦</span><span>✿</span><span>❦</span><span>❀</span>
        </div>
      </div>

      <div className="gate-doors" aria-hidden="true">
        <div className="gate-door gate-door-left">
          <div className="gate-door-leaves gate-door-leaves-top">❧</div>
          <div className="gate-door-leaves gate-door-leaves-bottom">❧</div>
          <div className="gate-door-mark">zareqia</div>
        </div>
        <div className="gate-door gate-door-right">
          <div className="gate-door-leaves gate-door-leaves-top">❧</div>
          <div className="gate-door-leaves gate-door-leaves-bottom">❧</div>
          <div className="gate-door-mark">zareqia</div>
        </div>
      </div>

      {!videoPlaying && (
        <>
          <div className="gate-hanging-line" aria-hidden="true" />
          <button
            className="gate-plaque"
            type="button"
            onClick={open}
            disabled={opening}
            aria-label="Tap to open the wedding invitation"
          >
            <span className="gate-plaque-leaf">❦</span>
            <span className="gate-plaque-text">{opening ? "WELCOME" : "TAP TO OPEN"}</span>
            <span className="gate-plaque-leaf">❦</span>
          </button>
          <span className="gate-watermark" aria-hidden="true">❧</span>
          <span className="gate-bottom-note">ZAYN & NORA · 31 JANUARY 2027</span>
        </>
      )}

      <button
        className="gate-sound-button"
        type="button"
        onClick={toggleSound}
        aria-label={muted ? "Unmute opening video" : "Mute opening video"}
        title={muted ? "Unmute" : "Mute"}
      >
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
    </motion.div>
  );
}


function App() {
  const [opened, setOpened] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(null);
  const [heroPhotoIndex, setHeroPhotoIndex] = useState(0);
  const [rsvp, setRsvp] = useState({ name: "", guests: "2", attendance: "yes", message: "" });
  const [rsvpSent, setRsvpSent] = useState(false);
  const countdown = useCountdown(wedding.date);

  useEffect(() => {
    document.body.classList.toggle("invitation-open", opened);
    return () => document.body.classList.remove("invitation-open");
  }, [opened]);

  useEffect(() => {
    if (!opened) return undefined;
    const intervalId = window.setInterval(() => {
      setHeroPhotoIndex((index) => (index + 1) % galleryImages.length);
    }, 4600);
    return () => window.clearInterval(intervalId);
  }, [opened]);

  useEffect(() => {
    if (!opened || typeof IntersectionObserver === "undefined") return undefined;
    const nodes = document.querySelectorAll(".floral-section, .save-date-section, .royal-cover .hero-frame");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in-view");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -4% 0px" });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [opened]);

  useEffect(() => {
    if (activeGalleryIndex === null) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setActiveGalleryIndex(null);
      if (event.key === "ArrowRight") {
        setActiveGalleryIndex((index) => (index + 1) % galleryImages.length);
      }
      if (event.key === "ArrowLeft") {
        setActiveGalleryIndex((index) => (index - 1 + galleryImages.length) % galleryImages.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeGalleryIndex]);

  const submitRsvp = (event) => {
    event.preventDefault();
    setRsvpSent(true);
  };

  return (
    <main className="site-shell">
      <AnimatePresence>
        {!opened && <GateReveal onOpen={() => { setOpened(true); window.scrollTo({ top: 0, behavior: "instant" }); }} />}
      </AnimatePresence>

      <div className={`invitation-site ${opened ? "is-visible" : ""}`} aria-hidden={!opened}>
        <button
          type="button"
          className={`music-button ${musicPlaying ? "music-playing" : ""}`}
          onClick={() => setMusicPlaying((value) => !value)}
          aria-label={musicPlaying ? "Mute music" : "Unmute music"}
          title="Music toggle preview"
        >
          <Music2 size={15} />
        </button>

        <section className="hero royal-cover" id="top">
          <div className="cover-curtain cover-curtain-left" aria-hidden="true" />
          <div className="cover-curtain cover-curtain-right" aria-hidden="true" />
          <div className="hero-frame royal-cover-frame">
            <span className="cover-heart" aria-hidden="true">♥</span>
            <p className="script cover-script">We're getting married</p>
            <div className="cover-divider"><span />♥<span /></div>
            <h1><span>{wedding.bride}</span><em>&</em><span>{wedding.groom}</span></h1>
            <p className="cover-family">Son of Mr. & Mrs. Malik<br /><span>B.E., M.S. · Data Scientist</span></p>
            <span className="cover-ampersand">&</span>
            <p className="cover-family">Daughter of Mr. & Mrs. Noor<br /><span>MBA · Public Relations</span></p>
            <div className="cover-bottom-flourish" aria-hidden="true">❦　✧　❦</div>
          </div>
          <div className="cover-garden" aria-hidden="true">
            <div className="garden-vase garden-vase-left">❀</div>
            <div className="garden-fountain"><span>✧</span></div>
            <div className="garden-vase garden-vase-right">❀</div>
          </div>
        </section>

        <section className="message-section floral-section" id="story">
          <span className="section-emblem">♥</span>
          <p className="script message-heading">A celebration of love</p>
          <h2>We are honoured to welcome you</h2>
          <div className="small-leaf-divider">❧　♥　❧</div>
          <p className="message-copy">to the wedding ceremony of <strong>{wedding.bride} & {wedding.groom}</strong> as they begin their journey together in faith and love.</p>
          <p className="message-copy">Thank you for being part of this blessed occasion. Your presence means the world to us.</p>
        </section>

        <section className="scratch-section floral-section" id="date">
          <ScratchReveal dateLabel={wedding.dateLabel} />
        </section>

        <section className="save-date-section floral-section" id="countdown">
          <span className="save-date-ribbon"><Heart size={12} fill="currentColor" /> SAVE THE DATE</span>
          <div className="save-date-photo" aria-label="Wedding photo slideshow">
            <motion.img
              key={galleryImages[heroPhotoIndex]}
              src={galleryImages[heroPhotoIndex]}
              alt={`Wedding slideshow photo ${heroPhotoIndex + 1}`}
              loading="lazy"
              initial={{ opacity: 0, scale: 1.025 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: .75, ease: "easeOut" }}
            />
            <span className="photo-slide-caption">MOMENTS OF LOVE · 0{heroPhotoIndex + 1}</span>
            <button
              type="button"
              className="photo-slide-arrow photo-slide-prev"
              aria-label="Previous wedding photo"
              onClick={() => setHeroPhotoIndex((index) => (index - 1 + galleryImages.length) % galleryImages.length)}
            ><ChevronLeft size={18} /></button>
            <button
              type="button"
              className="photo-slide-arrow photo-slide-next"
              aria-label="Next wedding photo"
              onClick={() => setHeroPhotoIndex((index) => (index + 1) % galleryImages.length)}
            ><ChevronRight size={18} /></button>
            <div className="photo-slide-dots" aria-label="Choose slideshow photo">
              {galleryImages.map((image, index) => (
                <button
                  type="button"
                  key={image}
                  aria-label={`Show photo ${index + 1}`}
                  aria-current={heroPhotoIndex === index ? "true" : undefined}
                  className={heroPhotoIndex === index ? "is-active" : ""}
                  onClick={() => setHeroPhotoIndex(index)}
                />
              ))}
            </div>
          </div>
          <p className="script countdown-heading">Counting Down to Forever</p>
          <div className="countdown-grid">
            {countdown.map(([label, value]) => (
              <div className="countdown-unit" key={label}>
                <strong>{String(value).padStart(2, "0")}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="program-section floral-section">
          <span className="section-emblem">◷</span>
          <p className="script page-script">Program Timeline</p>
          <div className="timeline-date">SUNDAY, 31 JANUARY 2027</div>
          <div className="program-timeline">
            <article className="timeline-item">
              <span className="timeline-time">10:00 AM</span>
              <span className="timeline-dot" />
              <div><h3>Guest Arrival</h3><p>Warm welcomes and a moment to settle in.</p></div>
            </article>
            <article className="timeline-item">
              <span className="timeline-time">10:30 AM</span>
              <span className="timeline-dot" />
              <div><h3>Wedding Ceremony</h3><p>Your presence makes our day complete.</p></div>
            </article>
            <article className="timeline-item">
              <span className="timeline-time">12:30 PM</span>
              <span className="timeline-dot" />
              <div><h3>Reception & Lunch</h3><p>Food, family, and cherished memories.</p></div>
            </article>
          </div>
        </section>

        <section className="venue-section floral-section" id="venue">
          <div className="venue-card">
            <MapPin size={19} className="section-icon" />
            <p className="script page-script">Venue</p>
            <h2>{wedding.venue}</h2>
            <p className="venue-address">{wedding.address}</p>
            <div className="venue-map">
              <iframe
                title={`Map showing ${wedding.venue} in ${wedding.address}`}
                src="https://maps.google.com/maps?q=Grand%20Palace%20Hall%20London&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <a className="venue-map-button" href="https://maps.google.com/?q=Grand+Palace+Hall+London" target="_blank" rel="noreferrer">View on Google Maps</a>
          </div>
        </section>

        <section className="dress-code-section floral-section">
          <span className="section-emblem">♧</span>
          <p className="script page-script">Dress Code</p>
          <div className="dress-code-grid">
            <article><span className="dress-code-icon">♙</span><h3>Women</h3><p>Elegant formal attire in pastel or jewel tones.</p></article>
            <article><span className="dress-code-icon">♙</span><h3>Men</h3><p>Suit or traditional formal wear.</p></article>
          </div>
        </section>

        <section className="pre-events-section floral-section">
          <span className="section-emblem">✧</span>
          <p className="script page-script">Pre-Wedding Events</p>
          <div className="detail-event"><span>THURSDAY, 28 JANUARY 2027</span><h3>3:30 PM · Mehndi</h3><p>At the bride's house</p></div>
          <div className="detail-event"><span>FRIDAY, 29 JANUARY 2027</span><h3>8:00 PM · Haldi</h3><p>At the groom's house</p></div>
        </section>

        <section className="transport-section floral-section">
          <span className="section-emblem">⌁</span>
          <p className="script page-script">Transportation</p>
          <p>Shuttle service will be available from the city centre to the venue.</p>
          <p className="detail-note">Pickup point: Central Station, at 9:45 AM.</p>
        </section>

        <section className="accommodation-section floral-section">
          <span className="section-emblem">⌂</span>
          <p className="script page-script">Accommodation</p>
          <p>Special rates are available at partner hotels for our wedding guests.</p>
          <p className="detail-note">Please mention “ZAYNNO​RA2027” when booking.</p>
        </section>

        <section className="gifts-section floral-section">
          <span className="section-emblem">♧</span>
          <p className="script page-script">Gifts</p>
          <p>Your love, blessings, and presence are the greatest gifts you could ever ask for.</p>
        </section>

        <section className="rsvp-section floral-section" id="rsvp">
          <span className="section-emblem">✉</span>
          <p className="script page-script">RSVP</p>
          <p className="rsvp-intro-copy">Kindly let us know if you can join us.</p>
          {rsvpSent ? (
            <div className="rsvp-success">
              <Sparkles size={25} />
              <h3>Thank you, {rsvp.name || "dear friend"}!</h3>
              <p>Your response has been noted in this preview. It is not sent to a server yet.</p>
              <button className="save-date-button" type="button" onClick={() => setRsvpSent(false)}>Edit response</button>
            </div>
          ) : (
            <form className="rsvp-form" onSubmit={submitRsvp}>
              <label>Your Name *<input required value={rsvp.name} onChange={(event) => setRsvp({ ...rsvp, name: event.target.value })} placeholder="Your full name" /></label>
              <label>Will you be attending? *
                <select required value={rsvp.attendance} onChange={(event) => setRsvp({ ...rsvp, attendance: event.target.value })}>
                  <option value="">Select...</option><option value="yes">Joyfully accepts</option><option value="no">Regretfully declines</option>
                </select>
              </label>
              <label>Number of guests
                <select value={rsvp.guests} onChange={(event) => setRsvp({ ...rsvp, guests: event.target.value })}>
                  <option>1</option><option>2</option><option>3</option><option>4</option><option>5</option>
                </select>
              </label>
              <label>Your Message<textarea rows="3" value={rsvp.message} onChange={(event) => setRsvp({ ...rsvp, message: event.target.value })} placeholder="Write your wishes..." /></label>
              <button className="rsvp-send-button" type="submit">Send Message</button>
              <p className="form-note">Preview only · responses are not saved to a server yet</p>
            </form>
          )}
        </section>

        <section className="end-section floral-section">
          <span className="section-emblem">♥</span>
          <p className="script page-script">We can't wait to<br />celebrate with you!</p>
          <p className="end-signature">{wedding.bride} & {wedding.groom}</p>
          <p className="footer-date">{wedding.dateLabel}</p>
        </section>

        <section className="gallery-section floral-section" id="gallery">
          <p className="script page-script">Moments of Love</p>
          <p className="section-subtitle">A few memories we'd love to share</p>
          <div className="gallery-grid">
            {galleryImages.map((image, index) => (
              <motion.figure
                key={image}
                className={`gallery-item gallery-item-${index % 6}`}
                role="button"
                tabIndex={0}
                aria-label={`Open wedding photo ${index + 1}`}
                onClick={() => setActiveGalleryIndex(index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActiveGalleryIndex(index);
                  }
                }}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: .15 }}
                transition={{ duration: .55, delay: (index % 3) * .07 }}
              >
                <img src={image} alt={`Wedding memory ${index + 1}`} loading="lazy" />
                <figcaption><span>MEMORY 0{index + 1}</span><Heart size={13} /></figcaption>
              </motion.figure>
            ))}
          </div>
          {activeGalleryIndex !== null && (
            <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label="Wedding photo slideshow" onClick={(event) => {
              if (event.target === event.currentTarget) setActiveGalleryIndex(null);
            }}>
              <button type="button" className="gallery-close" aria-label="Close slideshow" onClick={() => setActiveGalleryIndex(null)}><X size={22} /></button>
              <button type="button" className="gallery-nav gallery-prev" aria-label="Previous photo" onClick={() => setActiveGalleryIndex((index) => (index - 1 + galleryImages.length) % galleryImages.length)}><ChevronLeft size={26} /></button>
              <figure className="gallery-lightbox-photo">
                <img src={galleryImages[activeGalleryIndex]} alt={`Wedding memory ${activeGalleryIndex + 1}`} />
                <figcaption>MEMORY 0{activeGalleryIndex + 1} OF 0{galleryImages.length}</figcaption>
              </figure>
              <button type="button" className="gallery-nav gallery-next" aria-label="Next photo" onClick={() => setActiveGalleryIndex((index) => (index + 1) % galleryImages.length)}><ChevronRight size={26} /></button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
