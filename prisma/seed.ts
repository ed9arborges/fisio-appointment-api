import prisma from "../src/database/prisma"

async function main() {
  console.log("🌱 Starting seed...")

  // Create sample appointments
  const appointments = [
    {
      date: new Date("2025-09-10"),
      time: "11:00",
      client: "Ryan Dorwart",
    },
    {
      date: new Date("2025-09-10"),
      time: "13:00",
      client: "Livia Curtis",
    },
    {
      date: new Date("2025-09-10"),
      time: "14:00",
      client: "Randy Calzoni",
    },
    {
      date: new Date("2025-09-10"),
      time: "16:00",
      client: "Marley Franci",
    },
    {
      date: new Date("2025-09-10"),
      time: "17:00",
      client: "Jaylon Korsgaard",
    },
    {
      date: new Date("2025-09-10"),
      time: "21:00",
      client: "Maria Herwitz",
    },
  ]

  for (const appointment of appointments) {
    await prisma.appointment.create({
      data: appointment,
    })
  }

  console.log("✅ Seed completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
