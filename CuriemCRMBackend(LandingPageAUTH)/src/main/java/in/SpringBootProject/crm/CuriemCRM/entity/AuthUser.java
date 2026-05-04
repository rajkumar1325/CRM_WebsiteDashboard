package in.SpringBootProject.crm.CuriemCRM.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "auth_users")
public class AuthUser {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true, length = 255)
	private String email;

	@Column(nullable = false, length = 255)
	private String password;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 32)
	private AuthRole role = AuthRole.CUSTOMER;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public AuthRole getRole() {
		return role;
	}

	public void setRole(AuthRole role) {
		this.role = role;
	}



	public class RegisterRequest {
		private String email;
		private String password;
		private String role; // ← YEH ADD KARO

		// existing getters/setters ke saath yeh bhi add karo:
		public String getRole() { return role; }
		public void setRole(String role) { this.role = role; }
	}
}
