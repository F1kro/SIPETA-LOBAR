"use client"

import { useEffect, useRef, useState } from "react"

interface LeafletMapUpdatedProps {
  onSelectRegion: (region: string) => void
  selectedDistrict?: string
  selectedVillage?: string
}

interface WilayahDB {
  id: string
  kecamatan: string
  desa: string
  latitude: number
  longitude: number
}

export function LeafletMapUpdated({ onSelectRegion, selectedDistrict, selectedVillage }: LeafletMapUpdatedProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [L, setL] = useState<any>(null)
  const [regions, setRegions] = useState<WilayahDB[]>([])

  // 1. Fetch Data Wilayah dari Database
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const res = await fetch('/api/wilayah')
        if (res.ok) {
          const data = await res.json()
          setRegions(data)
        }
      } catch (error) {
        console.error("Error fetching map regions:", error)
      }
    }
    fetchRegions()
  }, [])

  // 2. Inisialisasi Peta dengan Proteksi Double Initialization
  useEffect(() => {
    const initMap = async () => {
      if (typeof window === "undefined" || !mapRef.current) return

      // CEK DOUBLE INITIALIZATION: Jika instance sudah ada atau div punya _leaflet_id, stop.
      if (mapInstanceRef.current || (mapRef.current as any)._leaflet_id) {
        return
      }

      // Import Leaflet secara dinamis
      const leaflet = await import("leaflet")
      const LeafletLib = leaflet.default
      setL(LeafletLib)

      // Tambahkan CSS Leaflet jika belum ada
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link")
        link.id = "leaflet-css"
        link.rel = "stylesheet"
        link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
        document.head.appendChild(link)
      }

      // Paksa bersihkan ID leaflet pada container (Solusi Ampuh Error)
      if (mapRef.current) {
        (mapRef.current as any)._leaflet_id = null;
      }

      const instance = LeafletLib.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: false,
        fadeAnimation: true,
        markerZoomAnimation: true
      }).setView([-8.68, 116.12], 11) // Default Fokus Lombok Barat

      LeafletLib.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
        maxZoom: 19,
      }).addTo(instance)

      mapInstanceRef.current = instance
    }

    initMap().catch(console.error)

    return () => {
      // CLEANUP: Hapus instance saat komponen unmount/refresh
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off()
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // 3. Update Marker & FlyTo berdasarkan data dinamis
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !L || regions.length === 0) return

    // Bersihkan marker lama sebelum render baru
    markersRef.current.forEach((m) => map.removeLayer(m))
    markersRef.current = []

    const customIcon = L.icon({
      iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232563eb'%3E%3Cpath d='M12 2C7.03 2 3 6.03 3 11c0 5.25 9 13 9 13s9-7.75 9-13c0-4.97-4.03-9-9-9zm0 11.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    })

    const selectedIcon = L.icon({
      iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ef4444'%3E%3Cpath d='M12 2C7.03 2 3 6.03 3 11c0 5.25 9 13 9 13s9-7.75 9-13c0-4.97-4.03-9-9-9zm0 11.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E",
      iconSize: [38, 38],
      iconAnchor: [19, 38],
    })

    regions.forEach((region) => {
      const isSelected = selectedVillage && selectedDistrict && 
                         region.kecamatan === selectedDistrict && 
                         region.desa === selectedVillage

      const marker = L.marker([region.latitude, region.longitude], { 
        icon: isSelected ? selectedIcon : customIcon,
        zIndexOffset: isSelected ? 1000 : 0 
      })
      .addTo(map)
      .bindPopup(`
        <div style="text-align: center; font-family: 'Poppins', sans-serif;">
          <div style="font-weight: 900; text-transform: uppercase; font-size: 12px; color: #0f172a;">${region.desa}</div>
          <div style="color: #64748b; font-size: 10px; font-weight: 700; margin-top: 2px;">KEC. ${region.kecamatan}</div>
        </div>
      `)

      marker.on("click", () => onSelectRegion(`${region.kecamatan}-${region.desa}`))
      markersRef.current.push(marker)

      if (isSelected) {
        map.flyTo([region.latitude, region.longitude], 14, {
          duration: 2,
          easeLinearity: 0.25
        })
        marker.openPopup()
      }
    })

    // Auto Zoom Out jika hanya pilih Kecamatan
    if (selectedDistrict && !selectedVillage) {
      const districtMarkers = regions
        .filter(r => r.kecamatan === selectedDistrict)
        .map(r => L.latLng(r.latitude, r.longitude))
      
      if (districtMarkers.length > 0) {
        const bounds = L.latLngBounds(districtMarkers)
        map.fitBounds(bounds, { padding: [50, 50] })
      }
    }
  }, [L, regions, selectedDistrict, selectedVillage, onSelectRegion])

  return (
    <div className="w-full h-full relative group">
      <style jsx global>{`
        .leaflet-container {
          font-family: 'Poppins', sans-serif !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 16px !important;
          padding: 4px !important;
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1) !important;
        }
        .leaflet-popup-tip-container {
          display: none !important; /* Hilangkan ujung lancip popup biar lebih modern */
        }
        .leaflet-control-zoom {
          border: 2px solid #f1f5f9 !important;
          border-radius: 12px !important;
          overflow: hidden;
          margin-top: 20px !important;
          margin-left: 20px !important;
        }
        .leaflet-control-zoom-in, .leaflet-control-zoom-out {
          background-color: white !important;
          color: #64748b !important;
          font-weight: bold !important;
        }
      `}</style>
      
      <div
        ref={mapRef}
        className="w-full h-full z-0"
        style={{ minHeight: "100%", background: "#f1f5f9" }}
      />
    </div>
  )
}