import axiosClient from "./axiosClient";
import type { Hotel } from "./types";

export type HotelSearchParams = {
  city: string;
  checkIn: string;
  checkOut: string;
  guests: number;
};

export const hotelApi = {
  search: async (params: HotelSearchParams) => {
    const { data } = await axiosClient.post<Hotel[]>(
      "/api/hotels/search",
      {
        city: params.city,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        guests: params.guests,
      }
    );

    return Array.isArray(data) ? data : [];
  },
};