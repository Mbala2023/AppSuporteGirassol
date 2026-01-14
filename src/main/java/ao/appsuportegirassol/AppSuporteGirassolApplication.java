package ao.appsuportegirassol;

import com.vaadin.flow.component.page.AppShellConfigurator;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
public class AppSuporteGirassolApplication implements AppShellConfigurator {
  public static void main(String[] args) {
    SpringApplication.run(AppSuporteGirassolApplication.class, args);
  }
}
