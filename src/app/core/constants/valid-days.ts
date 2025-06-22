import { SupportedLang } from "../types/types";

/**
 * A mapping of supported languages to their respective lists of valid day names.
 *
 * @remarks
 * - The keys are language codes (e.g., 'en' for English, 'es' for Spanish).
 * - The values are arrays of day names in the corresponding language, starting from Monday.
 *
 * @example
 * VALID_DAYS['en']; // ['Monday', 'Tuesday', ..., 'Sunday']
 * VALID_DAYS['es']; // ['Lunes', 'Martes', ..., 'Domingo']
 *
 * @see SupportedLang
 */
export const VALID_DAYS: Record<SupportedLang, string[]> = {
  en: [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ],
  es: [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ],
};