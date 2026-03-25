import sqlite3 from "sqlite3";
import { UserEntity } from "../model/entities";
export declare class UserDAO {
    private db;
    constructor(db: sqlite3.Database);
    create(user: UserEntity): Promise<void>;
    findById(id: string): Promise<UserEntity | undefined>;
    getAll(): Promise<UserEntity[]>;
    update(user: UserEntity): Promise<void>;
}
//# sourceMappingURL=user-dao.d.ts.map