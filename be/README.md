# FitLevel BE


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


## Create Activity Record
```bash
curl -X POST http://localhost:3001/api/v1/user/:userId/activity \
  -H "Content-Type: application/json" \
  -d '{
      "userId": "faeee6eb-6a59-44ff-b7e2-b0f4a923318c"
  }' | jq
  ```


