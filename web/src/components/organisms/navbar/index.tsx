import Logo from '@/components/molecules/logo';
import { MenuButton } from '@/components/molecules/menu-button';
import NavLink from '@/components/molecules/nav-link';
import { Profile } from '@/components/molecules/profile';
import { ThemeToggle } from '@/components/molecules/theme-toggle';
import { useAuth } from '@/contexts/AuthContext';
import { useLogout } from '@/hooks/auth/useLogout';
import { useRouter } from '@tanstack/react-router';

const NavBar = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { logout } = useLogout();
  const router = useRouter();

  if (isLoading) {
    return (
      <nav className="flex flex-col h-screen w-64 bg-surface border-r border-border px-4 py-6">
        <div className="flex items-center justify-center h-full">
          <span className="text-text-weaker">Loading...</span>
        </div>
      </nav>
    );
  }

  if (!isAuthenticated) {
    return (
      <nav className="flex flex-col h-screen w-64 bg-surface border-r border-border px-4 py-6">
        <div className="mb-8 ml-2">
          <Logo variant="line" color="accent" />
        </div>
        <ThemeToggle />
        <div className="flex flex-col space-y-4">
          <NavLink to="/" label="Home" icon="home" />
          <NavLink to="/about" label="About" icon="help" />
          <NavLink to="/login" label="Login" icon="lock" />
          <NavLink to="/signup" label="Sign Up" icon="user" />
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex flex-col h-screen w-64 bg-surface border-r border-border px-4 py-6">
      <div className="flex flex-col flex-1">
        <div className="mb-8 ml-2">
          <Logo variant="line" color="accent" />
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <ThemeToggle />
            <NavLink to="/dashboard" label="Dashboard" icon="home" />
          </div>

          <hr className="border-border" />

          <div className="flex flex-col space-y-2">
            <NavLink to="/progression" label="Progression" icon="progression" />
          </div>

          <hr className="border-border" />

          <div className="flex flex-col space-y-2">
            <NavLink to="/simulations" label="Simulations" icon="video" />
            <NavLink to="/notes" label="Notes" icon="notes" />
          </div>

          <hr className="border-border" />

          <div className="flex flex-col space-y-2">
            <NavLink to="/ai-chat" label="Chat" icon="chat" />
            <NavLink to="/diary" label="Diary" icon="bell" />
            <NavLink to="/cv-analysis" label="CV Analysis" icon="edit" />
            <NavLink to="/about" label="Help Center" icon="help" />
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-border">
        <div className="flex items-center justify-between hover:bg-neutral-weaker rounded-lg p-2 -m-2 transition-colors">
          <Profile
            name={
              user?.firstName ? `${user.firstName} ${user.lastName}` : 'User'
            }
            src="https://i.pravatar.cc/150?img=3"
            activityStatus="online"
            avatarSize="md"
            showName={true}
          />
          <MenuButton
            position="top"
            items={[
              {
                type: 'button',
                label: 'Profile',
                onClick: () => router.navigate({ to: '/profile' }),
                icon: 'user',
              },
              {
                type: 'button',
                label: 'Settings',
                onClick: () => console.log('Settings clicked'),
                icon: 'cog',
              },
              {
                type: 'divider',
              },
              {
                type: 'button',
                label: 'Logout',
                onClick: logout,
                icon: 'unlock',
                variant: 'danger',
              },
            ]}
          />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
