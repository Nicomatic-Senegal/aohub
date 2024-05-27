import { PartnerDTO } from "./partner.model";
import { PhaseDTO } from "./phase.model";

export interface TaskDTO {
  id?: number; // Optional since it can be null in Java
  label?: string;
  description?: string;
  done?: boolean;
  startDate?: Date;
  endDate?: Date;
  assignee: PartnerDTO;
  phase: PhaseDTO;
}
