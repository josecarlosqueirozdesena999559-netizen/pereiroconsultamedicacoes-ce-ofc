import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Building2, Users, FileText } from 'lucide-react';
import Header from '@/components/Header';
import UBSCard from '@/components/UBSCard';
import { UBS } from '@/types';
import { getUBS, initializeStorage } from '@/lib/storage';

const Index = () => {
  const [ubsList, setUbsList] = useState<UBS[]>([]);
  const [filteredUBS, setFilteredUBS] = useState<UBS[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    initializeStorage();
    loadUBS();
  }, []);

  useEffect(() => {
    filterUBS();
  }, [ubsList, searchTerm]);

  const loadUBS = async () => {
    try {
      const data = await getUBS();
      setUbsList(data);
    } catch (error) {
      console.error('Erro ao carregar UBS:', error);
    }
  };

  const filterUBS = () => {
    if (!searchTerm.trim()) {
      setFilteredUBS(ubsList);
      return;
    }

    const filtered = ubsList.filter(ubs =>
      ubs.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ubs.localidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ubs.responsavel.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUBS(filtered);
  };

  const totalUBS = ubsList.length;
  const ubsAbertas = ubsList.filter(ubs => ubs.status === 'aberto').length;
  const ubsComPDF = ubsList.filter(ubs => ubs.pdfUrl).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary via-[hsl(120_75%_25%)] to-primary text-primary-foreground py-16 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">
            Consulta de Medicações UBS
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl opacity-95 mb-3 sm:mb-4 font-medium">
            Sistema Integrado de Saúde Pública 
          </p>
          <p className="text-sm sm:text-lg opacity-85 max-w-4xl mx-auto leading-relaxed px-4">
            Acesse informações atualizadas sobre medicamentos disponíveis em todas as 
            Unidades Básicas de Saúde do município de Pereiro. Sistema oficial da 
            Prefeitura Municipal para garantir transparência e facilitar o acesso aos serviços de saúde.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 -mt-8 sm:-mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            <Card className="bg-white shadow-xl border-2 border-primary/10 hover:border-primary/30 transition-all duration-300">
              <CardContent className="p-6 sm:p-8 text-center">
                <Building2 className="h-10 sm:h-12 w-10 sm:w-12 text-primary mx-auto mb-4 sm:mb-6" strokeWidth={1.5} />
                <h3 className="text-3xl sm:text-4xl font-bold text-primary mb-2 sm:mb-3">{totalUBS}</h3>
                <p className="text-muted-foreground font-medium text-sm sm:text-base">Unidades Cadastradas</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Em todo o município</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-xl border-2 border-success/10 hover:border-success/30 transition-all duration-300">
              <CardContent className="p-6 sm:p-8 text-center">
                <Users className="h-10 sm:h-12 w-10 sm:w-12 text-success mx-auto mb-4 sm:mb-6" strokeWidth={1.5} />
                <h3 className="text-3xl sm:text-4xl font-bold text-success mb-2 sm:mb-3">{ubsAbertas}</h3>
                <p className="text-muted-foreground font-medium text-sm sm:text-base">UBS em Funcionamento</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Atendendo a população</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-xl border-2 border-info/10 hover:border-info/30 transition-all duration-300">
              <CardContent className="p-6 sm:p-8 text-center">
                <FileText className="h-10 sm:h-12 w-10 sm:w-12 text-info mx-auto mb-4 sm:mb-6" strokeWidth={1.5} />
                <h3 className="text-3xl sm:text-4xl font-bold text-info mb-2 sm:mb-3">{ubsComPDF}</h3>
                <p className="text-muted-foreground font-medium text-sm sm:text-base">Listas de Medicamentos</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Atualizadas e disponíveis</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* UBS Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-primary mb-4 sm:mb-6">
              Nossas Unidades Básicas de Saúde
            </h2>
            <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 sm:mb-10 leading-relaxed px-4">
              Encontre a UBS mais próxima de você e acesse informações detalhadas sobre 
              horários, responsáveis e listas atualizadas de medicamentos disponíveis.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-lg mx-auto relative px-4">
              <Search className="absolute left-8 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 sm:h-5 w-4 sm:w-5" />
              <Input
                type="text"
                placeholder="Buscar UBS, localidade ou responsável..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-2 sm:py-3 text-sm sm:text-base border-2 border-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {filteredUBS.length === 0 ? (
            <Card className="max-w-md mx-auto">
              <CardContent className="p-6 sm:p-8 text-center">
                <MapPin className="h-10 sm:h-12 w-10 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-semibold mb-2">Nenhuma UBS encontrada</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {searchTerm ? 'Tente ajustar sua busca' : 'Nenhuma UBS cadastrada no sistema'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
              {filteredUBS.map((ubs) => (
                <UBSCard key={ubs.id} ubs={ubs} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Card className="shadow-xl border-2 border-primary/10">
              <CardHeader className="text-center bg-gradient-to-r from-primary/5 to-primary/10">
                <CardTitle className="text-3xl text-primary mb-4">Como Utilizar o Sistema</CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                  Processo simples e rápido para consultar medicamentos disponíveis
                </CardDescription>
              </CardHeader>
              <CardContent className="p-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-[hsl(120_75%_25%)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <span className="text-primary-foreground font-bold text-2xl">1</span>
                    </div>
                    <h3 className="font-bold text-lg mb-3 text-primary">Localizar UBS</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Encontre a unidade de saúde mais próxima usando nossa busca 
                      por localidade ou nome da UBS
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-[hsl(120_75%_25%)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <span className="text-primary-foreground font-bold text-2xl">2</span>
                    </div>
                    <h3 className="font-bold text-lg mb-3 text-primary">Acessar Lista</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Baixe o PDF atualizado clicando no botão de download ou 
                      escaneie o QR Code com seu smartphone
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-[hsl(120_75%_25%)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <span className="text-primary-foreground font-bold text-2xl">3</span>
                    </div>
                    <h3 className="font-bold text-lg mb-3 text-primary">Consultar Medicamentos</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Visualize a lista completa e sempre atualizada de todos os 
                      medicamentos disponíveis na unidade escolhida
                    </p>
                  </div>
                </div>
                
                <div className="mt-12 text-center p-6 bg-primary/5 rounded-lg border border-primary/20">
                  <h4 className="font-semibold text-primary mb-2">Informação Importante</h4>
                  <p className="text-sm text-muted-foreground">
                    As listas são atualizadas regularmente pelas equipes das UBS. 
                    Recomendamos sempre verificar a data da última atualização antes de se dirigir à unidade.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
