package com.campus.trade.entity;

public class UserAddress {
    private Long addressId;
    private Long userId;
    private String receiver;
    private String phone;
    private String detail;
    private Integer isDefault;

    public Long getAddressId() { return addressId; }
    public void setAddressId(Long addressId) { this.addressId = addressId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getReceiver() { return receiver; }
    public void setReceiver(String receiver) { this.receiver = receiver; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getDetail() { return detail; }
    public void setDetail(String detail) { this.detail = detail; }
    public Integer getIsDefault() { return isDefault; }
    public void setIsDefault(Integer isDefault) { this.isDefault = isDefault; }
}
