-- Community: Public read (pour affichage landing pages)
CREATE POLICY "Communities are publicly readable"
  ON "Community"
  FOR SELECT
  USING ("isActive" = true);

-- CommunityMember: Users peuvent lire memberships de leur guilde
CREATE POLICY "Members can read guild members"
  ON "CommunityMember"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "CommunityMember" AS cm
      WHERE cm."userId" = current_setting('app.user_id', true)::text
      AND cm."communityId" = "CommunityMember"."communityId"
    )
  );

-- CommunityMember: Users peuvent join/leave
CREATE POLICY "Users can manage own membership"
  ON "CommunityMember"
  FOR ALL
  USING ("userId" = current_setting('app.user_id', true)::text)
  WITH CHECK ("userId" = current_setting('app.user_id', true)::text);
