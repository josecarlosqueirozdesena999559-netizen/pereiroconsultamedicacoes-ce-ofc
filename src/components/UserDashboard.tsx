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

      {/* ⚠️ Aviso informativo adicionado */}
      <Card className="border-l-4 border-primary bg-primary/5">
        <CardHeader className="flex flex-row items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          <div>
            <CardTitle className="text-primary">Como Atualizar o PDF</CardTitle>
            <CardDescription>Passos formais para evitar erros</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <ol className="list-decimal list-inside space-y-1">
            <li>Clique no botão <strong>“Atualizar PDF”</strong> e selecione o arquivo atualizado do seu estoque.</li>
            <li>Aguarde a notificação de <em>PDF atualizado com sucesso</em>.</li>
            <li>Utilize o botão <strong>“Baixar PDF Atual”</strong> para confirmar se o arquivo corresponde à versão enviada (verifique a data).</li>
            <li>Marque <strong>Atualizado pela manhã</strong> ou <strong>tarde</strong> somente após atualizar, evitando informações incorretas.</li>
            <li>Após seguir esses passos, a atualização estará concluída.</li>
          </ol>
        </CardContent>
      </Card>
      {/* ⚠️ Fim do aviso */}

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
              {/* ... resto do seu código igual ... */}
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-primary">
                  {ubs.nome}
                </CardTitle>
                <CardDescription className="text-sm">
                  {ubs.localidade} • {ubs.horarios}
                </CardDescription>
              </CardHeader>
              {/* conteúdo restante inalterado */}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
