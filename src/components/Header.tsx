import { LogOut, Home, User, Settings } from 'lucide-react';
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
      <div className="bg-white py-3">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <img 
              src={logoPereiro} 
              alt="Prefeitura Municipal de Pereiro" 
              className="h-16 w-auto drop-shadow-md"
            />
          </div>
        </div>
      </div>
      
      {/* Navigation Section */}
      <div className="bg-gradient-to-r from-primary to-[hsl(120_75%_25%)] text-primary-foreground">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-xl font-bold">Sistema UBS Pereiro</h1>
                <p className="text-sm opacity-90">Consulta de Medicações por Unidade Básica de Saúde</p>
              </div>
            </div>
            
            <nav className="flex items-center space-x-4">
              {!isHomePage && (
                <Button
                  variant="ghost"
                  onClick={() => navigate('/')}
                  className="text-primary-foreground hover:bg-white/10"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Início
                </Button>
              )}
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm opacity-90">
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
                    className="text-primary-foreground hover:bg-white/10"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => navigate('/login')}
                  className="text-primary-foreground hover:bg-white/10"
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