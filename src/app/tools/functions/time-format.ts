
/**
 * Convert seconds to HH:mm:ss
 * @param seconds
 * @returns HH:mm:ss string
 */
export function strTimeFormat(seconds): string {
    return new Date(seconds * 1000).toISOString().substr(11, 8);
}