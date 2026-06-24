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
        // 创建管理员账号
        if (userMapper.findByStudentNo("admin") == null) {
            User admin = new User();
            admin.setStudentNo("admin");
            admin.setEmail("admin@campus.edu");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setNickname("系统管理员");
            admin.setRole(1);
            userMapper.insert(admin);
        }
        
        // 创建演示普通用户
        String[][] demoUsers = {
            {"2021001", "zhangsan@campus.edu", "张三", "计算机学院"},
            {"2021002", "lisi@campus.edu", "李四", "经济管理学院"},
            {"2021003", "wangwu@campus.edu", "王五", "外国语学院"},
            {"2021004", "zhaoliu@campus.edu", "赵六", "机械工程学院"},
            {"2021005", "sunqi@campus.edu", "孙七", "艺术设计学院"}
        };
        
        for (String[] userData : demoUsers) {
            if (userMapper.findByStudentNo(userData[0]) == null) {
                User user = new User();
                user.setStudentNo(userData[0]);
                user.setEmail(userData[1]);
                user.setPassword(passwordEncoder.encode("123456"));
                user.setNickname(userData[2]);
                user.setCollege(userData[3]);
                user.setRole(0);
                userMapper.insert(user);
            }
        }
    }
}
