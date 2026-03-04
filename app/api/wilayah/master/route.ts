import { NextResponse } from 'next/server'
import { getMasterDistricts, getMasterVillagesByDistrict, getMasterWilayahList } from '@/lib/wilayah-master'

export async function GET() {
  try {
    const districts = getMasterDistricts()
    const villagesByDistrict = Object.fromEntries(
      districts.map((district) => [district, getMasterVillagesByDistrict(district)]),
    )

    return NextResponse.json({
      districts,
      villagesByDistrict,
      raw: getMasterWilayahList(),
    })
  } catch (error) {
    console.error('GET Wilayah Master Error:', error)
    return NextResponse.json({ error: 'Gagal mengambil referensi wilayah' }, { status: 500 })
  }
}
