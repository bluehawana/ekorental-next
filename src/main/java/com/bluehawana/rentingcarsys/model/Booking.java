@Entity
@Data
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private Long carId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;
    private BigDecimal totalPrice;
    private Integer totalHours;
    private String userEmail;
    private String userName;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Transient
    private String carModel;

    @Transient
    private String carImage;
} 