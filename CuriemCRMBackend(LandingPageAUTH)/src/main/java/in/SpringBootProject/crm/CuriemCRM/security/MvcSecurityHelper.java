package in.SpringBootProject.crm.CuriemCRM.security;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class MvcSecurityHelper {

	private final SecurityContextRepository securityContextRepository;

	public MvcSecurityHelper(SecurityContextRepository securityContextRepository) {
		this.securityContextRepository = securityContextRepository;
	}

	/**
	 * Establishes Spring Security context for the MVC session (password not used; principal is email).
	 */
	public void loginWithRole(HttpServletRequest request, HttpServletResponse response, String email, String roleAuthority) {
		UserDetails user = User.builder()
				.username(email)
				.password("{noop}")
				.authorities(roleAuthority)
				.build();
		UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
				user,
				null,
				user.getAuthorities());
		authentication.setAuthenticated(true);
		SecurityContext context = SecurityContextHolder.createEmptyContext();
		context.setAuthentication(authentication);
		SecurityContextHolder.setContext(context);
		securityContextRepository.saveContext(context, request, response);
	}

	public void logout(HttpServletRequest request, HttpServletResponse response) {
		SecurityContext context = SecurityContextHolder.createEmptyContext();
		SecurityContextHolder.setContext(context);
		securityContextRepository.saveContext(context, request, response);
	}
}
