import { API_BASE_URL } from "../constants";
import axios from "axios";

export const getPaymentSummary = async (uuid: string) => {
  const res = await axios.get(`${API_BASE_URL}/${uuid}/summary`);
  return res.data;
};
