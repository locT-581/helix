import type { ReactNode } from 'react';
import { styled } from '@helix/ui';

/**
 * MobileAppShell Component
 * 
 * Mobile-first app shell with safe area support and bottom navigation.
 * Optimized for iOS and Android with proper viewport handling.
 * 
 * @example
 * ```tsx
 * <MobileAppShell
 *   topBar={<TopBar />}
 *   bottomNav={<BottomNav />}
 * >
 *   <VideoPreview />
 *   <Timeline />
 * </MobileAppShell>
 * ```
 */

export interface MobileAppShellProps {
  /** Top bar component (back button, actions) */
  topBar?: ReactNode;
  
  /** Bottom navigation component */
  bottomNav?: ReactNode;
  
  /** Main content */
  children: ReactNode;
  
  /** Enable safe area padding (iOS notch) */
  useSafeArea?: boolean;
}

const AppContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  height: '100dvh', // Dynamic viewport height (mobile, fallback to 100vh)
  overflow: 'hidden',
  backgroundColor: '$background',
  
  '@supports not (height: 100dvh)': {
    height: '100vh', // Fallback for older browsers
  },
  
  // Safe area support (iOS notch, Android gesture bar)
  variants: {
    useSafeArea: {
      true: {
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      },
    },
  },
});

const TopBar = styled('header', {
  flexShrink: 0,
  height: '$12', // 48px (12 * 4px)
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 $4',
  backgroundColor: '$surface',
  borderBottom: '1px solid $border',
  zIndex: 100,
  
  // Ensure minimum touch target
  minHeight: '$11', // 44px (WCAG AAA)
});

const MainContent = styled('main', {
  flex: 1,
  overflow: 'auto',
  WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
  position: 'relative',
  
  // Prevent pull-to-refresh on mobile
  overscrollBehavior: 'contain',
});

const BottomNavContainer = styled('nav', {
  flexShrink: 0,
  height: '$16', // 64px
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
  padding: '0 $4',
  backgroundColor: '$surface',
  borderTop: '1px solid $border',
  zIndex: 100,
  
  // Minimum touch target
  minHeight: '$11', // 44px
});

export const MobileAppShell = ({
  topBar,
  bottomNav,
  children,
  useSafeArea = true,
}: MobileAppShellProps) => {
  return (
    <AppContainer useSafeArea={useSafeArea}>
      {topBar && <TopBar>{topBar}</TopBar>}
      
      <MainContent>{children}</MainContent>
      
      {bottomNav && <BottomNavContainer>{bottomNav}</BottomNavContainer>}
    </AppContainer>
  );
};
