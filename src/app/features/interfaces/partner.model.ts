import { EmployeePostDTO } from "./employee.model";
import { EnterpriseDTO } from "./enterprise.model";
import { InterestTopicDTO } from "./interest-topic.model";
import { UserDTO } from "./user-dto.model";

export interface PartnerDTO {
  id: number;
  phoneNumber: string;
  imageBase64Content: string;
  imageUrl: string;
  user: UserDTO;
  enterprise: EnterpriseDTO;
  employeePost: EmployeePostDTO;
  interestTopics: Array<InterestTopicDTO>;
  // You can include any additional methods or constructors if needed
}
