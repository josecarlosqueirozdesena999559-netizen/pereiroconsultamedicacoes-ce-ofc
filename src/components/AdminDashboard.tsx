import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit2, Trash2, Building2, Users, UserPlus, Link, Unlink, Calendar, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { UBS, User } from '@/types';
import { getUBS, addUBS, updateUBS, deleteUBS, getUsers, addUser, updateUser, deleteUser, setPostoResponsavel } from '@/lib/storage';
import { supabase } from '@/integrations/supabase/client';

interface UpdateStatus {
  ubs_id: string;
  user_id: string;
  manha: boolean;
  tarde: boolean;
  data: string;
}

const AdminDashboard = () => {
  const [ubsList, setUbsList] = useState<UBS[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [updateStatuses, setUpdateStatuses] = useState<UpdateStatus[]>([]);
  const [isUBSDialogOpen, setIsUBSDialogOpen] = useState(false);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [editingUBS, setEditingUBS] = useState<UBS | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { toast } = useToast();

  // UBS Form State
  const [ubsForm, setUbsForm] = useState({
    nome: '',
    localidade: '',
    horarios: '',
    responsavel: '',
    contato: '',
    status: 'aberto' as 'aberto' | 'fechado'
  });

  // User Form State
  const [userForm, setUserForm] = useState({
    login: '',
    nome: '',
    senha: '',
    tipo: 'responsavel' as 'admin' | 'responsavel',
    ubsVinculadas: [] as string[]
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ubsData, usersData] = await Promise.all([
        getUBS(),
        getUsers()
      ]);
      setUbsList(ubsData);
      setUsersList(usersData);
      await loadUpdateStatuses();
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do sistema.",
        variant: "destructive",
      });
    }
  };

  const loadUpdateStatuses = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('update_checks')
        .select('*')
        .eq('data', today);

      if (error) throw error;
      setUpdateStatuses(data || []);
    } catch (error) {
      console.error('Erro ao carregar status de atualizações:', error);
    }
  };

  const resetUBSForm = () => {
    setUbsForm({
      nome: '',
      localidade: '',
      horarios: '',
      responsavel: '',
      contato: '',
      status: 'aberto'
    });
    setEditingUBS(null);
  };

  const resetUserForm = () => {
    setUserForm({
      login: '',
      nome: '',
      senha: '',
      tipo: 'responsavel',
      ubsVinculadas: []
    });
    setEditingUser(null);
  };

  const handleUBSSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingUBS) {
        await updateUBS(editingUBS.id, {
          ...ubsForm
        });
        toast({
          title: "UBS atualizada com sucesso!",
          description: `${ubsForm.nome} foi atualizada.`,
        });
      } else {
        await addUBS({
          ...ubsForm
        });
        toast({
          title: "UBS criada com sucesso!",
          description: `${ubsForm.nome} foi adicionada ao sistema.`,
        });
      }
      
      await loadData();
      setIsUBSDialogOpen(false);
      resetUBSForm();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a UBS.",
        variant: "destructive",
      });
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const userType = userForm.tipo;
      
      if (editingUser) {
        await updateUser(editingUser.id, {
          ...userForm,
          tipo: userType
        });
        toast({
          title: "Usuário atualizado com sucesso!",
          description: `${userForm.nome} foi atualizado.`,
        });
      } else {
        // Check if login already exists
        const existingUsers = await getUsers();
        const existingUser = existingUsers.find(u => u.login === userForm.login);
        if (existingUser) {
          toast({
            title: "Erro",
            description: "Este email já existe.",
            variant: "destructive",
          });
          return;
        }
        
        await addUser({
          ...userForm,
          tipo: userType
        });
        toast({
          title: "Usuário criado com sucesso!",
          description: `${userForm.nome} foi adicionado ao sistema.`,
        });
      }
      
      await loadData();
      setIsUserDialogOpen(false);
      resetUserForm();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o usuário.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUBS = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta UBS?')) {
      await deleteUBS(id);
      await loadData();
      toast({
        title: "UBS excluída",
        description: "A UBS foi removida do sistema.",
      });
    }
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      deleteUser(id);
      loadData();
      toast({
        title: "Usuário excluído",
        description: "O usuário foi removido do sistema.",
      });
    }
  };

  const editUBS = (ubs: UBS) => {
    setEditingUBS(ubs);
    setUbsForm({
      nome: ubs.nome,
      localidade: ubs.localidade,
      horarios: ubs.horarios,
      responsavel: ubs.responsavel,
      contato: ubs.contato || '',
      status: ubs.status
    });
    setIsUBSDialogOpen(true);
  };

  const editUser = (user: User) => {
    setEditingUser(user);
    setUserForm({
      login: user.login,
      nome: user.nome,
      senha: user.senha,
      tipo: user.tipo,
      ubsVinculadas: user.ubsVinculadas
    });
    setIsUserDialogOpen(true);
  };

  const toggleUserUBS = async (userId: string, ubsId: string) => {
    const user = usersList.find(u => u.id === userId);
    if (!user) return;

    try {
      const isLinked = user.ubsVinculadas.includes(ubsId);

      // Aplicar vínculo 1:1 no banco
      const ok = await setPostoResponsavel(ubsId, isLinked ? null : userId);
      if (!ok) throw new Error('Falha ao atualizar vínculo');

      // Atualizar estado local garantindo exclusividade
      setUsersList(prev =>
        prev.map(u => {
          const filtered = u.ubsVinculadas.filter(id => id !== ubsId);
          if (!isLinked && u.id === userId) {
            return { ...u, ubsVinculadas: [...filtered, ubsId] };
          }
          return { ...u, ubsVinculadas: filtered };
        })
      );

      await loadData();

      const ubs = ubsList.find(u => u.id === ubsId);
      toast({
        title: isLinked ? 'Vinculação removida' : 'Vinculação criada',
        description: isLinked
          ? `Responsável removido de ${ubs?.nome ?? 'UBS'}.`
          : `${user.nome} definido como responsável de ${ubs?.nome ?? 'UBS'}.`,
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar vinculação.',
        variant: 'destructive',
      });
    }
  };

  const getUpdateStatus = (ubsId: string, userId: string) => {
    const status = updateStatuses.find(s => s.ubs_id === ubsId && s.user_id === userId);
    if (!status) return 'none';
    if (status.manha && status.tarde) return 'complete';
    if (status.manha || status.tarde) return 'partial';
    return 'none';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'bg-success text-success-foreground';
      case 'partial':
        return 'bg-success/50 text-success-foreground';
      case 'none':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'partial':
        return <Circle className="h-4 w-4" />;
      case 'none':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string, ubsId: string, userId: string) => {
    const check = updateStatuses.find(s => s.ubs_id === ubsId && s.user_id === userId);
    switch (status) {
      case 'complete':
        return 'Atualizado (Manhã e Tarde)';
      case 'partial':
        return check?.manha ? 'Atualizado (Manhã)' : 'Atualizado (Tarde)';
      case 'none':
        return 'Não atualizado';
      default:
        return 'Sem dados';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Dashboard Administrativo</h1>
          <p className="text-muted-foreground">Gerencie UBS, usuários e vinculações</p>
        </div>
      </div>

      <Tabs defaultValue="ubs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ubs" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            UBS
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="links" className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            Vinculações
          </TabsTrigger>
          <TabsTrigger value="updates" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Atualizações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ubs" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Unidades Básicas de Saúde</h2>
            <Dialog open={isUBSDialogOpen} onOpenChange={setIsUBSDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetUBSForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova UBS
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingUBS ? 'Editar UBS' : 'Nova UBS'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingUBS ? 'Edite as informações da UBS' : 'Adicione uma nova UBS ao sistema'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUBSSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome da UBS</Label>
                      <Input
                        id="nome"
                        value={ubsForm.nome}
                        onChange={(e) => setUbsForm({...ubsForm, nome: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="localidade">Localidade</Label>
                      <Input
                        id="localidade"
                        value={ubsForm.localidade}
                        onChange={(e) => setUbsForm({...ubsForm, localidade: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="horarios">Horários de Funcionamento</Label>
                    <Input
                      id="horarios"
                      value={ubsForm.horarios}
                      onChange={(e) => setUbsForm({...ubsForm, horarios: e.target.value})}
                      placeholder="Ex: 07:00 às 17:00"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="responsavel">Responsável</Label>
                      <Input
                        id="responsavel"
                        value={ubsForm.responsavel}
                        onChange={(e) => setUbsForm({...ubsForm, responsavel: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contato">Contato</Label>
                      <Input
                        id="contato"
                        value={ubsForm.contato}
                        onChange={(e) => setUbsForm({...ubsForm, contato: e.target.value})}
                        placeholder="Ex: (85) 99999-9999"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={ubsForm.status}
                      onValueChange={(value: 'aberto' | 'fechado') => setUbsForm({...ubsForm, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aberto">Aberto</SelectItem>
                        <SelectItem value="fechado">Fechado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsUBSDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingUBS ? 'Atualizar' : 'Criar'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ubsList.map((ubs) => (
              <Card key={ubs.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{ubs.nome}</CardTitle>
                    <Badge variant={ubs.status === 'aberto' ? 'default' : 'secondary'}>
                      {ubs.status === 'aberto' ? 'Aberto' : 'Fechado'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p><strong>Local:</strong> {ubs.localidade}</p>
                    <p><strong>Horários:</strong> {ubs.horarios}</p>
                    <p><strong>Responsável:</strong> {ubs.responsavel}</p>
                    {ubs.contato && <p><strong>Contato:</strong> {ubs.contato}</p>}
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button size="sm" variant="outline" onClick={() => editUBS(ubs)}>
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteUBS(ubs.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Usuários do Sistema</h2>
            <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetUserForm}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Novo Usuário
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingUser ? 'Edite as informações do usuário' : 'Adicione um novo usuário ao sistema'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUserSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input
                      id="nome"
                      value={userForm.nome}
                      onChange={(e) => setUserForm({...userForm, nome: e.target.value})}
                      placeholder="Ex: João Silva"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="login">E-mail (Login)</Label>
                      <Input
                        id="login"
                        type="email"
                        value={userForm.login}
                        onChange={(e) => setUserForm({...userForm, login: e.target.value})}
                        placeholder="usuario@exemplo.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="senha">Senha</Label>
                      <Input
                        id="senha"
                        type="password"
                        value={userForm.senha}
                        onChange={(e) => setUserForm({...userForm, senha: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo de Usuário</Label>
                    <Select
                      value={userForm.tipo}
                      onValueChange={(value: 'admin' | 'responsavel') => setUserForm({...userForm, tipo: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="responsavel">Responsável UBS</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingUser ? 'Atualizar' : 'Criar'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {usersList.map((user) => (
              <Card key={user.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{user.nome}</CardTitle>
                    <Badge variant={user.tipo === 'admin' ? 'default' : 'secondary'}>
                      {user.tipo === 'admin' ? 'Admin' : 'Responsável'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      <strong>E-mail:</strong> {user.login}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>UBS Vinculadas:</strong> {user.ubsVinculadas.length}
                    </p>
                    {user.ubsVinculadas.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {user.ubsVinculadas.map(ubsId => {
                          const ubs = ubsList.find(u => u.id === ubsId);
                          return ubs ? (
                            <Badge key={ubsId} variant="outline" className="text-xs">
                              {ubs.nome}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button size="sm" variant="outline" onClick={() => editUser(user)}>
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteUser(user.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="links" className="space-y-4">
          <h2 className="text-2xl font-semibold">Gerenciar Vinculações</h2>
          
          <div className="grid gap-4">
            {usersList.filter(user => user.tipo === 'responsavel').map((user) => (
              <Card key={user.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{user.nome}</span>
                    <Badge variant="outline">
                      {user.ubsVinculadas.length} UBS vinculada(s)
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {ubsList.map((ubs) => {
                      const isLinked = user.ubsVinculadas.includes(ubs.id);
                      return (
                        <Button
                          key={ubs.id}
                          variant={isLinked ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleUserUBS(user.id, ubs.id)}
                          className={`justify-between transition-all duration-200 ${
                            isLinked 
                              ? "bg-green-600 hover:bg-green-700 text-white border-green-600" 
                              : "border-gray-300 hover:border-green-400 hover:bg-green-50"
                          }`}
                        >
                          <span>{ubs.nome}</span>
                          {isLinked ? (
                            <Unlink className="h-3 w-3" />
                          ) : (
                            <Link className="h-3 w-3" />
                          )}
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="updates" className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">Status de Atualizações</h2>
                <p className="text-sm text-muted-foreground">Acompanhe as atualizações dos PDFs em tempo real</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border shadow-sm">
                <Calendar className="h-5 w-5 text-primary" />
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Hoje</p>
                  <p className="font-semibold">{new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                </div>
              </div>
            </div>
          </div>

          <Card className="border-primary/20 shadow-card">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="h-8 w-1 bg-primary rounded-full"></div>
                Legenda de Status
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-success/10 border border-success/20 transition-all hover:scale-105">
                  <div className="w-6 h-6 rounded-full bg-success shadow-sm flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-success-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Completo</p>
                    <p className="text-xs text-muted-foreground">Manhã e Tarde</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-success/5 border border-success/10 transition-all hover:scale-105">
                  <div className="w-6 h-6 rounded-full bg-success/50 shadow-sm flex items-center justify-center">
                    <Circle className="h-4 w-4 text-success-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Parcial</p>
                    <p className="text-xs text-muted-foreground">Manhã ou Tarde</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20 transition-all hover:scale-105">
                  <div className="w-6 h-6 rounded-full bg-destructive shadow-sm flex items-center justify-center">
                    <AlertCircle className="h-4 w-4 text-destructive-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Pendente</p>
                    <p className="text-xs text-muted-foreground">Não atualizado</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {ubsList.map((ubs, index) => {
              const responsaveis = usersList.filter(u => u.ubsVinculadas.includes(ubs.id));
              
              return (
                <Card 
                  key={ubs.id} 
                  className="overflow-hidden border-l-4 border-l-primary shadow-card hover:shadow-elegant transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl font-bold mb-1">{ubs.nome}</CardTitle>
                        <CardDescription className="flex items-center gap-2 text-sm">
                          <Building2 className="h-3 w-3" />
                          {ubs.localidade}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {responsaveis.length} {responsaveis.length === 1 ? 'responsável' : 'responsáveis'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {responsaveis.length === 0 ? (
                      <div className="text-center py-8 px-4 bg-muted/30 rounded-lg border border-dashed">
                        <AlertCircle className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                        <p className="font-medium text-muted-foreground">Nenhum responsável vinculado</p>
                        <p className="text-xs text-muted-foreground mt-1">Vincule um responsável na aba Vinculações</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {responsaveis.map((user, userIndex) => {
                          const status = getUpdateStatus(ubs.id, user.id);
                          return (
                            <div
                              key={user.id}
                              className={`group relative overflow-hidden rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] ${getStatusColor(status)} animate-scale-in`}
                              style={{ animationDelay: `${(index * 0.1) + (userIndex * 0.05)}s` }}
                            >
                              <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                  <div className="flex-shrink-0">
                                    {getStatusIcon(status)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-base truncate">{user.nome}</p>
                                    <p className="text-sm opacity-90 truncate">{user.login}</p>
                                  </div>
                                </div>
                                <Badge 
                                  variant="outline" 
                                  className="bg-white/20 border-white/30 backdrop-blur-sm flex-shrink-0 ml-2"
                                >
                                  {getStatusText(status, ubs.id, user.id)}
                                </Badge>
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {ubsList.length === 0 && (
            <Card className="border-dashed animate-fade-in">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="rounded-full bg-muted p-6 mb-4">
                  <AlertCircle className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Nenhuma UBS cadastrada</h3>
                <p className="text-muted-foreground text-center max-w-sm">
                  Cadastre UBS na aba correspondente para começar a monitorar as atualizações dos PDFs.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;