-- WeoktoUser: Users peuvent lire leur propre profil
CREATE POLICY "Users can read own profile"
  ON "WeoktoUser"
  FOR SELECT
  USING (id = current_setting('app.user_id', true)::text);

-- WeoktoUser: Users peuvent update leur propre profil
CREATE POLICY "Users can update own profile"
  ON "WeoktoUser"
  FOR UPDATE
  USING (id = current_setting('app.user_id', true)::text)
  WITH CHECK (id = current_setting('app.user_id', true)::text);

-- WeoktoSession: Users peuvent lire leurs propres sessions
CREATE POLICY "Users can read own sessions"
  ON "WeoktoSession"
  FOR SELECT
  USING ("userId" = current_setting('app.user_id', true)::text);

-- WeoktoSession: Service role peut tout faire (backend)
CREATE POLICY "Service role full access"
  ON "WeoktoSession"
  FOR ALL
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');
