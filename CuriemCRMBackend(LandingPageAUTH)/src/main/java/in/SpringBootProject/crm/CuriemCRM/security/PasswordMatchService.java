package in.SpringBootProject.crm.CuriemCRM.security;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Central BCrypt matching via {@link PasswordEncoder} ({@link org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder}).
 * Supports legacy plain-text values stored before migration (until passwords are re-encoded).
 */
@Service
public class PasswordMatchService {

	private final PasswordEncoder passwordEncoder;

	public PasswordMatchService(PasswordEncoder passwordEncoder) {
		this.passwordEncoder = passwordEncoder;
	}

	public String encode(String rawPassword) {
		return passwordEncoder.encode(rawPassword);
	}

	public boolean matches(String rawPassword, String stored) {
		if (rawPassword == null || stored == null) {
			return false;
		}
		if (looksLikeBcryptHash(stored)) {
			return passwordEncoder.matches(rawPassword, stored);
		}
		return rawPassword.equals(stored);
	}

	/** Password looks like a BCrypt hash (starts with $2a$/etc., typical length 60). */
	public boolean looksLikeBcryptHash(String stored) {
		if (stored == null || stored.length() < 20) {
			return false;
		}
		return stored.startsWith("$2a$") || stored.startsWith("$2b$") || stored.startsWith("$2y$");
	}
}
