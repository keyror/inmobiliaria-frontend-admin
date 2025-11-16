export function calculateDV(numero: string | number): string {
    if (!numero) return "";
    const weights = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];
    const clean = numero.toString().replace(/\D/g, '');
    const reversedDigits = clean.split('').reverse();

    let sum = 0;
    reversedDigits.forEach((digit, index) => {
        sum += Number(digit) * (weights[index] ?? 0);
    });

    const remainder = sum % 11;
    const dv = remainder > 1 ? 11 - remainder : remainder;

    return String(dv);
}
