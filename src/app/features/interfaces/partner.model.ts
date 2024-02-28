import { EmployeePostDTO } from "./employee.model";
import { EnterpriseDTO } from "./enterprise.model";
import { UserDTO } from "./user-dto.model";

export interface PartnerDTO {
  id: number;
  phoneNumber: string;
  imageBase64Content: string;
  imageUrl: string;
  user: UserDTO;
  enterprise: EnterpriseDTO;
  employeePost: EmployeePostDTO;

  // You can include any additional methods or constructors if needed
}
