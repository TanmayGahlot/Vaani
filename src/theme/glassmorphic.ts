import {ViewStyle} from 'react-native';
import {colors, borderRadius} from './theme';

/**
 * Reusable glassmorphic style objects for the Vaani dark UI.
 */

/** Standard glass card with subtle transparency and border */
export const glassCard: ViewStyle = {
  backgroundColor: colors.surfaceGlass,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: borderRadius.lg,
};

/** Elevated glass card with slightly more opacity */
export const glassCardElevated: ViewStyle = {
  backgroundColor: colors.surfaceGlassLight,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: borderRadius.lg,
  elevation: 4,
  shadowColor: '#000',
  shadowOffset: {width: 0, height: 4},
  shadowOpacity: 0.3,
  shadowRadius: 8,
};

/** Rounded glass button */
export const glassButton: ViewStyle = {
  backgroundColor: colors.surfaceGlass,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: borderRadius.full,
  paddingHorizontal: 24,
  paddingVertical: 12,
  alignItems: 'center',
  justifyContent: 'center',
};

/**
 * Creates a custom glassmorphic style with the specified opacity.
 * @param opacity - Background opacity value (0 to 1)
 * @returns ViewStyle with glassmorphic properties
 */
export function createGlassStyle(opacity: number): ViewStyle {
  return {
    backgroundColor: `rgba(255,255,255,${opacity})`,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
  };
}
