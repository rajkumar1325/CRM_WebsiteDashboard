package in.SpringBootProject.crm.CuriemCRM.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import in.SpringBootProject.crm.CuriemCRM.entity.Employee;
import in.SpringBootProject.crm.CuriemCRM.Repository.EmployeeRepository;
import in.SpringBootProject.crm.CuriemCRM.security.PasswordMatchService;

@Service
public class EmployeeService {

	private final EmployeeRepository employeeRepository;
	private final PasswordMatchService passwordMatchService;

	public EmployeeService(EmployeeRepository employeeRepository, PasswordMatchService passwordMatchService) {
		this.employeeRepository = employeeRepository;
		this.passwordMatchService = passwordMatchService;
	}

	public boolean loginEmpService(String email, String password) {
		Employee employee = employeeRepository.findByEmail(email);
		if (employee != null) {
			return passwordMatchService.matches(password, employee.getPassword());
		}
		return false;
	}

	public void addEmployee(Employee employee) {
		employee.setPassword(passwordMatchService.encode(employee.getPassword()));
		employeeRepository.save(employee);
	}
	
	public Employee getEmployeeDetails(String employeeEmail)
	{
		return employeeRepository.findByEmail(employeeEmail);
	}
	
	public Page<Employee> getAllEmployeeDetailsByPagination(Pageable pageable)
	{
		return employeeRepository.findAll(pageable);
	}
	
	public void updateEmployeeDetails(Employee employee) {
		Employee existing = employeeRepository.findByEmail(employee.getEmail());
		if (existing == null) {
			throw new RuntimeException("Employee not found with email: " + employee.getEmail());
		}
		String pwd = employee.getPassword();
		if (pwd == null || pwd.isBlank()) {
			employee.setPassword(existing.getPassword());
		} else if (!passwordMatchService.looksLikeBcryptHash(pwd)) {
			employee.setPassword(passwordMatchService.encode(pwd));
		}
		employeeRepository.save(employee);
	}
	
	public void deleteEmployeeDetails(String employeeEmail)
	{
		Employee employee = employeeRepository.findByEmail(employeeEmail);
		if(employee != null)
		{
			employeeRepository.delete(employee);
		}
		else
		{
			throw new RuntimeException("Employee not found with email : "+employeeEmail);
		}
	}
}