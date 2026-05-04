package in.SpringBootProject.crm.CuriemCRM.Repository;

import in.SpringBootProject.crm.CuriemCRM.entity.Customer;   // ← ADDED
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Customer, Long>
{
    Customer findByEmail(String email);
}
