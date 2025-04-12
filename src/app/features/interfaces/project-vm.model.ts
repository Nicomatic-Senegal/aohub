import { PartnerDTO } from './partner.model';

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

  domains?: DomainDTO[];
  disponibilityInstants?: string[];
}
