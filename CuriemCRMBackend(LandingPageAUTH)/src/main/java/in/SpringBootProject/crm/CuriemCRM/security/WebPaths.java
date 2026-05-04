package in.SpringBootProject.crm.CuriemCRM.security;

/**
 * Central route lists for RBAC and login redirects (keep in sync with controllers).
 */
public final class WebPaths {

	public static final String[] PUBLIC = {
			"/",
			"/index",
			"/landingPage",
			"/home",
			"/register",
			"/regForm",
			"/login",
			"/loginForm",
			"/employeeLogin",
			"/empLoginForm",
			"/adminLogin",
			"/adminLoginForm",
			"/error",
			"/css/**",
			"/js/**",
			"/images/**",
			"/uploads/**",
			"/webjars/**",
			"/favicon.ico"
	};

	public static final String[] ADMIN = {
			"/adminLogout",
			"/courseManagement",
			"/addCourse",
			"/addCourseForm",
			"/editCourse",
			"/updateCourseDetailsForm",
			"/deleteCourseDetails",
			"/adminFeedback",
			"/adminProfile",
			"/updateFeedbackStatus"
	};

	public static final String[] EMPLOYEE = {
			"/employeeLogout",
			"/employeeProfile",
			"/employeeManagement",
			"/addEmployee",
			"/addEmployeeForm",
			"/editEmployee",
			"/updateEmployeeDetailsForm",
			"/deleteEmployeeDetails",
			"/sellCourse",
			"/sellCourseForm",
			"/inquiryManagement",
			"/newInquiry",
			"/submitInquiryForm",
			"/followUps",
			"/sales"
	};

	public static final String[] CUSTOMER = {
			"/logout",
			"/userProfile",
			"/customerProfile",
			"/myCourses",
			"/provideFeedback",
			"/feedbackForm"
	};

	public static final String[] API_STAFF = {
			"/api/searchInquiries",
			"/api/myFollowUps"
	};

	private WebPaths() {
	}
}
