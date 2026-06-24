package com.campus.trade.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class User {
    private Long userId;
    private String studentNo;
    private String email;
    private Integer emailVerified;
    private String password;
    private String nickname;
    private String avatar;
    private String phone;
    private String college;
    private BigDecimal creditScore;
    private Integer role;
    private Integer status;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getStudentNo() { return studentNo; }
    public void setStudentNo(String studentNo) { this.studentNo = studentNo; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Integer getEmailVerified() { return emailVerified; }
    public void setEmailVerified(Integer emailVerified) { this.emailVerified = emailVerified; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }
    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }
    public BigDecimal getCreditScore() { return creditScore; }
    public void setCreditScore(BigDecimal creditScore) { this.creditScore = creditScore; }
    public Integer getRole() { return role; }
    public void setRole(Integer role) { this.role = role; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
    public LocalDateTime getCreateTime() { return createTime; }
    public void setCreateTime(LocalDateTime createTime) { this.createTime = createTime; }
    public LocalDateTime getUpdateTime() { return updateTime; }
    public void setUpdateTime(LocalDateTime updateTime) { this.updateTime = updateTime; }
}
