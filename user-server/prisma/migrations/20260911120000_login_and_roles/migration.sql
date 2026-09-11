-- Вход по логину вместо email, имя/фамилия и роль.
-- Если в базе уже есть пользователи, логином становится их email,
-- а именем (когда его не было) — часть email до «@».
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

ALTER TABLE "User" RENAME COLUMN "name" TO "firstName";

ALTER TABLE "User"
    ADD COLUMN "login" TEXT,
    ADD COLUMN "lastName" TEXT,
    ADD COLUMN "role" "Role" NOT NULL DEFAULT 'USER';

UPDATE "User"
SET "login" = lower("email"),
    "firstName" = COALESCE(NULLIF(trim("firstName"), ''), split_part("email", '@', 1));

ALTER TABLE "User"
    ALTER COLUMN "login" SET NOT NULL,
    ALTER COLUMN "firstName" SET NOT NULL,
    DROP COLUMN "email";

CREATE UNIQUE INDEX "User_login_key" ON "User"("login");
