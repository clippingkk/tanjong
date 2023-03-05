import { request } from "../utils/apollo";

export type StripeError = {
  code: string;
  doc_url: string;
  status: number;
  message: string;
  param: string;
  request_id: string;
  request_log_url: string;
  type: string;
}

export function getPaymentSheet() {
  return request<{
    paymentIntent: string
    ephemeralKey: string
    customer: string
  }>('/v2/payment-sheet', {
    method: 'POST'
  })
}
