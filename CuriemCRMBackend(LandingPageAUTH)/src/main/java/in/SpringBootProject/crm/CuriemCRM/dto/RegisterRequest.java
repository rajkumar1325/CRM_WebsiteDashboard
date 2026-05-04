package in.SpringBootProject.crm.CuriemCRM.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

	private String role; // add this field + getter/setter
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}



	@NotBlank
	@Email
	private String email;

	@NotBlank
	@Size(min = 6, max = 100)
	private String password;

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
}
