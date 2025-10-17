import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Upload, Download, Calendar, FileText, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { UBS } from '@/types';
import { getUBS, savePDF, getPDF, getUpdateChecks, saveUpdateCheck } from '@/lib/storage';

const UserDashboard = () => {
  const [ubsList, setUbsList] = useState<UBS[]>([]);
  const [uploadingUBS, setUploadingUBS] = useState<string | null>(null);
  const [updateChecks, setUpdateChecks] = useState<Record<string, { manha: boolean; tarde: boolean }>>({});
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadUserUBS();
    }
  }, [user]);

  const loadUpdateChecksForUBS = async (ubsId: string) => {
    if (!user) return;

    const checks = await getUpdateChecks(user.id, ubsId);
    if (checks) {
      setUpdateChecks(prev => ({
        ...prev,
        [ubsId]: checks
      }));
    }
  };

  const toggleCheck = async (ubsId: string, period: 'manha' | 'tarde') => {
    if (!user) return;

    const current = updateChecks[ubsId] || { manha: false, tarde: false };

    // Se já está marcado, não permite desmarcar
    if (current[period]) {
      toast({
        title: "Não é possível alterar",
        description: "Uma vez marcado, não é possível desmarcar.",
        variant: "destructive",
      });
      return;
    }

    const success = await saveUpdateCheck(user.id, ubsId, period);

    if (success) {
      setUpdateChecks(prev => ({
        ...prev,
        [ubsId]: {
          ...current,
          [period]: true
        }
      }));

      toast({
        title: "Atualização registrada",
        description: `Atualização da ${period} foi marcada com sucesso.`,
      });
    } else {
      toast({
        title: "Erro ao registrar",
        description: "Não foi possível registrar a atualização.",
        variant: "destructive",
      });
    }
  };

  const isComplete = (ubsId: string) => {
    const checks = updateChecks[ubsId];
    return checks?.manha && checks?.tarde;
  };

  const loadUserUBS = async () => {
    try {
      const allUBS = await getUBS();
      const userUBS = allUBS.filter(ubs => user?.ubsVinculadas.includes(ubs.id));
      setUbsList(userUBS);

      // Carregar checks para cada UBS
      userUBS.forEach(ubs => {
        loadUpdateChecksForUBS(ubs.id);
      });
    } catch (error) {
      console.error('Erro ao carregar UBS do usuário:', error);
    }
  };

  const handleFileUpload = async (ubsId: string, file: File) => {
    if (!file) return;

    // Validar se é PDF
    if (file.type !== 'application/pdf') {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione apenas arquivos PDF.",
        variant: "destructive",
      });
      return;
    }

    // Validar tamanho (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 10MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadingUBS(ubsId);

    try {
      await savePDF(ubsId, file);

      toast({
        title: "PDF atualizado com sucesso!",
        description: "O arquivo de medicações foi atualizado.",
      });

      loadUserUBS();
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: "Ocorreu um erro ao salvar o arquivo.",
        variant: "destructive",
      });
    } finally {
      setUploadingUBS(null);
    }
  };

  const handleDownload = (ubs: UBS) => {
    if (ubs.pdfUrl) {
      const link = document.createElement('a');
      link.href = ubs.pdfUrl;
      link.download = `medicacoes_${ubs.nome.replace(/\s+/g, '_')}.pdf`;
      link.click();
    }
  };

  const triggerFileInput = (ubsId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileUpload(ubsId, file);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Meu Dashboard</h1>
          <p className="text-muted-foreground">
            Gerencie os PDFs de medicações das suas UBS
          </p>
        </div>
      </div>

      {/* Aviso informativo */}
      <Card className="border-l-4 border-primary bg-primary/5">
        <CardHeader className="flex flex-row items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          <div>
            <CardTitle className="text-primary">Como Atualizar o PDF</CardTitle>
            <CardDescription>Orientações formais para evitar erros</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <ol className="list-decimal list-inside space-y-1">
            <li>
              Clique no botão <strong>“Atualizar PDF”</strong> e selecione o PDF atualizado do seu estoque.
            </li>
            <li>
              Ao atualizar, <strong>aguarde a notificação</strong> com a mensagem <em>“PDF atualizado com sucesso”</em>.
            </li>
            <li>
              Utilize o botão <strong>“Baixar PDF Atual”</strong> para confirmar se o arquivo está correto, verificando a <strong>data do envio</strong>.
            </li>
            <li>
              Marque <strong>“Atualizado pela manhã”</strong> ou <strong>“Atualizado pela tarde”</strong> <u>somente após atualizar</u>, para evitar erros ou desinformações sobre o estoque real.
            </li>
            <li>
              Após seguir esses passos, o sistema estará devidamente atualizado e funcionando corretamente.
            </li>
          </ol>
        </CardContent>
      </Card>
      {/* Fim do aviso */}

      {ubsList.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma UBS vinculada</h3>
            <p className="text-muted-foreground text-center">
              Você não possui UBS vinculadas ao seu usuário. 
              Entre em contato com o administrador para solicitar acesso.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ubsList.map((ubs) => (
            <Card key={ubs.id} className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-primary">
                  {ubs.nome}
                </CardTitle>
                <CardDescription className="text-sm">
                  {ubs.localidade} • {ubs.horarios}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p><strong>Responsável:</strong> {ubs.responsavel}</p>
                  {ubs.pdfUltimaAtualizacao && (
                    <div className="flex items-center mt-2">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>Última atualização: {ubs.pdfUltimaAtualizacao}</span>
                    </div>
                  )}
                </div>

                {!isComplete(ubs.id) && (
                  <Alert className="border-amber-500/20 bg-amber-500/5">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-700 font-semibold text-sm">Lembrete</AlertTitle>
                    <AlertDescription className="text-amber-600/90 text-xs">
                      Não esqueça de atualizar os documentos hoje
                    </AlertDescription>
                  </Alert>
                )}

                <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Atualização diária</p>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`${ubs.id}-manha`}
                      checked={updateChecks[ubs.id]?.manha || false}
                      onCheckedChange={() => toggleCheck(ubs.id, 'manha')}
                    />
                    <label
                      htmlFor={`${ubs.id}-manha`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Atualizado pela manhã
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`${ubs.id}-tarde`}
                      checked={updateChecks[ubs.id]?.tarde || false}
                      onCheckedChange={() => toggleCheck(ubs.id, 'tarde')}
                    />
                    <label
                      htmlFor={`${ubs.id}-tarde`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Atualizado pela tarde
                    </label>
                  </div>

                  {isComplete(ubs.id) && (
                    <div className="flex items-center gap-2 text-green-600 pt-1">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-xs font-medium">Atualização completa!</span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Arquivo PDF</Label>
                    {ubs.pdfUrl && (
                      <FileText className="h-4 w-4 text-success" />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={() => triggerFileInput(ubs.id)}
                      disabled={uploadingUBS === ubs.id}
                      className="w-full"
                      variant={ubs.pdfUrl ? "outline" : "default"}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploadingUBS === ubs.id 
                        ? 'Enviando...' 
                        : ubs.pdfUrl 
                          ? 'Atualizar PDF' 
                          : 'Enviar PDF'
                      }
                    </Button>

                    {ubs.pdfUrl && (
                      <Button
                        onClick={() => handleDownload(ubs)}
                        variant="ghost"
                        className="w-full"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Baixar PDF Atual
                      </Button>
                    )}
                  </div>

                  <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                    <p><strong>Requisitos:</strong></p>
                    <p>• Formato: PDF apenas</p>
                    <p>• Tamanho máximo: 10MB</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
