package in.SpringBootProject.crm.CuriemCRM.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import in.SpringBootProject.crm.CuriemCRM.entity.FollowUps;
import in.SpringBootProject.crm.CuriemCRM.services.FollowUpsService;

@RestController
@RequestMapping("/api")
public class FollowUpsApi
{
	@Autowired
	private FollowUpsService followUpsService;
	
	@GetMapping("/myFollowUps")
	public ResponseEntity<List<FollowUps>> getFollowUpCustomers(
			@RequestParam("empEmail") String empEmail,
			@RequestParam("followUpDate") String followUpDate)
	{
		List<FollowUps> followUpsList = followUpsService.getMyFollowUps(empEmail, followUpDate);
		return ResponseEntity.ok(followUpsList);
	}
}