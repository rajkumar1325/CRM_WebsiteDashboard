package in.SpringBootProject.crm.CuriemCRM.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import in.SpringBootProject.crm.CuriemCRM.entity.Inquiry;
import java.util.List;


@Repository
public interface InquiryRepository extends JpaRepository<Inquiry, Long> 
{
	List<Inquiry> findByPhoneno(String phoneno);
}