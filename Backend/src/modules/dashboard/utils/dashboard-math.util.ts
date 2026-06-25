export class DashboardMathUtil {
  static percentage(value: number, total: number): number {
    if (!total) {
      return 0;
    }

    return Number(((value / total) * 100).toFixed(2));
  }

  static average(total: number, count: number): number {
    if (!count) {
      return 0;
    }

    return Number((total / count).toFixed(2));
  }
}
