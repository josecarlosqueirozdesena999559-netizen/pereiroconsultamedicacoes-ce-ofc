import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Pill, Phone, MapPin as LocationIcon, Clock, FileText, Users } from 'lucide-react';
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
            CAF - CENTRO DE ATENDIMENTO FARMACÊUTICO.
          </p>
          <p className="text-sm sm:text-lg opacity-85 max-w-4xl mx-auto leading-relaxed px-4">
            Acesso a medicamentos indicados para o tratamento de condições clínicas de maior complexidade,
            tais como: doenças raras, doenças autoimunes, esclerose múltipla, artrite reumatoide,
            doenças inflamatórias intestinais, psoríase em formas graves, pacientes transplantados, entre outras.
          </p>
        </div>
      </section>

      {/* Information Section */}
      <section className="py-12 sm:py-16 -mt-8 sm:-mt-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-6 bg-white shadow-xl border-2 border-primary/10 rounded-xl p-8">

            <Accordion
              type="multiple"
              defaultValue={['o-que-e', 'como-funciona', 'caf-info']}
              className="w-full space-y-4"
            >

              {/* O que é */}
              <AccordionItem value="o-que-e" className="border border-primary/20 rounded-lg px-6">
                <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5" />
                    O que é?
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-6">
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      O Governo Federal, através do Sistema Único de Saúde (SUS), fornece medicamentos de alto custo para doenças graves, crônicas e raras,
                      principalmente através do Componente Especializado da Assistência Farmacêutica (CEAF).
                      Para ter acesso, é preciso ter o laudo médico (LME), a receita, os documentos pessoais e o cartão SUS,
                      e verificar se o medicamento está nos protocolos clínicos do Ministério da Saúde.
                      A solicitação é feita nas Secretarias de Saúde ou através do portal do Ministério da Saúde.
                    </p>
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <p className="text-sm font-medium text-primary">
                        <strong>Objetivo:</strong> "Garantir o acesso a medicamentos essenciais para todas as famílias."
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Como ter acesso */}
              <AccordionItem value="como-funciona" className="border border-success/20 rounded-lg px-6">
                <AccordionTrigger className="text-lg font-semibold text-success hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5" />
                    Como ter acesso aos medicamentos?
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-6">
                  <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
                    <p>
                      Após o atendimento médico e a prescrição de um medicamento pertencente ao elenco do CEAF
                      (Elenco de medicamentos disponibilizados), o(a) usuário(a) deverá sair da consulta com os seguintes
                      documentos devidamente preenchidos pelo profissional prescritor:
                    </p>
                    <ul className="list-disc list-inside space-y-1 pl-2">
                      <li>Cópia do Cartão Nacional de Saúde (CNS).</li>
                      <li>Cópia do documento de identidade com foto.</li>
                      <li>
                        Laudo para Solicitação, Avaliação e Autorização de Medicamento do Componente Especializado da
                        Assistência Farmacêutica (LME) preenchido por um médico.
                      </li>
                      <li>Receita médica preenchida.</li>
                      <li>Cópia do comprovante de residência.</li>
                      <li>Exames e outros documentos adicionais, dependendo da doença.</li>
                    </ul>

                    <div className="mt-6 text-center">
                      <a
                        href="/docs/laudo.pdf"
                        download
                        className="inline-flex items-center gap-2 px-4 py-2 bg-success text-white rounded-md hover:bg-success/90 transition-colors text-sm font-medium"
                      >
                        <FileText className="w-4 h-4" />
                        Baixar Laudo (PDF)
                      </a>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* CAF Info */}
              <AccordionItem value="caf-info" className="border border-info/20 rounded-lg px-6">
                <AccordionTrigger className="text-lg font-semibold text-info hover:no-underline">
                  <div className="flex items-center gap-3">
                    <LocationIcon className="h-5 w-5" />
                    Mais informações - CAF
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-info mb-4">Centro de Atendimento Farmacêutico - CAF</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        </div>
                        <div>
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
                      </div>
                    </div>

                    <div className="p-4 bg-info/5 rounded-lg border border-info/20">
                      <h4 className="font-semibold text-info mb-2">Informação Importante</h4>
                      <p className="text-sm text-muted-foreground">
                        O programa é destinado a famílias de baixa renda cadastradas no CadÚnico.
                        Consulte a lista de medicamentos disponíveis no CAF para verificar a cobertura do seu tratamento.
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </




