package com.campus.trade.controller;

import com.campus.trade.common.Result;
import com.campus.trade.dto.BindEmailRequest;
import com.campus.trade.dto.SendEmailCodeRequest;
import com.campus.trade.service.EmailVerifyService;
import com.campus.trade.util.SecurityUtils;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/email")
public class UserEmailController {

    private final EmailVerifyService emailVerifyService;

    public UserEmailController(EmailVerifyService emailVerifyService) {
        this.emailVerifyService = emailVerifyService;
    }

    @PostMapping("/send-code")
    public Result<Void> sendBindCode(@Valid @RequestBody SendEmailCodeRequest request) {
        request.setScene("bind");
        emailVerifyService.sendCode(request, SecurityUtils.currentUserId());
        return Result.ok("验证码已发送", null);
    }

    @PostMapping("/bind")
    public Result<Void> bindEmail(@Valid @RequestBody BindEmailRequest request) {
        emailVerifyService.bindEmail(SecurityUtils.currentUserId(), request);
        return Result.ok("邮箱绑定成功", null);
    }
}
