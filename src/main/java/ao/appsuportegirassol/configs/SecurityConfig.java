package ao.appsuportegirassol.configs;

import com.vaadin.flow.spring.security.VaadinSecurityConfigurer;
import com.vaadin.hilla.route.RouteUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AuthorizeHttpRequestsConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
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

    http
        .csrf((csrf) -> csrf
            // ignore our stomp endpoints since they are protected using Stomp headers
            .ignoringRequestMatchers("/chat/**")
        )
        .headers((headers) -> headers
            // allow same origin to frame our site to support iframe SockJS
            .frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin
            )
        );

    http.authorizeHttpRequests(registry ->
        registry
            .requestMatchers("/", "/error").permitAll()
            .requestMatchers("/chat/**", "/ws/**", "/app/topic/**").authenticated()
    );
    http.with(VaadinSecurityConfigurer.vaadin(), configurer -> {
      // use a custom login view and redirect to root on logout
      configurer.loginView("/login", "/dashboard");
    });
    return http.build();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
}
