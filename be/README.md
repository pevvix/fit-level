# Fit Level Backend

Fit Level is a fitness tracking application that helps users maintain their workout routines through scoring, levels, and streaks.

## Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher recommended)
- **npm**
- **dbmate** (for database migrations)
- **SQLite3**

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory and configure your environment variables (see `.env.example` if available, or use the following defaults):
   ```env
   DATABASE_URL="sqlite:db/fit-level.db"
   PORT=3000
   ```

## Database Migrations

This project uses `dbmate` for managing SQLite database migrations.

- **Create a new migration:**
  ```bash
  npm run db:create <migration_name>
  ```
- **Run migrations (Development):**
  ```bash
  npm run db:migrate
  ```
- **Run migrations (Test):**
  ```bash
  npm run db:migrate:test
  ```

## Running the Application

- **Development Mode (with auto-reload):**
  ```bash
  npm run dev
  ```
- **Build the project:**
  ```bash
  npm run build
  ```
- **Start the production build:**
  ```bash
  npm run start
  ```

## Testing

To run the test suite (this will also clean and migrate the test database):
```bash
npm test
```

## REST API Methods

### Workout Plans
- **POST `/api/v1/workout-plan`**: Create a new workout plan.
  ```bash
  curl -X POST http://localhost:3001/api/v1/workout-plan \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Weight Loss Plan",
    "description": "Plan focused on cardio and light weights",
    "activityTypeByDay": {
      "MONDAY": ["running"],
      "TUESDAY": ["cycling"],
      "WEDNESDAY": [],
      "THURSDAY": ["yoga"],
      "FRIDAY": ["weight lifting"],
      "SATURDAY": [],
      "SUNDAY": []
    }
  }'
  ```
- **GET `/api/v1/workout-plan/:id`**: Get workout plan details.
  ```bash
  curl http://localhost:3001/api/v1/workout-plan/<plan_id>
  ```

### Users
- **POST `/api/v1/user`**: Create a new user and associate with a workout plan.
  ```bash
  curl -X POST http://localhost:3001/api/v1/user \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "JohnDoe",
    "workoutPlanId": "<plan_id>"
  }'
  ```
- **GET `/api/v1/user/:id`**: Get user workout summary (includes score, level, and streak).
  ```bash
  curl http://localhost:3001/api/v1/user/<user_id>
  ```

### Activity Records
- **POST `/api/v1/user/:id/activity`**: Log an activity for a user.
  ```bash
  curl -X POST http://localhost:3001/api/v1/user/<user_id>/activity \
  -H "Content-Type: application/json" \
  -d '{
    "activityType": "running",
    "description": "Morning run",
    "exercise": true,
    "activityDate": "2026-04-12T08:00:00.000Z"
  }'
  ```
- **GET `/api/v1/user/:id/activity`**: Get all activity records for a user.
  ```bash
  curl http://localhost:3001/api/v1/user/<user_id>/activity
  ```

## REST API Flow

The typical usage flow for the API is as follows:
1. **Define a Workout Plan**: Create a plan specifying which days have scheduled activities.
2. **Create a User**: Register a user and link them to the created Workout Plan.
3. **Log Activities**: As the user performs exercises, log them via the activity endpoint.
4. **Track Progress**: Retrieve the user summary to see updated points, levels, and day streaks. The system automatically calculates penalties for missed days and rewards for completed exercises.

## Background Tasks

### Automated Score Recalculation
The system includes a cron job (defined in `calculate-user-scores-service.ts`) that runs every night at midnight (`0 0 * * *`). 

**Functionality:**
- It iterates through all users.
- It identifies "missed" activity days (days scheduled in the workout plan where no exercise was logged).
- It creates dummy activity records with `exercise: false` for those missed days.
- It recalculates the user's total points, level, and day streak based on the updated activity history.
