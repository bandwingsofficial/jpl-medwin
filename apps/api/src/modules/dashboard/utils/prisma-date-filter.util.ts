// src/modules/dashboard/utils/prisma-date-filter.util.ts

import { DashboardPeriod } from '../domain/enums/dashboard-period.enum';
import { DashboardPeriodUtil } from './dashboard-period.util';

export class PrismaDateFilterUtil {
  static build(period: DashboardPeriod) {
    const range = DashboardPeriodUtil.getRange(period);

    if (!range.startDate || !range.endDate) {
      return {};
    }

    return {
      createdAt: {
        gte: range.startDate,
        lte: range.endDate,
      },
    };
  }
}
