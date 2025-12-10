# ServiçoApp - Sistema de Gestão de Atendimentos Técnicos

Sistema completo de gestão de atendimentos técnicos com perfis diferenciados para clientes, técnicos e administradores.

## Funcionalidades Principais

### Sistema de Autenticação
- Login com diferentes tipos de usuário (Cliente, Técnico, Administrador)
- Perfis personalizados para cada tipo de usuário
- Controle de acesso baseado em roles

### Gestão de Pedidos
- Clientes podem criar e gerenciar pedidos de atendimento
- Técnicos podem aceitar e gerenciar atendimentos
- Sistema de status completo: pendente, aceito, em andamento, concluído, cancelado, avaliado
- Cancelamento de pedidos pelos clientes com registro de motivo
- Histórico completo de pedidos

### Sistema de Chat
- Chat em tempo real entre cliente e técnico
- Disponível apenas para pedidos aceitos ou em andamento
- Interface intuitiva com histórico de mensagens
- Indicadores de mensagens lidas/não lidas

### Sistema de Avaliação
- Avaliação por estrelas (1-5) após conclusão do atendimento
- Comentários opcionais dos clientes
- Pontuação média exibida no perfil do técnico
- Histórico de avaliações recebidas

### Dashboard Administrativo
- Visível apenas para administradores
- Estatísticas completas do sistema
- Ranking de técnicos por período (diário, semanal, mensal, anual)
- Score calculado baseado em taxa de conclusão, avaliação média e volume
- Gráficos de evolução de avaliações
- Métricas de performance (taxa de conclusão, cancelamento, satisfação)
- Visualização de todos os pedidos e usuários

### Perfis de Usuário
- Perfil personalizado para cada tipo de usuário
- Técnicos: especialidade, descrição, avaliações, estatísticas
- Clientes: histórico de pedidos
- Visualização de atendimentos/pedidos recentes

## Estrutura do Projeto

\`\`\`
├── app/
│   ├── page.tsx                 # Página de login
│   ├── layout.tsx               # Layout principal com providers
│   ├── pedidos/
│   │   └── page.tsx            # Gestão de pedidos
│   ├── chat/
│   │   └── [orderId]/
│   │       └── page.tsx        # Chat por pedido
│   ├── dashboard/
│   │   └── page.tsx            # Dashboard administrativo
│   └── perfil/
│       └── page.tsx            # Perfil do usuário
├── components/
│   ├── navbar.tsx              # Barra de navegação
│   ├── login-form.tsx          # Formulário de login
│   ├── order-card.tsx          # Card de pedido
│   ├── cancel-order-dialog.tsx # Diálogo de cancelamento
│   ├── rating-dialog.tsx       # Diálogo de avaliação
│   ├── rating-display.tsx      # Exibição de estrelas
│   ├── technician-ranking.tsx  # Ranking de técnicos
│   └── rating-chart.tsx        # Gráfico de avaliações
├── lib/
│   ├── types.ts                # Tipos TypeScript
│   ├── mock-data.ts            # Dados mockados
│   ├── auth-context.tsx        # Contexto de autenticação
│   └── dashboard-utils.ts      # Utilitários do dashboard
└── components/ui/              # Componentes shadcn/ui
\`\`\`

## Regras de Negócio Implementadas

### 1. Perfis Diferenciados
- **Cliente**: Pode criar pedidos, cancelar, conversar com técnico e avaliar
- **Técnico**: Pode aceitar pedidos, conversar com cliente, concluir atendimentos
- **Administrador**: Acesso ao dashboard + funcionalidades de técnico

### 2. Fluxo de Pedidos
1. Cliente cria pedido (status: pendente)
2. Técnico aceita pedido (status: aceito)
3. Técnico inicia atendimento (status: em_andamento)
4. Técnico conclui atendimento (status: concluído)
5. Cliente avalia atendimento (status: avaliado)

### 3. Sistema de Chat
- Chat disponível apenas após técnico aceitar o pedido
- Ambas as partes podem enviar mensagens
- Histórico completo de conversas

### 4. Sistema de Avaliação
- Avaliação só pode ser feita após conclusão do atendimento
- Cliente marca estrelas (1-5) e pode adicionar comentário
- Pontuação aparece automaticamente no perfil do técnico
- Avaliação média calculada com base em todas as avaliações

### 5. Cancelamento de Pedidos
- Cliente pode cancelar pedidos pendentes ou aceitos
- Obrigatório informar motivo do cancelamento
- Cancelamento influencia estatísticas do dashboard

### 6. Dashboard Administrativo
- Visível apenas para usuários com role "admin"
- Estatísticas em tempo real
- Ranking de técnicos com filtros temporais
- Score calculado: 40% taxa de conclusão + 40% avaliação média + 20% volume
- Métricas de performance do sistema

## 🔐 Contas de Teste

### Administrador
- **Email**: joao@email.com
- **Senha**: admin123
- **Acesso**: Dashboard + Pedidos + Chat + Perfil

### Técnico 1
- **Email**: maria@email.com
- **Senha**: tecnico123
- **Acesso**: Pedidos + Chat + Perfil

### Técnico 2
- **Email**: carlos@email.com
- **Senha**: tecnico123
- **Acesso**: Pedidos + Chat + Perfil

### Cliente 1
- **Email**: pedro@email.com
- **Senha**: cliente123
- **Acesso**: Pedidos + Chat + Perfil

### Cliente 2
- **Email**: ana@email.com
- **Senha**: cliente123
- **Acesso**: Pedidos + Chat + Perfil

## Tecnologias Utilizadas

- **Next.js 16** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS v4** - Estilização
- **shadcn/ui** - Componentes UI
- **Recharts** - Gráficos e visualizações
- **date-fns** - Manipulação de datas
- **Lucide React** - Ícones
- **React Context** - Gerenciamento de estado

## Como Executar

1. Instale as dependências:
\`\`\`bash
npm install
\`\`\`

2. Execute o servidor de desenvolvimento:
\`\`\`bash
npm run dev
\`\`\`

3. Acesse http://localhost:3000

4. Faça login com uma das contas de teste acima

## Próximos Passos (Produção)

Para colocar em produção, você precisará:

1. **Backend Real**
   - Implementar API REST ou GraphQL
   - Substituir dados mockados por chamadas reais

2. **Banco de Dados**
   - Configurar banco de dados (PostgreSQL, MongoDB, etc.)
   - Implementar schemas e migrations

3. **Autenticação Real**
   - Implementar JWT ou sessões
   - Hash de senhas com bcrypt
   - Recuperação de senha

4. **Chat em Tempo Real**
   - Implementar WebSockets ou Server-Sent Events
   - Usar serviços como Pusher, Ably ou Socket.io

5. **Upload de Arquivos**
   - Permitir anexos em pedidos e chat
   - Integrar com serviço de storage (AWS S3, Cloudinary)

6. **Notificações**
   - Email notifications
   - Push notifications
   - SMS para eventos importantes

7. **Pagamentos**
   - Integrar gateway de pagamento
   - Sistema de cobrança por atendimento

## Estrutura de Dados

### User
\`\`\`typescript
{
  id: string
  nome: string
  email: string
  password: string
  telefone: string
  role: 'cliente' | 'tecnico' | 'admin'
  especialidade?: string  // apenas técnicos
  descricao?: string      // apenas técnicos
  avaliacaoMedia?: number // apenas técnicos
}
\`\`\`

### Order
\`\`\`typescript
{
  id: string
  clienteId: string
  tecnicoId?: string
  titulo: string
  descricao: string
  status: OrderStatus
  endereco: string
  dataHora: Date
  motivoCancelamento?: string
}
\`\`\`

### Rating
\`\`\`typescript
{
  id: string
  orderId: string
  clienteId: string
  tecnicoId: string
  estrelas: number  // 1-5
  comentario?: string
}
\`\`\`

### ChatMessage
\`\`\`typescript
{
  id: string
  orderId: string
  senderId: string
  mensagem: string
  createdAt: Date
  lida: boolean
}
\`\`\`

## Licença

MIT
