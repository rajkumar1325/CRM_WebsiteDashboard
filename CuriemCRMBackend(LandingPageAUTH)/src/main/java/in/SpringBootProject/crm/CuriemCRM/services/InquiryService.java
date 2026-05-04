package in.SpringBootProject.crm.CuriemCRM.services;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import in.SpringBootProject.crm.CuriemCRM.entity.Inquiry;
import in.SpringBootProject.crm.CuriemCRM.Repository.InquiryRepository;

@Service
public class InquiryService
{
	@Autowired
	private InquiryRepository inquiryRepository;
	
	public void addNewInquiry(Inquiry inquiry)
	{
		inquiryRepository.save(inquiry);
	}
	
	public List<Inquiry> findInquiriesUsingPhno(String phoneno)
	{
		return inquiryRepository.findByPhoneno(phoneno);
	}
}
