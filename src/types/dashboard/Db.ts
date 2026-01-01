import DbDetails from "@/types/dashboard/DbDetails";

export default interface Db {
    status: string;
    details: DbDetails;
}
