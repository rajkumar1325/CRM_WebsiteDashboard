package in.SpringBootProject.crm.CuriemCRM.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import in.SpringBootProject.crm.CuriemCRM.entity.EmployeeOrders;

@Repository
public interface EmployeeOrdersRepository extends JpaRepository<EmployeeOrders, Long>
{

}
