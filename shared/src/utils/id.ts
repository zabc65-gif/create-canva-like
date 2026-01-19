/**
 * Génère un ID unique
 */
export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Génère un ID avec préfixe
 */
export function generatePrefixedId(prefix: string): string {
  return `${prefix}_${generateId()}`;
}
