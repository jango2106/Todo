-- CreateEnum
CREATE TYPE "FrequencyBase" AS ENUM ('NONE', 'DAYS', 'WEEKS', 'MONTHS', 'YEARS');

-- CreateTable
CREATE TABLE "task" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "next_scheduled_date" TIMESTAMP(3) NOT NULL DEFAULT '2000-01-01 00:00:00 +00:00',
    "last_scheduled_date" TIMESTAMP(3) NOT NULL DEFAULT '2000-01-01 00:00:00 +00:00',
    "frequency_base" "FrequencyBase" NOT NULL,
    "frequency_units" INTEGER NOT NULL,
    "task_list_id" TEXT NOT NULL,

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_list" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,

    CONSTRAINT "task_list_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_list" FOREIGN KEY ("task_list_id") REFERENCES "task_list"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_list" ADD CONSTRAINT "task_list_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
