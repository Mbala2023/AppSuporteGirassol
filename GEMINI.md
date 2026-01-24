# GEMINI.md

## Project Overview

This is a full-stack web application for managing technical support services. It's built with a Spring Boot backend and a React frontend.

**Backend:**

*   **Framework:** Spring Boot
*   **Language:** Java 21
*   **Dependencies:**
    *   Spring Web
    *   Spring Data JPA
    *   Spring Security
    *   H2 Database (for development)
    *   Lombok
    *   Langchain4j for AI-powered features

**Frontend:**

*   **Framework:** React
*   **Language:** TypeScript
*   **Build Tool:** Vite
*   **UI:** Shadcn/UI, Tailwind CSS
*   **Dependencies:**
    *   Vaadin Hilla
    *   React Router
    *   Recharts
    *   date-fns

The application features a role-based authentication system (client, technician, administrator), order management, a real-time chat between clients and technicians, a rating system, and an administrative dashboard with statistics.

## Building and Running

### Backend

To run the Spring Boot application, you can use the Maven wrapper:

```bash
./mvnw spring-boot:run
```

The backend will be available at `http://localhost:8080`.

### Frontend

To run the frontend, first, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`.

**Backend Configuration:**
*   **Virtual Threads:** The application is configured to use virtual threads for improved concurrency.
*   **Database:** JPA is configured to show SQL queries for debugging purposes.
*   **AI:** The application uses a Gemini API token for AI-powered features. The token is configured in `application.yml`.
*   **Logging:** Debug logging is enabled for several packages, which is useful for development.

## Development Conventions

*   **Backend:** The project follows standard Spring Boot conventions.
*   **Frontend:** The project uses functional components with Hooks. The code is organized into components, pages, and libraries. The `@` alias is configured to point to `src/main/frontend`.
*   **Code Style:** The project uses Prettier for code formatting.
*   **Styling:** Tailwind CSS is used for styling.
*   **TypeScript:** The project uses strict mode and enables experimental decorators.
*   **API:** The frontend communicates with the backend via Vaadin Hilla.

## Test Accounts

### Administrator
- **Email**: joao@email.com
- **Senha**: admin123

### Technician 1
- **Email**: maria@email.com
- **Senha**: tecnico123

### Technician 2
- **Email**: carlos@email.com
- **Senha**: tecnico123

### Client 1
- **Email**: pedro@email.com
- **Senha**: cliente123

### Client 2
- **Email**: ana@email.com
- **Senha**: cliente123

## Data Structure

### User
```typescript
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
```

### Order
```typescript
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
```

### Rating
```typescript
{
  id: string
  orderId: string
  clienteId: string
  tecnicoId: string
  estrelas: number  // 1-5
  comentario?: string
}
```

### ChatMessage
```typescript
{
  id: string
  orderId: string
  senderId: string
  mensagem: string
  createdAt: Date
  lida: boolean
}
```
