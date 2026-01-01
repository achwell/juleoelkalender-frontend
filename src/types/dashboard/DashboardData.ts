import { HealthStatus } from "@/redux/features/dashboardSlice";
import Device from "@/types/dashboard/Device";
import { Beer, User } from "@/types/generated";

export default interface DashboardData {
    backendVersion: string;
    backendBuildTime: Date | null;
    cpuLoad: number;
    freeDiskSpace: number;
    diskUsage: number;
    freeMemory: number;
    processUptime: number;
    devices: Device[];
    backendStatus: HealthStatus;
    dbStatus: HealthStatus;
    emailStatus: HealthStatus;
    numberOfUsers: number;
    newestUser: User | null;
    numberOfActiveUsers: number;
    newestActiveUser: User | null;
    numberOfBeers: number;
    numberOfBeersToPlace: number;
    numberOfVacantCalendarDays: number;
    newestBeer: Beer | null;
}
