export interface ReportShareLink {
  reportId: string;
  shareUrl: string;
  fileUrl?: string;
  expiresAt?: string;
  isExpired?: boolean;
}

