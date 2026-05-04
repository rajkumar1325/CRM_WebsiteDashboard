package in.SpringBootProject.crm.CuriemCRM.controller;

import in.SpringBootProject.crm.CuriemCRM.dto.LeadDTO;
import in.SpringBootProject.crm.CuriemCRM.services.LeadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leads")
@CrossOrigin(origins = "http://localhost:5173") // Vite default; change if needed
@RequiredArgsConstructor
public class LeadController {

    private final LeadService leadService;

    // GET  /api/leads              → all leads
    // GET  /api/leads?search=xyz   → search leads
    @GetMapping
    public ResponseEntity<List<LeadDTO>> getLeads(
            @RequestParam(required = false) String search) {
        if (search != null && !search.isBlank()) {
            return ResponseEntity.ok(leadService.searchLeads(search));
        }
        return ResponseEntity.ok(leadService.getAllLeads());
    }

    // GET /api/leads/stats
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(leadService.getStats());
    }

    // GET /api/leads/{id}
    @GetMapping("/{id}")
    public ResponseEntity<LeadDTO> getLeadById(@PathVariable Long id) {
        return ResponseEntity.ok(leadService.getLeadById(id));
    }

    // POST /api/leads
    @PostMapping
    public ResponseEntity<LeadDTO> createLead(@RequestBody LeadDTO dto) {
        return ResponseEntity.status(201).body(leadService.createLead(dto));
    }

    // PUT /api/leads/{id}
    @PutMapping("/{id}")
    public ResponseEntity<LeadDTO> updateLead(
            @PathVariable Long id,
            @RequestBody LeadDTO dto) {
        return ResponseEntity.ok(leadService.updateLead(id, dto));
    }

    // DELETE /api/leads/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLead(@PathVariable Long id) {
        leadService.deleteLead(id);
        return ResponseEntity.noContent().build();
    }
}
