package com.unioff.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public UserDetailsManager userDetailsService() {

        UserDetails usuario = User.builder()
                .username("admin")
                .password("{noop}admin123")
                .roles("ADMIN")
                .build();

        return new InMemoryUserDetailsManager(usuario);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            // H2 precisa de frames para funcionar no navegador
            .headers(headers -> headers
                .frameOptions(frame -> frame.sameOrigin())
            )

            // Para desenvolvimento local
            .csrf(csrf -> csrf
                .ignoringRequestMatchers("/h2-console/**")
            )

            .authorizeHttpRequests(auth -> auth

                // H2 Console
                .requestMatchers("/h2-console/**").permitAll()

                // Swagger UI
                .requestMatchers("/swagger-ui/**").permitAll()
                .requestMatchers("/swagger-ui.html").permitAll()

                // OpenAPI
                .requestMatchers("/v3/api-docs/**").permitAll()

                // Qualquer outra rota precisa de login
                .anyRequest().authenticated()
            )

            // Login HTTP Basic
            .httpBasic(httpBasic -> {});

        return http.build();
    }
}