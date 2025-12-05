import api from "./axios";

// Types that match backend2 scan DTOs/enums
export type ScanType = "QUICK" | "FULL" | "SQL_INJECTION" | "XSS";

export interface StartScanResponse {
  success: boolean;
  message: string;
  scanId: string;
  status: string;
}

export interface ScanStatusDTO {
  status: "RUNNING" | "COMPLETED" | "FAILED";
  progress: number;
  stateDescription?: string;
}

export const startScan = async (url: string, scanType: ScanType) => {
  const res = await api.post<StartScanResponse>("/api/scans/start", {
    url,
    scanType,
  });
  return res.data;
};

export const getScanStatus = async (scanId: string) => {
  const res = await api.get<ScanStatusDTO>(`/api/scans/${scanId}/status`);
  return res.data;
};

export const downloadScanReport = async (scanId: string) => {
  const res = await api.get(`/api/scans/${scanId}/report`, {
    responseType: "blob",
  });
  return res.data as Blob;
};



