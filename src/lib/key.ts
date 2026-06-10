const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";
const BASE = ALPHABET.length;

export function generateKey(index?: number): string {
    let val = Date.now();
    if (index !== undefined) val = val * 1000 + index;

    const chars: string[] = [];
    while (val > 0) {
        chars.push(ALPHABET[val % BASE]!);
        val = Math.floor(val / BASE);
    }

    return chars.reverse().join("");
}
