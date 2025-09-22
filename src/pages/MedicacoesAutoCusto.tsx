import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, Pill, Phone, MapPin as LocationIcon, Clock, FileText, Users, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';

const MedicacoesAutoCusto = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary via-[hsl(120_75%_25%)] to-primary text-primary-foreground py-16 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <Pill className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">
            Medicações Auto Custo
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl opacity-95 mb-3 sm:mb-4 font-medium">
            Programa de Assistência Farmacêutica
          </p>
          <p className="text-sm sm:text-lg opacity-85 max-w-4xl mx-auto leading-relaxed px-4">
            Acesso facilitado a medicamentos essenciais com valores subsidiados pela 
            Prefeitura Municipal de Pereiro através do Centro de Atendimento Farmacêutico (CAF).
          </p>
        </div>
      </section>

      {/* Main Information Section */}
      <section className="py-12 sm:py-16 -mt-8 sm:-mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* O que é? */}
            <Card className="bg-white shadow-xl border-2 border-primary/10 hover:border-primary/30 transition-all duration-300">
              <CardHeader className="text-center bg-gradient-to-r from-primary/5 to-primary/10">
                <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-xl text-primary mb-2">O que é?</CardTitle>
                <CardDescription className="text-base">
                  Programa Medicações Auto Custo
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  Sistema que permite ao cidadão adquirir medicamentos essenciais por valores 
                  subsidiados, garantindo acesso facilitado aos tratamentos básicos de saúde 
                  através de parcerias com farmácias credenciadas do município.
                </p>
                <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm font-medium text-primary">
                    Objetivo: Democratizar o acesso aos medicamentos básicos
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Como funciona? */}
            <Card className="bg-white shadow-xl border-2 border-success/10 hover:border-success/30 transition-all duration-300">
              <CardHeader className="text-center bg-gradient-to-r from-success/5 to-success/10">
                <Users className="h-12 w-12 text-success mx-auto mb-4" />
                <CardTitle className="text-xl text-success mb-2">Como funciona?</CardTitle>
                <CardDescription className="text-base">
                  Processo simples em 4 etapas
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-xs font-bold">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Cadastro no CAF</p>
                      <p className="text-sm text-muted-foreground">Realize seu cadastro com documentos pessoais</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-xs font-bold">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Prescrição Médica</p>
                      <p className="text-sm text-muted-foreground">Apresente receita médica válida</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-xs font-bold">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Verificação</p>
                      <p className="text-sm text-muted-foreground">Consulte disponibilidade na lista de medicamentos</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-xs font-bold">4</span>
                    </div>
                    <div>
                      <p className="font-medium">Aquisição</p>
                      <p className="text-sm text-muted-foreground">Retire com desconto nas farmácias credenciadas</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CAF Information */}
            <Card className="bg-white shadow-xl border-2 border-info/10 hover:border-info/30 transition-all duration-300">
              <CardHeader className="text-center bg-gradient-to-r from-info/5 to-info/10">
                <LocationIcon className="h-12 w-12 text-info mx-auto mb-4" />
                <CardTitle className="text-xl text-info mb-2">Centro de Atendimento</CardTitle>
                <CardDescription className="text-base">
                  CAF - Informações de Contato
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <LocationIcon className="h-5 w-5 text-info mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Endereço:</p>
                      <p className="text-sm text-muted-foreground">Rua Principal, 123 - Centro</p>
                      <p className="text-sm text-muted-foreground">Pereiro - CE, 63460-000</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-info mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Contato:</p>
                      <p className="text-sm text-muted-foreground">(85) 3555-0000</p>
                      <p className="text-sm text-muted-foreground">WhatsApp: (85) 9 9999-0000</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-info mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Funcionamento:</p>
                      <p className="text-sm text-muted-foreground">Segunda à Sexta: 7h às 17h</p>
                      <p className="text-sm text-muted-foreground">Sábado: 7h às 12h</p>
                      <p className="text-sm text-muted-foreground">Domingo: Fechado</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-xl border-2 border-primary/10">
              <CardHeader className="text-center bg-gradient-to-r from-primary/5 to-primary/10">
                <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-2xl text-primary mb-4">Documentos Necessários</CardTitle>
                <CardDescription className="text-lg">
                  Para realizar seu cadastro no programa
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-lg mb-4 text-primary">Documentos Pessoais:</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        CPF (original e cópia)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        RG (original e cópia)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Comprovante de residência
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Cartão SUS
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-4 text-primary">Para Aquisição:</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Receita médica válida
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Documento com foto
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Cartão do programa CAF
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Comprovante de renda (se necessário)
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/20 text-center">
                  <h4 className="font-semibold text-primary mb-2">Importante</h4>
                  <p className="text-sm text-muted-foreground">
                    O programa é destinado a famílias de baixa renda cadastradas no CadÚnico. 
                    Consulte a lista de medicamentos disponíveis no CAF para verificar a cobertura do seu tratamento.
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

export default MedicacoesAutoCusto;