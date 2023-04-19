import { PrismaClient, Prisma } from "@prisma/client";
import moment from "moment";

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);
  await prisma.user.create({
    data: {
      email: "dustin.a.roan@gmail.com",
      name: "Dustin",
      taskLists: {
        create: {
          name: "Test Tasklist",
          tasks: {
            createMany: {
              data: [
                {
                  name: "Current Task",
                  nextScheduledDate: moment.utc().startOf("day").toISOString(),
                  lastCompletedDate: moment
                    .utc()
                    .subtract(1, "day")
                    .startOf("day")
                    .toISOString(),
                  frequencyBase: "DAYS",
                  frequencyUnits: 1,
                },
                {
                  name: "Future Task",
                  nextScheduledDate: moment
                    .utc()
                    .add(1, "weeks")
                    .startOf("day")
                    .toISOString(),
                  lastCompletedDate: moment.utc().startOf("day").toISOString(),
                  frequencyBase: "WEEKS",
                  frequencyUnits: 1,
                },
              ],
            },
          },
        },
      },
    },
  });
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
