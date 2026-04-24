-- AlterTable
ALTER TABLE "users" ADD CONSTRAINT "users_pkey" PRIMARY KEY ("tg_id");

-- DropIndex
DROP INDEX "users_tg_id_key";

-- CreateTable
CREATE TABLE "students" (
    "id" SERIAL NOT NULL,
    "course" INTEGER NOT NULL,
    "department" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "record_book_id" INTEGER NOT NULL,
    "semester" INTEGER NOT NULL,
    "study_direction" TEXT NOT NULL,
    "study_profile" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "deadline" TIMESTAMP(3) NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "discipline" TEXT NOT NULL,
    "id" INTEGER NOT NULL,
    "alias" TEXT,
    "current_grade" DOUBLE PRECISION,
    "max_grade" DOUBLE PRECISION,
    "name" TEXT,
    "type" TEXT NOT NULL,
    "week" INTEGER NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "students_userId_key" ON "students"("userId");

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("tg_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("tg_id") ON DELETE RESTRICT ON UPDATE CASCADE;
