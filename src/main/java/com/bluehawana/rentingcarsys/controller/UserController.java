package com.bluehawana.rentingcarsys.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    
    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<User> createOrUpdateUser(@RequestBody UserDTO userDTO) {
        User user = userService.createOrUpdateUser(userDTO);
        return ResponseEntity.ok(user);
    }
} 