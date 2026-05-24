import es from '../../../messages/es.json';
import en from '../../../messages/en.json';
import ru from '../../../messages/ru.json';
import { Locale } from '@/types';

const messages: Record<Locale, typeof es> = { es, en, ru };

export function getMessages(locale: Locale) {
  return messages[locale];
}
