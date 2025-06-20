import { SupportedLang } from "../types/supported-langs";

/**
 * Represents an error related to day operations within the application.
 * Provides static factory methods for different error types: 'invalid', 'not_found', and 'conflict'.
 * Supports localized error messages in English ('en') and Spanish ('es').
 *
 * @remarks
 * Use the static methods {@link DayError.invalid}, {@link DayError.notFound}, and {@link DayError.conflict}
 * to create instances of this error with appropriate messages and types.
 *
 * @example
 * ```typescript
 * throw DayError.invalid('Funday');
 * ```
 */
export class DayError extends Error {
  readonly type: 'invalid' | 'not_found' | 'conflict';
  readonly day: string;

  private constructor(type: 'invalid' | 'not_found' | 'conflict', day: string, message: string) {
    super(message);
    this.name = 'DayError';
    this.type = type;
    this.day = day;
  }

  static invalid(day: string, locale: SupportedLang = 'es'): DayError {
    const msg = locale === 'en'
      ? `Invalid day provided: "${day}".`
      : `Día inválido: "${day}".`;
    return new DayError('invalid', day, msg);
  }

  static notFound(day: string, locale: SupportedLang = 'es'): DayError {
    const msg = locale === 'en'
      ? `Day not found: "${day}".`
      : `No se encontró el día: "${day}".`;
    return new DayError('not_found', day, msg);
  }

  static conflict(day: string, locale: SupportedLang = 'es'): DayError {
    const msg = locale === 'en'
      ? `Conflicting data for day "${day}".`
      : `Datos en conflicto para el día "${day}".`;
    return new DayError('conflict', day, msg);
  }

  static isDayError(e: unknown): e is DayError {
    return e instanceof DayError;
  }
}
