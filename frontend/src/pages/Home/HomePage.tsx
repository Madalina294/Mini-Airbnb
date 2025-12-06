import { useAuthStore, useLogout } from '../../features/auth';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

/**
 * HomePage - Pagina principală
 * Design modern inspirat de Airbnb cu spacing și aliniere corecte
 */
export const HomePage = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { logout } = useLogout();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="homePage">
      {/* Header */}
      <header className="header">
        <div className="headerContainer">
          <div className="headerContent">
            {/* Logo */}
            <div className="logoContainer" onClick={() => navigate('/home')}>
              <div className="logoCircle">
                <span className="logoLetter">M</span>
              </div>
              <h1 className="brandTitle">Mini-Airbnb</h1>
            </div>

            {/* Navigation */}
            {isAuthenticated ? (
              <div className="navContainer">
                <div className="userInfo">
                  <div className="userAvatar">
                    <span className="userInitial">
                      {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="userName">{user?.name || user?.email}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="btnSecondary"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="navContainer">
                <button 
                  onClick={() => navigate('/login')}
                  className="btnSecondary"
                >
                  Login
                </button>
                <button 
                  onClick={() => navigate('/register')}
                  className="btnPrimary"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main>
        {isAuthenticated ? (
          /* Dashboard pentru utilizatori autentificați */
          <div className="mainContent">
            {/* Welcome Section */}
            <div className="welcomeSection">
              <h2 className="welcomeTitle">
                Welcome back, {user?.name?.split(' ')[0] || 'there'}! 👋
              </h2>
              <p className="welcomeSubtitle">
                Ready to discover your next adventure?
              </p>
            </div>

            {/* Quick Actions Grid */}
            <div className="actionsGrid">
              <div className="actionCard">
                <div className="actionIcon">🏠</div>
                <h3 className="actionTitle">Browse Properties</h3>
                <p className="actionDescription">
                  Explore amazing places to stay around the world
                </p>
                <button className="btnFull btnBlue"
                onClick={() => navigate('/properties')}>
                  Explore Now
                </button>
              </div>

              <div className={`actionCard actionCardGreen`}>
                <div className="actionIcon">📅</div>
                <h3 className="actionTitle">My Bookings</h3>
                <p className="actionDescription">
                  View and manage your upcoming trips
                </p>
                <button className="btnFull btnGreen"
                onClick={() => navigate('/bookings')}>
                  View Bookings
                </button>
              </div>

              <div className={`actionCard actionCardPurple`}>
                <div className="actionIcon">⭐</div>
                <h3 className="actionTitle">Host a Property</h3>
                <p className="actionDescription">
                  Share your space with travelers worldwide
                </p>
                <button className="btnFull btnPurple"
                onClick={() => navigate('/properties/create')}>
                  Become a Host
                </button>
              </div>
            </div>

            {/* User Info Card */}
            <div className="userCard">
              <div className="userCardContent">
                <div className="userCardAvatar">
                  <span className="userCardInitial">
                    {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="userCardInfo">
                  <h3 className="userCardName">{user?.name || 'User'}</h3>
                  <p className="userCardEmail">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Landing page pentru utilizatori neautentificați */
          <div>
            {/* Hero Section */}
            <section className="heroSection">
              <div className="heroContainer">
                <div className="heroContent">
                  <h2 className="heroTitle">
                    Find your perfect{' '}
                    <span className="heroGradient">getaway</span>
                  </h2>
                  <p className="heroSubtitle">
                    Discover unique places to stay and experiences around the world
                  </p>
                  <div className="heroButtons">
                    <button 
                      onClick={() => navigate('/register')}
                      className="btnPrimary btnLarge"
                    >
                      Get Started
                    </button>
                    <button 
                      onClick={() => navigate('/login')}
                      className="btnSecondary btnLarge"
                    >
                      Sign In
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section className="featuresSection">
              <div className="featuresContainer">
                <h3 className="featuresTitle">
                  Why choose Mini-Airbnb?
                </h3>
                <div className="featuresGrid">
                  <div className="featureCard">
                    <div className="featureIcon">🔒</div>
                    <h4 className="featureTitle">Secure & Safe</h4>
                    <p className="featureDescription">
                      Your data and bookings are protected with industry-leading security measures
                    </p>
                  </div>
                  <div className="featureCard">
                    <div className="featureIcon">🌍</div>
                    <h4 className="featureTitle">Worldwide</h4>
                    <p className="featureDescription">
                      Access thousands of unique properties and experiences globally
                    </p>
                  </div>
                  <div className="featureCard">
                    <div className="featureIcon">💎</div>
                    <h4 className="featureTitle">Premium Quality</h4>
                    <p className="featureDescription">
                      Every property is verified and meets our high standards
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="ctaSection">
              <div className="ctaContainer">
                <h3 className="ctaTitle">
                  Ready to start your journey?
                </h3>
                <p className="ctaSubtitle">
                  Join thousands of travelers discovering amazing places around the world
                </p>
                <button 
                  onClick={() => navigate('/register')}
                  className="btnSecondary btnLarge"
                  style={{ backgroundColor: '#ffffff', color: '#f43f5e', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                >
                  Create Account
                </button>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footerContainer">
          <div className="footerContent">
            <div>
              <h4 className="footerBrand">Mini-Airbnb</h4>
              <p className="footerTagline">Your perfect getaway awaits</p>
            </div>
            <div className="footerCopyright">
              © 2024 Mini-Airbnb. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
