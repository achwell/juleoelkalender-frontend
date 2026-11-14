import Components from "@/types/dashboard/Components";

export default interface HealthStatus {
  status: string;
  components: Components;
}

export type HealthStatusCode = "UP" | "DOWN" | "OUT_OF_SERVICE" | "UNKNOWN";
