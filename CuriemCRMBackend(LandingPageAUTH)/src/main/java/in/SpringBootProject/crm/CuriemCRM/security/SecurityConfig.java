package in.SpringBootProject.crm.CuriemCRM.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	private final JwtAuthenticationFilter jwtAuthenticationFilter;
	private final CustomUserDetailsService userDetailsService;
	private final RbacAuthenticationEntryPoint authenticationEntryPoint;
	private final RbacAccessDeniedHandler accessDeniedHandler;

	public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
	                      CustomUserDetailsService userDetailsService,
	                      RbacAuthenticationEntryPoint authenticationEntryPoint,
	                      RbacAccessDeniedHandler accessDeniedHandler) {
		this.jwtAuthenticationFilter = jwtAuthenticationFilter;
		this.userDetailsService = userDetailsService;
		this.authenticationEntryPoint = authenticationEntryPoint;
		this.accessDeniedHandler = accessDeniedHandler;
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public AuthenticationProvider authenticationProvider(PasswordEncoder passwordEncoder) {
		DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
		provider.setPasswordEncoder(passwordEncoder);
		return provider;
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
		return configuration.getAuthenticationManager();
	}

	@Bean
	public SecurityContextRepository securityContextRepository() {
		return new HttpSessionSecurityContextRepository();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration config = new CorsConfiguration();
		config.setAllowedOriginPatterns(List.of("*"));
		config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
		config.setAllowedHeaders(List.of("*"));
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/api/**", config);
		return source;
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http, AuthenticationProvider authenticationProvider,
	                                               SecurityContextRepository securityContextRepository)
			throws Exception {
		http
				.cors(Customizer.withDefaults())
				.csrf(csrf -> csrf.disable())
				.sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
				.securityContext(sc -> sc.securityContextRepository(securityContextRepository))
				.authenticationProvider(authenticationProvider)
				.exceptionHandling(ex -> ex
						.authenticationEntryPoint(authenticationEntryPoint)
						.accessDeniedHandler(accessDeniedHandler))
				.authorizeHttpRequests(auth -> auth
						.requestMatchers(WebPaths.PUBLIC).permitAll()
						.requestMatchers("/api/auth/**").permitAll()
						// ── CRM Customers API — JWT required, ADMIN or EMPLOYEE only ──
						.requestMatchers("/api/customers/**").hasAnyRole("ADMIN", "EMPLOYEE")
						.requestMatchers(WebPaths.API_STAFF).hasAnyRole("EMPLOYEE", "ADMIN")
						.requestMatchers(HttpMethod.POST, "/api/storeOrderDetails").hasAnyRole("CUSTOMER", "ADMIN")
						.requestMatchers("/api/**").authenticated()
						.requestMatchers(WebPaths.ADMIN).hasRole("ADMIN")
						.requestMatchers(WebPaths.EMPLOYEE).hasRole("EMPLOYEE")
						.requestMatchers(WebPaths.CUSTOMER).hasRole("CUSTOMER")
						.anyRequest().permitAll())
				.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
		return http.build();
	}
}