// src/modules/dashboard/application/use-cases/get-last-five-months-dashboard.use-case.ts

import { Injectable } from '@nestjs/common';

import { DashboardLastFiveMonthsService } from '../services/dashboard-last-five-months.service';

@Injectable()
export class GetLastFiveMonthsDashboardUseCase {
  constructor(private readonly dashboardLastFiveMonthsService: DashboardLastFiveMonthsService) {}

  async execute() {
    return this.dashboardLastFiveMonthsService.getOverview();
  }
}
