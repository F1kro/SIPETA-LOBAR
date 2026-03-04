const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

const rdtrDistricts = ["batulayar", "narmada", "sekotong"]
const norm = (s) => String(s || "").toLowerCase().replace(/\s+/g, "")

async function main() {
  const all = await prisma.wilayah.findMany({
    select: { id: true, kecamatan: true, statusRdtr: true },
  })

  const inRdtr = all.filter((w) => rdtrDistricts.includes(norm(w.kecamatan)))
  const outRdtr = all.filter((w) => !rdtrDistricts.includes(norm(w.kecamatan)))

  const rProses = await prisma.wilayah.updateMany({
    where: { id: { in: outRdtr.map((w) => w.id) } },
    data: { statusRdtr: "Proses" },
  })

  const rTersedia = await prisma.wilayah.updateMany({
    where: { id: { in: inRdtr.map((w) => w.id) } },
    data: { statusRdtr: "Tersedia" },
  })

  const summary = await prisma.wilayah.groupBy({
    by: ["statusRdtr"],
    _count: { _all: true },
  })

  console.log(
    JSON.stringify(
      {
        total: all.length,
        inRdtr: inRdtr.length,
        outRdtr: outRdtr.length,
        updatedProses: rProses.count,
        updatedTersedia: rTersedia.count,
        summary,
      },
      null,
      2,
    ),
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
