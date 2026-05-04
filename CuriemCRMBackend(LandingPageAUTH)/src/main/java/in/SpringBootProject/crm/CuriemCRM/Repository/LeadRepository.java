package in.SpringBootProject.crm.CuriemCRM.Repository;

import in.SpringBootProject.crm.CuriemCRM.entity.Lead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long> {

    // Search by name or company (case-insensitive)
    @Query("SELECT l FROM Lead l WHERE " +
           "LOWER(l.fullName) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(l.company)  LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Lead> searchByNameOrCompany(@Param("q") String query);

    // Filter by status
    List<Lead> findByStatus(Lead.LeadStatus status);

    // Filter by dealStatus
    List<Lead> findByDealStatus(Lead.DealStatus dealStatus);
}
