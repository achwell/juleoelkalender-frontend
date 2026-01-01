import Db from "@/types/dashboard/Db";
import DiskSpace from "@/types/dashboard/DiskSpace";
import Ping from "@/types/dashboard/Ping";

export default interface Components {
    db: Db;
    diskSpace: DiskSpace;
    ping: Ping;
}
