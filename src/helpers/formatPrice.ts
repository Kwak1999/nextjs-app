/**
 * 숫자를 한국 원화 포맷으로 변환
 * 예: 2500000 -> "2,500,000"
 */
export function formatPrice(price: number | string): string {
  const num = typeof price === 'string' ? parseInt(price, 10) : price;
  if (isNaN(num)) return '0';
  return num.toLocaleString('ko-KR');
}
