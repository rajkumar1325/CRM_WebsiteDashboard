package in.SpringBootProject.crm.CuriemCRM.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import in.SpringBootProject.crm.CuriemCRM.entity.Course;
import in.SpringBootProject.crm.CuriemCRM.entity.Feedback;
import in.SpringBootProject.crm.CuriemCRM.services.CourseService;
import in.SpringBootProject.crm.CuriemCRM.services.FeedbackService;
import in.SpringBootProject.crm.CuriemCRM.security.ApplicationRoles;
import in.SpringBootProject.crm.CuriemCRM.security.MvcSecurityHelper;
import in.SpringBootProject.crm.CuriemCRM.security.PasswordMatchService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Controller
public class AdminController
{
	@Value("${app.admin.email}")
	private String adminEmail;

	@Value("${app.admin.password}")
	private String adminPassword;

	@Autowired
	private MvcSecurityHelper mvcSecurityHelper;

	@Autowired
	private PasswordMatchService passwordMatchService;

	@Autowired
	private CourseService courseService;

	@Autowired
	private FeedbackService feedbackService;

	// ─── Admin Login ──────────────────────────────────────────────────────────

	@GetMapping("/adminLogin")
	public String openAdminLoginPage()
	{
		return "admin-login";
	}

	@PostMapping("/adminLoginForm")
	public String adminLoginForm(
			@RequestParam("adminemail") String aemail,
			@RequestParam("adminpass") String apass,
			Model model,
			HttpServletRequest request,
			HttpServletResponse response)
	{
		if (aemail.equals(adminEmail) && passwordMatchService.matches(apass, adminPassword))
		{
			mvcSecurityHelper.loginWithRole(request, response, aemail, ApplicationRoles.ADMIN);
			return "redirect:/adminProfile";
		}
		else
		{
			model.addAttribute("errorMsg", "Invalid email or password");
			return "admin-login";
		}
	}

	// ─── Admin Profile ────────────────────────────────────────────────────────

	@GetMapping("/adminProfile")
	public String openAdminProfilePage()
	{
		return "admin-profile";
	}

	// ─── Projects (was: Course Management) ───────────────────────────────────

	@GetMapping("/projects")
	public String openProjectsPage(
			Model model,
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "4") int size)
	{
		Pageable pageable = PageRequest.of(page, size);
		Page<Course> projectsPage = courseService.getAllCourseDetailsByPagination(pageable);
		model.addAttribute("projectsPage", projectsPage);
		return "course-management";
	}

	// ─── Support (was: Admin Feedback) ───────────────────────────────────────

	@GetMapping("/support")
	public String openSupportPage(
			Model model,
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "4") int size)
	{
		Pageable pageable = PageRequest.of(page, size);
		Page<Feedback> supportPage = feedbackService.getAllFeedbacksByPagination(pageable);
		model.addAttribute("supportPage", supportPage);
		return "view-feedbacks";
	}

	@PostMapping("/updateSupportStatus")
	public String updateSupportStatus(
			@RequestParam("id") Long id,
			@RequestParam("status") String status,
			RedirectAttributes redirectAttributes)
	{
		boolean success = feedbackService.updateFeedbackStatus(id, status);
		if (success)
		{
			redirectAttributes.addFlashAttribute("successMsg", "Support ticket updated successfully.");
		}
		else
		{
			redirectAttributes.addFlashAttribute("errorMsg", "Failed to update support ticket.");
		}
		return "redirect:/support";
	}

	// ─── Admin Logout ─────────────────────────────────────────────────────────

	@GetMapping("/adminLogout")
	public String adminLogout(
			SessionStatus sessionStatus,
			HttpServletRequest request,
			HttpServletResponse response)
	{
		mvcSecurityHelper.logout(request, response);
		sessionStatus.setComplete();
		return "redirect:/";   // → React landing page
	}
}