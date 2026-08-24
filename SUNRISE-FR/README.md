# Sunrise Travel Manager

Build a production-quality React web application called "Sunrise Travel" for a corporate travel management platform.

IMPORTANT:

- This is a FRONTEND-ONLY project.

- Do NOT create a backend.

- Do NOT use Supabase, Firebase, or any external database/authentication service.

- The backend already exists as a Java Spring Boot REST API with MySQL and JWT authentication.

- The frontend will communicate with the existing Spring Boot API at:

  http://localhost:8080

- Use REST APIs and JWT Bearer authentication.

- Keep API integration code clean and centralized so the API base URL can easily be changed later.

TECH STACK:

- React

- Vite

- JavaScript or TypeScript

- Tailwind CSS

- React Router

- Axios for API calls

- Lucide React icons or another clean icon library

DESIGN GOAL:

Create a polished, professional corporate travel website inspired by the usability and information hierarchy of modern travel platforms such as MakeMyTrip, Booking.com, and enterprise travel portals.

DO NOT make it look like an AI-generated template.

Avoid:

- Excessive gradients

- Glassmorphism everywhere

- Huge rounded cards

- Excessive animations

- Neon colors

- Excessive shadows

- Random decorative elements

- Overly futuristic UI

- Fake statistics

- Generic SaaS landing-page aesthetics

The design should feel like a real travel product used by employees of a company.

Use:

- Clean white/light backgrounds

- Dark navy/blue primary text and navigation

- A restrained corporate blue accent

- Subtle borders

- Moderate border radius

- Clear typography hierarchy

- Good spacing

- Professional tables

- Practical cards

- Consistent buttons

- Responsive layouts

Brand:

Name: Sunrise Travel

Create a simple professional Sunrise Travel wordmark/logo using text and a subtle travel/sunrise icon. Do not use an external copyrighted logo.

The application should feel trustworthy, corporate, and travel-oriented.

==================================================

AUTHENTICATION

==================================================

Create a Login page.

Fields:

- Email

- Password

Features:

- Login button

- Loading state

- Validation

- Error message

- Password visibility toggle

On successful login, the backend returns:

{

  "token": "...",

  "role": "EMPLOYEE | TRAVEL_APPROVER | TRAVEL_ADMIN",

  "message": "Login successful"

}

Store the JWT securely for the current frontend session and store the role required for frontend routing.

Every protected API request must send:

Authorization: Bearer <JWT>

Create a centralized Axios instance/interceptor for this.

If the backend returns 401:

- Clear authentication

- Redirect to login

If the backend returns 403:

- Show an appropriate "You don't have permission to access this page" message.

Do not implement fake authentication.

==================================================

ROLE-BASED APPLICATION

==================================================

There are three roles:

1. EMPLOYEE

2. TRAVEL_APPROVER

3. TRAVEL_ADMIN

The UI and navigation must change based on the authenticated role.

Never show Admin or Approver actions to an Employee.

Never rely only on hiding buttons for security. The backend is authoritative; the frontend should simply provide appropriate role-based navigation and UX.

==================================================

EMPLOYEE EXPERIENCE

==================================================

Create an Employee dashboard.

The employee should see:

- Welcome message

- Quick flight search

- Quick hotel search

- Recent bookings

- Booking status

- Simple travel summary

Navigation:

- Dashboard

- Flights

- Hotels

- My Bookings

- Profile

- Logout

--------------------------------------------------

FLIGHT SEARCH

--------------------------------------------------

Create a travel-platform-style flight search page.

Use a prominent search section similar in usability to modern travel booking websites.

Search fields:

- Origin

- Destination

- Departure date

- Cabin class

- Search button

Display flight results as professional horizontal result cards.

Each flight result should show:

- Flight number

- Airline

- Origin

- Destination

- Departure time

- Arrival time

- Cabin class

- Available seats

- Price

- Book button

Use the existing backend API rather than hardcoded final data.

Backend endpoint:

GET /api/flights/search

Support the backend's existing query parameters.

When the user clicks Book:

- Open a booking confirmation UI

- Show flight details

- Show fare

- Show cabin class

- Allow confirmation

Create booking through:

POST /api/bookings

Request structure:

{

  "bookingType": "FLIGHT",

  "itemReference": "AI101",

  "origin": "Pune",

  "destination": "Delhi",

  "travelDate": "2026-08-25T06:30:00",

  "amount": 6500,

  "details": "Air India AI101 - Pune to Delhi",

  "cabinOrCategory": "ECONOMY"

}

Do not invent a different booking API.

After successful booking:

- Show booking confirmation

- Display booking reference

- Display status PENDING

If policy validation fails:

- Show a clear professional policy violation message.

--------------------------------------------------

HOTEL SEARCH

--------------------------------------------------

Create a hotel search page with a layout inspired by modern hotel booking websites.

Search fields:

- City

- Check-in date

- Check-out date

- Hotel category

Display hotel cards showing:

- Hotel name

- City

- Category

- Address

- Room type

- Amenities

- Price per night

- Available rooms

- Book button

Use the existing backend hotel API.

Do not create fake hotel APIs.

Booking must use the existing:

POST /api/bookings

with:

bookingType = HOTEL

and the hotel's reference/category/price information.

==================================================

MY BOOKINGS

==================================================

Create a professional bookings page.

Endpoint:

GET /api/bookings/my

Display bookings in a clean table/card layout.

Each booking should show:

- Booking reference

- Type

- Item reference

- Origin

- Destination

- Travel date

- Amount

- Status

- Created date

Use clear status badges:

PENDING

APPROVED

REJECTED

TICKETED

CANCELLED

Use sensible visual differentiation but keep the design professional.

Allow the employee to view booking details.

==================================================

TRAVEL APPROVER EXPERIENCE

==================================================

For TRAVEL_APPROVER users, create a dedicated approval dashboard.

Navigation:

- Dashboard

- Pending Approvals

- Processed Requests

- Logout

Main page:

GET /api/approvals/pending

Display pending bookings in a professional approval table.

Columns:

- Booking reference

- Employee/traveler information if available

- Travel type

- Origin

- Destination

- Travel date

- Amount

- Status

- Actions

Actions:

- Approve

- Reject

Approve:

POST /api/approvals/{bookingId}/approve

Reject:

POST /api/approvals/{bookingId}/reject

For both actions, allow the approver to enter an optional comment.

Approval confirmation should clearly show:

- Booking reference

- Employee

- Amount

- Destination

- Comment

- Result

After approval/rejection:

- Refresh the pending list

- Show success feedback

- Update status immediately

Do not use fake approval logic.

==================================================

TRAVEL ADMIN EXPERIENCE

==================================================

For TRAVEL_ADMIN users, create an Admin dashboard.

Navigation:

- Dashboard

- Bookings

- Ticketing

- Travel Statistics

- Logout

Dashboard endpoint:

GET /api/dashboard/summary

The backend response contains:

{

  "totalBookings": 0,

  "todayBookings": 0,

  "pendingBookings": 0,

  "approvedBookings": 0,

  "rejectedBookings": 0,

  "ticketedBookings": 0,

  "cancelledBookings": 0,

  "totalTravelSpend": 0,

  "mostTravelledCity": ""

}

Display these using professional dashboard cards.

Do NOT create fake chart data.

If charts are useful, generate charts from the actual API response only.

The dashboard should prominently show:

- Total bookings

- Today's bookings

- Pending approvals

- Cancelled bookings

- Total travel spend

- Most travelled city

Also show a booking status breakdown.

==================================================

TICKETING

==================================================

Admins can issue tickets for APPROVED bookings.

Endpoint:

POST /api/tickets/{bookingId}/issue

Only show the Issue Ticket action when the booking status is:

APPROVED

After issuing:

status becomes:

TICKETED

Admins can cancel TICKETED bookings.

Endpoint:

POST /api/tickets/{bookingId}/cancel

Only show Cancel when status is:

TICKETED

After cancellation:

status becomes:

CANCELLED

Use confirmation dialogs before issuing or cancelling.

==================================================

NAVIGATION

==================================================

Create a professional responsive layout.

Desktop:

- Top navigation/header

- Role-specific navigation

- Main content area

Mobile:

- Responsive navigation

- Collapsible menu

Header should contain:

- Sunrise Travel logo/name

- Current user's role

- User menu

- Logout

Do not make the sidebar unnecessarily huge.

==================================================

API ARCHITECTURE

==================================================

Create a clean frontend API structure:

src/

  api/

    axiosClient

    authApi

    flightApi

    hotelApi

    bookingApi

    approvalApi

    ticketingApi

    dashboardApi

Centralize the base URL:

VITE_API_BASE_URL=http://localhost:8080

Use Axios interceptors for JWT.

Do not scatter fetch/axios calls throughout UI components.

==================================================

ROUTING

==================================================

Use React Router.

Routes should include:

/login

/employee

/employee/flights

/employee/hotels

/employee/bookings

/approver

/approver/pending

/admin

/admin/dashboard

/admin/bookings

Implement protected routes.

Role restrictions:

EMPLOYEE:

- employee routes only

TRAVEL_APPROVER:

- approver routes

TRAVEL_ADMIN:

- admin routes

Unauthenticated users:

- redirect to /login

==================================================

UX REQUIREMENTS

==================================================

Every API operation should have:

- Loading state

- Success state

- Error state

Use:

- Toast notifications

- Confirmation dialogs

- Empty states

- Skeleton/loading indicators where appropriate

Examples:

"No pending approvals"

"No bookings found"

"No flights found for your search"

"Your booking was created successfully"

"Booking violates your corporate travel policy"

Do not expose raw backend stack traces to the user.

==================================================

RESPONSIVENESS

==================================================

The application must work well on:

- Desktop

- Laptop

- Tablet

- Mobile

The primary focus is desktop because this is a corporate travel platform, but mobile should remain usable.

==================================================

IMPORTANT IMPLEMENTATION RULES

==================================================

1. Do not create a backend.

2. Do not create Supabase/Firebase.

3. Do not replace JWT authentication.

4. Do not invent API endpoints.

5. Do not hardcode final booking/search/dashboard data.

6. Use the existing Spring Boot APIs.

7. Keep API calls centralized.

8. Keep components reusable.

9. Keep the UI professional and realistic.

10. Avoid over-designed AI-generated aesthetics.

11. Do not add unnecessary animations.

12. Prioritize usability and business workflow.

13. Make the application look like a real corporate travel product.

14. Use realistic empty/loading/error states.

15. Keep the code easy for a Java/Spring Boot developer to understand and maintain.

The most important goal is:

A user should be able to log in, search for a flight/hotel, make a booking, see the booking as PENDING, a Travel Approver should be able to approve/reject it, and a Travel Administrator should be able to view the dashboard, issue a ticket for an approved booking, and cancel a ticketed booking.

Build the complete frontend UI and routing structure around this workflow.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/62cc23f9-bff5-4102-82e4-ec5dbd7956f0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
