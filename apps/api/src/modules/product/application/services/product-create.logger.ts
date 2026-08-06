export class ProductCreateLogger {
  private readonly prefix = '[ProductCreate]';

  step(message: string, detail?: string) {
    console.log(`${this.prefix} STEP — ${message}${detail ? `: ${detail}` : ''}`);
  }

  failure(step: string, error: unknown) {
    const err = error as Error & { code?: string };

    console.error(`${this.prefix} FAILED at ${step}`);
    console.error(`${this.prefix} Message: ${err?.message ?? String(error)}`);

    if (err?.code) {
      console.error(`${this.prefix} Prisma Code: ${err.code}`);
    }

    if (err?.stack) {
      console.error(`${this.prefix} Stack:\n${err.stack}`);
    }
  }

  rollback(reason: string, fileCount: number) {
    console.warn(
      `${this.prefix} Rolling back ${fileCount} uploaded file(s). Reason: ${reason}`,
    );
  }
}
