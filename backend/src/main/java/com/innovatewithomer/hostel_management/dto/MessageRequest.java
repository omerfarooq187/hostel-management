package com.innovatewithomer.hostel_management.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MessageRequest {
    private String subject;
    private String body;

    private Long userId;
    private boolean activeOnly;
    private boolean allStudents;
}
