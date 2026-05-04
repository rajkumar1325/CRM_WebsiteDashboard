package in.SpringBootProject.crm.CuriemCRM.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import in.SpringBootProject.crm.CuriemCRM.entity.Course;
import in.SpringBootProject.crm.CuriemCRM.services.CourseService;

@Controller
public class ProjectController
{
	private static final String UPLOAD_DIR = "src/main/resources/static/uploads/";
	private static final String IMAGE_URL  = "http://localhost:8080/uploads/";

	@Autowired
	private CourseService courseService;

	// ─── Add Project ──────────────────────────────────────────────────────────

	@GetMapping("/addProject")
	public String openAddProjectPage(Model model)
	{
		model.addAttribute("course", new Course());
		return "add-course";   // Thymeleaf template name (rename the .html file too if you want)
	}

	@PostMapping("/addProjectForm")
	public String addProjectForm(
			@ModelAttribute("course") Course course,
			@RequestParam("courseImg") MultipartFile courseImg,
			Model model)
	{
		try
		{
			courseService.addCourse(course, courseImg);
			model.addAttribute("successMsg", "Project added successfully");
		}
		catch (Exception e)
		{
			e.printStackTrace();
			model.addAttribute("errorMsg", "Project not added due to some error");
		}
		return "add-course";
	}

	// ─── Edit Project ─────────────────────────────────────────────────────────

	@GetMapping("/editProject")
	public String openEditProjectPage(
			@RequestParam("projectName") String projectName,
			Model model,
			RedirectAttributes redirectAttributes)
	{
		Course course = courseService.getCourseDetails(projectName);
		if (course == null)
		{
			redirectAttributes.addFlashAttribute("errorMsg", "Project not found");
			return "redirect:/projects";
		}

		model.addAttribute("course", course);
		model.addAttribute("newCourseObj", new Course());
		return "edit-course";
	}

	@PostMapping("/updateProjectForm")
	public String updateProjectForm(
			@ModelAttribute("newCourseObj") Course newCourseObj,
			@RequestParam("courseImg") MultipartFile courseImg,
			RedirectAttributes redirectAttributes)
	{
		try
		{
			Course oldProject = courseService.getCourseDetails(newCourseObj.getName());
			if (oldProject == null)
			{
				redirectAttributes.addFlashAttribute("errorMsg", "Project not found; cannot update");
				return "redirect:/projects";
			}
			newCourseObj.setId(oldProject.getId());

			if (!courseImg.isEmpty())
			{
				String imgName = courseImg.getOriginalFilename();
				if (imgName == null || imgName.isBlank())
				{
					imgName = "project-" + System.currentTimeMillis();
				}
				Path dir     = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize();
				Files.createDirectories(dir);
				Path imgPath = dir.resolve(imgName).normalize();
				Files.write(imgPath, courseImg.getBytes());
				newCourseObj.setImageUrl(IMAGE_URL + imgName);
			}
			else
			{
				newCourseObj.setImageUrl(oldProject.getImageUrl());
			}

			courseService.updateCourseDetails(newCourseObj);
			redirectAttributes.addFlashAttribute("successMsg", "Project updated successfully");
		}
		catch (Exception e)
		{
			redirectAttributes.addFlashAttribute("errorMsg", "Project not updated due to some error");
			e.printStackTrace();
		}
		return "redirect:/projects";
	}

	// ─── Delete Project ───────────────────────────────────────────────────────

	@GetMapping("/deleteProject")
	public String deleteProject(
			@RequestParam("projectName") String projectName,
			RedirectAttributes redirectAttributes)
	{
		try
		{
			courseService.deleteCourseDetails(projectName);
			redirectAttributes.addFlashAttribute("successMsg", "Project deleted successfully");
		}
		catch (Exception e)
		{
			redirectAttributes.addFlashAttribute("errorMsg", "Project not deleted due to some error");
			e.printStackTrace();
		}
		return "redirect:/projects";
	}

	// ─── Projects List (main page) ────────────────────────────────────────────

//	@GetMapping("/projects")
//	public String openProjectsPage(Model model)
//	{
//		model.addAttribute("projects", courseService.getAllCourseDetails());
//		return "course-management";   // rename this .html too if desired
//	}
}