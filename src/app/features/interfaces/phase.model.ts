import { PartnerDTO } from "./partner.model";
import { Project } from "./project.model";
import { TaskDTO } from "./task.model";

export interface PhaseDTO {
  id?: number;
  label?: string;
  description?: string;
  progression?: number;
  startDate?: Date;
  endDate?: Date;
  fullyValidated?: boolean;
  assignee?: PartnerDTO;
  project?: Project;
  tasks?: TaskDTO[];
}
