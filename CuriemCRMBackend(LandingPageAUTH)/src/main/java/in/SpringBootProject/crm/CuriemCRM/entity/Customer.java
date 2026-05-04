package in.SpringBootProject.crm.CuriemCRM.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "customers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_code", length = 10)
    private String customerCode;

    @Column(name = "full_name", length = 100)
    private String fullName;

    @Column(name = "company", length = 100)
    private String company;

    @Column(name = "email", length = 150)
    private String email;

    @Column(name = "phone", length = 30)
    private String phone;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "product_id")
    private Long productId;

    @Column(name = "purchase_date")
    private LocalDate purchaseDate;

    @Column(name = "contract_value", precision = 12, scale = 2)
    private BigDecimal contractValue;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private CustomerStatus status;

    @Column(name = "avatar_url", length = 255)
    private String avatarUrl;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum CustomerStatus {
        Active, closed
    }
}
