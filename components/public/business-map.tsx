'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface BusinessItem {
  id: string
  desa: string
  kecamatan: string
}

interface RegionItem {
  id: string
  desa: string
  kecamatan: string
  latitude: number
  longitude: number
}

interface GeoFeature {
  type: 'Feature'
  properties: {
    shape_index?: number
    regionKey?: string
    desa?: string
    kecamatan?: string
  }
  geometry: {
    type: 'Polygon' | 'MultiPolygon'
    coordinates: number[][][] | number[][][][]
  }
}

interface GeoFeatureCollection {
  type: 'FeatureCollection'
  features: GeoFeature[]
}

interface BusinessMapProps {
  businesses?: BusinessItem[]
  selectedRegionKey?: string
  activeDistrict?: string
  activeVillage?: string
  onSelectRegion?: (regionKey: string) => void
  onLoadingChange?: (loading: boolean) => void
  onErrorChange?: (message: string | null) => void
}

const LOBAR_CENTER: [number, number] = [-8.65, 116.1]
const ALL_LABEL = 'Semua'

const safeRegionKey = (kecamatan?: string, desa?: string) =>
  `${(kecamatan || '').trim()}::${(desa || '').trim()}`

const parseRegionKey = (regionKey?: string) => {
  const [kecamatan, desa] = String(regionKey || '').split('::')
  return {
    kecamatan: (kecamatan || '').trim(),
    desa: (desa || '').trim(),
  }
}

const colorFromKey = (key: string) => {
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  }

  const hue = hash % 360
  return {
    fill: `hsl(${hue}, 68%, 58%)`,
    border: `hsl(${hue}, 70%, 36%)`,
  }
}

const pointInRing = (point: [number, number], ring: number[][]) => {
  let inside = false
  const [x, y] = point

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0]
    const yi = ring[i][1]
    const xj = ring[j][0]
    const yj = ring[j][1]

    const intersects = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / ((yj - yi) || 1e-12) + xi
    if (intersects) inside = !inside
  }

  return inside
}

const pointInPolygon = (point: [number, number], polygon: number[][][]) => {
  if (!polygon.length) return false
  if (!pointInRing(point, polygon[0])) return false

  for (let i = 1; i < polygon.length; i++) {
    if (pointInRing(point, polygon[i])) {
      return false
    }
  }

  return true
}

const pointInGeometry = (
  point: [number, number],
  geometry: { type: 'Polygon' | 'MultiPolygon'; coordinates: number[][][] | number[][][][] },
) => {
  if (geometry.type === 'Polygon') {
    return pointInPolygon(point, geometry.coordinates as number[][][])
  }

  const multi = geometry.coordinates as number[][][][]
  return multi.some((polygon) => pointInPolygon(point, polygon))
}

export default function BusinessMap({
  businesses = [],
  selectedRegionKey,
  activeDistrict = ALL_LABEL,
  activeVillage = ALL_LABEL,
  onSelectRegion,
  onLoadingChange,
  onErrorChange,
}: BusinessMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const polygonLayerRef = useRef<L.LayerGroup | null>(null)
  const markerLayerRef = useRef<L.LayerGroup | null>(null)

  const [regions, setRegions] = useState<RegionItem[]>([])
  const [featureCollection, setFeatureCollection] = useState<GeoFeatureCollection | null>(null)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [mapInitialized, setMapInitialized] = useState(false)
  const [loadingError, setLoadingError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const businessCountByRegion = useMemo(() => {
    const countMap = new Map<string, number>()

    businesses.forEach((item) => {
      const key = safeRegionKey(item.kecamatan, item.desa)
      countMap.set(key, (countMap.get(key) || 0) + 1)
    })

    return countMap
  }, [businesses])

  const effectiveFilter = useMemo(() => {
    const selected = parseRegionKey(selectedRegionKey)

    const district = activeDistrict !== ALL_LABEL ? activeDistrict : selected.kecamatan || ALL_LABEL
    const village = activeVillage !== ALL_LABEL ? activeVillage : selected.desa || ALL_LABEL

    return {
      district,
      village,
    }
  }, [activeDistrict, activeVillage, selectedRegionKey])

  useEffect(() => {
    let mounted = true

    const loadData = async () => {
      try {
        setLoadingError(null)
        setDataLoaded(false)
        const [regionsRes, geoRes] = await Promise.all([
          fetch('/api/wilayah'),
          fetch('/ADMINISTRASIDESA_AR.geojson'),
        ])

        if (!regionsRes.ok || !geoRes.ok) {
          throw new Error('Gagal memuat data peta. Periksa koneksi lalu coba lagi.')
        }

        if (!mounted) return

        const [regionsData, geoData] = await Promise.all([regionsRes.json(), geoRes.json()])

        const normalizedRegions: RegionItem[] = (Array.isArray(regionsData) ? regionsData : [])
          .filter(
            (item) =>
              Number.isFinite(Number(item?.latitude)) &&
              Number.isFinite(Number(item?.longitude)) &&
              Number(item?.latitude) !== 0 &&
              Number(item?.longitude) !== 0,
          )
          .map((item) => ({
            id: String(item.id),
            desa: String(item.desa || ''),
            kecamatan: String(item.kecamatan || ''),
            latitude: Number(item.latitude),
            longitude: Number(item.longitude),
          }))

        const features = Array.isArray(geoData?.features) ? geoData.features : []

        const patchedFeatures: GeoFeature[] = features
          .map((feature: GeoFeature, featureIndex: number) => {
            const geometry = feature?.geometry
            if (!geometry || (geometry.type !== 'Polygon' && geometry.type !== 'MultiPolygon')) {
              return null
            }

            const sourceDesa = String(feature?.properties?.desa || '').trim()
            const sourceKecamatan = String(feature?.properties?.kecamatan || '').trim()

            const matchedByName = normalizedRegions.find(
              (region) =>
                region.desa.toLowerCase() === sourceDesa.toLowerCase() &&
                region.kecamatan.toLowerCase() === sourceKecamatan.toLowerCase(),
            )

            const matchedByGeometry = normalizedRegions.find((region) =>
              pointInGeometry([region.longitude, region.latitude], geometry),
            )

            const matched = matchedByName || matchedByGeometry

            if (!matched) {
              return {
                ...feature,
                properties: {
                  ...feature.properties,
                  shape_index: featureIndex,
                },
              }
            }

            return {
              ...feature,
              properties: {
                ...feature.properties,
                shape_index: featureIndex,
                regionKey: safeRegionKey(matched.kecamatan, matched.desa),
                desa: matched.desa,
                kecamatan: matched.kecamatan,
              },
            }
          })
          .filter(Boolean) as GeoFeature[]

        setRegions(normalizedRegions)
        setFeatureCollection({ type: 'FeatureCollection', features: patchedFeatures })
        setDataLoaded(true)
      } catch (error) {
        console.error('Failed to load map layers:', error)
        if (!mounted) return
        setRegions([])
        setFeatureCollection(null)
        setLoadingError('Data polygon peta gagal dimuat.')
      }
    }

    loadData()

    return () => {
      mounted = false
    }
  }, [reloadKey])

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return

    const map = L.map(mapContainer.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView(LOBAR_CENTER, 11)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
    L.control.zoom({ position: 'topright' }).addTo(map)
    polygonLayerRef.current = L.layerGroup().addTo(map)
    markerLayerRef.current = L.layerGroup().addTo(map)
    mapRef.current = map
    setMapInitialized(true)

    setTimeout(() => map.invalidateSize(), 300)

    return () => {
      map.remove()
      mapRef.current = null
      setMapInitialized(false)
    }
  }, [])

  const mapLoading = !loadingError && (!dataLoaded || !mapInitialized)

  useEffect(() => {
    onLoadingChange?.(mapLoading)
  }, [mapLoading, onLoadingChange])

  useEffect(() => {
    onErrorChange?.(loadingError)
  }, [loadingError, onErrorChange])

  useEffect(() => {
    const map = mapRef.current
    const polygonLayer = polygonLayerRef.current
    const markerLayer = markerLayerRef.current
    if (!map || !polygonLayer || !markerLayer || !featureCollection) return

    polygonLayer.clearLayers()
    markerLayer.clearLayers()

    const regionLayers = new Map<string, L.Layer[]>()
    const districtLayers = new Map<string, L.Layer[]>()

    const addMapLayer = (targetMap: Map<string, L.Layer[]>, key: string, layer: L.Layer) => {
      const existing = targetMap.get(key) || []
      existing.push(layer)
      targetMap.set(key, existing)
    }

    const isDistrictFiltered = effectiveFilter.district !== ALL_LABEL
    const isVillageFiltered = effectiveFilter.village !== ALL_LABEL

    featureCollection.features.forEach((feature) => {
      const regionKey = feature.properties?.regionKey || ''
      const desa = feature.properties?.desa || 'Desa Tidak Terpetakan'
      const kecamatan = feature.properties?.kecamatan || '-'
      const count = regionKey ? businessCountByRegion.get(regionKey) || 0 : 0
      const isSelectedRegion = regionKey !== '' && regionKey === selectedRegionKey

      const inActiveDistrict = !isDistrictFiltered || kecamatan === effectiveFilter.district
      const inActiveVillage = !isVillageFiltered || desa === effectiveFilter.village
      const isInScope = inActiveDistrict && inActiveVillage

      const palette = colorFromKey(regionKey || String(feature.properties?.shape_index || 0))

      const layer = L.geoJSON(feature as any, {
        style: {
          color: isInScope ? (isSelectedRegion ? '#0f172a' : palette.border) : '#cbd5e1',
          weight: isSelectedRegion ? 3 : isInScope ? 1.7 : 1,
          fillColor: isInScope ? palette.fill : '#e5e7eb',
          fillOpacity: isInScope ? (isSelectedRegion ? 0.68 : 0.46) : 0.08,
          dashArray: isInScope ? undefined : '3 3',
        },
        onEachFeature: (_: any, polygon: any) => {
          polygon.bindTooltip(`${desa}, ${kecamatan}`, {
            direction: 'top',
            opacity: 0.95,
          })

          polygon.bindPopup(
            `
            <div style="min-width:220px;font-family:'Poppins',sans-serif;">
              <div style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;">Kecamatan ${kecamatan}</div>
              <div style="font-size:14px;font-weight:900;color:#0f172a;text-transform:uppercase;margin:2px 0 8px;">${desa}</div>
              <div style="font-size:12px;color:#1e3a8a;font-weight:700;">${count} usaha terdaftar</div>
              <div style="font-size:11px;color:#64748b;margin-top:4px;">Klik area ini untuk memfilter daftar usaha.</div>
            </div>
          `,
          )

          if (regionKey) {
            polygon.on('click', () => onSelectRegion?.(regionKey))
            addMapLayer(regionLayers, regionKey, polygon)
            addMapLayer(districtLayers, kecamatan, polygon)
          }
        },
      })

      layer.addTo(polygonLayer)
    })

    const createPinIcon = (highlight = false) =>
      L.divIcon({
        className: '',
        html: `
          <div style="width:${highlight ? 34 : 30}px;height:${highlight ? 34 : 30}px;filter:drop-shadow(0 8px 12px rgba(0,0,0,.25));">
            <svg viewBox="0 0 24 24" width="${highlight ? 34 : 30}" height="${highlight ? 34 : 30}" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" fill="${highlight ? '#ef4444' : '#2563eb'}"/>
              <circle cx="12" cy="10" r="2.8" fill="#ffffff"/>
            </svg>
          </div>
        `,
        iconSize: [highlight ? 34 : 30, highlight ? 34 : 30],
        iconAnchor: [highlight ? 17 : 15, highlight ? 30 : 26],
      })

    if (isDistrictFiltered) {
      const markerRegions = regions.filter((r) => {
        if (r.kecamatan !== effectiveFilter.district) return false
        if (isVillageFiltered) return r.desa === effectiveFilter.village
        return true
      })

      markerRegions.forEach((r) => {
        const isFocus = isVillageFiltered
        L.marker([r.latitude, r.longitude], { icon: createPinIcon(isFocus) })
          .bindTooltip(`${r.desa}, ${r.kecamatan}`, { direction: 'top', opacity: 0.95 })
          .addTo(markerLayer)
      })
    }

    if (selectedRegionKey && regionLayers.has(selectedRegionKey)) {
      const bounds = L.featureGroup(regionLayers.get(selectedRegionKey) || []).getBounds()
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 })
        return
      }
    }

    if (isDistrictFiltered && districtLayers.has(effectiveFilter.district)) {
      const bounds = L.featureGroup(districtLayers.get(effectiveFilter.district) || []).getBounds()
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [30, 30], maxZoom: isVillageFiltered ? 14 : 12 })
        return
      }
    }

    const allLayers: L.Layer[] = []
    polygonLayer.eachLayer((layer: any) => allLayers.push(layer))
    const allBounds = L.featureGroup(allLayers).getBounds()
    if (allBounds.isValid()) {
      map.fitBounds(allBounds, { padding: [30, 30], maxZoom: 11 })
    }
  }, [featureCollection, regions, businessCountByRegion, selectedRegionKey, onSelectRegion, effectiveFilter])

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainer} className="w-full h-full bg-slate-100" />
      {mapLoading && (
        <div className="absolute inset-0 z-[1100] bg-white/75 backdrop-blur-sm flex items-center justify-center">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-md text-sm font-bold text-slate-700">
            <span className="inline-block w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            Memuat polygon peta...
          </div>
        </div>
      )}
      {loadingError && (
        <div className="absolute inset-0 z-[1101] bg-white/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-sm w-full rounded-2xl border border-red-200 bg-white p-4 shadow-lg text-center space-y-3">
            <p className="text-sm font-black text-red-700">Gagal memuat peta</p>
            <p className="text-xs font-semibold text-slate-600">{loadingError}</p>
            <button
              type="button"
              onClick={() => setReloadKey((prev) => prev + 1)}
              className="w-full rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider px-4 py-3"
            >
              Coba Muat Ulang
            </button>
          </div>
        </div>
      )}
      <div className="absolute left-3 bottom-3 z-[800] bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl p-3 shadow-md text-[10px] font-bold uppercase tracking-wider text-slate-600 space-y-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-sm bg-blue-500" />
          <span>Wilayah Aktif</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-sm bg-slate-200 border border-slate-300" />
          <span>Wilayah Non Aktif</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow" />
          <span>Pin Filter Kecamatan</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow" />
          <span>Pin Fokus Desa</span>
        </div>
      </div>
    </div>
  )
}
