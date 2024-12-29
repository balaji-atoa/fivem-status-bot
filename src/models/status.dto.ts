export class CfxStatusDto {
  indicator: 'none' | 'minor' | 'major' | 'critical';
  description:
    | 'All Systems Operational'
    | 'Partial System Outage'
    | 'Major Service Outage';
}
