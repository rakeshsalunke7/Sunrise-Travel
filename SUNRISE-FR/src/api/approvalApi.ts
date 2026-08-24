import axiosClient from "./axiosClient";
import type { Booking } from "./types";

export const approvalApi = {
  pending: async () => {
    const { data } = await axiosClient.get<Booking[]>("/api/approvals/pending");
    return Array.isArray(data) ? data : [];
  },
  approve: async (bookingId: number, comment?: string) => {
    const { data } = await axiosClient.post<Booking>(
      `/api/approvals/${bookingId}/approve`,
      { comment: comment ?? "" },
    );
    return data;
  },
  reject: async (bookingId: number, comment?: string) => {
    const { data } = await axiosClient.post<Booking>(
      `/api/approvals/${bookingId}/reject`,
      { comment: comment ?? "" },
    );
    return data;
  },
};
