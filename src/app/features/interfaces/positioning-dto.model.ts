import { Disponibility } from './disponibility.model';
import { PartnerDTO } from './partner.model';
import { Project } from './project.model';
import { AttachmentDto } from './attachment-dto.model';

export interface PositioningDTO {
  id: number;
  status: PositioningStatus;
  partner: PartnerDTO;
  project: Project;
  attachment: AttachmentDto;
}
export enum PositioningStatus {
  PENDING,
  ACCEPTED,
  REJECTED,
}
