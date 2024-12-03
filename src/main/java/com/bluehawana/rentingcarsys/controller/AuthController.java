package com.bluehawana.rentingcarsys.controller;

import com.bluehawana.rentingcarsys.service.AuthService;
import com.bluehawana.rentingcarsys.dto.AuthResponse;
import com.bluehawana.rentingcarsys.dto.EmailAuthRequest;
import com.bluehawana.rentingcarsys.dto.SocialAuthRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {

    @Autowired
    private AuthService authService;

    @GetMapping("/google")
    public ResponseEntity<AuthResponse> googleAuth(@RequestParam String code) {
        try {
            AuthResponse response = authService.handleGoogleAuth(code);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(false, null, e.getMessage()));
        }
    }

    @GetMapping("/google/callback")
    public ResponseEntity<AuthResponse> googleCallback(@RequestParam String code) {
        try {
            AuthResponse response = authService.handleGoogleCallback(code);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(false, null, e.getMessage()));
        }
    }

    @GetMapping("/github")
    public ResponseEntity<AuthResponse> githubAuth(@RequestParam String code) {
        try {
            AuthResponse response = authService.handleGithubAuth(code);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(false, null, e.getMessage()));
        }
    }

    @GetMapping("/github/callback")
    public ResponseEntity<AuthResponse> githubCallback(@RequestParam String code) {
        try {
            AuthResponse response = authService.handleGithubCallback(code);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(false, null, e.getMessage()));
        }
    }

    @PostMapping("/email")
    public ResponseEntity<AuthResponse> emailAuth(@RequestBody EmailAuthRequest request) {
        try {
            AuthResponse response = authService.handleEmailAuth(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(false, null, e.getMessage()));
        }
    }

    @GetMapping("/session")
    public ResponseEntity<AuthResponse> getSession(@RequestHeader("Authorization") String token) {
        try {
            AuthResponse response = authService.validateSession(token);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(false, null, e.getMessage()));
        }
    }
}