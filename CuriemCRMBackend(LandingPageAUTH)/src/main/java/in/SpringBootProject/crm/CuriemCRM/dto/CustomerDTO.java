package in.SpringBootProject.crm.CuriemCRM.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import in.SpringBootProject.crm.CuriemCRM.entity.Customer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Response DTO for Customer – field names match what Customer.jsx expects:
 *   fullName, company, email, phone, address, productId,
 *   purchaseDate, contractValue, status, avatarUrl
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerDTO {

    private Long id;
    private String customerCode;
    private String fullName;
    private String company;
    private String email;
    private String phone;
    private String address;
    private Long productId;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate purchaseDate;

    private BigDecimal contractValue;
    private String status;
    private String avatarUrl;

    public static CustomerDTO from(Customer c) {
        return CustomerDTO.builder()
                .id(c.getId())
                .customerCode(c.getCustomerCode())
                .fullName(c.getFullName())
                .company(c.getCompany())
                .email(c.getEmail())
                .phone(c.getPhone())
                .address(c.getAddress())
                .productId(c.getProductId())
                .purchaseDate(c.getPurchaseDate())
                .contractValue(c.getContractValue())
                .status(c.getStatus() != null ? c.getStatus().name() : null)
                .avatarUrl(c.getAvatarUrl())
                .build();
    }
}
