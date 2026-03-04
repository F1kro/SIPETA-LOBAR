import villages from '@/scripts/data/lombok-barat-villages.json'

type MasterVillage = {
  desa: string
  kecamatan: string
  latitude: number
  longitude: number
}

const masterVillages = villages as MasterVillage[]

const normalize = (value: string) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim()

export const getMasterWilayahList = () => masterVillages

export const getMasterDistricts = () =>
  Array.from(new Set(masterVillages.map((v) => v.kecamatan))).sort((a, b) => a.localeCompare(b))

export const getMasterVillagesByDistrict = (kecamatan: string) =>
  masterVillages
    .filter((v) => normalize(v.kecamatan) === normalize(kecamatan))
    .map((v) => v.desa)
    .sort((a, b) => a.localeCompare(b))

export const resolveMasterCoordinate = (kecamatan: string, desa: string) => {
  return (
    masterVillages.find(
      (v) => normalize(v.kecamatan) === normalize(kecamatan) && normalize(v.desa) === normalize(desa),
    ) || null
  )
}
