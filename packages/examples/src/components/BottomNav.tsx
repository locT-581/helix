import { styled } from '@helix/ui';
import { Film, Clock, Image, Settings } from 'lucide-react';
import { useNavigationStore, type NavigationTab } from '@helix/studio';

const NavContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
  width: '100%',
});

const NavButton = styled('button', {
  flex: 1,
  height: '$14', // 56px
  border: 'none',
  backgroundColor: 'transparent',
  color: '$textSecondary',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$1',
  cursor: 'pointer',
  fontSize: '$xs',
  minHeight: '$11', // 44px minimum touch target
  
  '&:active': {
    backgroundColor: '$surfaceHover',
  },
  
  variants: {
    active: {
      true: {
        color: '$primary',
      },
    },
  },
});

const tabs: { id: NavigationTab; label: string; icon: typeof Film }[] = [
  { id: 'editor', label: 'Editor', icon: Film },
  { id: 'timeline', label: 'Timeline', icon: Clock },
  { id: 'elements', label: 'Elements', icon: Image },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const BottomNav = () => {
  const { currentTab, setCurrentTab } = useNavigationStore();
  
  return (
    <NavContainer>
      {tabs.map(({ id, label, icon: Icon }) => (
        <NavButton
          key={id}
          active={currentTab === id}
          onClick={() => setCurrentTab(id)}
        >
          <Icon size={20} />
          <span>{label}</span>
        </NavButton>
      ))}
    </NavContainer>
  );
};
