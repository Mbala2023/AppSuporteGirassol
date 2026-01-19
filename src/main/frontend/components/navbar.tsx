import { useNavigate, Link } from "react-router"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutDashboard, Package, User, LogOut, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { SunflowerLogo } from "./sunflower-logo"
import { getAuthenticatedUser, logout } from "Frontend/auth"

export function Navbar() {
  const pathname = window.location.pathname
  const router = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const user = getAuthenticatedUser()
  const isAdmin = user?.authorities.includes("ROLE_ADMIN")
  const isTecnico = user?.authorities.includes("ROLE_TECNICO")

  const handleLogout = () => {
    logout()
    router("/")
  }

  if (!user) return null

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const NavigationLinks = () => (
    <>
      {isAdmin && (
        <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
          <Button
            variant={pathname === "/dashboard" ? "secondary" : "ghost"}
            size="sm"
            className="w-full justify-start"
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </Link>
      )}

      <Link to="/pedidos" onClick={() => setMobileMenuOpen(false)}>
        <Button variant={pathname === "/pedidos" ? "secondary" : "ghost"} size="sm" className="w-full justify-start">
          <Package className="mr-2 h-4 w-4" />
          Pedidos
        </Button>
      </Link>

      <Link to="/perfil" onClick={() => setMobileMenuOpen(false)}>
        <Button variant={pathname === "/perfil" ? "secondary" : "ghost"} size="sm" className="w-full justify-start">
          <User className="mr-2 h-4 w-4" />
          Perfil
        </Button>
      </Link>
    </>
  )

  return (
    <nav className="border-b bg-background sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 md:h-20 items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <Link to="/pedidos" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <div className="text-primary hover:text-primary/80 transition-colors">
                <SunflowerLogo />
              </div>
              <div className="flex flex-col">
                <span className="hidden sm:inline text-lg md:text-xl font-bold text-primary">ServiçoApp</span>
                <span className="hidden sm:inline text-xs text-muted-foreground">Gestão de Atendimentos</span>
              </div>
            </Link>

            <div className="hidden md:flex gap-1 ml-8">
              {isAdmin && (
                <Link to="/dashboard">
                  <Button variant={pathname === "/dashboard" ? "secondary" : "ghost"} size="sm">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              )}

              <Link to="/pedidos">
                <Button variant={pathname === "/pedidos" ? "secondary" : "ghost"} size="sm">
                  <Package className="mr-2 h-4 w-4" />
                  Pedidos
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="flex flex-col gap-4 mt-8">
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>{getInitials(user.nome)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">{user.nome}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {user.authorities.includes("ROLE_ADMIN") ? "Administrador" : user.authorities.includes("ROLE_TECNICO") ? "Técnico" : "Cliente"}
                      </p>
                    </div>
                  </div>
                  <NavigationLinks />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full justify-start text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full hover:bg-accent/50">
                  <Avatar className="h-9 w-9 sm:h-10 sm:w-10">
                    <AvatarFallback className="text-xs sm:text-sm bg-primary text-primary-foreground">
                      {getInitials(user.nome)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium truncate">{user.nome}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.username}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {user.authorities.includes("ROLE_ADMIN") ? "Administrador" : user.authorities.includes("ROLE_TECNICO") ? "Técnico" : "Cliente"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="md:hidden">
                  <Link to="/pedidos" className="cursor-pointer">
                    <Package className="mr-2 h-4 w-4" />
                    Pedidos
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/perfil" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Meu Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
