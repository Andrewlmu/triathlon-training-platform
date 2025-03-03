-- AlterTable
ALTER TABLE "Workout" ADD COLUMN     "labelId" TEXT;

-- CreateTable
CREATE TABLE "WorkoutLabel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkoutLabel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkoutLabel" ADD CONSTRAINT "WorkoutLabel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "WorkoutLabel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
