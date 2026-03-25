import sqlite3 from "sqlite3";
import { ActivityRecordEntity } from "../model/entities";
export declare class ActivityRecordDAO {
    private db;
    constructor(db: sqlite3.Database);
    create(record: ActivityRecordEntity): Promise<void>;
    getByUserId(userId: string): Promise<ActivityRecordEntity[]>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=activity-record-dao.d.ts.map