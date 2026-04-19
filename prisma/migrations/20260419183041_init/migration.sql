-- CreateTable
CREATE TABLE "users" (
    "tg_id" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_tg_id_key" ON "users"("tg_id");