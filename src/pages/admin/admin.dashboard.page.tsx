import Chart from "@/components/dashboard/Chart";
import StatusBox from "@/components/dashboard/StatusBox";
import H1 from "@/components/layout/H1";
import { useHttpexchangesQuery } from "@/redux/api/actuatorApi";
import { useGetDashboardDataQuery } from "@/redux/api/dashboardApi";
import {
    HealthStatus,
    setBackendBuildTime,
    setBackendStatus,
    setBackendVersion,
    setCpuLoad,
    setDbStatus,
    setDevices,
    setDiskUsage,
    setEmailStatus,
    setFreeDiskSpace,
    setFreeMemory,
    setHttpExchanges,
    setNewestActiveUser,
    setNewestBeer,
    setNewestUser,
    setNumberOfActiveUsers,
    setNumberOfBeers,
    setNumberOfBeersToPlace,
    setNumberOfUsers,
    setNumberOfVacantCalendarDays,
    setProcessUptime,
} from "@/redux/features/dashboardSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import ChartData from "@/types/dashboard/ChartData";
import Device from "@/types/dashboard/Device";
import { Beer, User } from "@/types/generated";
import { lazy, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Beers = lazy(() => import("@/components/dashboard/Beers"));
const CpuLoad = lazy(() => import("@/components/dashboard/CpuLoad"));
const DiskUsage = lazy(() => import("@/components/dashboard/DiskUsage"));
const FreeMemory = lazy(() => import("@/components/dashboard/FreeMemory"));
const HttpExchanges = lazy(() => import("@/components/dashboard/HttpExchanges"));
const Uptime = lazy(() => import("@/components/dashboard/Uptime"));
const Users = lazy(() => import("@/components/dashboard/Users"));
const Version = lazy(() => import("@/components/dashboard/Version"));

const AdminDashboardPage = () => {
    const { t } = useTranslation();
    const [browserChartData, setBrowserChartData] = useState<ChartData[]>([]);
    const [mobileChartData, setMobileChartData] = useState<ChartData[]>([]);
    const [osChartData, setOsChartData] = useState<ChartData[]>([]);
    const { data, refetch } = useGetDashboardDataQuery();
    const { data: httpexchanges, refetch: refetchHttpexchanges } = useHttpexchangesQuery();
    const {
        backendBuildTime,
        backendStatus,
        backendVersion,
        cpuLoad,
        dbStatus,
        devices,
        diskUsage,
        emailStatus,
        freeDiskSpace,
        freeMemory,
        httpexchanges: exchanges,
        newestBeer,
        newestUser,
        newestActiveUser,
        numberOfActiveUsers,
        numberOfBeers,
        numberOfBeersToPlace,
        numberOfUsers,
        numberOfVacantCalendarDays,
        processUptime,
    } = useAppSelector((state) => state.dashboardState);

    const dispatch = useAppDispatch();

    const handleBackendBuildTime = (buildTime: Date | null) => {
        if (buildTime && buildTime !== backendBuildTime) {
            dispatch(setBackendBuildTime(buildTime));
        }
    };

    const handleBackendVersion = (version: string | null) => {
        if (version && version !== backendVersion) {
            dispatch(setBackendVersion(version));
        }
    };

    const handleBackendStatus = (status: HealthStatus | null) => {
        if (status && backendStatus !== status) {
            dispatch(setBackendStatus(status));
        }
    };

    const handledDbStatus = (status: HealthStatus | null) => {
        if (status && status !== dbStatus) {
            dispatch(setDbStatus(status));
        }
    };

    const handleEmailStatus = (status: HealthStatus | null) => {
        if (status && status !== emailStatus) {
            dispatch(setEmailStatus(status));
        }
    };

    const handleDevices = (dev: Device[]) => {
        if (dev && devices !== dev) {
            dispatch(setDevices(dev));
        }
    };

    const handleHttpexchanges = () => {
        if (httpexchanges && exchanges !== httpexchanges.exchanges) {
            dispatch(setHttpExchanges(httpexchanges.exchanges));
        }
    };

    const handleCpuLoad = (load: number | null) => {
        if (cpuLoad && load && cpuLoad !== load) {
            dispatch(setCpuLoad(load));
        }
    };

    const handleFreeDiskSpace = (freeSpace: number | null, usage: number | null) => {
        if (freeSpace && usage) {
            if (freeDiskSpace !== freeSpace) {
                dispatch(setFreeDiskSpace(freeSpace));
            }
            if (diskUsage !== usage) {
                dispatch(setDiskUsage(usage));
            }
        }
    };

    const handleFreeMemory = (memory: number | null) => {
        if (memory && freeMemory !== memory) {
            dispatch(setFreeMemory(memory));
        }
    };

    const handleNumberOfUsers = (users: number | null) => {
        if (users && numberOfUsers !== users) {
            dispatch(setNumberOfUsers(users));
        }
    };

    const handleNewestUser = (user: User | null) => {
        if (user && newestUser !== user) {
            dispatch(setNewestUser(user));
        }
    };

    const handleNumberOfActiveUsers = (users: number | null) => {
        if (users && numberOfActiveUsers !== users) {
            dispatch(setNumberOfActiveUsers(users));
        }
    };

    const handleNewestActiveUser = (user: User | null) => {
        if (user && newestActiveUser !== user) {
            dispatch(setNewestActiveUser(user));
        }
    };

    const handleProcessUptime = (uptime: number | null) => {
        if (uptime && processUptime !== uptime) {
            dispatch(setProcessUptime(uptime));
        }
    };

    const handleNumberOfBeers = (beers: number | null) => {
        if (beers && numberOfBeers !== beers) {
            dispatch(setNumberOfBeers(beers));
        }
    };

    const handleNumberOfVacantCalendarDays = (vacantCalendarDays: number | null) => {
        if (vacantCalendarDays && numberOfVacantCalendarDays !== vacantCalendarDays) {
            dispatch(setNumberOfVacantCalendarDays(vacantCalendarDays));
        }
    };

    const handleNumberOfBeersToPlace = (beersToPlace: number | null) => {
        if (beersToPlace && numberOfBeersToPlace !== beersToPlace) {
            dispatch(setNumberOfBeersToPlace(beersToPlace));
        }
    };

    const handleNewestBeer = (beer: Beer | null) => {
        if (beer && newestBeer !== beer) {
            dispatch(setNewestBeer(beer));
        }
    };

    useEffect(() => {
        if (data) {
            handleBackendBuildTime(data.backendBuildTime);
            handleBackendVersion(data.backendVersion);
            handleBackendStatus(data.backendStatus);
            handledDbStatus(data.dbStatus);
            handleEmailStatus(data.emailStatus);
            handleDevices(data.devices);
            handleHttpexchanges();
            handleCpuLoad(data.cpuLoad);
            handleFreeDiskSpace(data.freeDiskSpace, data.diskUsage);
            handleFreeMemory(data.freeMemory);
            handleNumberOfUsers(data.numberOfUsers);
            handleNumberOfActiveUsers(data.numberOfActiveUsers);
            handleNewestUser(data.newestUser);
            handleNewestActiveUser(data.newestActiveUser);
            handleProcessUptime(data.processUptime);
            handleNumberOfBeers(data.numberOfBeers);
            handleNumberOfVacantCalendarDays(data.numberOfVacantCalendarDays);
            handleNumberOfBeersToPlace(data.numberOfBeersToPlace);
            handleNewestBeer(data.newestBeer);
        }
    }, [data, httpexchanges]);

    useEffect(() => {
        const interval = setInterval(() => {
            refetch();
            refetchHttpexchanges();
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (devices) {
            const chartDataBrowser = devices.reduce<ChartData[]>((group, device) => {
                const category = device.browserName;
                if (category) {
                    const element = group.filter((value) => value.name === category).at(0);
                    if (element) {
                        element.value += 1;
                    } else {
                        group.push({ name: category, value: 1 });
                    }
                }
                return group;
            }, []);
            setBrowserChartData(chartDataBrowser);
            const chartDataMobile = devices.reduce<ChartData[]>((group, device) => {
                const category = device.isMobile
                    ? t("pages.dashboard.charts.mobile")
                    : t("pages.dashboard.charts.desktop");
                const element = group.filter((value) => value.name === category).at(0);
                if (element) {
                    element.value += 1;
                } else {
                    group.push({ name: category, value: 1 });
                }
                return group;
            }, []);
            setMobileChartData(chartDataMobile);
            const chartDataOs = devices.reduce<ChartData[]>((group, device) => {
                const category = device.osName;
                if (category) {
                    const element = group.filter((value) => value.name === category).at(0);
                    if (element) {
                        element.value += 1;
                    } else {
                        group.push({ name: category, value: 1 });
                    }
                }
                return group;
            }, []);
            setOsChartData(chartDataOs);
        }
    }, [devices]);

    return (
        <div className="flex-grow w-screen">
            <H1>{t("pages.dashboard.header")}</H1>
            <div className="w-full">
                <div className="grid grid-cols-3 gap-4 w-full">
                    <div>
                        <StatusBox header={t("pages.dashboard.backend")} status={backendStatus} />
                    </div>
                    <div>
                        <StatusBox header={t("pages.dashboard.database")} status={dbStatus} />
                    </div>
                    <div>
                        <StatusBox header={t("pages.dashboard.email")} status={emailStatus} />
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-4 w-full">
                    <div>
                        <FreeMemory freeMemory={freeMemory} />
                    </div>
                    <div>
                        <DiskUsage diskUsage={diskUsage} freeDiskSpace={freeDiskSpace} />
                    </div>
                    <div>
                        <CpuLoad cpuLoad={cpuLoad} />
                    </div>
                    <div>
                        <Uptime processUptime={processUptime} />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4 w-full">
                    <div>
                        <Users
                            newestUser={newestUser}
                            newestActiveUser={newestActiveUser}
                            numberOfUsers={numberOfUsers}
                            numberOfActiveUsers={numberOfActiveUsers}
                        />
                    </div>
                    <div>
                        <Beers
                            numberOfBeers={numberOfBeers}
                            newestBeer={newestBeer}
                            numberOfBeersToPlace={numberOfBeersToPlace}
                            numberOfVacantCalendarDays={numberOfVacantCalendarDays}
                        />
                    </div>
                    <div>
                        <Version backendVersion={backendVersion} backendBuildTime={backendBuildTime} />
                    </div>
                </div>
            </div>
            <div className="w-full">
                <Chart header={t("pages.dashboard.charts.platform")} chartData={mobileChartData} />
            </div>
            <div className="w-full">
                <Chart header={t("pages.dashboard.charts.os")} chartData={osChartData} />
            </div>
            <div className="w-full">
                <Chart header={t("pages.dashboard.charts.browser")} chartData={browserChartData} />
            </div>
            <div className="w-full">
                <HttpExchanges />
            </div>
        </div>
    );
};
export default AdminDashboardPage;
