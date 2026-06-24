// src/modules/dashboard/utils/dashboard-period.util.ts

import { DashboardPeriod } from '../domain/enums/dashboard-period.enum';
import { PeriodRange } from '../domain/types/period-range.type';

export class DashboardPeriodUtil {
  static getRange(
    period: DashboardPeriod,
  ): PeriodRange {
    const now = new Date();

    switch (period) {
      case DashboardPeriod.TODAY: {
        const startDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
        );

        return {
          startDate,
          endDate: now,
        };
      }

      case DashboardPeriod.WEEK: {
        const startDate = new Date(now);

        startDate.setDate(
          now.getDate() - 7,
        );

        return {
          startDate,
          endDate: now,
        };
      }

      case DashboardPeriod.MONTH: {
        const startDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          1,
        );

        return {
          startDate,
          endDate: now,
        };
      }

      case DashboardPeriod.YEAR: {
        const startDate = new Date(
          now.getFullYear(),
          0,
          1,
        );

        return {
          startDate,
          endDate: now,
        };
      }

      case DashboardPeriod.OVERALL:
      default:
        return {};
    }
  }
}