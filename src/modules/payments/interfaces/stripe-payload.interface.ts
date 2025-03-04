export interface StripePayload {
  stripePaymentId: string;
  orderId: string;
  receiptUrl: string | null;
}
