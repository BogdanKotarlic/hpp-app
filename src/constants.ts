export const API_BASE_URL = "https://api.sandbox.bvnk.com/api/v1/pay";

export const CURRENCIES = ["BTC", "ETH", "LTC"] as const;

export type Currency = (typeof CURRENCIES)[number];

export const ROUTES = {
  accept: (uuid: string) => `/payin/${uuid}`,
  pay: (uuid: string) => `/payin/${uuid}/pay`,
  expired: (uuid: string) => `/payin/${uuid}/expired`,
};
