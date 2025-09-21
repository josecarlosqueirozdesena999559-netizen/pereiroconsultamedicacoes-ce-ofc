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
import { Plus, Edit2, Trash2, Building2, Users, UserPlus, Link, Unlink } from 'lucide-react';
import { UBS, User } from '@/types';
import { getUBS, addUBS, updateUBS, deleteUBS, getUsers, addUser, updateUser, deleteUser } from '@/lib/storage';

const AdminDashboard = () => {
  const [ubsList, setUbsList] = useState<UBS[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
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
    status: 'aberto' as 'aberto' | 'fechado'
  });

  // User Form State
  const [userForm, setUserForm] = useState({
    login: '',
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
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do sistema.",
        variant: "destructive",
      });
    }
  };

  const resetUBSForm = () => {
    setUbsForm({
      nome: '',
      localidade: '',
      horarios: '',
      responsavel: '',
      status: 'aberto'
    });
    setEditingUBS(null);
  };

  const resetUserForm = () => {
    setUserForm({
      login: '',
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
          description: `${userForm.login} foi atualizado.`,
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
          description: `${userForm.login} foi adicionado ao sistema.`,
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
      status: ubs.status
    });
    setIsUBSDialogOpen(true);
  };

  const editUser = (user: User) => {
    setEditingUser(user);
    setUserForm({
      login: user.login,
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
      const newUbsVinculadas = isLinked 
        ? user.ubsVinculadas.filter(id => id !== ubsId)
        : [...user.ubsVinculadas, ubsId];

      const result = await updateUser(userId, { ubsVinculadas: newUbsVinculadas });
      
      if (result) {
        // Update local state immediately for better UX
        setUsersList(prevUsers => 
          prevUsers.map(u => 
            u.id === userId 
              ? { ...u, ubsVinculadas: newUbsVinculadas }
              : u
          )
        );
        
        // Also update UBS list to reflect the responsible change
        await loadData();
        
        toast({
          title: isLinked ? "Vinculação removida" : "Vinculação criada",
          description: `Usuário ${isLinked ? 'desvinculado' : 'vinculado'} com sucesso.`,
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar vinculação.",
        variant: "destructive",
      });
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
        <TabsList className="grid w-full grid-cols-3">
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="login">Login</Label>
                      <Input
                        id="login"
                        value={userForm.login}
                        onChange={(e) => setUserForm({...userForm, login: e.target.value})}
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
                    <CardTitle className="text-lg">{user.login}</CardTitle>
                    <Badge variant={user.tipo === 'admin' ? 'default' : 'secondary'}>
                      {user.tipo === 'admin' ? 'Admin' : 'Responsável'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
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
                    <span>{user.login}</span>
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
      </Tabs>
    </div>
  );
};

export default AdminDashboard;