import { Applicant } from './applicant.model';
import { Disponibility } from './disponibility.model';
import { Domain } from './domain.model';
import { Market } from './market.model';
import { PartnerDTO } from './partner.model';
import { PhaseDTO } from './phase.model';
import { TypeAppelOffre } from './appelOffre.model';
import { ActivityDTO } from './activity.model';
import { EnterpriseDTO } from './enterprise.model';

export interface Project {
  id: number;
  applicant?: PartnerDTO;
  budget?: string;
  client?: string;
  confidential?: boolean;
  description?: string;
  disponibilities?: Array<Disponibility>;
  domains?: Array<Domain>;
  duration?: string;
  processingEndDate?: Date;
  applicationClosingDate?: Date;
  globalVolume?: string;
  markets?: Array<Market>;
  needLifetime?: string;
  needType?: string;
  status?: string;
  targetPrice?: string;
  teamMembers?: Array<PartnerDTO>;
  title?: string;
  deadlinePositioning?: Date;
  createdAt: Date;
  phases?: PhaseDTO[];
  stopped?: boolean;
  stopReason?: string;
  aoType?: TypeAppelOffre;
  specifiedEnterprises?: EnterpriseDTO[];
  activities?: ActivityDTO[];
}
