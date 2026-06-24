package com.campus.trade.entity;

import java.time.LocalDateTime;

public class EmailVerifyCode {
    private Long id;
    private String email;
    private String code;
    private String scene;
    private Long userId;
    private LocalDateTime expireTime;
    private Integer used;
    private LocalDateTime createTime;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getScene() { return scene; }
    public void setScene(String scene) { this.scene = scene; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public LocalDateTime getExpireTime() { return expireTime; }
    public void setExpireTime(LocalDateTime expireTime) { this.expireTime = expireTime; }
    public Integer getUsed() { return used; }
    public void setUsed(Integer used) { this.used = used; }
    public LocalDateTime getCreateTime() { return createTime; }
    public void setCreateTime(LocalDateTime createTime) { this.createTime = createTime; }
}
