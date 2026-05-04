package in.SpringBootProject.crm.CuriemCRM.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import in.SpringBootProject.crm.CuriemCRM.entity.Feedback;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long>
{

}
