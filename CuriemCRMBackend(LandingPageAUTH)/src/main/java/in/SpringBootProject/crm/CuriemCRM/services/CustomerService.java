package in.SpringBootProject.crm.CuriemCRM.services;

import in.SpringBootProject.crm.CuriemCRM.dto.CustomerDTO;
import in.SpringBootProject.crm.CuriemCRM.dto.CustomerStatsDTO;
import in.SpringBootProject.crm.CuriemCRM.entity.Customer;
import in.SpringBootProject.crm.CuriemCRM.Repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CustomerService {

    private final CustomerRepository customerRepository;

    /** Return all customers, optionally filtered by status */
    public List<CustomerDTO> getAll(String status) {
        List<Customer> customers;

        if (status != null && !status.isBlank()) {
            try {
                Customer.CustomerStatus s = Customer.CustomerStatus.valueOf(status);
                customers = customerRepository.findByStatus(s);
            } catch (IllegalArgumentException ex) {
                // Unknown status → return empty list
                customers = List.of();
            }
        } else {
            customers = customerRepository.findAll();
        }

        return customers.stream()
                .map(CustomerDTO::from)
                .collect(Collectors.toList());
    }

    /** Search across name / email / company / phone / code */
    public List<CustomerDTO> search(String q) {
        if (q == null || q.isBlank()) return getAll(null);
        return customerRepository.search(q.trim())
                .stream()
                .map(CustomerDTO::from)
                .collect(Collectors.toList());
    }

    /** Single customer detail */
    public CustomerDTO getById(Long id) {
        Customer c = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found: " + id));
        return CustomerDTO.from(c);
    }

    /** Dashboard stat cards */
    public CustomerStatsDTO getStats() {
        long total   = customerRepository.count();
        long active  = customerRepository.countByStatus(Customer.CustomerStatus.Active);
        long closed  = customerRepository.countByStatus(Customer.CustomerStatus.closed);
        var  revenue = customerRepository.sumTotalRevenue();

        return new CustomerStatsDTO(total, active, closed, revenue);
    }

    /** Create a new customer */
    @Transactional
    public CustomerDTO create(Customer customer) {
        // Auto-generate customer_code if not provided
        if (customer.getCustomerCode() == null || customer.getCustomerCode().isBlank()) {
            long nextId = customerRepository.count() + 1;
            customer.setCustomerCode(String.format("CUST-%04d", nextId));
        }
        return CustomerDTO.from(customerRepository.save(customer));
    }

    /** Update existing customer */
    @Transactional
    public CustomerDTO update(Long id, Customer incoming) {
        Customer existing = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found: " + id));

        if (incoming.getFullName()      != null) existing.setFullName(incoming.getFullName());
        if (incoming.getCompany()       != null) existing.setCompany(incoming.getCompany());
        if (incoming.getEmail()         != null) existing.setEmail(incoming.getEmail());
        if (incoming.getPhone()         != null) existing.setPhone(incoming.getPhone());
        if (incoming.getAddress()       != null) existing.setAddress(incoming.getAddress());
        if (incoming.getProductId()     != null) existing.setProductId(incoming.getProductId());
        if (incoming.getPurchaseDate()  != null) existing.setPurchaseDate(incoming.getPurchaseDate());
        if (incoming.getContractValue() != null) existing.setContractValue(incoming.getContractValue());
        if (incoming.getStatus()        != null) existing.setStatus(incoming.getStatus());
        if (incoming.getAvatarUrl()     != null) existing.setAvatarUrl(incoming.getAvatarUrl());

        return CustomerDTO.from(customerRepository.save(existing));
    }

    /** Delete a customer */
    @Transactional
    public void delete(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new RuntimeException("Customer not found: " + id);
        }
        customerRepository.deleteById(id);
    }
}
