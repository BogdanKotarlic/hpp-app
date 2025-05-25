import { API_BASE_URL } from "../constants";
import axios from "axios";

export const updatePaymentSummary = async (uuid: string, currency: string) => {
  const res = await axios.put(`${API_BASE_URL}/${uuid}/update/summary`, {
    currency,
    payInMethod: "crypto",
  });
  return res.data;
};

export const acceptPaymentSummary = async (uuid: string) => {
  const res = await axios.put(`${API_BASE_URL}/${uuid}/accept/summary`, {
    successUrl: "no_url",
  });
  return res.data;
};
