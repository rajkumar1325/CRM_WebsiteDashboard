package in.SpringBootProject.crm.CuriemCRM.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import in.SpringBootProject.crm.CuriemCRM.entity.Employee;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long>
{
	Employee findByEmail(String email);
}
