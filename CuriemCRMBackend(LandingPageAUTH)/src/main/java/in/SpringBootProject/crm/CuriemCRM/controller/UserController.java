package in.SpringBootProject.crm.CuriemCRM.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.bind.support.SessionStatus;

import in.SpringBootProject.crm.CuriemCRM.security.ApplicationRoles;
import in.SpringBootProject.crm.CuriemCRM.security.MvcSecurityHelper;
import in.SpringBootProject.crm.CuriemCRM.dto.PurchasedCourse;
import in.SpringBootProject.crm.CuriemCRM.entity.Course;
import in.SpringBootProject.crm.CuriemCRM.entity.Customer;                      // ← ADDED
import in.SpringBootProject.crm.CuriemCRM.Repository.OrdersRepository;
import in.SpringBootProject.crm.CuriemCRM.Repository.CustomerRepository;        // ← ADDED
import in.SpringBootProject.crm.CuriemCRM.services.CourseService;
import in.SpringBootProject.crm.CuriemCRM.services.CustomerService;             // ← ADDED
import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Controller
@SessionAttributes("sessionUser")
public class UserController
{
	@Autowired
	private MvcSecurityHelper mvcSecurityHelper;

	@Autowired
	private CustomerService userService;

	@Autowired
	private CustomerRepository userRepository;

	@Autowired
	private CourseService courseService;

	@Autowired
	private OrdersRepository ordersRepository;

	// ─── Home / Index ─────────────────────────────────────────────────────────

	@GetMapping({ "/home", "/index", "/landingPage" })
	public String openIndexPage(
			Model model,
			@SessionAttribute(name = "sessionUser", required = false) Customer sessionCustomer)
	{
		List<Course> projectsList = courseService.getAllCourseDetails();
		model.addAttribute("projectsList", projectsList);

		if (sessionCustomer != null)
		{
			List<Object[]> purchasedList = ordersRepository.findPurchasedCoursesByEmail(sessionCustomer.getEmail());

			List<String> purchasedProjectNames = new ArrayList<>();
			for (Object[] project : purchasedList)
			{
				purchasedProjectNames.add((String) project[3]);
			}
			model.addAttribute("purchasedProjectNames", purchasedProjectNames);
		}

		return "index";
	}

	// ─── Customer Register ────────────────────────────────────────────────────

	@GetMapping("/register")
	public String openRegisterPage(Model model)
	{
		model.addAttribute("customer", new Customer());
		return "register";
	}

	@PostMapping("/regForm")
	public String handleRegForm(
			@Valid @ModelAttribute("customer") Customer customer,
			BindingResult result,
			Model model)
	{
		if (result.hasErrors())
		{
			return "register";
		}
		try
		{
			userService.registerCustomerService(customer);
			model.addAttribute("successMsg", "Registered successfully");
			return "register";
		}
		catch (Exception e)
		{
			e.printStackTrace();
			model.addAttribute("errorMsg", "Registration failed. Please try again.");
			return "error";
		}
	}

	// ─── Customer Login ───────────────────────────────────────────────────────

	@GetMapping("/login")
	public String openLoginPage(Model model)
	{
		model.addAttribute("customer", new Customer());
		return "login";
	}

	@PostMapping("/loginForm")
	public String handleLoginForm(
			@ModelAttribute("customer") Customer customer,
			Model model,
			HttpServletRequest request,
			HttpServletResponse response)
	{
		boolean isAuthenticated = userService.loginCustomerService(customer.getEmail(), customer.getPassword());
		if (isAuthenticated)
		{
			Customer authenticatedUser = userRepository.findByEmail(customer.getEmail());

			if (authenticatedUser.isBanStatus())
			{
				model.addAttribute("errorMsg", "Your account has been suspended. Please contact support.");
				return "login";
			}

			mvcSecurityHelper.loginWithRole(request, response, authenticatedUser.getEmail(), ApplicationRoles.CUSTOMER);
			model.addAttribute("sessionUser", authenticatedUser);
			return "redirect:/customerProfile";
		}
		else
		{
			model.addAttribute("errorMsg", "Incorrect email or password");
			return "login";
		}
	}

	// ─── Customer Logout ──────────────────────────────────────────────────────

	@GetMapping("/logout")
	public String logout(
			SessionStatus sessionStatus,
			HttpServletRequest request,
			HttpServletResponse response)
	{
		mvcSecurityHelper.logout(request, response);
		sessionStatus.setComplete();
		return "redirect:/";
	}

	// ─── Customer Profile ─────────────────────────────────────────────────────

	@GetMapping({ "/customerProfile", "/userProfile" })
	public String openCustomerProfile()
	{
		return "user-profile";
	}

	// ─── My Projects ─────────────────────────────────────────────────────────

	@GetMapping("/myProjects")
	public String myProjectsPage(
			@SessionAttribute("sessionUser") Customer sessionUser,
			Model model)
	{
		List<Object[]> pcDbList = ordersRepository.findPurchasedCoursesByEmail(sessionUser.getEmail());

		List<PurchasedCourse> purchasedProjectsList = new ArrayList<>();

		for (Object[] project : pcDbList)
		{
			PurchasedCourse purchasedProject = new PurchasedCourse();
			purchasedProject.setPurchasedOn((String) project[0]);
			purchasedProject.setDescription((String) project[1]);
			purchasedProject.setImageUrl((String) project[2]);
			purchasedProject.setCourseName((String) project[3]);
			purchasedProject.setUpdatedOn((String) project[4]);
			purchasedProjectsList.add(purchasedProject);
		}

		model.addAttribute("purchasedProjectsList", purchasedProjectsList);
		return "my-courses";
	}
}
