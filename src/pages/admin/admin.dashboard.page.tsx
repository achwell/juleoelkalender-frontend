import Chart from "@/components/dashboard/Chart";
import StatusBox from "@/components/dashboard/StatusBox";
import H1 from "@/components/layout/H1";
import { useHttpexchangesQuery } from "@/redux/api/actuatorApi";
import { useGetDashboardDataQuery } from "@/redux/api/dashboardApi";
import { groupDevices } from "@/utils/graphUtils";
import { lazy, useMemo } from "react";
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
  const { data } = useGetDashboardDataQuery(undefined, { pollingInterval: 30000 });
  const { data: httpData } = useHttpexchangesQuery(undefined, { pollingInterval: 30000 });
  const {
    backendBuildTime = null,
    backendStatus = "UNKNOWN",
    backendVersion = "",
    cpuLoad = 0,
    dbStatus = "UNKNOWN",
    devices,
    diskUsage = 0,
    emailStatus = "UNKNOWN",
    freeDiskSpace = 0,
    freeMemory = 0,
    newestBeer = null,
    newestUser = null,
    newestActiveUser = null,
    numberOfActiveUsers = 0,
    numberOfBeers = 0,
    numberOfBeersToPlace = 0,
    numberOfUsers = 0,
    numberOfVacantCalendarDays = 0,
    processUptime = 0,
  } = data ?? {};
  const { browserChartData, mobileChartData, osChartData } = useMemo(
    () => groupDevices(devices ?? [], t("pages.dashboard.charts.mobile"), t("pages.dashboard.charts.desktop")),
    [devices, t],
  );

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
        <HttpExchanges exchanges={httpData?.exchanges} />
      </div>
    </div>
  );
};
export default AdminDashboardPage;
