package in.SpringBootProject.crm.CuriemCRM.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import in.SpringBootProject.crm.CuriemCRM.Repository.AuthUserRepository;
import in.SpringBootProject.crm.CuriemCRM.dto.AuthResponse;
import in.SpringBootProject.crm.CuriemCRM.dto.LoginRequest;
import in.SpringBootProject.crm.CuriemCRM.dto.RegisterRequest;
import in.SpringBootProject.crm.CuriemCRM.entity.AuthRole;
import in.SpringBootProject.crm.CuriemCRM.entity.AuthUser;
import in.SpringBootProject.crm.CuriemCRM.security.CustomUserDetailsService;
import in.SpringBootProject.crm.CuriemCRM.security.JwtService;
import in.SpringBootProject.crm.CuriemCRM.security.PasswordMatchService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final AuthenticationManager authenticationManager;
	private final AuthUserRepository authUserRepository;
	private final PasswordMatchService passwordMatchService;
	private final JwtService jwtService;
	private final CustomUserDetailsService userDetailsService;

	public AuthController(
			AuthenticationManager authenticationManager,
			AuthUserRepository authUserRepository,
			PasswordMatchService passwordMatchService,
			JwtService jwtService,
			CustomUserDetailsService userDetailsService) {
		this.authenticationManager = authenticationManager;
		this.authUserRepository = authUserRepository;
		this.passwordMatchService = passwordMatchService;
		this.jwtService = jwtService;
		this.userDetailsService = userDetailsService;
	}

	@PostMapping({ "/signup", "/register" })
	public ResponseEntity<?> signup(@Valid @RequestBody RegisterRequest request) {
		System.out.println("DEBUG role received: " + request.getRole()); // for debug
		String email = request.getEmail().trim().toLowerCase();
		if (authUserRepository.existsByEmailIgnoreCase(email)) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already registered");
		}
		AuthUser user = new AuthUser();
		user.setEmail(email);
		user.setPassword(passwordMatchService.encode(request.getPassword()));
//		user.setRole(AuthRole.USER);

		// Map string → AuthRole enum from Request....(mapping user dynamically)
		AuthRole authRole;
		try {
			authRole = AuthRole.valueOf(request.getRole().toUpperCase()); // "admin" → ADMIN
		} catch (Exception e) {
			authRole = AuthRole.CUSTOMER; // fallback agar role null ho
		}
		user.setRole(authRole);


		authUserRepository.save(user);

		UserDetails details = userDetailsService.loadUserByUsername(email);
//		String token = jwtService.generateToken(details);
		String token = jwtService.generateToken(details, user.getRole().name());

		return ResponseEntity.ok(new AuthResponse(token, email, user.getRole()));
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
		String email = request.getEmail().trim().toLowerCase();
		try {
			Authentication auth = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(email, request.getPassword()));

			// pehle user fetch karo
			var user = authUserRepository.findByEmailIgnoreCase(email).orElseThrow();

			UserDetails details = (UserDetails) auth.getPrincipal();

			// ab role pass kar sakte hain
			String token = jwtService.generateToken(details, user.getRole().name());

			return ResponseEntity.ok(new AuthResponse(token, email, user.getRole()));
		} catch (BadCredentialsException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
		}
	}
	
}
