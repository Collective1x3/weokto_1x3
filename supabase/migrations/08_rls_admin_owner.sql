-- Fonction helper pour check admin/owner
CREATE OR REPLACE FUNCTION is_admin_or_owner()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM "WeoktoUser"
    WHERE id = current_setting('app.user_id', true)::text
    AND "userType" IN ('ADMIN', 'OWNER')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Product: Owner/Admin peuvent tout
CREATE POLICY "Admins can manage products"
  ON "Product"
  FOR ALL
  USING (is_admin_or_owner())
  WITH CHECK (is_admin_or_owner());

-- Product: Public read
CREATE POLICY "Products are publicly readable"
  ON "Product"
  FOR SELECT
  USING ("isActive" = true);

-- Plan: Owner/Admin peuvent tout
CREATE POLICY "Admins can manage plans"
  ON "Plan"
  FOR ALL
  USING (is_admin_or_owner())
  WITH CHECK (is_admin_or_owner());

-- Plan: Public read
CREATE POLICY "Plans are publicly readable"
  ON "Plan"
  FOR SELECT
  USING ("isActive" = true);

-- ManualPaymentButton: Owner/Admin peuvent tout
CREATE POLICY "Admins can manage payment buttons"
  ON "ManualPaymentButton"
  FOR ALL
  USING (is_admin_or_owner())
  WITH CHECK (is_admin_or_owner());

-- Refund: Owner/Admin peuvent read/manage
CREATE POLICY "Admins can manage refunds"
  ON "Refund"
  FOR ALL
  USING (is_admin_or_owner())
  WITH CHECK (is_admin_or_owner());

-- Refund: Clients peuvent read leurs propres refunds
CREATE POLICY "Customers can read own refunds"
  ON "Refund"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "Customer"
      WHERE "Customer".id = "Refund"."customerId"
      AND "Customer"."stamUserId" = current_setting('app.stam_user_id', true)::text
    )
  );
