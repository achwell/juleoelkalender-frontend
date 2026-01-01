import DashboardData from "@/types/dashboard/DashboardData";
import Device from "@/types/dashboard/Device";
import Exchange from "@/types/dashboard/Exchange";
import { Beer, User } from "@/types/generated";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type HealthStatus = "UP" | "DOWN" | "OUT_OF_SERVICE" | "UNKNOWN";

interface DashboardState extends DashboardData {
    httpexchanges: Exchange[];
}

const initialState: DashboardState = {
    backendVersion: "",
    backendBuildTime: null,
    dbStatus: "UNKNOWN",
    emailStatus: "UNKNOWN",
    backendStatus: "UNKNOWN",
    devices: [],
    httpexchanges: [],
    cpuLoad: 0,
    diskUsage: 0,
    freeDiskSpace: 0,
    freeMemory: 0,
    processUptime: 0,
    numberOfUsers: 0,
    newestUser: null,
    numberOfActiveUsers: 0,
    newestActiveUser: null,
    newestBeer: null,
    numberOfBeers: 0,
    numberOfBeersToPlace: 0,
    numberOfVacantCalendarDays: 0,
};
export const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        setBackendBuildTime: (state: DashboardState, action: PayloadAction<Date | null>) => {
            state.backendBuildTime = action.payload;
        },
        setBackendStatus: (state: DashboardState, action: PayloadAction<HealthStatus>) => {
            state.backendStatus = action.payload;
        },
        setBackendVersion: (state: DashboardState, action: PayloadAction<string>) => {
            state.backendVersion = action.payload;
        },
        setDbStatus: (state: DashboardState, action: PayloadAction<HealthStatus>) => {
            state.dbStatus = action.payload;
        },
        setEmailStatus: (state: DashboardState, action: PayloadAction<HealthStatus>) => {
            state.emailStatus = action.payload;
        },
        setDevices: (state: DashboardState, action: PayloadAction<Device[]>) => {
            state.devices = action.payload;
        },
        setHttpExchanges: (state: DashboardState, action: PayloadAction<Exchange[]>) => {
            state.httpexchanges = action.payload;
        },
        setCpuLoad: (state: DashboardState, action: PayloadAction<number>) => {
            state.cpuLoad = action.payload;
        },
        setDiskUsage: (state: DashboardState, action: PayloadAction<number>) => {
            state.diskUsage = action.payload;
        },
        setFreeDiskSpace: (state: DashboardState, action: PayloadAction<number>) => {
            state.freeDiskSpace = action.payload;
        },
        setFreeMemory: (state: DashboardState, action: PayloadAction<number>) => {
            state.freeMemory = action.payload;
        },
        setNumberOfUsers: (state: DashboardState, action: PayloadAction<number>) => {
            state.numberOfUsers = action.payload;
        },
        setNewestUser: (state: DashboardState, action: PayloadAction<User | null>) => {
            state.newestUser = action.payload;
        },
        setNumberOfActiveUsers: (state: DashboardState, action: PayloadAction<number>) => {
            state.numberOfActiveUsers = action.payload;
        },
        setNewestActiveUser: (state: DashboardState, action: PayloadAction<User | null>) => {
            state.newestActiveUser = action.payload;
        },
        setProcessUptime: (state: DashboardState, action: PayloadAction<number>) => {
            state.processUptime = action.payload;
        },
        setNumberOfBeers: (state: DashboardState, action: PayloadAction<number>) => {
            state.numberOfBeers = action.payload;
        },
        setNumberOfBeersToPlace: (state: DashboardState, action: PayloadAction<number>) => {
            state.numberOfBeersToPlace = action.payload;
        },
        setNumberOfVacantCalendarDays: (state: DashboardState, action: PayloadAction<number>) => {
            state.numberOfVacantCalendarDays = action.payload;
        },
        setNewestBeer: (state: DashboardState, action: PayloadAction<Beer | null>) => {
            state.newestBeer = action.payload;
        },
    },
});
export const {
    setBackendBuildTime,
    setBackendVersion,
    setBackendStatus,
    setDbStatus,
    setDevices,
    setHttpExchanges,
    setEmailStatus,
    setFreeDiskSpace,
    setFreeMemory,
    setDiskUsage,
    setCpuLoad,
    setNewestUser,
    setNewestActiveUser,
    setNumberOfActiveUsers,
    setNumberOfUsers,
    setProcessUptime,
    setNewestBeer,
    setNumberOfBeers,
    setNumberOfBeersToPlace,
    setNumberOfVacantCalendarDays,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
