import { Disponibility } from "./disponibility.model";
import { PartnerDTO } from "./partner.model";
import { Project } from "./project.model";

export interface PositioningDTO {
  id: number;
  status: PositioningStatus;
  partner: PartnerDTO;
  project: Project;
  disponibilities: Disponibility[];
}
export enum PositioningStatus {
  PENDING,
  ACCEPTED,
  REJECTED,
}
