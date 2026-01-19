package ao.appsuportegirassol.configs;

import com.vaadin.flow.spring.security.VaadinSecurityConfigurer;
import com.vaadin.hilla.route.RouteUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AuthorizeHttpRequestsConfigurer;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@EnableWebSecurity
@Configuration
public class SecurityConfig {

  @Bean
  SecurityFilterChain securityFilterChain(HttpSecurity http, RouteUtil routeUtil) throws Exception {
    // Set default security policy that permits Hilla internal requests and
    // denies all other
    http.authorizeHttpRequests(registry -> registry.requestMatchers(
        routeUtil::isRouteAllowed).permitAll());
    http.with(VaadinSecurityConfigurer.vaadin(), configurer -> {
      // use a custom login view and redirect to root on logout
      configurer.loginView("/login", "/dashboard")
          .anyRequest(AuthorizeHttpRequestsConfigurer.AuthorizedUrl::authenticated);
    });
    http.authorizeHttpRequests(registry ->
        registry.requestMatchers("/").permitAll()
    );
    return http.build();
  }

  @Bean
  public UserDetailsManager userDetailsService() {
    // Configure users and roles in memory
    return new InMemoryUserDetailsManager(
        // the {noop} prefix tells Spring that the password is not encoded
        User.withUsername("user").password("{noop}user").roles("USER").build(),
        User.withUsername("admin").password("{noop}admin").roles("ADMIN", "USER").build()
    );
  }
}
