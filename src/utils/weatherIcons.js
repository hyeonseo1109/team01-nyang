import { Sun, Cloud, CloudRain, Snowflake, CloudSun, CloudFog } from 'lucide-react';

export function mapDescription(desc) {
  if (!desc) return 'cloudy';

  if (desc.includes('맑')) return 'sunny';
  if (desc.includes('구름') || desc.includes('흐림')) return 'cloudy';
  if (desc.includes('비')) return 'rainy';
  if (desc.includes('눈')) return 'snow';
  if (desc.includes('안개')) return 'fog';

  return 'cloudy';
}

export function mapIconCode(code) {
  if (!code) return 'cloudy';

  if (code.startsWith('01')) return 'sunny';
  if (code.startsWith('02')) return 'partly-cloudy';
  if (code.startsWith('03') || code.startsWith('04')) return 'cloudy';
  if (code.startsWith('09') || code.startsWith('10')) return 'rainy';
  if (code.startsWith('13')) return 'snow';
  if (code.startsWith('50')) return 'fog';

  return 'cloudy';
}

export const weatherIconMap = {
  sunny: Sun,
  clear: Sun,
  'partly-cloudy': CloudSun,
  cloudy: Cloud,
  rainy: CloudRain,
  snow: Snowflake,
  fog: CloudFog,
};
