// src/modules/dashboard/domain/interfaces/dashboard-filter.interface.ts

import { DashboardPeriod } from '../enums/dashboard-period.enum';

export interface DashboardFilter {
  period?: DashboardPeriod;
}