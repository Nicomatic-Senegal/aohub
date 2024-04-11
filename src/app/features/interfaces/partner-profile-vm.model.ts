import { InterestTopicDTO } from "./interest-topic.model";

export interface PartnerProfileVM{
  id: number;
   userLogin: string,
   userFirstName: string,
   userLastName: string,
   phoneNumber: string,
   imageBase64Content: string,
   enterpriseName: string,
   employeePostTitle: string,
   employeePostDescription: string,
   interestTopicLabels: InterestTopicDTO[]
}
