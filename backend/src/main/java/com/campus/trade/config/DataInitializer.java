package com.campus.trade.config;

import com.campus.trade.entity.User;
import com.campus.trade.mapper.UserMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userMapper.findByStudentNo("admin") == null) {
            User admin = new User();
            admin.setStudentNo("admin");
            admin.setEmail("admin@campus.edu");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setNickname("系统管理员");
            admin.setRole(1);
            userMapper.insert(admin);
        }
    }
}
