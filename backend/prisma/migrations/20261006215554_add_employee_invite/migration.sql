-- CreateTable
CREATE TABLE "EmployeeInvite" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "usedBy" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmployeeInvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeInvite_token_key" ON "EmployeeInvite"("token");
