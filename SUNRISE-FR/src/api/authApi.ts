import axiosClient from "./axiosClient";
import type { LoginResponse } from "./types";

export type RegisterRequest = {
  fullName: string;
  email: string;
  password: string;
  designation: string;
};

export const authApi = {
  login: async (email: string, password: string) => {
    const { data } = await axiosClient.post<LoginResponse>(
      "/api/auth/login",
      { email, password },
    );

    return data;
  },

  register: async (payload: RegisterRequest) => {
    let salaryBand: string;

    switch (payload.designation) {
      case "Junior Executive":
        salaryBand = "B1";
        break;

      case "Executive":
        salaryBand = "B2";
        break;

      case "Senior Executive":
        salaryBand = "B3";
        break;

      default:
        throw new Error("Invalid designation");
    }

    const { data } = await axiosClient.post<LoginResponse>(
      "/api/auth/register",
      {
        fullName: payload.fullName,
        email: payload.email,
        password: payload.password,
        designation: payload.designation,
        salaryBand,
        role: "EMPLOYEE",
      },
    );

    return data;
  },
};