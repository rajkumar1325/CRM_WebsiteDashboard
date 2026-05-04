package in.SpringBootProject.crm.CuriemCRM.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import in.SpringBootProject.crm.CuriemCRM.entity.Lead;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeadDTO {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String company;
    private String status;      // "new", "contacted", etc.
    private String source;      // "Website", "Social Media", etc.

    @JsonProperty("agentId")
    private Long agentId;

    @JsonProperty("customerId")
    private Long customerId;

    @JsonProperty("conversionDate")
    private String conversionDate;

    @JsonProperty("dealStatus")
    private String dealStatus;  // "active" or "close"

    @JsonProperty("receivedAmount")
    private BigDecimal receivedAmount;

    private String notes;

    // ── Entity → DTO ──────────────────────────────────────────────────────────
    public static LeadDTO fromEntity(Lead lead) {
        // Status: converter stores "new","contacted"... so just use the converter output
        String statusStr = null;
        if (lead.getStatus() != null) {
            statusStr = switch (lead.getStatus()) {
                case NEW       -> "new";
                case CONTACTED -> "contacted";
                case QUALIFIED -> "qualified";
                case CONVERTED -> "converted";
                case LOST      -> "lost";
            };
        }

        String sourceStr = null;
        if (lead.getSource() != null) {
            sourceStr = switch (lead.getSource()) {
                case WEBSITE        -> "Website";
                case REFERRAL       -> "Referral";
                case SOCIAL_MEDIA   -> "Social Media";
                case COLD_CALL      -> "Cold Call";
                case EMAIL_CAMPAIGN -> "Email Campaign";
                case OTHER          -> "Other";
            };
        }

        String dealStr = null;
        if (lead.getDealStatus() != null) {
            dealStr = switch (lead.getDealStatus()) {
                case ACTIVE -> "active";
                case CLOSE  -> "close";
            };
        }

        return LeadDTO.builder()
                .id(lead.getId())
                .name(lead.getFullName())
                .email(lead.getEmail())
                .phone(lead.getPhone())
                .company(lead.getCompany())
                .status(statusStr)
                .source(sourceStr)
                .agentId(lead.getAgentId())
                .customerId(lead.getCustomerId())
                .conversionDate(lead.getConversionDate() != null
                        ? lead.getConversionDate().toString() : null)
                .dealStatus(dealStr)
                .receivedAmount(lead.getReceivedAmount())
                .notes(lead.getNotes())
                .build();
    }

    // ── DTO → Entity ──────────────────────────────────────────────────────────
    public Lead toEntity() {
        Lead lead = new Lead();
        lead.setId(this.id);
        lead.setFullName(this.name);
        lead.setEmail(this.email);
        lead.setPhone(this.phone);
        lead.setCompany(this.company);

        if (this.status != null) {
            lead.setStatus(switch (this.status) {
                case "new"       -> Lead.LeadStatus.NEW;
                case "contacted" -> Lead.LeadStatus.CONTACTED;
                case "qualified" -> Lead.LeadStatus.QUALIFIED;
                case "converted" -> Lead.LeadStatus.CONVERTED;
                case "lost"      -> Lead.LeadStatus.LOST;
                default          -> null;
            });
        }

        if (this.source != null) {
            lead.setSource(switch (this.source) {
                case "Website"        -> Lead.LeadSource.WEBSITE;
                case "Referral"       -> Lead.LeadSource.REFERRAL;
                case "Social Media"   -> Lead.LeadSource.SOCIAL_MEDIA;
                case "Cold Call"      -> Lead.LeadSource.COLD_CALL;
                case "Email Campaign" -> Lead.LeadSource.EMAIL_CAMPAIGN;
                case "Other"          -> Lead.LeadSource.OTHER;
                default               -> null;
            });
        }

        if (this.conversionDate != null && !this.conversionDate.isEmpty()) {
            try { lead.setConversionDate(LocalDate.parse(this.conversionDate)); }
            catch (Exception ignored) {}
        }

        if (this.dealStatus != null) {
            lead.setDealStatus(switch (this.dealStatus) {
                case "active" -> Lead.DealStatus.ACTIVE;
                case "close"  -> Lead.DealStatus.CLOSE;
                default       -> null;
            });
        }

        lead.setAgentId(this.agentId);
        lead.setCustomerId(this.customerId);
        lead.setReceivedAmount(this.receivedAmount);
        lead.setNotes(this.notes);
        return lead;
    }
}
