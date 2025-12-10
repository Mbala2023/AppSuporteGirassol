export function SunflowerLogo() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-colors"
    >
      {/* Folhas */}
      <ellipse
        cx="12"
        cy="8"
        rx="4"
        ry="8"
        fill="currentColor"
        className="text-green-700"
        transform="rotate(-45 12 8)"
      />
      <ellipse
        cx="28"
        cy="8"
        rx="4"
        ry="8"
        fill="currentColor"
        className="text-green-700"
        transform="rotate(45 28 8)"
      />
      <ellipse
        cx="8"
        cy="24"
        rx="3"
        ry="7"
        fill="currentColor"
        className="text-green-700"
        transform="rotate(-60 8 24)"
      />
      <ellipse
        cx="32"
        cy="24"
        rx="3"
        ry="7"
        fill="currentColor"
        className="text-green-700"
        transform="rotate(60 32 24)"
      />

      {/* Pétalas amarelas externas */}
      <circle cx="20" cy="4" r="3.5" fill="currentColor" className="text-yellow-600" />
      <circle cx="28" cy="7" r="3.5" fill="currentColor" className="text-yellow-600" transform="rotate(45 28 7)" />
      <circle cx="32" cy="15" r="3.5" fill="currentColor" className="text-yellow-600" transform="rotate(90 32 15)" />
      <circle cx="28" cy="23" r="3.5" fill="currentColor" className="text-yellow-600" transform="rotate(135 28 23)" />
      <circle cx="20" cy="26" r="3.5" fill="currentColor" className="text-yellow-600" />
      <circle cx="12" cy="23" r="3.5" fill="currentColor" className="text-yellow-600" transform="rotate(-135 12 23)" />
      <circle cx="8" cy="15" r="3.5" fill="currentColor" className="text-yellow-600" transform="rotate(-90 8 15)" />
      <circle cx="12" cy="7" r="3.5" fill="currentColor" className="text-yellow-600" transform="rotate(-45 12 7)" />

      {/* Pétalas amarelas internas */}
      <circle cx="20" cy="9" r="2.5" fill="currentColor" className="text-yellow-500" />
      <circle cx="25" cy="12" r="2.5" fill="currentColor" className="text-yellow-500" />
      <circle cx="27" cy="18" r="2.5" fill="currentColor" className="text-yellow-500" />
      <circle cx="25" cy="24" r="2.5" fill="currentColor" className="text-yellow-500" />
      <circle cx="20" cy="27" r="2.5" fill="currentColor" className="text-yellow-500" />
      <circle cx="15" cy="24" r="2.5" fill="currentColor" className="text-yellow-500" />
      <circle cx="13" cy="18" r="2.5" fill="currentColor" className="text-yellow-500" />
      <circle cx="15" cy="12" r="2.5" fill="currentColor" className="text-yellow-500" />

      {/* Miolo preto */}
      <circle cx="20" cy="17" r="8" fill="currentColor" className="text-black" />

      {/* Sementes do miolo */}
      <circle cx="18" cy="14" r="1.2" fill="currentColor" className="text-yellow-400" opacity="0.8" />
      <circle cx="22" cy="14" r="1.2" fill="currentColor" className="text-yellow-400" opacity="0.8" />
      <circle cx="17" cy="18" r="1.2" fill="currentColor" className="text-yellow-400" opacity="0.8" />
      <circle cx="23" cy="18" r="1.2" fill="currentColor" className="text-yellow-400" opacity="0.8" />
      <circle cx="18" cy="22" r="1.2" fill="currentColor" className="text-yellow-400" opacity="0.8" />
      <circle cx="22" cy="22" r="1.2" fill="currentColor" className="text-yellow-400" opacity="0.8" />
    </svg>
  )
}
