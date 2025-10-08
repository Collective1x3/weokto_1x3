-- Formation: Clients avec Customer actif peuvent read
CREATE POLICY "Active customers can read formations"
  ON "Formation"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "Customer"
      WHERE "Customer"."productId" = "Formation"."productId"
      AND "Customer"."stamUserId" = current_setting('app.stam_user_id', true)::text
      AND "Customer"."status" = 'ACTIVE'
    )
  );

-- Module: Via formation
CREATE POLICY "Customers can read modules"
  ON "Module"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "Formation" f
      JOIN "Customer" c ON c."productId" = f."productId"
      WHERE f.id = "Module"."formationId"
      AND c."stamUserId" = current_setting('app.stam_user_id', true)::text
      AND c."status" = 'ACTIVE'
    )
  );

-- Lesson: Via module
CREATE POLICY "Customers can read lessons"
  ON "Lesson"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "Module" m
      JOIN "Formation" f ON f.id = m."formationId"
      JOIN "Customer" c ON c."productId" = f."productId"
      WHERE m.id = "Lesson"."moduleId"
      AND c."stamUserId" = current_setting('app.stam_user_id', true)::text
      AND c."status" = 'ACTIVE'
    )
  );

-- LessonProgress: Users peuvent read/write leur propre progression
CREATE POLICY "Users can manage own lesson progress"
  ON "LessonProgress"
  FOR ALL
  USING ("userId" = current_setting('app.stam_user_id', true)::text)
  WITH CHECK ("userId" = current_setting('app.stam_user_id', true)::text);
