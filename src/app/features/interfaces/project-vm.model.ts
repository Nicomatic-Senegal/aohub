import { PartnerDTO } from './partner.model';
import { ActivityDTO } from './activity.model';
import { TypeAppelOffre } from './appelOffre.model';
import { EnterpriseDTO } from './enterprise.model';

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

  needType?: NeedType;
  duration?: number;
  needLifetime?: number;
  globalVolume?: number;
  budget?: number;
  processingEndDate?: Date;
  applicationClosingDate?: Date;
  service?: string;
  applicant?: PartnerDTO;

  activities?: ActivityDTO[]; //  id ,name , description
  aoType?: TypeAppelOffre; // AOType -> GLOBAL RESTRICTED INTEREST_MANIFESTATION

  domains?: DomainDTO[];
  disponibilityInstants?: string[];
  specifiedEnterprises?: EnterpriseDTO[];
}
