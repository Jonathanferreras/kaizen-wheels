<img src="public/logo.svg" alt="Kaizen Logo" width="64" style="background: #666; padding: 0.25rem; border-radius: 100%; margin-bottom: 1rem;" />

# Kaizen Wheels

A vehicle rental application built with Next.js, TypeScript, Prisma, SQLite, Tailwind CSS, and shadcn/ui.

This project was completed as part of the Kaizen Wheels Product Engineer take-home assessment.

## Features

### Persistence

- Migrated vehicle and reservation data from in-memory storage to SQLite
- Prisma ORM for database access and migrations
- Seeded database with vehicle and reservation data

### Vehicle Search & Filtering

- Availability-aware date range filtering
- Passenger count filtering
- Price filtering

### Discounts

Supports two discount types:

- Holiday Discount (17% off reservation total)
- Long Reservation Discount ($10/hour discount for reservations longer than 3 days)

Discounts do not stack. If both discounts apply, the reservation receives whichever discount produces the lower total price.

### Optional Add-ons

Support for the following add-ons:

- GPS Navigation
- Child Seat
- Additional Driver
- Pre-paid Fuel
- Roadside Assistance

Add-ons can be selected during the review step and are reflected in the reservation pricing.

### Styling

- Tailwind CSS
- shadcn/ui components
- Responsive layouts and improved user experience throughout the booking flow

---

## Tech Stack

- Next.js
- React
- TypeScript
- Prisma
- SQLite
- Tailwind CSS
- shadcn/ui

---

## Getting Started

### Clone the repository

```bash
git clone https://github.com/Jonathanferreras/kaizen-wheels.git
```

### Install dependencies

```bash
npm install
```

### Setup database

This command will:

- Generate the Prisma client
- Run database migrations
- Seed the database

```bash
npm run setup
```

### Start the application

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Database

The application uses SQLite for local development.

Prisma schema:

```text
prisma/schema.prisma
```

To inspect the database:

```bash
npx prisma studio
```

To reset and reseed the database:

```bash
npx prisma migrate reset
```

---

## Project Structure

```text
app/
components/
hooks/
lib/
prisma/
server/
```

---

## Assumptions

- Vehicle availability is determined by checking for overlapping reservations.
- Discounts apply only to the base rental cost.
- Discounts cannot be combined.
- The best available discount is selected automatically.
- Add-ons are selected during the review step of the booking flow.

---

## Additional Documentation

Implementation decisions and tradeoffs:

```text
DECISIONS.md
```

AI usage log:

```text
AI_LOG.md
```
