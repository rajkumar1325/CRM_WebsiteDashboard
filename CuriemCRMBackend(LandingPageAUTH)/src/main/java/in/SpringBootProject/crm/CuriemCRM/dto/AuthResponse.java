package in.SpringBootProject.crm.CuriemCRM.dto;

import in.SpringBootProject.crm.CuriemCRM.entity.AuthRole;

public class AuthResponse {

	private String token;
	private String tokenType = "Bearer";
	private String email;
	private AuthRole role;

	public AuthResponse() {
	}

	public AuthResponse(String token, String email, AuthRole role) {
		this.token = token;
		this.email = email;
		this.role = role;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public String getTokenType() {
		return tokenType;
	}

	public void setTokenType(String tokenType) {
		this.tokenType = tokenType;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public AuthRole getRole() {
		return role;
	}

	public void setRole(AuthRole role) {
		this.role = role;
	}
}
