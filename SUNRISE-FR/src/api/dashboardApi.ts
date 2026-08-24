import axiosClient from "./axiosClient";
import type { DashboardSummary } from "./types";

export const dashboardApi = {
  summary: async () => {
    const { data } = await axiosClient.get<DashboardSummary>("/api/dashboard/summary");
    return data;
  },
};
