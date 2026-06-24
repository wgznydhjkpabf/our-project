package com.campus.trade.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println("123456 hash: " + encoder.encode("123456"));
        System.out.println("admin123 hash: " + encoder.encode("admin123"));
    }
}
