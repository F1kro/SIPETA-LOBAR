'use client'
import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Mapping Ikon berdasarkan Sektor
const SECTOR_ICONS: { [key: string]: string } = {
  'Pariwisata': '🌴', 
  'Pertanian': '🌾',
  'Perikanan': '🐟',
  'Perdagangan': '🏪',
  'Industri': '🏭',
  'Jasa': '💼',
  'Lainnya': '📍',
}

const getSectorIcon = (sektor: string): string => {
  return SECTOR_ICONS[sektor] || SECTOR_ICONS['Lainnya']
}

export default function BusinessMap({ businesses = [], onShowDetail }: any) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const markersRef = useRef<{ [key: string]: L.Marker }>({})

  useEffect(() => {
    if (!mapContainer.current || map.current) return
    map.current = L.map(mapContainer.current, { zoomControl: false, attributionControl: false }).setView([-8.65, 116.1], 11)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.current)
    L.control.zoom({ position: 'topright' }).addTo(map.current)
    setTimeout(() => map.current?.invalidateSize(), 500)
  }, [])

  useEffect(() => {
    if (!map.current) return
    Object.values(markersRef.current).forEach((m) => map.current?.removeLayer(m))
    markersRef.current = {}

    if (businesses.length > 0) {
      const latLngs: L.LatLng[] = []

      businesses.forEach((u: any) => {
        const position = new L.LatLng(u.latitude, u.longitude)
        latLngs.push(position)

        const icon = L.divIcon({
          html: `<div class="flex items-center justify-center w-10 h-10 bg-white rounded-xl shadow-xl border-2 border-white hover:border-blue-500 transition-all">
                  <span class="text-xl">${getSectorIcon(u.sektor)}</span>
                 </div>`,
          iconSize: [40, 40],
          className: 'custom-marker',
        })

        const marker = L.marker(position, { icon }).addTo(map.current!)
        
        // POPUP DENGAN GAMBAR & INFO DESA (Sesuai Referensi)
        const popupContent = document.createElement('div')
        popupContent.className = "p-0 min-w-[220px] font-poppins overflow-hidden"
        popupContent.innerHTML = `
          <div class="w-full h-24 bg-gray-200 mb-2">
            <img src="${u.gambar || '/placeholder.jpg'}" class="w-full h-full object-cover" />
          </div>
          <div class="p-2 pt-0">
            <div class="text-[9px] font-bold text-blue-600 uppercase mb-1 flex items-center gap-1">
              <span>${getSectorIcon(u.sektor)}</span> ${u.sektor}
            </div>
            <div class="text-[12px] font-extrabold text-gray-800 leading-tight mb-1 uppercase">
              ${u.nama}
            </div>
            <div class="text-[10px] text-gray-500 mb-3">
              ${u.desa}, ${u.kecamatan}, Kab. Lombok Barat
            </div>
            <button id="btn-popup-${u.id}" class="w-full bg-blue-600 text-white text-[10px] py-2 rounded-lg font-bold hover:bg-blue-700 transition">
              LIHAT DETAIL
            </button>
          </div>
        `

        marker.bindPopup(popupContent, { offset: [0, -10] })
        
        marker.on('popupopen', () => {
          document.getElementById(`btn-popup-${u.id}`)?.addEventListener('click', () => {
            // Arahkan ke halaman detail
            window.location.href = `/peta-usaha/${u.id}`;
          })
        })
        markersRef.current[u.id] = marker
      })

      const bounds = L.latLngBounds(latLngs)
      map.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 })
    }
  }, [businesses])

  return <div ref={mapContainer} className="w-full h-full bg-gray-100" />
}