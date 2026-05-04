package in.SpringBootProject.crm.CuriemCRM.api;

import in.SpringBootProject.crm.CuriemCRM.dto.CustomerDTO;
import in.SpringBootProject.crm.CuriemCRM.dto.CustomerStatsDTO;
import in.SpringBootProject.crm.CuriemCRM.entity.Customer;
import in.SpringBootProject.crm.CuriemCRM.services.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for the Customers module.
 *
 * Endpoints consumed by Customer.jsx:
 *
 *   GET  /api/customers                → all customers (optionally ?status=Active|closed)
 *   GET  /api/customers/search?q=...  → full-text search
 *   GET  /api/customers/stats         → dashboard stats (total/active/closed/revenue)
 *   GET  /api/customers/{id}          → single customer detail
 *   POST /api/customers               → create customer
 *   PUT  /api/customers/{id}          → update customer
 *   DELETE /api/customers/{id}        → delete customer
 */
@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")   // adjust in production via SecurityConfig
public class CustomersApi {

    private final CustomerService customerService;

    // ── LIST / FILTER ──────────────────────────────────────────────────────────

    /**
     * GET /api/customers
     * GET /api/customers?status=Active
     * GET /api/customers?status=closed
     */
    @GetMapping
    public ResponseEntity<List<CustomerDTO>> list(
            @RequestParam(value = "status", required = false) String status) {
        return ResponseEntity.ok(customerService.getAll(status));
    }

    // ── SEARCH ─────────────────────────────────────────────────────────────────

    /**
     * GET /api/customers/search?q=john
     *
     * Must be declared BEFORE /{id} so Spring doesn't treat "search" as an id.
     */
    @GetMapping("/search")
    public ResponseEntity<List<CustomerDTO>> search(
            @RequestParam(value = "q", required = false, defaultValue = "") String q) {
        return ResponseEntity.ok(customerService.search(q));
    }

    // ── STATS ──────────────────────────────────────────────────────────────────

    /**
     * GET /api/customers/stats
     * Returns { total, active, closed, totalRevenue }
     */
    @GetMapping("/stats")
    public ResponseEntity<CustomerStatsDTO> stats() {
        return ResponseEntity.ok(customerService.getStats());
    }

    // ── SINGLE ─────────────────────────────────────────────────────────────────

    /**
     * GET /api/customers/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<CustomerDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getById(id));
    }

    // ── CREATE ─────────────────────────────────────────────────────────────────

    /**
     * POST /api/customers
     * Body: { fullName, company, email, phone, address, productId,
     *         purchaseDate, contractValue, status, avatarUrl }
     */
    @PostMapping
    public ResponseEntity<CustomerDTO> create(@RequestBody Customer customer) {
        CustomerDTO created = customerService.create(customer);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // ── UPDATE ─────────────────────────────────────────────────────────────────

    /**
     * PUT /api/customers/{id}
     * Partial update – only provided fields are changed.
     */
    @PutMapping("/{id}")
    public ResponseEntity<CustomerDTO> update(
            @PathVariable Long id,
            @RequestBody Customer customer) {
        return ResponseEntity.ok(customerService.update(id, customer));
    }

    // ── DELETE ─────────────────────────────────────────────────────────────────

    /**
     * DELETE /api/customers/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        customerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
