package in.SpringBootProject.crm.CuriemCRM.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import in.SpringBootProject.crm.CuriemCRM.entity.Course;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long>
{
	Optional<Course> findByName(String name);
}
