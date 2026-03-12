# FitLevel BE


## Create Workout
```bash
curl -X POST http://localhost:3001/api/v1/workout-plan \
     -H "Content-Type: application/json" \
     -d '{
          "userId": "1234565",
          "name": "First Workout Plan",
          "description" : "test description for the plan",
          "activityTypeByDay": {
            "MONDAY": ["running"],
            "TUESDAY": [],
            "WEDNESDAY": ["gym"],
            "THURSDAY": [],
            "FRIDAY": ["swimming"],
            "SATURDAY": [],
            "SUNDAY": []
          }
         }' | jq
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


