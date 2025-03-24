/*
  Warnings:

  - You are about to drop the `_ProjectTasks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProjectTasks" DROP CONSTRAINT "_ProjectTasks_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectTasks" DROP CONSTRAINT "_ProjectTasks_B_fkey";

-- DropTable
DROP TABLE "_ProjectTasks";

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
