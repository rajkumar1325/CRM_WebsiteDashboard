package in.SpringBootProject.crm.CuriemCRM.services;

import in.SpringBootProject.crm.CuriemCRM.entity.Customer;
import in.SpringBootProject.crm.CuriemCRM.Repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ClientService
{
	@Autowired
	private ClientRepository clientRepository;

	public Page<Customer> getAllUserDetailsByPagination(Pageable pageable)
	{
		return clientRepository.findAll(pageable);
	}

	public Customer getClientDetails(String userEmail)
	{
		return clientRepository.findByEmail(userEmail);
	}

	public void updateUserBanStatus(Customer customer)
	{
		clientRepository.save(customer);
	}
}