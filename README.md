<img src="public/logo.svg" alt="Kaizen Logo" width="64" style="background: #666; padding: 0.25rem; border-radius: 100%; margin-bottom: 1rem;" />

## Project requirements

This is Kaizen Wheels: the start of a car rental app. The design is unfinished, there's no filtering, and all data lives in memory. You will harden it across five areas. Parts 1 and 2 are cross-cutting concerns that touch the whole app; Parts 3, 4, and 5 are functional features.

### **Part 1: Styling**

The app currently ships with no visual design. Add styling you'd be comfortable shipping to real users.

Tailwind is configured and the shadcn/ui primitives in `app/components/shared/ui/` are available. Use them, swap them out, or bring your own approach — the choice is yours, but be ready to justify it.

### **Part 2: Persistence**

Today, vehicles and reservations live in memory in `app/server/data.ts`. Move them to a real database. We recommend Postgres, but you can pick any persistence layer you prefer.

You're responsible for:

- Schema design for vehicles and reservations.
- Migrations.
- Seed data (you can start from the existing in-memory data in `app/server/data.ts`).
- Connection setup.
- Clear documentation explaining how to run the project locally — prerequisites, environment variables, and commands — so we can pull it down and get it working without guessing.

### **Part 3: Filters**

There are no filters in the app today. Add filtering so a user can find a vehicle for their trip. At minimum, support:

- A date/time range for pickup and drop-off, with vehicles filtered by availability.
- Whatever additional filters you think are useful (e.g. price, vehicle class, passenger count, make).

Briefly justify which filters you chose and why.

### **Part 4: Discounts**

We'd like to add discounts that satisfy these requirements:

- A reservation that includes a holiday but does not start or end on that holiday should receive a 17% discount off the total price. (A list of fictitious holidays is included below.)
- A reservation for more than 3 days should receive a $10/hr discount on the hourly rate.
- These discounts cannot both apply at the same time. If they conflict, the discount with the best price applies to the reservation.
- Visitors should see the discount reflected during search and checkout, including on the review page.


List of fictitious holidays (10 randomly sampled dates in the year):

- Jan 21
- Feb 12
- Mar 04
- May 02
- Jun 16
- Jul 26
- Aug 03
- Sep 01
- Nov 05
- Dec 18

### **Part 5: Optional add-ons**

Real rental flows let customers add extras at checkout (GPS, child seats, insurance, etc.). Add support for selecting optional add-ons on the review page and reflecting them in the price.

Requirements:

- The review page should let the user pick from a list of add-ons.
- Each add-on has its own price model — some are charged per rental, some per day (see the list below).
- The total cost should update live as the user toggles add-ons, and the page should show a line-item breakdown (base rental, each selected add-on, discount if applicable, total).
- Discounts from Part 4 apply to the base rental rate only, not to add-ons.
- Selections do not need to persist beyond the review page session.

Define a data shape that supports the add-ons below and would extend cleanly to new ones in the future.

Available add-ons:

| Name | Description | Price |
| --- | --- | --- |
| GPS Navigation | Suction-mount GPS unit | $5 per rental |
| Child seat | Forward-facing booster | $8 per day |
| Additional driver | Allow a second registered driver | $12 per day |
| Pre-paid fuel | Return the car empty | $40 per rental |
| Roadside assistance | 24/7 emergency support | $4 per day |

UI and implementation details are up to you. In your submission, briefly justify the data model you chose and the UI/UX decisions you made — what tradeoffs you considered, what you'd build differently with more time, and anything you intentionally left out.
