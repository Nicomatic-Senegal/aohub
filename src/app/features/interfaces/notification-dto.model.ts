export interface Notification {
  id?: number;
  title?: string;
  content?: string;
  type?: string;
  read?: boolean;
  createdBy:string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
}
