export function destinationTitle(name, locale = 'en') {
  if (locale === 'nl') return `eSIM ${name} | Prepaid mobiel internet voor je reis | SafarSIM`
  if (locale === 'fr') return `eSIM ${name} | Forfaits Internet prépayés pour votre voyage | SafarSIM`
  if (locale === 'ar') return `eSIM ${name} | باقات إنترنت مسبقة الدفع للسفر | SafarSIM`
  return `${name} eSIM | Prepaid Mobile Data for Your Trip | SafarSIM`
}
