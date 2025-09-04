import Logo from '@/components/molecules/logo';
import NavLink from '@/components/molecules/nav-link';
import { Profile } from '@/components/molecules/profile';

const NavBar = () => {
  return (
    <nav className="flex flex-col h-screen w-64 bg-surface border-r border-border px-4 py-6">
      <div className="flex flex-col flex-1">
        <div className="mb-8 ml-2">
          <Logo variant="line" color="accent" />
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <NavLink to="/" label="Home" icon="home" />
          </div>

          <hr className="border-border" />

          <div className="flex flex-col space-y-2">
            <NavLink to="/progression" label="Progression" icon="progression" />
          </div>

          <hr className="border-border" />

          <div className="flex flex-col space-y-2">
            <NavLink to="/simulations" label="Simulations" icon="cog" />
            <NavLink to="/notes" label="Notes" icon="notes" />
          </div>

          <hr className="border-border" />

          <div className="flex flex-col space-y-2">
            {/* The links dont correspond ! To change */}
            <NavLink to="/ai-chat" label="Chat" icon="chat" />
            <NavLink to="/diary" label="Notifications" icon="bell" />
            <NavLink to="/about" label="Help Center" icon="help" />
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-border">
        <Profile
          name="John Doe"
          src="https://i.pravatar.cc/150?img=3"
          activityStatus="online"
          avatarSize="md"
          showName={true}
          className="cursor-pointer hover:bg-neutral-weaker rounded-lg p-2 -m-2 transition-colors"
        />
      </div>
    </nav>
  );
};

export default NavBar;
