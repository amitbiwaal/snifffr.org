/** Lightweight inline hero illustration (no extra request). */
export function HeroArt() {
  return (
    <svg
      className="hero-art"
      viewBox="0 0 620 280"
      role="img"
      aria-label="Snifffr feet pics marketplace dashboard showing earnings and secure private sales"
    >
      <defs>
        <linearGradient id="hero-g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f97316" />
          <stop offset="1" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="620" height="280" rx="18" fill="#ffffff" stroke="#ece6f7" />
      <rect x="24" y="24" width="260" height="232" rx="14" fill="#faf7ff" stroke="#ece6f7" />
      <circle cx="80" cy="80" r="30" fill="url(#hero-g1)" opacity=".18" />
      <text x="80" y="90" fontSize="30" textAnchor="middle">
        👣
      </text>
      <rect x="128" y="62" width="130" height="14" rx="7" fill="#ece6f7" />
      <rect x="128" y="86" width="90" height="12" rx="6" fill="#f0eaf9" />
      <rect x="44" y="140" width="220" height="14" rx="7" fill="#ece6f7" />
      <rect x="44" y="168" width="180" height="12" rx="6" fill="#f0eaf9" />
      <rect x="44" y="196" width="200" height="12" rx="6" fill="#f0eaf9" />
      <rect x="312" y="24" width="284" height="110" rx="14" fill="url(#hero-g1)" />
      <text x="332" y="70" fontSize="16" fill="#ffffff" opacity=".85">
        Total earned
      </text>
      <text x="332" y="104" fontSize="30" fill="#ffffff" fontWeight="700">
        $4,820.00
      </text>
      <rect x="312" y="146" width="135" height="110" rx="14" fill="#faf7ff" stroke="#ece6f7" />
      <text x="332" y="186" fontSize="13" fill="#52466b">
        Private sales
      </text>
      <text x="332" y="214" fontSize="24" fill="#1f1633" fontWeight="700">
        328
      </text>
      <rect x="461" y="146" width="135" height="110" rx="14" fill="#faf7ff" stroke="#ece6f7" />
      <text x="481" y="186" fontSize="13" fill="#52466b">
        Anonymity
      </text>
      <text x="481" y="214" fontSize="24" fill="#1f1633" fontWeight="700">
        100%
      </text>
    </svg>
  )
}
