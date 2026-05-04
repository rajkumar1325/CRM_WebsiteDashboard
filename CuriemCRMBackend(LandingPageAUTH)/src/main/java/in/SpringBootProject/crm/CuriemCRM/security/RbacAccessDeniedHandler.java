package in.SpringBootProject.crm.CuriemCRM.security;

import java.io.IOException;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * API requests get 403; browser requests are redirected using the same routing idea as {@link RbacAuthenticationEntryPoint}.
 */
@Component
public class RbacAccessDeniedHandler implements AccessDeniedHandler {

	private final RbacAuthenticationEntryPoint entryPoint;

	public RbacAccessDeniedHandler(RbacAuthenticationEntryPoint entryPoint) {
		this.entryPoint = entryPoint;
	}

	@Override
	public void handle(HttpServletRequest request, HttpServletResponse response,
			AccessDeniedException accessDeniedException) throws IOException {
		if (request.getRequestURI().startsWith(request.getContextPath() + "/api/")) {
			response.sendError(HttpServletResponse.SC_FORBIDDEN, "Insufficient privileges");
			return;
		}
		entryPoint.commence(request, response,
				new InsufficientAuthenticationException("Access denied for this area"));
	}
}
