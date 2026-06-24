package com.campus.trade.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class SendEmailCodeRequest {

    @NotBlank(message = "邮箱不能为空")
    @Email(message = "邮箱格式不正确")
    private String email;

    /** register | bind */
    @NotBlank(message = "场景不能为空")
    private String scene;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getScene() { return scene; }
    public void setScene(String scene) { this.scene = scene; }
}
