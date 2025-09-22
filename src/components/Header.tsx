import { LogOut, Home, User, Settings, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import logoPereiro from '@/assets/logo-pereiro.png';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isHomePage = location.pathname === '/';

  return (
    <header className="bg-white border-b-2 border-primary shadow-lg">
      {/* Logo Section */}
      <div className="bg-white py-2 sm:py-3">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <img 
              src={logoPereiro} 
              alt="Prefeitura Municipal de Pereiro" 
              className="h-12 sm:h-16 w-auto drop-shadow-md"
            />
          </div>
        </div>
      </div>
      
      {/* Navigation Section */}
      <div className="bg-gradient-to-r from-primary to-[hsl(120_75%_25%)] text-primary-foreground">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
            <div className="flex items-center space-x-4 text-center sm:text-left">
              <div>
                <h1 className="text-lg sm:text-xl font-bold">ConsulMed</h1>
                <p className="text-xs sm:text-sm opacity-90">Consulta de Medicações das UBS de Pereiro-CE</p>
              </div>
            </div>
            
            <nav className="flex items-center space-x-2 sm:space-x-4">
              {!isHomePage && (
                <Button
                  variant="ghost"
                  onClick={() => navigate('/')}
                  className="text-primary-foreground hover:bg-white/10 text-sm"
                >
                  <Home className="h-4 w-4 mr-1 sm:mr-2" />
                  Início
                </Button>
              )}
              
              <Button
                variant="ghost"
                onClick={() => navigate('/medicacoes-auto-custo')}
                className="text-primary-foreground hover:bg-white/10 text-sm"
              >
                <Pill className="h-4 w-4 mr-1 sm:mr-2" />
                Medicações Auto Custo
              </Button>
              
              {isAuthenticated && isHomePage && (
                <Button
                  variant="ghost"
                  onClick={() => navigate('/dashboard')}
                  className="text-primary-foreground hover:bg-white/10 text-sm"
                >
                  <Settings className="h-4 w-4 mr-1 sm:mr-2" />
                  Área Admin
                </Button>
              )}
              
              {isAuthenticated ? (
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <span className="text-xs sm:text-sm opacity-90 text-center sm:text-left">
                    Olá, <span className="font-semibold">{user?.login}</span>
                    {user?.tipo === 'admin' && (
                      <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded">
                        Admin
                      </span>
                    )}
                  </span>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="text-primary-foreground hover:bg-white/10 text-sm"
                  >
                    <LogOut className="h-4 w-4 mr-1 sm:mr-2" />
                    Sair
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => navigate('/login')}
                  className="text-primary-foreground hover:bg-white/10 text-sm"
                >
                  Entrar
                </Button>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
