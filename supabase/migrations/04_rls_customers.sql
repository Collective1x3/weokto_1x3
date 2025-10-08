-- Customer: Users peuvent lire leurs propres customers
CREATE POLICY "Stam users can read own customers"
  ON "Customer"
  FOR SELECT
  USING ("stamUserId" = current_setting('app.stam_user_id', true)::text);

-- Invoice: Via customer
CREATE POLICY "Users can read own invoices"
  ON "Invoice"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "Customer"
      WHERE "Customer".id = "Invoice"."customerId"
      AND "Customer"."stamUserId" = current_setting('app.stam_user_id', true)::text
    )
  );
