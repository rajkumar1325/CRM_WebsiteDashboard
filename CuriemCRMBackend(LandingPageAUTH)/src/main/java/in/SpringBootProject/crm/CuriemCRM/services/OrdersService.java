package in.SpringBootProject.crm.CuriemCRM.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import in.SpringBootProject.crm.CuriemCRM.Repository.OrdersRepository;
import in.SpringBootProject.crm.CuriemCRM.entity.Orders;

@Service
public class OrdersService
{
	@Autowired
	private OrdersRepository ordersRepository;
	
	public void storeCustomerOrders(Orders orders)
	{
		ordersRepository.save(orders);
	}
}