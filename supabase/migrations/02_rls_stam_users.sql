-- StamUser: Users peuvent lire leur propre profil
CREATE POLICY "Users can read own profile"
  ON "StamUser"
  FOR SELECT
  USING (id = current_setting('app.stam_user_id', true)::text);

-- StamUser: Users peuvent update leur propre profil
CREATE POLICY "Users can update own profile"
  ON "StamUser"
  FOR UPDATE
  USING (id = current_setting('app.stam_user_id', true)::text)
  WITH CHECK (id = current_setting('app.stam_user_id', true)::text);

-- StamSession: Users peuvent lire leurs sessions
CREATE POLICY "Users can read own sessions"
  ON "StamSession"
  FOR SELECT
  USING ("userId" = current_setting('app.stam_user_id', true)::text);

-- StamSession: Service role full access
CREATE POLICY "Service role full access"
  ON "StamSession"
  FOR ALL
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');
