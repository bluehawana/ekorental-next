package com.bluehawana.rentingcarsys.dto;

import lombok.Data;

@Data
public class EmailAuthRequest {
    private String email;
    private String password;
}