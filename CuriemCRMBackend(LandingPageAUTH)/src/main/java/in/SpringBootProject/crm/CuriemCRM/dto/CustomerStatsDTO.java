package in.SpringBootProject.crm.CuriemCRM.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Returned by GET /api/customers/stats
 * Consumed by the four StatCards in Customer.jsx:
 *   total, active, closed, totalRevenue
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerStatsDTO {
    private long total;
    private long active;
    private long closed;
    private BigDecimal totalRevenue;
}
