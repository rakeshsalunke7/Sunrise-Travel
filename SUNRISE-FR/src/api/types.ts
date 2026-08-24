export type BookingStatus = "PENDING" | "APPROVED" | "REJECTED" | "TICKETED" | "CANCELLED";

export type BookingType = "FLIGHT" | "HOTEL";

export type LoginResponse = {
  token: string;
  role: "EMPLOYEE" | "TRAVEL_APPROVER" | "TRAVEL_ADMIN";
  message?: string;
};

export type Flight = {
  id?: number | string;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  cabinClass: string;
  availableSeats?: number;
  price: number;
};

export type Hotel = {
  id?: number | string;
  hotelName?: string;
  name?: string;
  city: string;
  category: string;
  address?: string;
  roomType?: string;
  amenities?: string;
  pricePerNight: number;
  availableRooms?: number;
};

export type Booking = {
  id: number;
  bookingReference?: string;
  bookingType: BookingType | string;
  itemReference?: string;
  origin?: string;
  destination?: string;
  travelDate?: string;
  amount?: number;
  status: BookingStatus | string;
  createdAt?: string;
  details?: string;
  cabinOrCategory?: string;
  employeeEmail?: string;
  employeeName?: string;
  userEmail?: string;
};

export type BookingRequest = {
  bookingType: BookingType;
  itemReference: string;
  origin: string;
  destination: string;
  travelDate: string;
  amount: number;
  details: string;
  cabinOrCategory: string;
};

export type DashboardSummary = {
  totalBookings: number;
  todayBookings: number;
  pendingBookings: number;
  approvedBookings: number;
  rejectedBookings: number;
  ticketedBookings: number;
  cancelledBookings: number;
  totalTravelSpend: number;
  mostTravelledCity: string;
};
