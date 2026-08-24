import axiosClient from "./axiosClient";
import type { Booking, BookingRequest } from "./types";

export const bookingApi = {
  create: async (payload: BookingRequest) => {
    const { data } = await axiosClient.post<Booking>("/api/bookings", payload);
    return data;
  },
  myBookings: async () => {
    const { data } = await axiosClient.get<Booking[]>("/api/bookings/my");
    return Array.isArray(data) ? data : [];
  },
  allBookings: async () => {
    const { data } = await axiosClient.get<Booking[]>("/api/bookings");
    return Array.isArray(data) ? data : [];
  },
  processedBookings: async () => {
  const { data } = await axiosClient.get<Booking[]>("/api/bookings/processed");
  return Array.isArray(data) ? data : [];
 },
};
