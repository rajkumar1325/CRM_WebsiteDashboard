package in.SpringBootProject.crm.CuriemCRM.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "leads")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", length = 100)
    private String fullName;

    @Column(length = 150)
    private String email;

    @Column(length = 30)
    private String phone;

    @Column(length = 100)
    private String company;

    // Use @Convert instead of @Enumerated so we control the exact DB string
    @Convert(converter = LeadStatusConverter.class)
    private LeadStatus status;

    @Convert(converter = LeadSourceConverter.class)
    private LeadSource source;

    @Column(name = "agent_id")
    private Long agentId;

    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "conversion_date")
    private LocalDate conversionDate;

    @Convert(converter = DealStatusConverter.class)
    @Column(name = "deal_status")
    private DealStatus dealStatus;

    @Column(name = "received_amount", precision = 12, scale = 2)
    private BigDecimal receivedAmount;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // ─── Enums ────────────────────────────────────────────────────────────────

    public enum LeadStatus {
        @JsonProperty("new")       NEW,
        @JsonProperty("contacted") CONTACTED,
        @JsonProperty("qualified") QUALIFIED,
        @JsonProperty("converted") CONVERTED,
        @JsonProperty("lost")      LOST
    }

    public enum LeadSource {
        @JsonProperty("Website")        WEBSITE,
        @JsonProperty("Referral")       REFERRAL,
        @JsonProperty("Social Media")   SOCIAL_MEDIA,
        @JsonProperty("Cold Call")      COLD_CALL,
        @JsonProperty("Email Campaign") EMAIL_CAMPAIGN,
        @JsonProperty("Other")          OTHER
    }

    public enum DealStatus {
        @JsonProperty("active") ACTIVE,
        @JsonProperty("close")  CLOSE
    }

    // ─── Converters (Java enum ↔ exact DB string) ─────────────────────────────

    @Converter
    public static class LeadStatusConverter implements AttributeConverter<LeadStatus, String> {
        @Override
        public String convertToDatabaseColumn(LeadStatus s) {
            if (s == null) return null;
            return switch (s) {
                case NEW       -> "new";
                case CONTACTED -> "contacted";
                case QUALIFIED -> "qualified";
                case CONVERTED -> "converted";
                case LOST      -> "lost";
            };
        }
        @Override
        public LeadStatus convertToEntityAttribute(String s) {
            if (s == null) return null;
            return switch (s) {
                case "new"       -> LeadStatus.NEW;
                case "contacted" -> LeadStatus.CONTACTED;
                case "qualified" -> LeadStatus.QUALIFIED;
                case "converted" -> LeadStatus.CONVERTED;
                case "lost"      -> LeadStatus.LOST;
                default          -> null;
            };
        }
    }

    @Converter
    public static class LeadSourceConverter implements AttributeConverter<LeadSource, String> {
        @Override
        public String convertToDatabaseColumn(LeadSource s) {
            if (s == null) return null;
            return switch (s) {
                case WEBSITE        -> "Website";
                case REFERRAL       -> "Referral";
                case SOCIAL_MEDIA   -> "Social Media";
                case COLD_CALL      -> "Cold Call";
                case EMAIL_CAMPAIGN -> "Email Campaign";
                case OTHER          -> "Other";
            };
        }
        @Override
        public LeadSource convertToEntityAttribute(String s) {
            if (s == null) return null;
            return switch (s) {
                case "Website"        -> LeadSource.WEBSITE;
                case "Referral"       -> LeadSource.REFERRAL;
                case "Social Media"   -> LeadSource.SOCIAL_MEDIA;
                case "Cold Call"      -> LeadSource.COLD_CALL;
                case "Email Campaign" -> LeadSource.EMAIL_CAMPAIGN;
                case "Other"          -> LeadSource.OTHER;
                default               -> null;
            };
        }
    }

    @Converter
    public static class DealStatusConverter implements AttributeConverter<DealStatus, String> {
        @Override
        public String convertToDatabaseColumn(DealStatus s) {
            if (s == null) return null;
            return switch (s) {
                case ACTIVE -> "active";
                case CLOSE  -> "close";
            };
        }
        @Override
        public DealStatus convertToEntityAttribute(String s) {
            if (s == null) return null;
            return switch (s) {
                case "active" -> DealStatus.ACTIVE;
                case "close"  -> DealStatus.CLOSE;
                default       -> null;
            };
        }
    }
}
