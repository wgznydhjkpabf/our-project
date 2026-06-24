package com.campus.trade.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank(message = "学号不能为空")
    private String studentNo;

    @NotBlank(message = "邮箱不能为空")
    @Email(message = "邮箱格式不正确")
    private String email;

    @NotBlank(message = "密码不能为空")
    @Size(min = 6, max = 20, message = "密码长度6-20位")
    private String password;

    @NotBlank(message = "昵称不能为空")
    private String nickname;

    private String college;

    @NotBlank(message = "邮箱验证码不能为空")
    @Pattern(regexp = "^\\d{6}$", message = "验证码为6位数字")
    private String verifyCode;

    public String getStudentNo() { return studentNo; }
    public void setStudentNo(String studentNo) { this.studentNo = studentNo; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }
    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }
    public String getVerifyCode() { return verifyCode; }
    public void setVerifyCode(String verifyCode) { this.verifyCode = verifyCode; }
}
