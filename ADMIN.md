# 🎛️ Painel Administrativo

## 🔑 Acesso

Para acessar o painel administrativo:

1. **URL**: `http://localhost:3000/admin/login`
2. **Credenciais**: guardadas fora do repositório (nunca commitar senha em texto plano)

## ✅ Status dos Erros Corrigidos

- ✅ **Importações server-side corrigidas** - Removidas importações de `catalog.server.ts` dos componentes client
- ✅ **APIs funcionando** - Rotas `/api/admin/*` criadas e testando corretamente
- ✅ **TypeScript compilando** - Todos os erros de tipagem resolvidos
- ✅ **Build funcionando** - Projeto compila sem erros (output: export temporariamente desabilitado para APIs)
- ✅ **Manifest.webmanifest criado** - PWA manifest configurado
- ✅ **Servidor rodando** - `npm run dev` funcionando perfeitamente

## Funcionalidades

### 📋 Listagem de Produtos
- Visualize todos os produtos do catálogo
- Busque produtos por nome, categoria ou subcategoria
- Veja estatísticas de produtos disponíveis, em destaque, etc.
- Acesse diretamente para editar ou visualizar no site

### ✏️ Editar Produtos
- Modifique todas as informações do produto:
  - Nome, categoria, subcategoria
  - Descrição detalhada
  - Preços (diária e final de semana)
  - Dimensões, peso, idade mínima, capacidade
  - Observações especiais
  - Status de disponibilidade
  - Destaque na página inicial
- Upload de novas imagens
- Visualização das imagens existentes

### ➕ Adicionar Produtos
- Crie novos produtos no catálogo
- Formulário completo com validação
- Upload múltiplo de imagens
- Preview automático do caminho onde será salvo
- Geração automática da estrutura de pastas

### 🗑️ Deletar Produtos
- Remova produtos do catálogo
- Confirmação obrigatória antes da exclusão
- Remove automaticamente todas as imagens e metadata

### ⚙️ Configurações
- Visualize informações do sistema
- Acesso rápido a links importantes
- Estatísticas do catálogo

## Estrutura de Arquivos

O sistema gerencia automaticamente a estrutura:

```
public/Organizado/
├── Categoria/
│   ├── Subcategoria/
│   │   ├── Nome do Produto/
│   │   │   ├── metadata.json
│   │   │   ├── imagem1.jpg
│   │   │   ├── imagem2.jpg
│   │   │   └── ...
```

### Exemplo de metadata.json:
```json
{
  "nome": "Fliperama Pac-Man",
  "categoria": "Jogos Eletrônicos",
  "subcategoria": "Fliperamas",
  "descricao": "Clássico jogo de fliperama com mais de 100 jogos",
  "preco_diaria": "R$ 150,00",
  "preco_final_de_semana": "R$ 220,00",
  "dimensoes": "1,80m x 0,60m x 1,70m",
  "peso": "85 kg",
  "idade_minima": "6 anos",
  "capacidade": "2 pessoas",
  "disponivel": true,
  "destaque": false,
  "observacoes": "Necessita tomada 110V"
}
```

## APIs Disponíveis

### POST `/api/admin/products/metadata`
Salva metadata de um produto

### POST `/api/admin/products/images`
Faz upload de imagens para um produto

### DELETE `/api/admin/products/[...slug]`
Remove um produto completamente

### POST `/api/admin/products`
Cria um novo produto

## Segurança

- Autenticação por sessão (sessionStorage)
- Credenciais hardcoded para simplicidade
- Acesso restrito apenas às rotas admin
- Logout automático ao fechar navegador

## Tecnologias Utilizadas

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Radix UI** - Componentes acessíveis
- **File System API** - Manipulação de arquivos
- **React Hook Form** - Formulários

## Dicas de Uso

1. **Imagens**: Use imagens em alta qualidade (JPG/PNG)
2. **Nomes**: Evite caracteres especiais nos nomes dos produtos
3. **Categorias**: Mantenha consistência na nomenclatura
4. **Preços**: Use formato "R$ 100,00" para padronização
5. **Backup**: Faça backup das pastas antes de deletar produtos

## Limitações Atuais

- Upload máximo: 10MB por imagem
- Não há controle de versão
- Autenticação básica (não recomendado para produção)
- Sem auditoria de mudanças

## Próximas Melhorias

- [ ] Controle de versão/histórico
- [ ] Upload drag & drop
- [ ] Redimensionamento automático de imagens  
- [ ] Backup automático
- [ ] Auditoria de mudanças
- [ ] Usuários múltiplos com permissões