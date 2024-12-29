import { Expose } from 'class-transformer';

export class CfxComponentDto {
  @Expose()
  name: string;
  @Expose()
  status:
    | 'operational'
    | 'degraded_performance'
    | 'partial_outage'
    | 'major_outage';
}
