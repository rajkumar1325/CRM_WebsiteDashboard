package in.SpringBootProject.crm.CuriemCRM.controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;

import in.SpringBootProject.crm.CuriemCRM.entity.Employee;
import in.SpringBootProject.crm.CuriemCRM.entity.FollowUps;
import in.SpringBootProject.crm.CuriemCRM.entity.Inquiry;
import in.SpringBootProject.crm.CuriemCRM.services.FollowUpsService;
import in.SpringBootProject.crm.CuriemCRM.services.InquiryService;

@Controller
@SessionAttributes("sessionEmp")
public class InquiryController
{
	@Autowired
	private InquiryService inquiryService;

	@Autowired
	private FollowUpsService followUpsService;

	// ─── New Lead Page (was: New Inquiry) ────────────────────────────────────

	@GetMapping("/newLead")
	public String openNewLeadPage(Model model)
	{
		model.addAttribute("inquiry", new Inquiry());
		return "new-inquiry";
	}

	// ─── Submit Lead (was: Submit Inquiry Form) ───────────────────────────────

	@PostMapping("/submitLead")
	public String submitLead(
			@ModelAttribute("inquiry") Inquiry inquiry,
			@SessionAttribute("sessionEmp") Employee sessionEmp,
			Model model,
			@RequestParam(name = "followUpDate", required = false) String followUpDate,
			@RequestParam(name = "sourcePage",   required = false) String sourcePage)
	{
		inquiry.setEmpEmail(sessionEmp.getEmail());

		LocalDate ld = LocalDate.now();
		inquiry.setDateOfInquiry(ld.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));

		LocalTime lt = LocalTime.now();
		inquiry.setTimeOfInquiry(lt.format(DateTimeFormatter.ofPattern("HH:mm:ss")));

		try
		{
			inquiryService.addNewInquiry(inquiry);

			String status = inquiry.getStatus();
			if ("Interested - (follow up)".equals(status) && followUpDate != null)
			{
				FollowUps followUps = new FollowUps();
				followUps.setPhoneno(inquiry.getPhoneno());
				followUps.setFollowUpDate(followUpDate);
				followUps.setEmpEmail(sessionEmp.getEmail());
				followUpsService.addFollowUps(followUps);
			}
			else
			{
				followUpsService.deleteByPhoneNumber(inquiry.getPhoneno());
			}

			model.addAttribute("successMsg", "Lead added successfully");
		}
		catch (Exception e)
		{
			e.printStackTrace();
			model.addAttribute("errorMsg", "Failed to add lead. Please try again.");
		}

		if ("followUpsPage".equals(sourcePage))
		{
			model.addAttribute("successMsg", "Lead follow-up handled successfully");
			return "follow-ups";
		}
		else
		{
			return "inquiry-management";  // rename .html to leads.html if desired
		}
	}
}