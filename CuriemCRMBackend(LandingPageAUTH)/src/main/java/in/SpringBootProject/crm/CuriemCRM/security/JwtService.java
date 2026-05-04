package in.SpringBootProject.crm.CuriemCRM.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

	@Value("${jwt.secret}")
	private String jwtSecret;

	@Value("${jwt.expiration-ms}")
	private long jwtExpirationMs;

	private SecretKey signingKey() {
		byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
		if (keyBytes.length < 32) {
			try {
				MessageDigest md = MessageDigest.getInstance("SHA-256");
				keyBytes = md.digest(keyBytes);
			} catch (NoSuchAlgorithmException e) {
				throw new IllegalStateException(e);
			}
		}
		return Keys.hmacShaKeyFor(keyBytes);
	}

	public String generateToken(UserDetails userDetails ,String role) {
		Map<String, Object> claims = new HashMap<>();
		claims.put("role", role);  // <-- sirf ye ek line add karo

		return buildToken(claims, userDetails.getUsername());
	}

	private String buildToken(Map<String, Object> extraClaims, String subject) {
		Date now = new Date();
		Date expiry = new Date(now.getTime() + jwtExpirationMs);
		return Jwts.builder()
				.claims(extraClaims)
				.subject(subject)
				.issuedAt(now)
				.expiration(expiry)
				.signWith(signingKey())
				.compact();
	}

	public String extractUsername(String token) {
		return parseClaims(token).getSubject();
	}

	public boolean isTokenValid(String token, UserDetails userDetails) {
		String username = extractUsername(token);
		return username.equalsIgnoreCase(userDetails.getUsername()) && !isTokenExpired(token);
	}

	private boolean isTokenExpired(String token) {
		return parseClaims(token).getExpiration().before(new Date());
	}

	private Claims parseClaims(String token) {
		return Jwts.parser()
				.verifyWith(signingKey())
				.build()
				.parseSignedClaims(token)
				.getPayload();
	}
}
