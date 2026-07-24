/**
 * The page's signature element: a continuous ECG-style waveform.
 * It idles as a slow, steady heartbeat. While an audit is running,
 * `isScanning` speeds the sweep up to signal activity.
 */
export default function PulseLine({ isScanning = false }) {
  return (
    <svg
      viewBox="0 0 700 90"
      className="w-full h-16 md:h-20"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        className={`pulse-line-path pulse-line-track ${isScanning ? "is-scanning" : ""}`}
        d="M0,45 L120,45 L145,45 L160,12 L180,78 L200,25 L220,45 L260,45
           L400,45 L420,45 L435,12 L450,78 L470,25 L490,45 L530,45
           L680,45 L700,45"
      />
    </svg>
  );
}
