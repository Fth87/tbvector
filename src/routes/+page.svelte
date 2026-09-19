<script lang="ts">
  import { resolve } from "$app/paths";

  const processSteps = [
    {
      title: "Capture",
      copy: "A microphone array records surrounding cough sounds in real-time.",
    },
    {
      title: "Analyze",
      copy: "An LSTM AI algorithm classifies coughs as TB or non-TB in under one second with 90.65% accuracy.",
    },
    {
      title: "Locate",
      copy: "Integration of Direction of Arrival (DoA) and inverse beamforming determines the direction of the cough source with 87% accuracy.",
    },
    {
      title: "Identify",
      copy: "An OAK-D Lite camera using YOLOv10s detects and tracks individuals within the video frame.",
    },
    {
      title: "Alert",
      copy: "The dashboard instantly sends notifications to healthcare workers, including location details and the confidence score.",
    },
  ];

  const sellingPoints = [
    {
      title: "Zero Consumables",
      copy: "No reagents, no cartridges. Operational costs are near zero per test compared to expensive GeneXpert.",
    },
    {
      title: "Non-Invasive",
      copy: "No sputum samples, no laboratory required, and no specialist operator. It can be used anywhere.",
    },
    {
      title: "First Real-Time Spatial AI",
      copy: "An acoustic solution combining LSTM analysis and spatial localization in under one second.",
    },
  ];

  const specifications = [
    {
      title: "AI Accuracy",
      copy: "Classifier LSTM (90.65%), Direction of Arrival (87%), YOLOv10s mAP50 (0.98).",
    },
    { title: "Inference Time", copy: "<1 second." },
    {
      title: "Components",
      copy: "Mic INMP4415, OAK-D Lite camera, suction cup mount, and precision casing.",
    },
  ];

  const validation = [
    {
      title: "Ethics Approval",
      copy: "Ethical clearance approved (KARS) for TB patients.",
    },
    {
      title: "Achievements",
      copy: "1st Place at BrinAI-Deanatin 2025, Double Gold Medals at GEMASTIK (IoT & Web Dev), and Gold Medal at PIMNAS 28.",
    },
    {
      title: "Institutional Partners",
      copy: "Supported by BRIN, PT INTI Indonesia Makmur, PT Xirka Silicon Technology, and PT Meditrans.",
    },
  ];

  const targetMarkets = [
    {
      title: "Private Hospital & Clinic Network",
      copy: "For rapid TB pre-screening without reliance on laboratories.",
    },
    {
      title: "Public Space Operators",
      copy: "Airports, stations, transit terminals, and shopping centers to maintain public health surveillance.",
    },
    {
      title: "Government Agencies & Ministry of Health",
      copy: "Supporting the WHO End TB 2030 strategy through Active Case Finding (ACF).",
    },
  ];
</script>

<svelte:head>
  <title>TB VEctor — AI-Driven Audio-Visual System</title>
  <meta
    name="description"
    content="TB VEctor is an AI-driven audio-visual system for real-time tuberculosis pre-screening and spatial localization."
  />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link
    rel="preconnect"
    href="https://fonts.gstatic.com"
    crossorigin="anonymous"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Poppins:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="page-shell">
  <header class="site-header">
    <a class="brand-mark" href={resolve("/")} aria-label="TB VEctor home">
      <img src="/images/tbvector/image-16.png" alt="TB VEctor" />
    </a>
  </header>

  <main>
    <section class="hero" aria-labelledby="hero-title">
      <h1 id="hero-title" class="sr-only">TB VEctor</h1>
      <div class="hero-visual">
        <img
          src="/hero.png"
          alt="TB VEctor audio-visual detection device with TB VEctor branding and healthcare imagery"
        />
      </div>
      <p class="hero-subtitle">AI Driven Audio-Visual System</p>
    </section>

    <section
      class="section split-section"
      id="about"
      aria-labelledby="background-title"
    >
      <div class="section-heading">
        <span class="rule"></span>
        <h2 id="background-title">Problem &amp; Background</h2>
      </div>
      <div class="split-grid">
        <figure class="image-frame image-frame-wide">
          <img
            src="/images/tbvector/image-09.png"
            alt="Healthcare workers in a tuberculosis ward"
            loading="lazy"
          />
        </figure>
        <div class="body-copy">
          <p>
            Every year, millions of TB cases go undiagnosed and untreated,
            posing a transmission risk because current detection systems remain
            reactive — waiting for sick patients to seek care.
          </p>
          <p>
            Eight countries account for 67% of global TB cases, with Indonesia
            bearing 10% of the worldwide disease burden.
          </p>
          <p>
            Existing tools have limitations: portable X-ray machines are
            expensive, GeneXpert requires sputum samples and reagents, and
            standard acoustic AI applications lack spatial tracking capabilities
            in public spaces.
          </p>
        </div>
      </div>
    </section>

    <section class="section" id="how-it-works" aria-labelledby="how-title">
      <div class="section-heading">
        <span class="rule"></span>
        <h2 id="how-title">How It Works</h2>
      </div>
      <div class="process-layout">
        <ol class="process-list">
          {#each processSteps as step, index (step.title)}
            <li>
              <span class="step-number">0{index + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </div>
            </li>
          {/each}
        </ol>
        <figure class="image-frame device-frame">
          <img
            src="/images/tbvector/image-12.png"
            alt="TB VEctor device close-up"
            loading="lazy"
          />
        </figure>
      </div>
    </section>

    <section class="section" aria-labelledby="selling-title">
      <div class="section-heading centered">
        <span class="rule"></span>
        <h2 id="selling-title">Unique Selling Points</h2>
      </div>
      <div class="feature-layout">
        <figure class="image-frame feature-image">
          <img
            src="/USP.png"
            alt="A sustainable, human-centered future"
            loading="lazy"
          />
        </figure>
        <div class="feature-list">
          {#each sellingPoints as point (point.title)}
            <article>
              <span class="feature-dot"></span>
              <div>
                <h3>{point.title}</h3>
                <p>{point.copy}</p>
              </div>
            </article>
          {/each}
        </div>
      </div>
    </section>

    <section
      class="section"
      id="specification"
      aria-labelledby="specification-title"
    >
      <div class="section-heading centered">
        <span class="rule"></span>
        <h2 id="specification-title">Specification</h2>
      </div>
      <div class="two-column-copy">
        <div>
          <h3 class="column-title">AI Engine &amp; Hardware Specifications</h3>
          <ol>
            {#each specifications as item (item.title)}<li>
                <strong>{item.title}:</strong>
                {item.copy}
              </li>{/each}
          </ol>
        </div>
        <div>
          <h3 class="column-title">Validation &amp; Recognition</h3>
          <ol>
            {#each validation as item (item.title)}<li>
                <strong>{item.title}:</strong>
                {item.copy}
              </li>{/each}
          </ol>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="market-title">
      <div class="section-heading centered">
        <span class="rule"></span>
        <h2 id="market-title">Target Market</h2>
      </div>
      <div class="split-grid market-grid">
        <figure class="image-frame image-frame-wide">
          <img
            src="/Target market.png"
            alt="Targeting people in public spaces"
            loading="lazy"
          />
        </figure>
        <ol class="market-list">
          {#each targetMarkets as market (market.title)}<li>
              <strong>{market.title}:</strong>
              {market.copy}
            </li>{/each}
        </ol>
      </div>
    </section>

    <section
      class="section team-section"
      id="team"
      aria-labelledby="team-title"
    >
      <div class="section-heading centered">
        <span class="rule"></span>
        <h2 id="team-title">The People Behind</h2>
      </div>
      <div class="team-copy">
        <ol>
          <li>
            <strong>Chief Technology Officer:</strong> Dr. Dhany Arifianto (Principal
            Investigator Signal Processing, ITS)
          </li>
          <li>
            <strong>Chief Executive Officer:</strong> Luna Arafatul Nikmah (Lead Developer
            TB Vector, ITS)
          </li>
        </ol>
        <ol start="3">
          <li>
            <strong>Chief Medical Officer:</strong> Dr. Alfian Nur Rosyid (Pulmonologist
            Consultant RSUA)
          </li>
          <li>
            <strong>Technical &amp; Research:</strong> AI &amp; Algorithm, Software
            Development, Hardware Engineering, Embedded Systems, Clinical Affairs,
            Regulatory, Commercial &amp; Branding.
          </li>
        </ol>
      </div>
      <div class="team-gallery" aria-label="TB VEctor team photos">
        <img src="/footer.png" alt="TB VEctor team members" loading="lazy" />
      </div>
    </section>
  </main>

  <footer class="site-footer" id="contact">
    <div class="footer-content">
      <p class="footer-label">Links</p>
      <a
        href="https://www.linkedin.com/in/luna-arafatul-nikmah/"
        target="_blank"
        rel="noreferrer">linkedin.com/in/luna-arafatul-nikmah/</a
      ><a href="mailto:dnplab.its@gmail.com">dnplab.its@gmail.com</a><a
        href="mailto:lunaarafatul@gmail.com">lunaarafatul@gmail.com</a
      >
    </div>
    <div class="footer-brand">
      <img src="/images/tbvector/image-16.png" alt="TB VEctor" />
      <p>AI Driven Audio-Visual System</p>
    </div>
    <p class="footer-wordmark" aria-hidden="true">TB VEctor</p>
  </footer>
</div>

<style>
  :global(html) {
    scroll-behavior: smooth;
  }
  :global(body) {
    background: #fff;
    color: #06202b;
    font-family: "Poppins", sans-serif;
  }
  :global(*) {
    box-sizing: border-box;
  }
  .page-shell {
    overflow: hidden;
    background: #fff;
  }
  .site-header {
    align-items: center;
    display: flex;
    justify-content: center;
    left: 50%;
    padding: 1.15rem 1.5rem;
    position: absolute;
    top: 2.1rem;
    transform: translateX(-50%);
    width: 100%;
    z-index: 5;
  }
  .brand-mark {
    background: white;
    border-radius: 0.8rem;
    box-shadow: 0 4px 14px #06202b22;
    display: grid;
    padding: 0.6rem 0.95rem;
    place-items: center;
  }
  .brand-mark img {
    height: 2.8rem;
    width: auto;
  }
  .hero {
    background: #f5ece5;
    display: flex;
    flex-direction: column;
    height: min(100svh, 1113px);
    overflow: hidden;
    padding: 6rem 0 1.75rem;
    position: relative;
  }
  h2 {
    font-family: "Bebas Neue", Impact, sans-serif;
    font-weight: 400;
    letter-spacing: -0.025em;
  }
  .hero-visual {
    align-items: center;
    display: flex;
    flex: 1 1 auto;
    justify-content: center;
    min-height: 0;
    margin: 0 auto;
    max-width: 1440px;
    width: 100%;
  }
  .hero-visual img {
    display: block;
    height: 100%;
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
    width: auto;
  }
  .hero-subtitle {
    color: #077a7d;
    font-family: "Bebas Neue", sans-serif;
    font-size: clamp(1.25rem, 3.7vw, 3.4rem);
    letter-spacing: 0.04em;
    flex: 0 0 auto;
    margin: 0 auto;
    text-align: center;
  }
  .section {
    border-top: 2px solid #d9d9d9;
    margin: 0 auto;
    max-width: 1300px;
    padding: 5.5rem 1rem;
    scroll-margin-top: 4rem;
  }
  .section-heading {
    align-items: center;
    display: flex;
    gap: 1.25rem;
    margin-bottom: 3rem;
  }
  .section-heading.centered {
    justify-content: center;
  }
  .section-heading .rule {
    background: #077a7d;
    height: 0.25rem;
    width: 3.5rem;
  }
  .section-heading h2 {
    color: #077a7d;
    font-size: clamp(3rem, 6vw, 5.5rem);
    line-height: 0.9;
    margin: 0;
  }
  .split-grid,
  .process-layout,
  .feature-layout,
  .market-grid {
    align-items: center;
    display: grid;
    gap: clamp(2rem, 5vw, 5rem);
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
  .image-frame {
    background: #fff;
    border-radius: 1rem;
    box-shadow: 15px 20px 35px #06202b20;
    overflow: hidden;
  }
  .image-frame img {
    display: block;
    height: 100%;
    object-fit: cover;
    width: 100%;
  }
  .image-frame-wide {
    aspect-ratio: 1.85;
  }
  .body-copy,
  .process-list,
  .feature-list,
  .market-list,
  .two-column-copy {
    font-size: clamp(0.82rem, 1.2vw, 1rem);
    line-height: 1.75;
  }
  .body-copy p {
    margin: 0 0 1.4rem;
  }
  .body-copy p:last-child {
    margin-bottom: 0;
  }
  .process-layout {
    align-items: start;
  }
  .process-list,
  .market-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .process-list li {
    align-items: flex-start;
    display: flex;
    gap: 1rem;
    margin-bottom: 1.35rem;
  }
  .step-number {
    color: #077a7d;
    font-family: "Bebas Neue";
    font-size: 2rem;
    line-height: 1;
  }
  .process-list h3,
  .feature-list h3 {
    color: #077a7d;
    font-size: 1.2rem;
    margin: 0;
  }
  .process-list p,
  .feature-list p {
    margin: 0.15rem 0 0;
  }
  .device-frame {
    background: linear-gradient(150deg, #7ae2cf, #437c72);
    padding: 1.5rem;
  }
  .device-frame img {
    filter: drop-shadow(15px 22px 16px #06202b55);
    object-fit: contain;
  }
  .feature-layout {
    align-items: center;
  }
  .feature-image {
    aspect-ratio: 2.34;
    background: transparent;
    border-radius: 0;
    box-shadow: none;
  }
  .market-grid .image-frame {
    background: transparent;
    border-radius: 0;
    box-shadow: none;
  }
  .feature-list article {
    align-items: flex-start;
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  .feature-dot {
    background: #077a7d;
    border-radius: 50%;
    flex: 0 0 0.75rem;
    height: 0.75rem;
    margin-top: 0.55rem;
  }
  .two-column-copy {
    display: grid;
    gap: 3rem;
    grid-template-columns: 1fr 1fr;
  }
  .column-title {
    color: #077a7d;
    font-size: 1.15rem;
    margin: 0 0 1rem;
  }
  .two-column-copy ol {
    margin: 0;
    padding-left: 1.2rem;
  }
  .two-column-copy li,
  .market-list li {
    margin-bottom: 1rem;
    padding-left: 0.35rem;
  }
  .two-column-copy strong,
  .market-list strong {
    color: #077a7d;
  }
  .market-list {
    counter-reset: market;
    list-style: decimal;
    padding-left: 1.5rem;
  }
  .team-section {
    padding-bottom: 6rem;
  }
  .team-copy {
    display: grid;
    font-size: clamp(0.78rem, 1.05vw, 0.95rem);
    gap: 3rem;
    line-height: 1.75;
    grid-template-columns: repeat(2, 1fr);
    margin: 0 auto 2.5rem;
    max-width: 1220px;
  }
  .team-copy ol {
    margin: 0;
    padding-left: 1.5rem;
  }
  .team-copy li {
    margin-bottom: 1rem;
    padding-left: 0.35rem;
  }
  .team-copy strong {
    color: #077a7d;
  }
  .team-gallery {
    background: transparent;
    border-radius: 1.5rem;
    margin: 0 auto;
    max-width: 1275px;
    overflow: hidden;
    padding: 0;
  }
  .team-gallery img {
    display: block;
    height: auto;
    width: 100%;
  }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  .site-footer {
    align-items: flex-start;
    background: #06202b;
    color: #e6edf1;
    display: flex;
    justify-content: space-between;
    min-height: 32.875rem;
    overflow: hidden;
    padding: 3.75rem max(1.5rem, calc((100vw - 1300px) / 2)) 0;
    position: relative;
  }
  .site-footer > div {
    position: relative;
    z-index: 1;
  }
  .footer-label {
    color: white;
    font-family: "Bebas Neue";
    font-size: 1.8rem;
    letter-spacing: 0.05em;
    margin: 0 0 0.7rem;
  }
  .site-footer a {
    color: #e6edf1;
    display: block;
    font-size: clamp(0.85rem, 1.3vw, 1.15rem);
    margin: 0.35rem 0;
    text-decoration: none;
  }
  .site-footer a:hover {
    color: #7ae2cf;
  }
  .footer-brand {
    text-align: right;
  }
  .footer-brand img {
    filter: brightness(0) invert(1);
    max-width: 10rem;
    opacity: 0.9;
  }
  .footer-brand p {
    color: #7ae2cf;
    font-size: 0.7rem;
    margin: 0.35rem 0 0;
  }
  .footer-wordmark {
    bottom: -6rem;
    color: #0b2f3d;
    font-family: "Bebas Neue", Impact, sans-serif;
    font-size: clamp(12rem, 32vw, 23.75rem);
    left: 50%;
    line-height: 0.75;
    margin: 0;
    position: absolute;
    transform: translateX(-50%);
    white-space: nowrap;
    z-index: 0;
  }
  @media (max-width: 800px) {
    .site-header {
      padding: 0.75rem 0;
    }
    .brand-mark {
      padding: 0.45rem 0.65rem;
    }
    .brand-mark img {
      height: 1.8rem;
    }
    .hero {
      height: min(100svh, 720px);
      padding: 5rem 0 1rem;
    }
    .hero-subtitle {
      font-size: clamp(1rem, 5vw, 1.75rem);
    }
    .section {
      padding: 4rem 1rem;
    }
    .section-heading {
      align-items: flex-start;
      flex-direction: column;
      gap: 0.8rem;
      margin-bottom: 2rem;
    }
    .section-heading.centered {
      align-items: center;
    }
    .section-heading .rule {
      height: 0.2rem;
      width: 2.5rem;
    }
    .section-heading h2 {
      font-size: clamp(3rem, 14vw, 5rem);
    }
    .split-grid,
    .process-layout,
    .feature-layout,
    .two-column-copy,
    .team-copy {
      grid-template-columns: 1fr;
    }
    .image-frame-wide {
      aspect-ratio: 1.45;
    }
    .body-copy {
      font-size: 0.86rem;
    }
    .process-layout {
      gap: 2rem;
    }
    .device-frame {
      order: -1;
    }
    .feature-image {
      margin: 0 auto;
      max-width: 26rem;
      width: 100%;
    }
    .two-column-copy {
      gap: 2.25rem;
      font-size: 0.84rem;
    }
    .team-gallery {
      border-radius: 1rem;
    }
    .site-footer {
      align-items: flex-start;
      flex-direction: column;
      gap: 2.5rem;
      padding: 3rem 1.25rem;
    }
    .footer-brand {
      text-align: left;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :global(html) {
      scroll-behavior: auto;
    }
  }
</style>
