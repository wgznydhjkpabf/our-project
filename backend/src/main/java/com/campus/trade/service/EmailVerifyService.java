package com.campus.trade.service;

import com.campus.trade.common.BusinessException;
import com.campus.trade.dto.BindEmailRequest;
import com.campus.trade.dto.SendEmailCodeRequest;
import com.campus.trade.entity.EmailVerifyCode;
import com.campus.trade.entity.User;
import com.campus.trade.mapper.EmailVerifyCodeMapper;
import com.campus.trade.mapper.UserMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class EmailVerifyService {

    private static final int CODE_EXPIRE_MINUTES = 5;
    private static final int SEND_INTERVAL_MINUTES = 1;
    private static final int MAX_SEND_PER_INTERVAL = 3;

    private final EmailVerifyCodeMapper codeMapper;
    private final UserMapper userMapper;
    private final MailSendService mailSendService;

    public EmailVerifyService(EmailVerifyCodeMapper codeMapper,
                              UserMapper userMapper,
                              MailSendService mailSendService) {
        this.codeMapper = codeMapper;
        this.userMapper = userMapper;
        this.mailSendService = mailSendService;
    }

    public void sendCode(SendEmailCodeRequest request, Long userId) {
        String scene = request.getScene();
        String email = request.getEmail().trim().toLowerCase();

        if (!"register".equals(scene) && !"bind".equals(scene)) {
            throw new BusinessException("无效的场景类型");
        }

        if ("register".equals(scene)) {
            if (userMapper.findByEmail(email) != null) {
                throw new BusinessException("该邮箱已被注册");
            }
        }

        if ("bind".equals(scene)) {
            if (userId == null) {
                throw new BusinessException(401, "请先登录");
            }
            User existing = userMapper.findByEmail(email);
            if (existing != null && !existing.getUserId().equals(userId)) {
                throw new BusinessException("该邮箱已被其他账号绑定");
            }
            User current = userMapper.findById(userId);
            if (current != null && email.equalsIgnoreCase(current.getEmail())
                    && current.getEmailVerified() != null && current.getEmailVerified() == 1) {
                throw new BusinessException("当前邮箱已验证，无需重复绑定");
            }
        }

        int recent = codeMapper.countRecentByEmail(email, SEND_INTERVAL_MINUTES);
        if (recent >= MAX_SEND_PER_INTERVAL) {
            throw new BusinessException("发送过于频繁，请稍后再试");
        }

        String code = String.format("%06d", ThreadLocalRandom.current().nextInt(0, 1000000));

        EmailVerifyCode record = new EmailVerifyCode();
        record.setEmail(email);
        record.setCode(code);
        record.setScene(scene);
        record.setUserId(userId);
        record.setExpireTime(LocalDateTime.now().plusMinutes(CODE_EXPIRE_MINUTES));
        codeMapper.insert(record);

        mailSendService.sendVerifyCode(email, code, scene);
    }

    public void verifyForRegister(String email, String code) {
        consumeCode(email, "register", code, null);
    }

    @Transactional
    public void bindEmail(Long userId, BindEmailRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        consumeCode(email, "bind", request.getCode(), userId);

        User existing = userMapper.findByEmail(email);
        if (existing != null && !existing.getUserId().equals(userId)) {
            throw new BusinessException("该邮箱已被其他账号绑定");
        }

        userMapper.updateEmail(userId, email, 1);
    }

    private void consumeCode(String email, String scene, String code, Long userId) {
        EmailVerifyCode record = codeMapper.findLatestValid(email.toLowerCase(), scene, code);
        if (record == null) {
            throw new BusinessException("验证码错误或已过期");
        }
        if ("bind".equals(scene) && userId != null && record.getUserId() != null
                && !record.getUserId().equals(userId)) {
            throw new BusinessException("验证码与当前用户不匹配");
        }
        codeMapper.markUsed(record.getId());
    }
}
