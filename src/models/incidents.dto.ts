import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';

export class CfxIncidentsDto {
  @Expose()
  status:
    | 'Investigating'
    | 'Identified'
    | 'Monitoring'
    | 'Resolved'
    | 'Postmortem';

  @Expose()
  impact: 'None' | 'Minor' | 'Major' | 'Critical';

  @Expose()
  name: string;

  @Expose()
  shortlink: string;

  @IsArray()
  @Expose()
  @Type(() => CfxIncidentUpdatesDto)
  incident_updates: CfxIncidentUpdatesDto[];
}

export class CfxIncidentUpdatesDto {
  @Expose()
  body: string;
}
