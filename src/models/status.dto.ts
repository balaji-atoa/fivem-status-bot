import { Expose } from 'class-transformer';

export class CfxStatusDto {
  @Expose()
  indicator: 'none' | 'minor' | 'major' | 'critical';

  @Expose()
  description:
    | 'All Systems Operational'
    | 'Partial System Outage'
    | 'Major Service Outage';
}
