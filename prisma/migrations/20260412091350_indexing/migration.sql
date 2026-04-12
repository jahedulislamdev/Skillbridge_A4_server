-- CreateIndex
CREATE INDEX "availableSlots_tutorId_idx" ON "availableSlots"("tutorId");

-- CreateIndex
CREATE INDEX "bookings_studentId_idx" ON "bookings"("studentId");

-- CreateIndex
CREATE INDEX "bookings_tutorId_slotId_idx" ON "bookings"("tutorId", "slotId");

-- CreateIndex
CREATE INDEX "reviews_bookingId_idx" ON "reviews"("bookingId");

-- CreateIndex
CREATE INDEX "reviews_studentId_idx" ON "reviews"("studentId");

-- CreateIndex
CREATE INDEX "tutorsprofile_userId_idx" ON "tutorsprofile"("userId");
