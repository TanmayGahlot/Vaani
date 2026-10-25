import { colors, typography, spacing } from '../theme/theme';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '../utils/constants';

describe('Vaani Theme & Constants', () => {
  it('should have primary colors defined', () => {
    expect(colors.primary).toBeDefined();
    expect(colors.background).toBeDefined();
    expect(colors.accent).toBeDefined();
  });

  it('should have typography sizes configured', () => {
    expect(typography.sizes.caption).toBeGreaterThan(0);
    expect(typography.sizes.body).toBeGreaterThan(0);
    expect(typography.sizes.title).toBeGreaterThan(0);
  });

  it('should define spacing scale', () => {
    expect(spacing.xs).toBeLessThan(spacing.sm);
    expect(spacing.sm).toBeLessThan(spacing.md);
    expect(spacing.md).toBeLessThan(spacing.lg);
  });

  it('should have supported regional Indian languages', () => {
    expect(SUPPORTED_LANGUAGES.length).toBeGreaterThan(5);
    const hindi = SUPPORTED_LANGUAGES.find((l) => l.code === 'hi');
    expect(hindi).toBeDefined();
    expect(hindi?.name).toBe('Hindi');
    expect(DEFAULT_LANGUAGE).toBe('hi');
  });
});
