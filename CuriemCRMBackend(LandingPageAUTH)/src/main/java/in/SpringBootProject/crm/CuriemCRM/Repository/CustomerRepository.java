package in.SpringBootProject.crm.CuriemCRM.Repository;

import in.SpringBootProject.crm.CuriemCRM.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    // Filter by status
    List<Customer> findByStatus(Customer.CustomerStatus status);

    // Full-text search across name, email, company, phone
    @Query("""
            SELECT c FROM Customer c
            WHERE LOWER(c.fullName)  LIKE LOWER(CONCAT('%', :q, '%'))
               OR LOWER(c.email)     LIKE LOWER(CONCAT('%', :q, '%'))
               OR LOWER(c.company)   LIKE LOWER(CONCAT('%', :q, '%'))
               OR LOWER(c.phone)     LIKE LOWER(CONCAT('%', :q, '%'))
               OR LOWER(c.customerCode) LIKE LOWER(CONCAT('%', :q, '%'))
            ORDER BY c.fullName
            """)
    List<Customer> search(@Param("q") String q);

    // Count per status
    long countByStatus(Customer.CustomerStatus status);

    // Sum contract values (active only, ignoring nulls)
    @Query("SELECT COALESCE(SUM(c.contractValue), 0) FROM Customer c WHERE c.contractValue IS NOT NULL")
    BigDecimal sumTotalRevenue();
}
