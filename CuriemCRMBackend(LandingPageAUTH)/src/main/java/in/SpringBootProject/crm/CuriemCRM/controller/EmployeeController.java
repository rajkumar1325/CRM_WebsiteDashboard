package in.SpringBootProject.crm.CuriemCRM.controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import in.SpringBootProject.crm.CuriemCRM.security.ApplicationRoles;
import in.SpringBootProject.crm.CuriemCRM.security.MvcSecurityHelper;
import in.SpringBootProject.crm.CuriemCRM.Repository.EmployeeOrdersRepository;
import in.SpringBootProject.crm.CuriemCRM.Repository.EmployeeRepository;
import in.SpringBootProject.crm.CuriemCRM.entity.Employee;
import in.SpringBootProject.crm.CuriemCRM.entity.EmployeeOrders;
import in.SpringBootProject.crm.CuriemCRM.entity.Inquiry;
import in.SpringBootProject.crm.CuriemCRM.entity.Orders;
import in.SpringBootProject.crm.CuriemCRM.services.CourseService;
import in.SpringBootProject.crm.CuriemCRM.services.EmployeeService;
import in.SpringBootProject.crm.CuriemCRM.services.OrdersService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


@Controller
@SessionAttributes("sessionEmp")
public class EmployeeController
{
	@Autowired
	private MvcSecurityHelper mvcSecurityHelper;

	@Autowired
	private EmployeeService employeeService;

	@Autowired
	private CourseService courseService;

	@Autowired
	private OrdersService ordersService;

	@Autowired
	private EmployeeRepository employeeRepository;

	@Autowired
	private EmployeeOrdersRepository employeeOrdersRepository;

	// ─── Employee Login ───────────────────────────────────────────────────────

	@GetMapping("/employeeLogin")
	public String openEmployeeLoginPage()
	{
		return "employee-login";
	}

	@PostMapping("/empLoginForm")
	public String employeeLoginForm(
			@RequestParam("email") String email,
			@RequestParam("password") String pass,
			Model model,
			HttpServletRequest request,
			HttpServletResponse response)
	{
		boolean isAuthenticated = employeeService.loginEmpService(email, pass);
		if (isAuthenticated)
		{
			Employee authenticatedEmp = employeeRepository.findByEmail(email);
			mvcSecurityHelper.loginWithRole(request, response, authenticatedEmp.getEmail(), ApplicationRoles.EMPLOYEE);
			model.addAttribute("sessionEmp", authenticatedEmp);
			return "redirect:/team";
		}
		else
		{
			model.addAttribute("errorMsg", "Incorrect Email or Password");
			return "employee-login";
		}
	}

	// ─── Employee Profile ─────────────────────────────────────────────────────

	@GetMapping("/employeeProfile")
	public String openEmployeeProfilePage()
	{
		return "employee-profile";
	}

	// ─── Team Management (was: Employee Management) ───────────────────────────

	@GetMapping("/team")
	public String openTeamPage(
			Model model,
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size)
	{
		Pageable pageable = PageRequest.of(page, size);
		Page<Employee> teamPage = employeeService.getAllEmployeeDetailsByPagination(pageable);
		model.addAttribute("teamPage", teamPage);
		return "employee-management";
	}

	// ─── Add Team Member (was: Add Employee) ──────────────────────────────────

	@GetMapping("/addTeamMember")
	public String openAddTeamMemberPage(Model model)
	{
		model.addAttribute("employee", new Employee());
		return "add-employee";
	}

	@PostMapping("/addTeamMemberForm")
	public String addTeamMemberForm(
			@ModelAttribute("employee") Employee employee,
			Model model)
	{
		try
		{
			employeeService.addEmployee(employee);
			model.addAttribute("successMsg", "Team member added successfully");
		}
		catch (Exception e)
		{
			e.printStackTrace();
			model.addAttribute("errorMsg", "Team member not added due to some error");
		}
		return "add-employee";
	}

	// ─── Edit Team Member (was: Edit Employee) ────────────────────────────────

	@GetMapping("/editTeamMember")
	public String openEditTeamMemberPage(
			@RequestParam("memberEmail") String memberEmail,
			Model model)
	{
		Employee employee = employeeService.getEmployeeDetails(memberEmail);
		model.addAttribute("employee", employee);
		model.addAttribute("newEmployeeObj", new Employee());
		return "edit-employee";
	}

	@PostMapping("/updateTeamMemberForm")
	public String updateTeamMemberForm(
			@ModelAttribute("newEmployeeObj") Employee newEmployeeObj,
			RedirectAttributes redirectAttributes)
	{
		try
		{
			Employee oldEmployee = employeeService.getEmployeeDetails(newEmployeeObj.getEmail());
			newEmployeeObj.setId(oldEmployee.getId());
			employeeService.updateEmployeeDetails(newEmployeeObj);
			redirectAttributes.addFlashAttribute("successMsg", "Team member updated successfully");
		}
		catch (Exception e)
		{
			redirectAttributes.addFlashAttribute("errorMsg", "Team member not updated due to some error");
			e.printStackTrace();
		}
		return "redirect:/team";
	}

	// ─── Delete Team Member (was: Delete Employee) ────────────────────────────

	@GetMapping("/deleteTeamMember")
	public String deleteTeamMember(
			@RequestParam("memberEmail") String memberEmail,
			RedirectAttributes redirectAttributes)
	{
		try
		{
			employeeService.deleteEmployeeDetails(memberEmail);
			redirectAttributes.addFlashAttribute("successMsg", "Team member removed successfully");
		}
		catch (Exception e)
		{
			redirectAttributes.addFlashAttribute("errorMsg", "Team member not removed due to some error");
			e.printStackTrace();
		}
		return "redirect:/team";
	}

	// ─── New Deal (was: Sell Course) ──────────────────────────────────────────

	@GetMapping("/newDeal")
	public String openNewDealPage(Model model)
	{
		List<String> projectNameList = courseService.getAllCourseNames();
		model.addAttribute("projectNameList", projectNameList);

		String uuidOrderId = UUID.randomUUID().toString();
		model.addAttribute("uuidOrderId", uuidOrderId);

		model.addAttribute("orders", new Orders());
		return "sell-course";
	}

	@PostMapping("/newDealForm")
	public String newDealForm(
			@ModelAttribute("orders") Orders orders,
			@SessionAttribute("sessionEmp") Employee sessionEmp,
			RedirectAttributes redirectAttributes)
	{
		LocalDate ld = LocalDate.now();
		String pdate = ld.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));

		LocalTime lt = LocalTime.now();
		String ptime = lt.format(DateTimeFormatter.ofPattern("hh:mm:ss a"));

		orders.setDateOfPurchase(pdate + ", " + ptime);

		try
		{
			ordersService.storeCustomerOrders(orders);

			EmployeeOrders employeeOrders = new EmployeeOrders();
			employeeOrders.setOrderId(orders.getOrderId());
			employeeOrders.setEmployeeEmail(sessionEmp.getEmail());
			employeeOrdersRepository.save(employeeOrders);

			redirectAttributes.addFlashAttribute("successMsg", "Deal closed successfully");
		}
		catch (Exception e)
		{
			e.printStackTrace();
			redirectAttributes.addFlashAttribute("errorMsg", "Deal not saved due to some error");
		}
		return "redirect:/newDeal";
	}

	// ─── Leads (was: Inquiry Management) ─────────────────────────────────────

	@GetMapping("/leads")
	public String openLeadsPage(Model model)
	{
		model.addAttribute("inquiry", new Inquiry());
		return "inquiry-management";
	}

	// ─── Employee Logout ──────────────────────────────────────────────────────

	@GetMapping("/employeeLogout")
	public String employeeLogout(
			SessionStatus sessionStatus,
			HttpServletRequest request,
			HttpServletResponse response)
	{
		mvcSecurityHelper.logout(request, response);
		sessionStatus.setComplete();
		return "redirect:/";   // → React landing page
	}
}