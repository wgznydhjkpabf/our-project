package com.campus.trade.service;

import com.campus.trade.common.BusinessException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailSendService {

    private static final Logger log = LoggerFactory.getLogger(MailSendService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String from;

    @Value("${app.mail.enabled:false}")
    private boolean mailEnabled;

    public MailSendService(@org.springframework.beans.factory.annotation.Autowired(required = false) JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerifyCode(String to, String code, String scene) {
        String subject = "register".equals(scene)
                ? "【校园二手交易】注册验证码"
                : "【校园二手交易】邮箱绑定验证码";
        String text = "您的验证码是：" + code + "，5分钟内有效。请勿泄露给他人。";

        if (!mailEnabled || mailSender == null || from == null || from.isBlank()) {
            log.warn("========== 邮件未配置，验证码（开发模式）==========");
            log.warn("收件邮箱: {}", to);
            log.warn("验证码: {}", code);
            log.warn("场景: {}", scene);
            log.warn("================================================");
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(from);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
        } catch (Exception e) {
            log.error("邮件发送失败，降级为控制台输出验证码", e);
            log.warn("验证码（降级）: {} -> {}", to, code);
        }
    }
}
