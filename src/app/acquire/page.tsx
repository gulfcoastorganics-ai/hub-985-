import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Software Assets for Acquisition | FULCRUMHAUS",
  description:
    "Direct owner sale of four transferable software assets: TraceLens, VestraGlobe, PRISMATIC, and Vestra Intel.",
  robots: { index: true, follow: true },
};

type Asset = {
  name: string;
  price: string;
  eyebrow: string;
  summary: string;
  buyerFit: string;
  proof: string[];
  useCases: string[];
  checkout: string;
  repo?: string;
};

const assets: Asset[] = [
  {
    name: "TraceLens",
    price: "$2,500",
    eyebrow: "CREATIVE CAMERA WORKFLOW / PWA",
    summary:
      "A browser-based camera and reference-alignment tool for artists, makers, educators, and visual documentation workflows.",
    buyerFit:
      "Best fit for an art app, drawing-reference product, tattoo/design workflow, camera utility, education platform, or portfolio operator that wants a finished feature foundation instead of starting from a blank repo.",
    proof: [
      "Live-camera plus reference-overlay workflow",
      "Perspective, blend, guide, comparison, and workspace controls",
      "Static browser/PWA structure with automated behavior tests and CI",
      "Lowest-friction acquisition in the portfolio",
    ],
    useCases: ["Ship as a niche paid tool", "Add to an existing creative app", "Use as a white-label client feature"],
    checkout: "https://buy.stripe.com/aFa5kF4CE3dq7mUfORbEA0l",
    repo: "https://github.com/gulfcoastorganics-ai/tracelens-web",
  },
  {
    name: "VestraGlobe",
    price: "$3,250",
    eyebrow: "WEBGL / INTERACTIVE PORTFOLIO SYSTEM",
    summary:
      "A cinematic interactive portfolio foundation built around a rotating WebGL project sphere, curved project panels, and focus-to-detail interactions.",
    buyerFit:
      "Best fit for a WebGL studio, creative agency, premium template seller, founder-brand agency, or productized-service shop that can reuse the interaction model across client launches.",
    proof: [
      "Distinctive 3D project-surface concept",
      "Reusable portfolio/product-showcase structure",
      "Responsive interactive presentation layer",
      "Natural white-label foundation for agencies and 3D web sellers",
    ],
    useCases: ["Resell as a premium template", "Convert into a client-site starter", "Use as an agency capability demo"],
    checkout: "https://buy.stripe.com/00w14pb12aFSePm5adbEA0m",
    repo: "https://github.com/gulfcoastorganics-ai/vestraglobe",
  },
  {
    name: "PRISMATIC",
    price: "$4,500",
    eyebrow: "IMAGING / ANALYSIS / INSTRUMENT UI",
    summary:
      "A scientific-instrument-style imaging and material-comparison application with capture, calibration, reference loading, canvas analysis, and result surfaces.",
    buyerFit:
      "Best fit for color-measurement, inspection, coatings, materials, lab-equipment, machine-vision, or industrial UX teams that need a polished analysis interface or R&D software foundation.",
    proof: [
      "High-end laboratory-console UX",
      "Capture, reference, comparison, calibration, and export-oriented workflows",
      "Strong white-label potential for instrument and inspection companies",
      "Useful as either source IP or a client-facing demo accelerator",
    ],
    useCases: ["Bundle with measurement hardware", "Use as an R&D interface prototype", "White-label for inspection workflows"],
    checkout: "https://buy.stripe.com/cNibJ32uwbJW6iQ6ehbEA0n",
  },
  {
    name: "Vestra Intel",
    price: "$7,500",
    eyebrow: "PUBLIC DATA / INTELLIGENCE / B2B INFRASTRUCTURE",
    summary:
      "A public-data intelligence engine with source ingestion, opportunity scoring, evidence graphs, anomaly detection, research queues, API surfaces, and compliance gates.",
    buyerFit:
      "Best fit for public-record intelligence, unclaimed-property software, investigative data, legal-tech, compliance, asset-recovery infrastructure, or vertical-data operators that already understand regulated workflows.",
    proof: [
      "Multi-source ingestion and scoring engine",
      "Evidence graph plus anomaly detection structure",
      "FastAPI endpoints, dashboard surfaces, and deployment materials",
      "Explicit compliance framing: discovery infrastructure, not entitlement claims",
    ],
    useCases: ["Extend a regulated data platform", "Use as internal research infrastructure", "Turn into a vertical B2B SaaS module"],
    checkout: "https://buy.stripe.com/3cI5kFc56cO04aI5adbEA0o",
    repo: "https://github.com/gulfcoastorganics-ai/VestraIntel-",
  },
];

export default function AcquisitionPage() {
  return (
    <main className={styles.page}>
      <div className={styles.grid} aria-hidden="true" />
      <section className={styles.hero}>
        <div className={styles.kicker}>FULCRUMHAUS // DIRECT SOFTWARE ASSET SALE</div>
        <h1>Transferable source assets for operators who can move faster than a greenfield build.</h1>
        <p className={styles.lead}>
          This is a direct owner sale of working software foundations, not a claim of existing revenue. Each purchase includes
          applicable source code, documentation, deployment material, commercial IP assignment, and 14 days of reasonable transition support.
        </p>
        <div className={styles.heroActions}>
          <a className={styles.primary} href="https://buy.stripe.com/5kQ4gBd9a29mdLidGJbEA0p" target="_blank" rel="noreferrer">
            Acquire all four — $12,900
          </a>
          <a className={styles.secondary} href="mailto:gulfcoastorganics@gmail.com?subject=Software%20acquisition%20diligence%20request">
            Request diligence / make offer
          </a>
        </div>
        <div className={styles.signalRow}>
          <span>DIRECT OWNER SALE</span>
          <span>PRE-REVENUE SOURCE/IP ASSETS</span>
          <span>ONE-PURCHASE CHECKOUT LINKS</span>
          <span>ESCROW AVAILABLE FOR NEGOTIATED DEALS</span>
        </div>
      </section>

      <section className={styles.positioning}>
        <div>
          <div className={styles.kicker}>BUYER POSITIONING</div>
          <h2>Priced for strategic reuse, not speculative startup valuation.</h2>
        </div>
        <p>
          The strongest buyer is not a passive investor. The strongest buyer is a software operator, agency, vertical vendor,
          or product team that can turn existing implementation into distribution, client work, or a faster roadmap.
        </p>
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
            <div className={styles.fit}>{asset.buyerFit}</div>
            <ul>
              {asset.proof.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className={styles.useCases}>
              {asset.useCases.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
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
            The portfolio route is intended for agencies, software operators, serial founders, and strategic buyers that can reuse,
            commercialize, white-label, or continue developing multiple assets. It gives one buyer four independent software foundations
            at a lower combined price than buying each asset separately.
          </p>
        </div>
        <a className={styles.primary} href="https://buy.stripe.com/5kQ4gBd9a29mdLidGJbEA0p" target="_blank" rel="noreferrer">
          Acquire portfolio — $12,900
        </a>
      </section>

      <section className={styles.process}>
        <div className={styles.kicker}>TRANSFER PROCESS</div>
        <div className={styles.steps}>
          <div><strong>01</strong><span>Buyer completes diligence, makes an offer, or purchases at the asking price.</span></div>
          <div><strong>02</strong><span>Buyer and seller execute asset purchase and IP assignment documents.</span></div>
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
