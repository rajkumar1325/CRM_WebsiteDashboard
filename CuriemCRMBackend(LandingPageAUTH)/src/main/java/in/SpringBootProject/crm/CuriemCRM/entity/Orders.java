package in.SpringBootProject.crm.CuriemCRM.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Orders
{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column
	private String courseName;
	
	@Column
	private String userEmail;
	
	@Column
	private String dateOfPurchase;
	
	@Column
	private String rzpPaymentId;

	/** Razorpay order id (e.g. order_xxx) or internal id from checkout flow */
	@Column
	private String orderId;

	/**
	 * Amount in <strong>paise</strong> (INR smallest unit), as required by Razorpay
	 * (e.g. ₹499.00 → 49900). Send this from the client in the same unit.
	 */
	@Column
	private Long courseAmount;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getCourseName() {
		return courseName;
	}
	public void setCourseName(String courseName) {
		this.courseName = courseName;
	}
	public String getUserEmail() {
		return userEmail;
	}
	public void setUserEmail(String userEmail) {
		this.userEmail = userEmail;
	}
	public String getDateOfPurchase() {
		return dateOfPurchase;
	}
	public void setDateOfPurchase(String dateOfPurchase) {
		this.dateOfPurchase = dateOfPurchase;
	}
	public String getRzpPaymentId() {
		return rzpPaymentId;
	}
	public void setRzpPaymentId(String rzpPaymentId) {
		this.rzpPaymentId = rzpPaymentId;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Long getCourseAmount() {
		return courseAmount;
	}

	public void setCourseAmount(Long courseAmount) {
		this.courseAmount = courseAmount;
	}
}
