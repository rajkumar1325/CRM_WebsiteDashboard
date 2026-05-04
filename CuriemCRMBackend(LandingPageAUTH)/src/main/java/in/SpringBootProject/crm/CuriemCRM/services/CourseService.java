package in.SpringBootProject.crm.CuriemCRM.services;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import in.SpringBootProject.crm.CuriemCRM.Repository.CourseRepository;
import in.SpringBootProject.crm.CuriemCRM.entity.Course;

@Service
public class CourseService 
{
	private static final String UPLOAD_DIR = "src/main/resources/static/uploads/";
	private static final String IMAGE_URL = "http://localhost:8080/uploads/";

	@Autowired
	private CourseRepository courseRepository;
	
	public List<Course> getAllCourseDetails()
	{
		return courseRepository.findAll();
	}

	public Page<Course> getAllCourseDetailsByPagination(Pageable pageable)
	{
		return courseRepository.findAll(pageable);
	}

	public List<String> getAllCourseNames()
	{
		return courseRepository.findAll().stream()
				.map(Course::getName)
				.filter(Objects::nonNull)
				.toList();
	}

	public Course getCourseDetails(String courseName)
	{
		return courseRepository.findByName(courseName).orElse(null);
	}

	public void addCourse(Course course, MultipartFile courseImg) throws Exception
	{
		if (courseImg != null && !courseImg.isEmpty())
		{
			String imgName = courseImg.getOriginalFilename();
			if (imgName == null || imgName.isBlank())
			{
				imgName = "course-" + System.currentTimeMillis();
			}
			Path dir = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize();
			Files.createDirectories(dir);
			Path imgPath = dir.resolve(imgName).normalize();
			Files.write(imgPath, courseImg.getBytes());
			course.setImageUrl(IMAGE_URL + imgName);
		}
		if (course.getUpdatedOn() == null || course.getUpdatedOn().isBlank())
		{
			course.setUpdatedOn(LocalDate.now().toString());
		}
		courseRepository.save(course);
	}

	public void updateCourseDetails(Course course)
	{
		if (course.getUpdatedOn() == null || course.getUpdatedOn().isBlank())
		{
			course.setUpdatedOn(LocalDate.now().toString());
		}
		courseRepository.save(course);
	}

	public void deleteCourseDetails(String courseName)
	{
		courseRepository.findByName(courseName).ifPresent(courseRepository::delete);
	}
}