package in.SpringBootProject.crm.CuriemCRM.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.SessionAttributes;

@Controller
@SessionAttributes("sessionEmp")
public class FollowUpsController
{
	// ─── Follow-ups Page (was: /followUps) ───────────────────────────────────

	@GetMapping("/follow-ups")
	public String openFollowUpsPage()
	{
		return "follow-ups";
	}
}