package in.SpringBootProject.crm.CuriemCRM.security;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import in.SpringBootProject.crm.CuriemCRM.Repository.AuthUserRepository;
import in.SpringBootProject.crm.CuriemCRM.entity.AuthRole;
import in.SpringBootProject.crm.CuriemCRM.entity.AuthUser;

@Service
public class CustomUserDetailsService implements UserDetailsService {

	private final AuthUserRepository authUserRepository;

	public CustomUserDetailsService(AuthUserRepository authUserRepository) {
		this.authUserRepository = authUserRepository;
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		AuthUser user = authUserRepository.findByEmailIgnoreCase(username)
				.orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
		String springRole = user.getRole() == AuthRole.CUSTOMER ? "CUSTOMER" : "ADMIN";
		return User.builder()
				.username(user.getEmail())
				.password(user.getPassword())
				.roles(springRole)
				.build();
	}
}
