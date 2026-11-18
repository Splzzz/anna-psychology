export interface Contact {
  label: string;
  href: string;
}

interface SiteSettings {
  name: string;
  profession: string;
  location: string;
  serviceArea: string;
  contacts: { primary: Contact | null; socials: Contact[] };
  pricing: { first: number; regular: number; minutes: number; discount: number };
  cta: { book: string; first: string; details: string; write: string; price: string };
  seo: { origin: string; title: string; description: string };
}

export const rubles = (value: number): string =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency', currency: 'RUB', maximumFractionDigits: 0,
  }).format(value);

const pricing = {
  regular: 2000,
  discount: 50,
  minutes: 60,
  get first() { return Math.round(this.regular * (1 - this.discount / 100)); },
};

export const site: SiteSettings = {
  name: 'Анна',
  profession: 'Психолог',
  location: 'Тула',
  serviceArea: 'Россия',
  contacts: {
    primary: { label: 'ВКонтакте', href: 'https://vk.ru/anna_yakurnova' },
    socials: [{ label: 'Telegram', href: 'https://t.me/Nnyrka' }],
  },
  pricing,
  cta: {
    book: 'Записаться',
    first: 'Записаться на первую встречу',
    details: 'Узнать, как проходят консультации',
    write: 'Написать Анне',
    price: `Записаться за ${rubles(pricing.first)}`,
  },
  seo: {
    // После согласования материалов укажите полный HTTPS-адрес сайта.
    origin: '',
    title: 'Анна — психолог онлайн | Консультации при тревоге и панических атаках',
    description: 'Индивидуальные консультации психолога Анны онлайн по всей России. Бережная работа с тревогой, паническими атаками и трудными чувствами. Знакомство, формат встреч и стоимость.',
  },
};

export function publicUrl(path: string): string | undefined {
  if (!site.seo.origin) return undefined;
  const origin = new URL(site.seo.origin);
  if (origin.protocol !== 'https:' || origin.pathname !== '/' || origin.search || origin.hash || origin.username || origin.password) {
    throw new Error('Укажите домен сайта в site.seo.origin в формате https://домен без пути, логина или параметров.');
  }
  return new URL(path, origin).href;
}
