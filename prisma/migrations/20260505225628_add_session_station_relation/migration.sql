-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "ChargingStation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
