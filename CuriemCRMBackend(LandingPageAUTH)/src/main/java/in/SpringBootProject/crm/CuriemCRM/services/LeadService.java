package in.SpringBootProject.crm.CuriemCRM.services;

import in.SpringBootProject.crm.CuriemCRM.Repository.LeadRepository;
import in.SpringBootProject.crm.CuriemCRM.dto.LeadDTO;
import in.SpringBootProject.crm.CuriemCRM.entity.Lead;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeadService {

    private final LeadRepository leadRepository;

    // ── Get all leads ─────────────────────────────────────────────────────────
    public List<LeadDTO> getAllLeads() {
        return leadRepository.findAll()
                .stream()
                .map(LeadDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // ── Get lead by ID ────────────────────────────────────────────────────────
    public LeadDTO getLeadById(Long id) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found with id: " + id));
        return LeadDTO.fromEntity(lead);
    }

    // ── Search leads ──────────────────────────────────────────────────────────
    public List<LeadDTO> searchLeads(String query) {
        return leadRepository.searchByNameOrCompany(query)
                .stream()
                .map(LeadDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // ── Create lead ───────────────────────────────────────────────────────────
    public LeadDTO createLead(LeadDTO dto) {
        Lead lead = dto.toEntity();
        Lead saved = leadRepository.save(lead);
        return LeadDTO.fromEntity(saved);
    }

    // ── Update lead ───────────────────────────────────────────────────────────
    public LeadDTO updateLead(Long id, LeadDTO dto) {
        Lead existing = leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found with id: " + id));

        Lead updated = dto.toEntity();
        updated.setId(existing.getId());
        updated.setCreatedAt(existing.getCreatedAt());

        Lead saved = leadRepository.save(updated);
        return LeadDTO.fromEntity(saved);
    }

    // ── Delete lead ───────────────────────────────────────────────────────────
    public void deleteLead(Long id) {
        if (!leadRepository.existsById(id)) {
            throw new RuntimeException("Lead not found with id: " + id);
        }
        leadRepository.deleteById(id);
    }

    // ── Stats ─────────────────────────────────────────────────────────────────
    public java.util.Map<String, Object> getStats() {
        List<Lead> all = leadRepository.findAll();
        long total     = all.size();
        long active    = all.stream().filter(l -> l.getDealStatus() == Lead.DealStatus.ACTIVE).count();
        long converted = all.stream().filter(l -> l.getStatus() == Lead.LeadStatus.CONVERTED).count();
        double revenue = all.stream()
                .filter(l -> l.getReceivedAmount() != null)
                .mapToDouble(l -> l.getReceivedAmount().doubleValue())
                .sum();

        return java.util.Map.of(
                "total", total,
                "active", active,
                "converted", converted,
                "revenue", revenue
        );
    }
}
