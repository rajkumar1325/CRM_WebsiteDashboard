package in.SpringBootProject.crm.CuriemCRM.security;

import java.io.IOException;
import java.util.Arrays;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Sends unauthenticated users to the correct login page for admin / employee / customer areas.
 */
@Component
public class RbacAuthenticationEntryPoint implements AuthenticationEntryPoint {

	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException authException) throws IOException {
		String path = stripContext(request.getRequestURI(), request.getContextPath());
		String redirect;
		if (matchesAny(path, WebPaths.ADMIN)) {
			redirect = request.getContextPath() + "/adminLogin";
		} else if (matchesAny(path, WebPaths.EMPLOYEE)) {
			redirect = request.getContextPath() + "/employeeLogin";
		} else if (path.startsWith("/api/")) {
			response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authentication required");
			return;
		} else {
			redirect = request.getContextPath() + "/login";
		}
		response.sendRedirect(redirect);
	}

	private static String stripContext(String uri, String contextPath) {
		if (contextPath != null && !contextPath.isEmpty() && uri.startsWith(contextPath)) {
			return uri.substring(contextPath.length());
		}
		return uri;
	}

	private static boolean matchesAny(String path, String[] patterns) {
		return Arrays.stream(patterns).anyMatch(p -> pathMatches(path, p));
	}

	/** Servlet-style pattern: ** suffix = subtree, * = segment */
	private static boolean pathMatches(String path, String pattern) {
		if (pattern.endsWith("/**")) {
			String prefix = pattern.substring(0, pattern.length() - 3);
			return path.startsWith(prefix);
		}
		return path.equals(pattern) || path.startsWith(pattern + "/");
	}
}
