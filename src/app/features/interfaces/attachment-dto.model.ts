import { SafeResourceUrl } from "@angular/platform-browser";
import { Project } from "./project.model";

export enum AttachmentType {
  NORMAL,
  PLAN,
}

export interface AttachmentDto {
  name: string,
  type: AttachmentType,
  fileSize: number,
  base64Content: string,
  project?: Project,
  safeUrl?: SafeResourceUrl,
  hover?: boolean,
}
