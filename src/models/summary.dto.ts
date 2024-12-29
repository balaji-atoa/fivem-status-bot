import { Expose, Type } from 'class-transformer';
import { CfxComponentDto } from './components.dto';
import { CfxIncidentsDto } from './incidents.dto';
import { CfxStatusDto } from './status.dto';
import { IsArray } from 'class-validator';

export class CfxSummaryDto {
  @Expose()
  @IsArray()
  @Type(() => CfxComponentDto)
  components: CfxComponentDto[];

  @Expose()
  @IsArray()
  @Type(() => CfxIncidentsDto)
  incidents: CfxIncidentsDto[];

  @Expose()
  @Type(() => CfxStatusDto)
  status: CfxStatusDto;
}
