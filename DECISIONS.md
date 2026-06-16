# Decisions

## Task Priority

1. Install & run application
2. Scan repository to gain understanding of the codebase
3. Setup persistence and schemas (Prisma + SQLite)
4. Implement filtering features
5. Implement discounting feature
6. Implement add-ons feature
7. Apply styling to the project

I chose to tackle persistence first because it impacted most of the remaining features. Having a database in place early made it easier to build filtering, discounts, and add-ons against the final data layer rather than implementing them against in-memory data and refactoring later.

## Implementation Choices

- Using SQLite over Docker + PostgreSQL for simplicity and speed. Prisma was chosen as the ORM because of its strong TypeScript support, migration workflow, and overall developer experience.
- I think the following filters are the most useful for an MVP because from a user perspective they want to reserve a vehicle for their trip, make sure it can accommodate their party size, and fit within their budget:
  - Date/time range for availability
  - Passenger count
  - Price

- I chose to use Tailwind and existing shadcn/ui components already available in the project rather than introducing another UI library. This allowed me to focus on improving the user experience while keeping the implementation lightweight.
- I centralized discount calculations in the quote workflow so that pricing logic exists in a single place. This helps ensure the same pricing is shown during search and checkout while making future discount rules easier to add.

## Architecture & Tradeoffs

### Persistence

I decided to use SQLite instead of PostgreSQL because it allowed me to get an MVP running quickly without requiring Docker or additional setup from reviewers. While PostgreSQL would be a better choice for a production application, SQLite felt like the right tradeoff for a take-home assessment where ease of setup and feature delivery were more important.

### Filtering

I focused on implementing filters that would have the biggest impact for users rather than trying to add every possible filter. Vehicle make, model, and class could all be useful additions, but I felt availability, passenger count, and price were the most important factors when selecting a rental vehicle.

### Add-On Data Model

For my schemas, I created the following data models:

- Vehicle
- Reservation
- AddOn
- ReservationAddOn

I created the `ReservationAddOn` model to support a many-to-many relationship between reservations and add-ons. A reservation can have multiple add-ons, and each add-on can be associated with many reservations.

For add-ons, I wanted a structure that could support future expansion. The add-on data is stored separately from reservations and linked through a join table, which makes it easier to introduce new add-ons or pricing rules without changing the reservation model itself. This supports both per-rental and per-day pricing while making it easy to introduce new add-ons in the future without changing the underlying data model.

### UI / UX Decisions

For the review page, I wanted users to be able to:

- Review vehicle details
- Select optional add-ons
- View updated pricing before confirming their reservation
- See any applicable discounts during checkout

I chose to calculate pricing on the review page as add-ons are selected so users can understand the impact of their selections before completing the booking process.

### Additional Tradeoffs

I tried to introduce as few dependencies as possible and reuse existing patterns from the codebase wherever I could. Prisma was the primary dependency I added because it solved persistence, migrations, and type-safe database access in a single tool.

## Future Improvements

Given additional time, there are a few areas I would continue refining:

- Persisting selected add-ons as part of the reservation creation flow
- Expanding the checkout price breakdown to display each selected add-on individually
- Additional validation and error handling around reservations
- More comprehensive test coverage
- Additional vehicle filters such as make, model, or vehicle class
- Further UI polish and responsive design improvements
