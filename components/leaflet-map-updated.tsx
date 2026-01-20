"use client"

import { useEffect, useRef, useState } from "react"

interface LeafletMapUpdatedProps {
  onSelectRegion: (region: string) => void
  selectedDistrict?: string
  selectedVillage?: string
}

const REGIONS = [
  { id: "Sekotong-Gili Meno", label: "Gili Meno", district: "Sekotong", lat: -8.361, lng: 116.078 },
  { id: "Sekotong-Gili Air", label: "Gili Air", district: "Sekotong", lat: -8.358, lng: 116.088 },
  { id: "Lembar-Lembar", label: "Lembar", district: "Lembar", lat: -8.653, lng: 116.045 },
  { id: "Lingsar-Lingsar", label: "Lingsar", district: "Lingsar", lat: -8.517, lng: 116.272 },
  { id: "Bayan-Senaru", label: "Senaru", district: "Bayan", lat: -8.187, lng: 116.395 },
]

const DISTRICT_BOUNDS: Record<string, { lat1: number; lat2: number; lng1: number; lng2: number }> = {
  Sekotong: { lat1: -8.42, lat2: -8.3, lng1: 116.0, lng2: 116.15 },
  Lembar: { lat1: -8.7, lat2: -8.6, lng1: 115.95, lng2: 116.1 },
  Lingsar: { lat1: -8.6, lat2: -8.43, lng1: 116.2, lng2: 116.35 },
  Bayan: { lat1: -8.27, lat2: -8.1, lng1: 116.3, lng2: 116.45 },
}
export function LeafletMapUpdated({ onSelectRegion, selectedDistrict, selectedVillage }: LeafletMapUpdatedProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const highlightLayerRef = useRef<any>(null)
  const [L, setL] = useState<any>(null)

  // 1. Inisialisasi Peta (Hanya Sekali)
  useEffect(() => {
    const initMap = async () => {
      if (typeof window === "undefined" || !mapRef.current) return

      // ✅ KUNCI UTAMA: Cek apakah container sudah pernah dipakai Leaflet
      // Jika sudah ada _leaflet_id, jangan pernah inisialisasi ulang
      if ((mapRef.current as any)._leaflet_id) {
        console.log("Peta sudah ada, melewati inisialisasi.");
        return
      }

      const leaflet = await import("leaflet")
      const LeafletLib = leaflet.default
      setL(LeafletLib)

      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link")
        link.id = "leaflet-css"
        link.rel = "stylesheet"
        link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
        document.head.appendChild(link)
      }

      // Pastikan container benar-benar kosong dari sisa-sisa render gagal sebelumnya
      if (!mapInstanceRef.current) {
        const instance = LeafletLib.map(mapRef.current, {
          zoomControl: true,
          scrollWheelZoom: false
        }).setView([-8.4, 116.2], 10)

        LeafletLib.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap",
          maxZoom: 19,
        }).addTo(instance)

        mapInstanceRef.current = instance
      }
    }

    initMap().catch(console.error)

    return () => {
      // ✅ Cleanup yang lebih bersih
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off()
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // 2. Update Marker & Highlight
  useEffect(() => {
    // Gunakan mapInstanceRef.current langsung untuk memastikan sinkronisasi
    const map = mapInstanceRef.current
    if (!map || !L) return

    // Hapus marker lama
    markersRef.current.forEach((m) => map.removeLayer(m))
    markersRef.current = []

    // Hapus highlight lama
    if (highlightLayerRef.current) {
      map.removeLayer(highlightLayerRef.current)
      highlightLayerRef.current = null
    }

    const customIcon = L.icon({
      iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232563eb'%3E%3Cpath d='M12 2C7.03 2 3 6.03 3 11c0 5.25 9 13 9 13s9-7.75 9-13c0-4.97-4.03-9-9-9zm0 11.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    })

    const selectedIcon = L.icon({
      iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ef4444'%3E%3Cpath d='M12 2C7.03 2 3 6.03 3 11c0 5.25 9 13 9 13s9-7.75 9-13c0-4.97-4.03-9-9-9zm0 11.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E",
      iconSize: [35, 35],
      iconAnchor: [17, 35],
    })

    REGIONS.forEach((region) => {
      const isSelected = selectedVillage && selectedDistrict && region.id === `${selectedDistrict}-${selectedVillage}`
      const marker = L.marker([region.lat, region.lng], { icon: isSelected ? selectedIcon : customIcon })
        .addTo(map)
        .bindPopup(`<div style="font-weight: bold; text-align: center;">${region.label}</div>`)

      marker.on("click", () => onSelectRegion(region.id))
      markersRef.current.push(marker)

      if (isSelected) {
        map.flyTo([region.lat, region.lng], 13, { duration: 1.5 })
      }
    })

    // Highlight Distrik
    if (selectedDistrict && !selectedVillage) {
      const bounds = DISTRICT_BOUNDS[selectedDistrict]
      if (bounds) {
        const rectangle = L.rectangle([[bounds.lat2, bounds.lng1], [bounds.lat1, bounds.lng2]], {
          color: "#2563eb", weight: 2, opacity: 0.5, fill: true, fillColor: "#2563eb", fillOpacity: 0.1
        }).addTo(map)
        highlightLayerRef.current = rectangle
        map.fitBounds(rectangle.getBounds(), { padding: [40, 40] })
      }
    }
  }, [L, selectedDistrict, selectedVillage, onSelectRegion])

  return (
    <div className="w-full h-full relative group">
      <style jsx global>{`
        .leaflet-control-container .leaflet-top,
        .leaflet-control-container .leaflet-bottom {
          z-index: 400 !important;
        }
      `}</style>
      
      <div
        ref={mapRef}
        className="w-full h-full z-0"
        style={{ minHeight: "100%", background: "#f8fafc" }}
      />
    </div>
  )
}