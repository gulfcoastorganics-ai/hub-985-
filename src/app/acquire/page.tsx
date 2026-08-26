import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Software Assets for Acquisition | FULCRUMHAUS",
  description:
    "Direct acquisition opportunities for four working software assets: TraceLens, VestraGlobe, PRISMATIC, and Vestra Intel.",
  robots: { index: true, follow: true },
};

type Asset = {
  name: string;
  price: string;
  eyebrow: string;
  summary: string;
  highlights: string[];
  checkout: string;
  repo?: string;
};

const assets: Asset[] = [
  {
    name: "TraceLens",
    price: "$2,500",
    eyebrow: "CAMERA / PWA / CREATIVE TOOLS",
    summary:
      "Camera-first browser software for aligning a reference image with a live camera view, including perspective, blend, guide, comparison, and workspace controls.",
    highlights: [
      "Static browser/PWA architecture",
      "Automated behavior tests and CI",
      "Camera + reference-overlay workflow",
      "Source, deployment config, docs + IP assignment",
    ],
    checkout: "https://buy.stripe.com/aFa5kF4CE3dq7mUfORbEA0l",
    repo: "https://github.com/gulfcoastorganics-ai/tracelens-web",
  },
  {
    name: "VestraGlobe",
    price: "$3,250",
    eyebrow: "WEBGL / INTERACTIVE PORTFOLIO",
    summary:
      "A cinematic interactive portfolio experience centered on a rotating WebGL project sphere with curved project panels, focus interactions, and detail transitions.",
    highlights: [
      "Distinctive WebGL presentation system",
      "Responsive interactive project surface",
      "Reusable agency / brand / portfolio foundation",
      "Source, deployment config, docs + IP assignment",
    ],
    checkout: "https://buy.stripe.com/00w14pb12aFSePm5adbEA0m",
    repo: "https://github.com/gulfcoastorganics-ai/vestraglobe",
  },
  {
    name: "PRISMATIC",
    price: "$4,500",
    eyebrow: "IMAGING / ANALYSIS / INSTRUMENT UI",
    summary:
      "A scientific-instrument-style imaging and material comparison application with calibration, reference loading, capture workflows, canvas analysis, and technical result surfaces.",
    highlights: [
      "High-end laboratory-console UX",
      "Capture, reference and comparison workflows",
      "Commercial white-label potential",
      "Source, design assets, docs + IP assignment",
    ],
    checkout: "https://buy.stripe.com/cNibJ32uwbJW6iQ6ehbEA0n",
  },
  {
    name: "Vestra Intel",
    price: "$7,500",
    eyebrow: "PUBLIC DATA / INTELLIGENCE / B2B",
    summary:
      "A public-data intelligence engine with source ingestion, opportunity scoring, evidence graphs, anomaly detection, research queues, FastAPI surfaces, and explicit compliance gates.",
    highlights: [
      "Multi-source ingestion and scoring engine",
      "Evidence graph + anomaly detection",
      "FastAPI endpoints and local dashboard",
      "Source, docs, deployment materials + IP assignment",
    ],
    checkout: "https://buy.stripe.com/3cI5kFc56cO04aI5adbEA0o",
    repo: "https://github.com/gulfcoastorganics-ai/VestraIntel-",
  },
];

export default function AcquisitionPage() {
  return (
    <main className={styles.page}>
      <div className={styles.grid} aria-hidden="true" />
      <section className={styles.hero}>
        <div className={styles.kicker}>FULCRUMHAUS // DIRECT SOFTWARE ACQUISITIONS</div>
        <h1>Four working software assets. One direct owner sale.</h1>
        <p className={styles.lead}>
          Acquire a single product or the complete portfolio. Each transaction includes the applicable source code,
          documentation, deployment materials, commercial IP assignment, and 14 days of reasonable transition support.
        </p>
        <div className={styles.heroActions}>
          <a className={styles.primary} href="https://buy.stripe.com/5kQ4gBd9a29mdLidGJbEA0p" target="_blank" rel="noreferrer">
            Acquire all four — $12,900
          </a>
          <a className={styles.secondary} href="mailto:gulfcoastorganics@gmail.com?subject=Software%20acquisition%20inquiry">
            Request diligence / make offer
          </a>
        </div>
        <div className={styles.signalRow}>
          <span>DIRECT OWNER SALE</span>
          <span>ONE-TIME ACQUISITION</span>
          <span>SECURE STRIPE CHECKOUT</span>
          <span>NEGOTIATED ESCROW AVAILABLE</span>
        </div>
      </section>

      <section className={styles.assets} aria-label="Software assets for sale">
        {assets.map((asset, index) => (
          <article className={styles.card} key={asset.name}>
            <div className={styles.cardNumber}>0{index + 1}</div>
            <div className={styles.eyebrow}>{asset.eyebrow}</div>
            <div className={styles.cardTitleRow}>
              <h2>{asset.name}</h2>
              <div className={styles.price}>{asset.price}</div>
            </div>
            <p>{asset.summary}</p>
            <ul>
              {asset.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className={styles.cardActions}>
              <a className={styles.primarySmall} href={asset.checkout} target="_blank" rel="noreferrer">
                Acquire at asking price
              </a>
              {asset.repo ? (
                <a className={styles.textLink} href={asset.repo} target="_blank" rel="noreferrer">
                  Inspect public repository ↗
                </a>
              ) : (
                <a className={styles.textLink} href={`mailto:gulfcoastorganics@gmail.com?subject=${encodeURIComponent(asset.name + " diligence request")}`}>
                  Request private diligence ↗
                </a>
              )}
            </div>
          </article>
        ))}
      </section>

      <section className={styles.portfolio}>
        <div>
          <div className={styles.kicker}>PORTFOLIO ACQUISITION</div>
          <h2>$17,750 individual asking value. $12,900 portfolio price.</h2>
          <p>
            The portfolio checkout covers TraceLens, VestraGlobe, PRISMATIC, and Vestra Intel in one negotiated handoff.
            This route is intended for agencies, software operators, serial founders, and strategic buyers that can reuse,
            commercialize, white-label, or continue developing multiple assets.
          </p>
        </div>
        <a className={styles.primary} href="https://buy.stripe.com/5kQ4gBd9a29mdLidGJbEA0p" target="_blank" rel="noreferrer">
          Acquire portfolio — $12,900
        </a>
      </section>

      <section className={styles.process}>
        <div className={styles.kicker}>TRANSFER PROCESS</div>
        <div className={styles.steps}>
          <div><strong>01</strong><span>Buyer completes diligence or purchases at the asking price.</span></div>
          <div><strong>02</strong><span>Buyer and seller execute the asset purchase / IP assignment documents.</span></div>
          <div><strong>03</strong><span>Repositories, documentation, deployment material and applicable assets are transferred.</span></div>
          <div><strong>04</strong><span>Fourteen-day transition window begins for reasonable handoff questions.</span></div>
        </div>
        <p className={styles.legal}>
          Stripe checkout secures payment but does not by itself transfer intellectual-property ownership. Final ownership transfers only after cleared funds and executed written transfer documents. Vestra Intel buyers remain responsible for applicable legal, licensing, privacy, and regulatory requirements in their intended operating jurisdictions.
        </p>
      </section>

      <footer className={styles.footer}>
        <div>FULCRUMHAUS // SOFTWARE ASSET DESK</div>
        <a href="mailto:gulfcoastorganics@gmail.com">gulfcoastorganics@gmail.com</a>
      </footer>
    </main>
  );
}
