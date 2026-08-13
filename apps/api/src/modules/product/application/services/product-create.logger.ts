export class ProductCreateLogger {
  private readonly prefix = '[ProductCreate]';

  step(message: string, detail?: string) {
    console.log(`${this.prefix} STEP — ${message}${detail ? `: ${detail}` : ''}`);
  }

  failure(step: string, error: unknown) {
  const err = error as Error & {
    code?: string;
  };

  console.error(`${this.prefix} FAILED at ${step}`);
  console.error(
    `${this.prefix} Message: ${err?.message ?? String(error)}`,
  );

  if (err?.code) {
    console.error(`${this.prefix} Prisma Code: ${err.code}`);
  }

  // =========================
  // VALIDATION ERRORS
  // =========================

  if (error instanceof Error && 'getResponse' in error) {
    const httpError = error as Error & {
      getResponse: () => unknown;
    };

    const response = httpError.getResponse();

    if (
      typeof response === 'object' &&
      response !== null &&
      'errors' in response
    ) {
      console.error(
        `${this.prefix} Validation Errors:`,
        JSON.stringify(
          (response as { errors: unknown }).errors,
          null,
          2,
        ),
      );
    }
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
