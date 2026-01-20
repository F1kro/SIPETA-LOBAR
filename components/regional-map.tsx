"use client"

interface RegionalMapProps {
  onSelectRegion: (region: string) => void
}

const REGIONS = [
  { id: "Sekotong-Gili Meno", label: "Gili Meno", x: "15%", y: "20%" },
  { id: "Sekotong-Gili Air", label: "Gili Air", x: "18%", y: "25%" },
  { id: "Lembar-Lembar", label: "Lembar", x: "35%", y: "65%" },
  { id: "Lingsar-Lingsar", label: "Lingsar", x: "55%", y: "50%" },
  { id: "Bayan-Senaru", label: "Senaru", x: "75%", y: "15%" },
]

export function RegionalMap({ onSelectRegion }: RegionalMapProps) {
  return (
    <div className="relative w-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg overflow-hidden aspect-video">
      {/* Map visualization with positioned markers */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Background coastline-like shape (simplified Lombok outline) */}
        <defs>
          <pattern id="water" patternUnits="userSpaceOnUse" width="4" height="4">
            <rect width="4" height="4" fill="#e0f2fe" />
            <circle cx="2" cy="2" r="1" fill="#bfdbfe" opacity="0.3" />
          </pattern>
        </defs>

        {/* Land areas */}
        <path
          d="M 10 15 L 30 10 L 50 5 L 70 10 L 85 20 L 88 40 L 85 60 L 80 75 L 60 85 L 40 88 L 20 85 L 10 75 Z"
          fill="#f5f5f5"
          stroke="#d4d4d8"
          strokeWidth="0.5"
        />

        {/* Water areas */}
        <rect width="100" height="100" fill="#e0f2fe" />
        <path
          d="M 10 15 L 30 10 L 50 5 L 70 10 L 85 20 L 88 40 L 85 60 L 80 75 L 60 85 L 40 88 L 20 85 L 10 75 Z"
          fill="#f5f5f4"
        />

        {/* Grid for reference */}
        <g stroke="#e5e7eb" strokeWidth="0.2" opacity="0.3">
          <line x1="0" y1="25" x2="100" y2="25" />
          <line x1="0" y1="50" x2="100" y2="50" />
          <line x1="0" y1="75" x2="100" y2="75" />
          <line x1="25" y1="0" x2="25" y2="100" />
          <line x1="50" y1="0" x2="50" y2="100" />
          <line x1="75" y1="0" x2="75" y2="100" />
        </g>
      </svg>

      {/* Interactive region buttons */}
      <div className="absolute inset-0">
        {REGIONS.map((region) => (
          <button
            key={region.id}
            onClick={() => onSelectRegion(region.id)}
            style={{ left: region.x, top: region.y, transform: "translate(-50%, -50%)" }}
            className="absolute group"
            title={region.label}
          >
            {/* Marker circle */}
            <div className="relative">
              <div className="w-8 h-8 bg-primary rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:w-10 hover:h-10 transition-all duration-200 hover:shadow-xl">
                <div className="w-3 h-3 bg-primary-foreground rounded-full" />
              </div>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-foreground text-foreground-foreground text-xs font-semibold rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                {region.label}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 text-xs">
        <p className="font-semibold text-foreground mb-2">Cara Penggunaan</p>
        <p className="text-muted-foreground">Klik marker untuk memilih wilayah</p>
      </div>
    </div>
  )
}
