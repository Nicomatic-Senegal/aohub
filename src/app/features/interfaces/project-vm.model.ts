import { PartnerDTO } from "./partner.model";


export enum ProjectStatus {
  IN_PROGRESS,
  ON_HOLD,
  ARCHIVED,
  FINISHED,
}

export enum NeedType {
  CONTRACT,
  PUNCTUAL,
}

 export interface MarketDTO {

    id?: number;

    name?: string;

    description?: string;
}

export interface DomainDTO {
  id?: number;
  name?: string;
  description?: string;
}

export interface ProjectVM {
  title?: string;
  description?: string;
  status?: ProjectStatus;
  confidential?: boolean;
  targetPrice?: number;
  needType?: NeedType;
  duration?: number;
  needLifetime?: number;
  globalVolume?: number;
  budget?: number;
  latestDeadline?: Date;
  earliestDeadline?: Date;
  client?: string;
  applicant?: PartnerDTO;
  markets?: MarketDTO[];
  domains?: DomainDTO[];
  disponibilityInstants?: string[];
}
