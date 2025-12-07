import { Header } from '../Header/Header';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Layout Component
 * Wrapper pentru toate paginile care include Header-ul
 * Similar cu app.component.html în Angular
 */
export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout">
      <Header />
      <main className="layoutMain">
        {children}
      </main>
    </div>
  );
};

