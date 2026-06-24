package com.campus.trade.controller;

import com.campus.trade.common.Result;
import com.campus.trade.dto.LoginRequest;
import com.campus.trade.dto.LoginResponse;
import com.campus.trade.dto.RegisterRequest;
import com.campus.trade.dto.SendEmailCodeRequest;
import com.campus.trade.entity.User;
import com.campus.trade.service.AuthService;
import com.campus.trade.service.EmailVerifyService;
import com.campus.trade.util.SecurityUtils;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final EmailVerifyService emailVerifyService;

    public AuthController(AuthService authService, EmailVerifyService emailVerifyService) {
        this.authService = authService;
        this.emailVerifyService = emailVerifyService;
    }

    @PostMapping("/email/send-code")
    public Result<Void> sendRegisterCode(@Valid @RequestBody SendEmailCodeRequest request) {
        request.setScene("register");
        emailVerifyService.sendCode(request, null);
        return Result.ok("验证码已发送", null);
    }

    @PostMapping("/register")
    public Result<Void> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return Result.ok("注册成功", null);
    }

    @PostMapping("/login")
    public Result<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return Result.ok(authService.login(request));
    }

    @GetMapping("/profile")
    public Result<User> profile() {
        return Result.ok(authService.getProfile(SecurityUtils.currentUserId()));
    }

    @PutMapping("/profile")
    public Result<Void> updateProfile(@RequestBody User user) {
        authService.updateProfile(SecurityUtils.currentUserId(), user);
        return Result.ok("更新成功", null);
    }
}
