import { configureAuth } from '@vaadin/hilla-react-auth';
import { UsuarioInfoService } from 'Frontend/generated/endpoints';

// Configure auth to use `UsuarioInfoService.getUsuarioInfo` and map to custom roles
const auth = configureAuth(UsuarioInfoService.usuarioLogado, {
  getRoles: (userInfo) => userInfo.authorities.map((v) => v ?? ''),
});

// Export auth provider and useAuth hook, which are automatically
// typed to the result of `UsuarioInfoService.getUsuarioInfo`
export const useAuth = auth.useAuth;
export const AuthProvider = auth.AuthProvider;