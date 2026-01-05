import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore, useLogout } from '../../../features/auth';
import './Header.css';

/**
 * Header Component
 * Header reutilizabil cu navigare și dropdown menu pentru profil
 * Similar cu navbar-ul din Angular
 */
export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const { logout } = useLogout();
  
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Închide dropdown-ul când se face click în afara lui
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  // Închide mobile menu când se schimbă ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Blochează scroll când mobile menu este deschis
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsProfileMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const userInitial = user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U';

  return (
    <header className="header">
      <div className="headerContainer">
        <div className="headerContent">
          {/* Logo */}
          <div className="headerLogo" onClick={() => navigate('/home')}>
            <div className="headerLogoCircle">
              <span className="headerLogoLetter">M</span>
            </div>
            <h1 className="headerBrandTitle">Mini-Airbnb</h1>
          </div>

          {/* Desktop Navigation - Link-uri principale */}
          {isAuthenticated && (
            <nav className="headerNav">
              <button
                className={`headerNavLink ${isActive('/home')}`}
                onClick={() => handleNavigation('/home')}
              >
                Home
              </button>
              <button
                className={`headerNavLink ${isActive('/properties') && !isActive('/properties/my') ? 'active' : ''}`}
                onClick={() => handleNavigation('/properties')}
              >
                Properties
              </button>
              <button
                className={`headerNavLink ${isActive('/properties/my') ? 'active' : ''}`}
                onClick={() => handleNavigation('/properties/my')}
              >
                My Properties
              </button>
              <button
                className={`headerNavLink ${isActive('/bookings') ? 'active' : ''}`}
                onClick={() => handleNavigation('/bookings')}
              >
                My Bookings
              </button>
              <button
                className={`headerNavLink ${isActive('/favorites') ? 'active' : ''}`}
                onClick={() => handleNavigation('/favorites')}
              >
                My Favorites
              </button>
            </nav>
          )}

          {/* Right Side - Auth buttons sau Profile dropdown */}
          <div className="headerRight">
            {isAuthenticated ? (
              <>
                {/* Profile Dropdown */}
                <div className="headerProfile" ref={profileMenuRef}>
                  <button
                    className="headerProfileButton"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    aria-label="Profile menu"
                  >
                    <div className="headerProfileAvatar">
                      <span className="headerProfileInitial">{userInitial}</span>
                    </div>
                    <span className="headerProfileName">
                      {user?.name?.split(' ')[0] || user?.email?.split('@')[0]}
                    </span>
                    <svg
                      className={`headerProfileArrow ${isProfileMenuOpen ? 'open' : ''}`}
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 4L6 8L10 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <div className="headerProfileDropdown">
                      <div className="headerProfileDropdownHeader">
                        <div className="headerProfileDropdownAvatar">
                          <span>{userInitial}</span>
                        </div>
                        <div className="headerProfileDropdownInfo">
                          <div className="headerProfileDropdownName">
                            {user?.name || 'User'}
                          </div>
                          <div className="headerProfileDropdownEmail">
                            {user?.email}
                          </div>
                        </div>
                      </div>
                      <div className="headerProfileDropdownDivider"></div>
                      <button
                        className="headerProfileDropdownItem"
                        onClick={() => handleNavigation('/home')}
                      >
                        <span>🏠</span>
                        <span>Home</span>
                      </button>
                      <button
                        className="headerProfileDropdownItem"
                        onClick={() => handleNavigation('/properties')}
                      >
                        <span>🏢</span>
                        <span>Properties</span>
                      </button>
                      <button
                        className="headerProfileDropdownItem"
                        onClick={() => handleNavigation('/properties/my')}
                      >
                        <span>📋</span>
                        <span>My Properties</span>
                      </button>
                      <button
                        className="headerProfileDropdownItem"
                        onClick={() => handleNavigation('/bookings')}
                      >
                        <span>📅</span>
                        <span>My Bookings</span>
                      </button>
                      <button
                        className="headerProfileDropdownItem"
                        onClick={() => handleNavigation('/favorites')}
                      >
                        <span>❤️</span>
                        <span>My Favorites</span>
                      </button>
                      <div className="headerProfileDropdownDivider"></div>
                      <button
                        className="headerProfileDropdownItem headerProfileDropdownItemDanger"
                        onClick={handleLogout}
                      >
                        <span>🚪</span>
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile Menu Button */}
                <button
                  className="headerMobileMenuButton"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label="Menu"
                >
                  <span className={`headerMobileMenuIcon ${isMobileMenuOpen ? 'open' : ''}`}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </button>
              </>
            ) : (
              <div className="headerAuthButtons">
                <button
                  className="headerAuthButton headerAuthButtonSecondary"
                  onClick={() => navigate('/login')}
                >
                  Login
                </button>
                <button
                  className="headerAuthButton headerAuthButtonPrimary"
                  onClick={() => navigate('/register')}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Side Menu */}
      {isAuthenticated && (
        <div className={`headerMobileMenu ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="headerMobileMenuOverlay" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="headerMobileMenuContent">
            <div className="headerMobileMenuHeader">
              <div className="headerMobileMenuUser">
                <div className="headerMobileMenuAvatar">
                  <span>{userInitial}</span>
                </div>
                <div className="headerMobileMenuUserInfo">
                  <div className="headerMobileMenuUserName">
                    {user?.name || 'User'}
                  </div>
                  <div className="headerMobileMenuUserEmail">
                    {user?.email}
                  </div>
                </div>
              </div>
              <button
                className="headerMobileMenuClose"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                ×
              </button>
            </div>
            <nav className="headerMobileMenuNav">
              <button
                className={`headerMobileMenuLink ${isActive('/home') ? 'active' : ''}`}
                onClick={() => handleNavigation('/home')}
              >
                <span>🏠</span>
                <span>Home</span>
              </button>
              <button
                className={`headerMobileMenuLink ${isActive('/properties') && !isActive('/properties/my') ? 'active' : ''}`}
                onClick={() => handleNavigation('/properties')}
              >
                <span>🏢</span>
                <span>Properties</span>
              </button>
              <button
                className={`headerMobileMenuLink ${isActive('/properties/my') ? 'active' : ''}`}
                onClick={() => handleNavigation('/properties/my')}
              >
                <span>📋</span>
                <span>My Properties</span>
              </button>
              <button
                className={`headerMobileMenuLink ${isActive('/bookings') ? 'active' : ''}`}
                onClick={() => handleNavigation('/bookings')}
              >
                <span>📅</span>
                <span>My Bookings</span>
              </button>
              <button
                className={`headerMobileMenuLink ${isActive('/favorites') ? 'active' : ''}`}
                onClick={() => handleNavigation('/favorites')}
              >
                <span>❤️</span>
                <span>My Favorites</span>
              </button>
              <div className="headerMobileMenuDivider"></div>
              <button
                className="headerMobileMenuLink headerMobileMenuLinkDanger"
                onClick={handleLogout}
              >
                <span>🚪</span>
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

