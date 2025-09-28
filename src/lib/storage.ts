import { UBS, User } from '@/types';
import { supabase } from '@/integrations/supabase/client';

const STORAGE_KEYS = {
  AUTH: 'pereiro_auth'
};

export const initializeStorage = () => {
  // Storage initialization no longer needed
};

// Transform Supabase data to app format
const transformPostoToUBS = (posto: any, pdf?: any): UBS => ({
  id: posto.id,
  nome: posto.nome,
  localidade: posto.localidade,
  horarios: posto.horario_funcionamento,
  responsavel: posto.responsavel_id || 'Não definido',
  contato: posto.contato || undefined,
  status: posto.status as 'aberto' | 'fechado',
  pdfUrl: pdf?.url,
  pdfUltimaAtualizacao: pdf?.data_upload ? new Date(pdf.data_upload).toLocaleDateString('pt-BR') : undefined,
  createdAt: posto.atualizado_em || new Date().toISOString(),
  updatedAt: posto.atualizado_em || new Date().toISOString()
});

const transformUsuarioToUser = (usuario: any, vinculacoes: any[] = []): User => ({
  id: usuario.id,
  login: usuario.email,
  senha: usuario.senha,
  tipo: usuario.tipo,
  ubsVinculadas: vinculacoes.map(v => v.posto_id),
  createdAt: usuario.criado_em || new Date().toISOString(),
  updatedAt: usuario.criado_em || new Date().toISOString()
});

// UBS operations
export const getUBS = async (): Promise<UBS[]> => {
  try {
    const { data: postos, error } = await supabase
      .from('postos')
      .select('*');

    if (error) throw error;

    const { data: pdfs } = await supabase
      .from('arquivos_pdf')
      .select('*');

    const { data: usuarios } = await supabase
      .from('usuarios')
      .select('*');

    const { data: vinculacoes } = await supabase
      .from('usuario_posto')
      .select('*');

    return (postos || []).map(posto => {
      const pdf = pdfs?.find(p => p.posto_id === posto.id);

      const vinc = vinculacoes?.find(v => v.posto_id === posto.id);
      let responsavel = 'Não definido';
      if (vinc) {
        const user = usuarios?.find(u => u.id === vinc.user_id && u.tipo === 'responsavel');
        if (user) responsavel = user.nome || user.email;
      }

      return {
        id: posto.id,
        nome: posto.nome,
        localidade: posto.localidade,
        horarios: posto.horario_funcionamento,
        responsavel,
        status: posto.status as 'aberto' | 'fechado',
        pdfUrl: pdf?.url,
        pdfUltimaAtualizacao: pdf?.data_upload ? new Date(pdf.data_upload).toLocaleDateString('pt-BR') : undefined,
        contato: posto.contato || undefined,
        createdAt: posto.atualizado_em || new Date().toISOString(),
        updatedAt: posto.atualizado_em || new Date().toISOString()
      };
    });
  } catch (error) {
    console.error('Erro ao buscar UBS:', error);
    return [];
  }
};

export const addUBS = async (ubs: Omit<UBS, 'id' | 'createdAt' | 'updatedAt'>): Promise<UBS> => {
  try {
    const { data, error } = await supabase
      .from('postos')
      .insert({
        nome: ubs.nome,
        localidade: ubs.localidade,
        horario_funcionamento: ubs.horarios,
        contato: ubs.contato,
        status: ubs.status
      })
      .select()
      .single();

    if (error) throw error;

    return transformPostoToUBS(data);
  } catch (error) {
    console.error('Erro ao criar UBS:', error);
    throw error;
  }
};

export const updateUBS = async (id: string, updates: Partial<UBS>): Promise<UBS | null> => {
  try {
    const updateData: any = {};
    if (updates.nome) updateData.nome = updates.nome;
    if (updates.localidade) updateData.localidade = updates.localidade;
    if (updates.horarios) updateData.horario_funcionamento = updates.horarios;
    if (updates.contato !== undefined) updateData.contato = updates.contato;
    if (updates.status) updateData.status = updates.status;

    const { data, error } = await supabase
      .from('postos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return transformPostoToUBS(data);
  } catch (error) {
    console.error('Erro ao atualizar UBS:', error);
    return null;
  }
};

export const deleteUBS = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('postos')
      .delete()
      .eq('id', id);

    return !error;
  } catch (error) {
    console.error('Erro ao deletar UBS:', error);
    return false;
  }
};

// Users operations
export const getUsers = async (): Promise<User[]> => {
  try {
    const { data: usuarios, error } = await supabase
      .from('usuarios')
      .select('*');

    if (error) throw error;

    const { data: vinculacoes } = await supabase
      .from('usuario_posto')
      .select('*');

    return (usuarios || []).map(usuario => {
      const userVinculacoes = vinculacoes?.filter(v => v.user_id === usuario.id) || [];
      return transformUsuarioToUser(usuario, userVinculacoes);
    });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return [];
  }
};

export const addUser = async (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .insert({
        email: user.login,
        senha: user.senha,
        nome: user.login,
        tipo: user.tipo
      })
      .select()
      .single();

    if (error) throw error;

    if (user.ubsVinculadas.length > 0) {
      const vinculacoes = user.ubsVinculadas.map(postoId => ({
        user_id: data.id,
        posto_id: postoId
      }));

      await supabase
        .from('usuario_posto')
        .insert(vinculacoes);
    }

    return transformUsuarioToUser(data, user.ubsVinculadas.map(id => ({ posto_id: id })));
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
};

export const updateUser = async (id: string, updates: Partial<User>): Promise<User | null> => {
  try {
    const updateData: any = {};
    if (updates.login) {
      updateData.email = updates.login;
      updateData.nome = updates.login;
    }
    if (updates.senha) updateData.senha = updates.senha;
    if (updates.tipo) updateData.tipo = updates.tipo;

    let userRow: any = null;

    if (Object.keys(updateData).length > 0) {
      const { data, error } = await supabase
        .from('usuarios')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      userRow = data;
    } else {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      userRow = data;
    }

    if (updates.ubsVinculadas) {
      await supabase
        .from('usuario_posto')
        .delete()
        .eq('user_id', id);

      if (updates.ubsVinculadas.length > 0) {
        await supabase
          .from('usuario_posto')
          .delete()
          .in('posto_id', updates.ubsVinculadas);

        const vinculacoes = updates.ubsVinculadas.map(postoId => ({
          user_id: id,
          posto_id: postoId
        }));

        await supabase
          .from('usuario_posto')
          .insert(vinculacoes);

        for (const postoId of updates.ubsVinculadas) {
          await supabase
            .from('postos')
            .update({ responsavel_id: id })
            .eq('id', postoId);
        }
      }
    }

    return transformUsuarioToUser(userRow, updates.ubsVinculadas?.map(id => ({ posto_id: id })) || []);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return null;
  }
};

export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id);

    return !error;
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    return false;
  }
};

// Define vínculo 1:1 entre posto e responsável
export const setPostoResponsavel = async (postoId: string, userId: string | null): Promise<boolean> => {
  try {
    await supabase
      .from('usuario_posto')
      .delete()
      .eq('posto_id', postoId);

    await supabase
      .from('postos')
      .update({ responsavel_id: userId })
      .eq('id', postoId);

    if (userId) {
      const { error } = await supabase
        .from('usuario_posto')
        .insert({ user_id: userId, posto_id: postoId });
      if (error) throw error;
    }

    return true;
  } catch (error) {
    console.error('Erro ao definir responsável do posto:', error);
    return false;
  }
};

// Auth operations
export const authenticateUser = async (login: string, senha: string): Promise<User | null> => {
  try {
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', login)
      .eq('senha', senha)
      .single();

    if (error || !usuario) return null;

    const { data: vinculacoes } = await supabase
      .from('usuario_posto')
      .select('posto_id')
      .eq('user_id', usuario.id);

    return transformUsuarioToUser(usuario, vinculacoes || []);
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return null;
  }
};

export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEYS.AUTH);
  return data ? JSON.parse(data) : null;
};

export const setCurrentUser = (user: User): void => {
  localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(user));
};

export const clearAuth = (): void => {
  localStorage.removeItem(STORAGE_KEYS.AUTH);
};

// PDF operations
export const savePDF = async (ubsId: string, file: File): Promise<string> => {
  try {
    const fileName = `${ubsId}/${Date.now()}-${file.name}`;

    const { data: existingFiles } = await supabase.storage
      .from('medicacoes_ubs')
      .list(ubsId);

    if (existingFiles && existingFiles.length > 0) {
      const filesToRemove = existingFiles.map(f => `${ubsId}/${f.name}`);
      await supabase.storage
        .from('medicacoes_ubs')
        .remove(filesToRemove);
    }

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('medicacoes_ubs')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error('Erro no upload:', uploadError);
      throw uploadError;
    }

    const { data: urlData } = supabase.storage
      .from('medicacoes_ubs')
      .getPublicUrl(fileName);

    // Remove existing PDF record for this UBS
    await supabase
      .from('arquivos_pdf')
      .delete()
      .eq('posto_id', ubsId);

    // Save to arquivos_pdf table
    const { error: insertError } = await supabase
      .from('arquivos_pdf')
      .insert({
        posto_id: ubsId,
        url: urlData.publicUrl
      });

    if (insertError) {
      console.error('Erro ao salvar no BD:', insertError);
      throw insertError;
    }

    return new Date().toISOString();
  } catch (error) {
    console.error('Erro ao salvar PDF:', error);
    throw error;
  }
};

export const getPDF = async (ubsId: string): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('arquivos_pdf')
      .select('*')
      .eq('posto_id', ubsId)
      .single();

    return error ? null : data;
  } catch (error) {
    console.error('Erro ao buscar PDF:', error);
    return null;
  }
};
