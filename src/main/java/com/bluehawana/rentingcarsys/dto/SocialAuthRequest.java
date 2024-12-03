package com.bluehawana.rentingcarsys.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SocialAuthRequest {
    private String code;
    private String provider; // "google" or "github"
    private String redirectUri;
}