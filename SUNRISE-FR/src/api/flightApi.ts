import axiosClient from "./axiosClient";
import type { Flight } from "./types";

export type FlightSearchParams = {
  origin: string;
  destination: string;
  departureDate: string;
  cabinClass: string;
  passengers?: number;
  returnDate?: string;
};

export const flightApi = {
  search: async (params: FlightSearchParams) => {
    const { data } = await axiosClient.post<Flight[]>(
      "/api/flights/search",
      {
        origin: params.origin,
        destination: params.destination,
        departureDate: params.departureDate,
        returnDate: params.returnDate ?? null,
        passengers: params.passengers ?? 1,
        cabinClass: params.cabinClass,
      }
    );

    return Array.isArray(data) ? data : [];
  },
};