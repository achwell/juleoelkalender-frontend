export default interface DiskSpaceDetails {
    total: number;
    free: number;
    threshold: number;
    path: string;
    exists: boolean;
}
