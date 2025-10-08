-- AffiliateProfile: Users peuvent lire leur propre profil affilié
CREATE POLICY "Affiliates can read own profile"
  ON "AffiliateProfile"
  FOR SELECT
  USING ("userId" = current_setting('app.user_id', true)::text);

-- AffiliateCommission: Affiliés peuvent lire leurs commissions
CREATE POLICY "Affiliates can read own commissions"
  ON "AffiliateCommission"
  FOR SELECT
  USING ("affiliateId" = current_setting('app.user_id', true)::text);

-- AffiliateCommission: Service role (backend) peut tout
CREATE POLICY "Service role full access commissions"
  ON "AffiliateCommission"
  FOR ALL
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- AffiliateLedgerEntry: Affiliés peuvent lire leur ledger
CREATE POLICY "Affiliates can read own ledger"
  ON "AffiliateLedgerEntry"
  FOR SELECT
  USING ("affiliateId" = current_setting('app.user_id', true)::text);

-- WithdrawalRequest: Affiliés peuvent lire leurs withdrawals
CREATE POLICY "Affiliates can read own withdrawals"
  ON "WithdrawalRequest"
  FOR SELECT
  USING ("affiliateId" = current_setting('app.user_id', true)::text);

-- WithdrawalRequest: Affiliés peuvent create withdrawal
CREATE POLICY "Affiliates can create withdrawal"
  ON "WithdrawalRequest"
  FOR INSERT
  WITH CHECK ("affiliateId" = current_setting('app.user_id', true)::text);
