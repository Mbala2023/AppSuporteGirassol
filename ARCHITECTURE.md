# Arquitetura do Sistema

## Visão Geral

O ServiçoApp é uma aplicação Next.js que implementa um sistema completo de gestão de atendimentos técnicos com três tipos de usuários distintos.

## Padrões de Arquitetura

### 1. Autenticação e Autorização

#### Context API
Utilizamos React Context para gerenciar o estado de autenticação globalmente:

\`\`\`typescript
// lib/auth-context.tsx
- AuthProvider: Provedor de contexto
- useAuth: Hook customizado para acessar contexto
- Funções: login(), logout()
- Estados: user, isAuthenticated, isAdmin, isTechnician, isClient
\`\`\`

#### Controle de Acesso
- **Verificação no Cliente**: useEffect verifica autenticação e redireciona
- **Verificação de Role**: Componentes verificam role antes de renderizar
- **Proteção de Rotas**: Páginas redirecionam usuários não autorizados

### 2. Gestão de Estado

#### Estado Local (useState)
- Formulários e inputs
- Diálogos e modais
- Filtros e tabs

#### Estado Global (Context)
- Autenticação do usuário
- Dados do perfil

#### Dados Mockados
- Armazenados em `lib/mock-data.ts`
- Simulam resposta de API
- Facilitam desenvolvimento e testes

### 3. Estrutura de Componentes

#### Componentes de Página (app/)
- Páginas completas com lógica de negócio
- Gerenciam estado e efeitos
- Fazem composição de componentes menores

#### Componentes Reutilizáveis (components/)
- Componentes específicos do domínio
- Recebem props e callbacks
- Não gerenciam estado global

#### Componentes UI (components/ui/)
- Componentes base do shadcn/ui
- Totalmente reutilizáveis
- Sem lógica de negócio

### 4. Fluxo de Dados

\`\`\`
Usuário Interage
    ↓
Componente de Página
    ↓
Atualiza Estado Local
    ↓
Renderiza Componentes Filhos
    ↓
Componentes Recebem Props
    ↓
Exibem Dados
\`\`\`

### 5. Padrões de Código

#### Nomenclatura
- Componentes: PascalCase (OrderCard, RatingDialog)
- Funções: camelCase (handleSubmit, getUserById)
- Constantes: UPPER_SNAKE_CASE (REFUSAL_MESSAGE)
- Arquivos: kebab-case (order-card.tsx, auth-context.tsx)

#### Organização de Imports
\`\`\`typescript
// 1. Imports do React
import { useState, useEffect } from 'react'

// 2. Imports do Next.js
import { useRouter } from 'next/navigation'

// 3. Imports de componentes
import { Button } from '@/components/ui/button'

// 4. Imports de utilitários
import { useAuth } from '@/lib/auth-context'

// 5. Imports de tipos
import { Order, User } from '@/lib/types'
\`\`\`

#### Estrutura de Componentes
\`\`\`typescript
// 1. Tipos e interfaces
interface ComponentProps { }

// 2. Componente
export function Component({ props }: ComponentProps) {
  // 3. Hooks
  const router = useRouter()
  const [state, setState] = useState()
  
  // 4. Effects
  useEffect(() => { }, [])
  
  // 5. Handlers
  const handleAction = () => { }
  
  // 6. Render
  return ( )
}
\`\`\`

## Fluxos Principais

### Fluxo de Autenticação
1. Usuário acessa página de login
2. Insere credenciais
3. Sistema valida (mock) e cria sessão
4. Armazena dados no localStorage
5. Redireciona para /pedidos
6. AuthProvider carrega dados do localStorage
7. Aplicação renderiza com usuário autenticado

### Fluxo de Pedido
1. Cliente cria pedido (status: pendente)
2. Pedido aparece na aba "Disponíveis" dos técnicos
3. Técnico aceita pedido (status: aceito)
4. Chat é habilitado entre cliente e técnico
5. Técnico marca como em andamento
6. Técnico conclui atendimento (status: concluído)
7. Cliente recebe opção de avaliar
8. Cliente avalia (status: avaliado)
9. Avaliação aparece no perfil do técnico

### Fluxo de Chat
1. Pedido deve estar aceito ou em andamento
2. Cliente ou técnico acessa /chat/[orderId]
3. Sistema carrega mensagens do pedido
4. Usuário digita mensagem
5. Mensagem é adicionada ao estado
6. Interface atualiza automaticamente
7. Scroll automático para última mensagem

### Fluxo de Avaliação
1. Técnico conclui atendimento
2. Status muda para "concluído"
3. Botão "Avaliar" aparece para cliente
4. Cliente clica e abre diálogo
5. Cliente seleciona estrelas (1-5)
6. Cliente adiciona comentário (opcional)
7. Sistema atualiza status para "avaliado"
8. Avaliação aparece no perfil do técnico

## Decisões de Design

### Por que Context API?
- Simples para escopo do projeto
- Evita prop drilling
- Fácil de entender e manter
- Suficiente para autenticação

### Por que Dados Mockados?
- Desenvolvimento rápido
- Testes sem backend
- Demonstração de funcionalidades
- Fácil migração para API real

### Por que shadcn/ui?
- Componentes acessíveis
- Totalmente customizáveis
- TypeScript nativo
- Sem dependências pesadas

### Por que Next.js App Router?
- Server Components por padrão
- Roteamento baseado em arquivos
- Melhor performance
- Preparado para futuro

## Melhorias Futuras

### Performance
- Implementar React Query para cache
- Lazy loading de componentes
- Otimização de imagens
- Code splitting

### Segurança
- Implementar CSRF protection
- Rate limiting
- Validação de inputs
- Sanitização de dados

### UX/UI
- Skeleton loaders
- Animações de transição
- Feedback visual melhorado
- Modo offline

### Funcionalidades
- Busca e filtros avançados
- Exportação de relatórios
- Notificações em tempo real
- Sistema de agendamento
