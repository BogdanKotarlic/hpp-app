import { Currency } from "../constants";

export interface PaymentSummary {
  uuid: string;
  merchantDisplayName: string;
  reference: string;
  quoteStatus: "TEMPLATE" | "ACCEPTED";
  status: "PENDING" | "EXPIRED";
  displayCurrency: {
    amount: number;
    currency: string;
  };
  paidCurrency: {
    amount: number;
    currency: Currency | null;
  };
  acceptanceExpiryDate?: number;
  expiryDate?: number;
  address?: {
    address: string;
    uri: string;
  };
}
