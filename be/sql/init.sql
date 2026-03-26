CREATE TABLE workout_plan (
	id TEXT PRIMARY KEY NOT NULL,
	name TEXT NOT NULL UNIQUE,
	description TEXT,
	activities_on_monday TEXT, -- cardio,strength
	activities_on_tuesday TEXT, -- yoga
	activities_on_wednesday TEXT,
	activities_on_thursday TEXT,
	activities_on_friday TEXT,
	activities_on_saturday TEXT,
	activities_on_sunday TEXT,
	created_at TIMESTAMP
);


CREATE TABLE user (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL UNIQUE,
    workout_plan_id_ref TEXT,
	points INTEGER ,
    level INTEGER,
    day_streak INTEGER,
    
    FOREIGN KEY(workout_plan_id_ref) REFERENCES workout_plan(id)
 );

CREATE INDEX idx_user__workout_plan_id_ref ON user(workout_plan_id_ref);

CREATE TABLE activity_record(
	id TEXT PRIMARY KEY NOT NULL,
	user_id_ref TEXT NOT NULL,
	description TEXT,
	activity_type TEXT,
	exercise BOOLEAN NOT NULL,
	activity_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY(user_id_ref) REFERENCES user(id)
);
CREATE INDEX idx_activity_record__user_id_ref ON activity_record(user_id_ref);

