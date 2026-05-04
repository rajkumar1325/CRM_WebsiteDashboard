package in.SpringBootProject.crm.CuriemCRM.services;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import in.SpringBootProject.crm.CuriemCRM.Repository.EmpSalesInfoRepository;

@Service
public class EmpSalesInfoService
{
	@Autowired
	private EmpSalesInfoRepository empSalesInfoRepository;
	
	public String findTotalSalesByAllEmployees()
	{
		return empSalesInfoRepository.findTotalSalesByAllEmployees();
	}
	
	public List<Object[]> findTotalSalesByEachEmployee()
	{
		return empSalesInfoRepository.findTotalSalesByEachEmployee();
	}
}
