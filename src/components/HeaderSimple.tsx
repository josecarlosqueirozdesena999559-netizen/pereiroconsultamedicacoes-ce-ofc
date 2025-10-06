import { Home } from 'lucide-react';
import logoPereiro from '@/assets/logo-pereiro.png';

const HeaderSimple = () => {
  return (
    <header className="bg-white border-b-2 border-primary shadow-lg">
      <div className="bg-white py-2 sm:py-3">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <img 
              src={logoPereiro} 
              alt="Prefeitura Municipal de Pereiro" 
              className="h-15 sm:h-23 w-auto drop-shadow-md"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-primary to-[hsl(120_75%_25%)] text-primary-foreground">
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-4">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-base sm:text-xl font-bold">ConsultMed</h1>
              <p className="text-xs sm:text-sm opacity-90">Sistema de Consulta de Medicamentos</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderSimple;
