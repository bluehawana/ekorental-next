package com.bluehawana.rentingcarsys.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;

    public User createOrUpdateUser(UserDTO userDTO) {
        User existingUser = userRepository.findByEmail(userDTO.getEmail())
            .orElse(new User());
        
        existingUser.setEmail(userDTO.getEmail());
        existingUser.setName(userDTO.getName());
        existingUser.setProvider(userDTO.getProvider());
        existingUser.setProviderId(userDTO.getProviderId());
        
        return userRepository.save(existingUser);
    }
} 