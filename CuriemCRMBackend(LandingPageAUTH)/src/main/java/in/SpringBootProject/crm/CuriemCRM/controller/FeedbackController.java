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
import org.springframework.web.bind.annotation.SessionAttributes;

import in.SpringBootProject.crm.CuriemCRM.entity.Feedback;
import in.SpringBootProject.crm.CuriemCRM.services.FeedbackService;

@Controller
@SessionAttributes("sessionUser")
public class FeedbackController
{
	@Autowired
	private FeedbackService feedbackService;

	// ─── Open Support Ticket Page (was: Provide Feedback) ────────────────────

	@GetMapping("/openSupportTicket")
	public String openSupportTicketPage(Model model)
	{
		model.addAttribute("feedback", new Feedback());
		return "provide-feedback";
	}

	// ─── Submit Support Ticket (was: Feedback Form) ───────────────────────────

	@PostMapping("/submitSupportTicket")
	public String handleSupportTicket(
			@ModelAttribute("feedback") Feedback feedback,
			Model model)
	{
		feedback.setDateOfFeedback(LocalDate.now().toString());
		feedback.setTimeOfFeedback(LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss")));
		feedback.setReadStatus("unread");

		try
		{
			feedbackService.sendFeedback(feedback);
			model.addAttribute("successMsg", "Support ticket submitted successfully. We'll get back to you soon!");
		}
		catch (Exception e)
		{
			model.addAttribute("errorMsg", "Failed to submit support ticket. Please try again.");
			e.printStackTrace();
		}

		return "provide-feedback";
	}
}