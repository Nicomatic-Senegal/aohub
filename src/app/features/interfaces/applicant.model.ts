import { EnterpriseDTO } from "./enterprise.model";

export interface Applicant {
    id: number;
    employeePost?: string;
    enterprise?: EnterpriseDTO;
    imageBase64Content?: string;
    imageUrl?: string;
}
  