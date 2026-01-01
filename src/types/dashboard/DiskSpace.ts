import DiskSpaceDetails from "@/types/dashboard/DiskSpaceDetails";

export default interface DiskSpace {
    status: string;
    details: DiskSpaceDetails;
}
