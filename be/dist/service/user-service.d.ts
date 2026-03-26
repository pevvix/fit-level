import { ScoreDto, UserDto, WorkoutSummaryDto } from '../dto/dto';
export declare function createUser(userDto: UserDto): Promise<WorkoutSummaryDto>;
export declare function getAllUsers(): Promise<WorkoutSummaryDto[]>;
export declare function getUserById(userId: string): Promise<WorkoutSummaryDto | null>;
export declare function updateUser(userId: string, userData: UserDto): Promise<WorkoutSummaryDto>;
export declare function updateUserScore(userId: string, score: ScoreDto): Promise<void>;
//# sourceMappingURL=user-service.d.ts.map