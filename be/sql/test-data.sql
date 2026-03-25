delete from activity_record;
delete from  user;
delete from  workout_plan;

INSERT INTO workout_plan (id, name, description, activities_on_monday, activities_on_wednesday, activities_on_friday, created_at)
VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Hypertrophy Split', 'Focused on muscle growth and progressive overload.', '["strength"]', '["strength"]', '["strength"]', '2026-03-01 08:00:00'),
('7b3c9d1e-1234-4567-890a-bcdef0123456', 'Cardio Burn', 'High intensity aerobic conditioning.', '["cardio"]', '["cardio"]', '["swimming"]', '2026-03-05 10:00:00');


INSERT INTO user (id, name, workout_plan_id_ref, points, level, day_streak)
VALUES 
('110e8400-e29b-11d4-a716-446655440001', 'Alice Johnson', '550e8400-e29b-41d4-a716-446655440000', '123','2','5'),
('220e8400-e29b-22d4-a716-446655440002', 'Bob Smith', '7b3c9d1e-1234-4567-890a-bcdef0123456', '43','1','2'),
('330e8400-e29b-33d4-a716-446655440003', 'Charlie Brown', NULL, '432','4','23'); -- User with no assigned plan


INSERT INTO activity_record (id, user_id_ref, desription, activity_type, exercise, activity_date)
VALUES 
('a1b2c3d4-e5f6-4g7h-8i9j-k0l1m2n3o4p5', '110e8400-e29b-11d4-a716-446655440001', 'Upper Body Power Day', 'strength', true, '2026-03-22 07:30:00'),
('b2c3d4e5-f6g7-5h8i-9j0k-l1m2n3o4p5q6', '220e8400-e29b-22d4-a716-446655440002', 'Morning 10k Run', 'cardio', true, '2026-03-22 06:00:00'),
('c3d4e5f6-g7h8-6i9j-0k1l-m2n3o4p5q6r7', '110e8400-e29b-11d4-a716-446655440001', 'Stretching and Mobility', 'yoga', true, '2026-03-23 08:00:00');

