# Decisions

## Task Prioritiy

1. Install & Run Application
2. Scan repository to gain understanding of code base
3. Setup persistence and schemas (Prisma + SQLite)
4. Implement filtering features
5. Implement discounting feature
6. Implement add-ons feature
7. Apply styling to the project

## Implementation Choices

- Using SQLite over Docker + PostGres for simplicity and speed. Prisma for the ORM to simplfy database workflows.
- I think the following filters are the most useful for a MVP because from a user perspective I think the user will want to reserve the car for their itinerary, see if there are any cars available that will accommadate their party size, and if the car fits their budget: - Date/Time range for availability - Passenger count - Price
