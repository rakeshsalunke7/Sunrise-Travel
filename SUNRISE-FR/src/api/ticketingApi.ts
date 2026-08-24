import axiosClient from "./axiosClient";
import type { Booking } from "./types";

export const ticketingApi = {
  issue: async (bookingId: number) => {
    const { data } = await axiosClient.post<Booking>(`/api/tickets/${bookingId}/issue`);
    return data;
  },
  cancel: async (bookingId: number) => {
    const { data } = await axiosClient.post<Booking>(`/api/tickets/${bookingId}/cancel`);
    return data;
  },
};
