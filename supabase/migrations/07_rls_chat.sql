-- Channel: Members de la guilde peuvent read
CREATE POLICY "Guild members can read channels"
  ON "Channel"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "CommunityMember"
      WHERE "CommunityMember"."communityId" = "Channel"."communityId"
      AND "CommunityMember"."userId" = current_setting('app.user_id', true)::text
    )
  );

-- Message: Members du channel peuvent read
CREATE POLICY "Channel members can read messages"
  ON "Message"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "Channel" ch
      JOIN "CommunityMember" cm ON cm."communityId" = ch."communityId"
      WHERE ch.id = "Message"."channelId"
      AND cm."userId" = current_setting('app.user_id', true)::text
    )
  );

-- Message: Members peuvent send messages
CREATE POLICY "Members can send messages"
  ON "Message"
  FOR INSERT
  WITH CHECK (
    "authorId" = current_setting('app.user_id', true)::text
    AND EXISTS (
      SELECT 1 FROM "Channel" ch
      JOIN "CommunityMember" cm ON cm."communityId" = ch."communityId"
      WHERE ch.id = "Message"."channelId"
      AND cm."userId" = current_setting('app.user_id', true)::text
    )
  );

-- DirectMessage: Users peuvent read leurs DMs
CREATE POLICY "Users can read own direct messages"
  ON "DirectMessage"
  FOR SELECT
  USING (
    "senderId" = current_setting('app.user_id', true)::text
    OR "recipientId" = current_setting('app.user_id', true)::text
  );

-- DirectMessage: Users peuvent send DMs
CREATE POLICY "Users can send direct messages"
  ON "DirectMessage"
  FOR INSERT
  WITH CHECK ("senderId" = current_setting('app.user_id', true)::text);
