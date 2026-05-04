package in.SpringBootProject.crm.CuriemCRM.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import in.SpringBootProject.crm.CuriemCRM.services.EmpSalesInfoService;

@Controller
public class EmpSalesInfoController
{
	@Autowired
	private EmpSalesInfoService empSalesInfoService;

	// ─── Deals Page (was: /sales) ─────────────────────────────────────────────

	@GetMapping("/deals")
	public String openDealsPage(Model model)
	{
		String totalDeals = empSalesInfoService.findTotalSalesByAllEmployees();
		model.addAttribute("totalDeals", totalDeals);

		List<Object[]> dealsList = empSalesInfoService.findTotalSalesByEachEmployee();
		model.addAttribute("dealsList", dealsList);

		return "sales";   // rename sales.html → deals.html if desired
	}
}