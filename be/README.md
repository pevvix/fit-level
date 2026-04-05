# FitLevel BE

## DB Migrations

- Add SQL file

```bash
  npm run db:create init_schema
  npm run db:create alter_user_table
```

## Create Workout
```bash
curl -X POST http://localhost:3001/api/v1/workout-plan \
     -H "Content-Type: application/json" \
     -d '{
        "name": "Plan A",
        "description": "test plan a",
        "activityTypeByDay": {
          "MONDAY": [
            "yoga"
          ],
          "TUESDAY": ["bicycle"],
          "WEDNESDAY": [],
          "THURSDAY": [],
          "FRIDAY": [
            "swimming"
          ],
          "SATURDAY": [],
          "SUNDAY": []
        }
  }' | jq
```

## Get all WorkoutPlans
```bash
curl -X GET http://localhost:3001/api/v1/workout-plan | jq
```


## Create User
```bash
curl -X POST http://localhost:3001/api/v1/user \
  -H "Content-Type: application/json" \
  -d '{
      "userName": "Bob"
  }' | jq
  ```

## Get all Users
```bash
curl -X GET http://localhost:3001/api/v1/user | jq
  ```

## Get User by ID
```bash
curl -X GET http://localhost:3001/api/v1/user/6bb19a26-d9c0-4feb-8c94-274d4da78527 | jq
  ```



## Create Activity Record
```bash
curl -X POST http://localhost:3001/api/v1/user/110e8400-e29b-11d4-a716-446655440001/activity \
  -H "Content-Type: application/json" \
  -d '{
      "userId": "110e8400-e29b-11d4-a716-446655440001"
  }' | jq
  ```

## Get All Activity Records for user
```bash
curl -X GET http://localhost:3001/api/v1/user/110e8400-e29b-11d4-a716-446655440001/activity | jq
  ```

