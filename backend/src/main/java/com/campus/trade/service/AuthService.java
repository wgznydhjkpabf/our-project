package com.campus.trade.service;

import com.campus.trade.common.BusinessException;
import com.campus.trade.dto.LoginRequest;
import com.campus.trade.dto.LoginResponse;
import com.campus.trade.dto.RegisterRequest;
import com.campus.trade.entity.User;
import com.campus.trade.mapper.UserMapper;
import com.campus.trade.util.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserMapper userMapper, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public void register(RegisterRequest request) {
        if (userMapper.findByStudentNo(request.getStudentNo()) != null) {
            throw new BusinessException("学号已注册");
        }
        if (userMapper.findByEmail(request.getEmail()) != null) {
            throw new BusinessException("邮箱已注册");
        }
        User user = new User();
        user.setStudentNo(request.getStudentNo());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setNickname(request.getNickname());
        user.setCollege(request.getCollege());
        user.setRole(0);
        userMapper.insert(user);
    }

    public LoginResponse login(LoginRequest request) {
        User user = userMapper.findByAccount(request.getAccount());
        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BusinessException("账号或密码错误");
        }
        if (user.getStatus() != null && user.getStatus() == 0) {
            throw new BusinessException("账号已被禁用");
        }
        LoginResponse response = new LoginResponse();
        response.setToken(jwtUtil.generateToken(user.getUserId(), user.getStudentNo(), user.getRole()));
        response.setUserId(user.getUserId());
        response.setNickname(user.getNickname());
        response.setRole(user.getRole());
        return response;
    }

    public User getProfile(Long userId) {
        User user = userMapper.findById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        user.setPassword(null);
        return user;
    }

    public void updateProfile(Long userId, User profile) {
        profile.setUserId(userId);
        userMapper.updateProfile(profile);
    }
}
