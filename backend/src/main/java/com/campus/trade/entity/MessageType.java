package com.campus.trade.entity;

public enum MessageType {
    USER(0, "用户消息"),
    ORDER_CREATE(1, "订单创建"),
    ORDER_CONFIRM(2, "订单确认"),
    ORDER_COMPLETE(3, "订单完成"),
    ORDER_CANCEL(4, "订单取消"),
    GOODS_AUDIT_PASS(5, "商品审核通过"),
    GOODS_AUDIT_REJECT(6, "商品审核驳回"),
    SYSTEM(99, "系统消息");

    private final int code;
    private final String desc;

    MessageType(int code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    public int getCode() {
        return code;
    }

    public String getDesc() {
        return desc;
    }

    public static MessageType fromCode(int code) {
        for (MessageType type : values()) {
            if (type.code == code) {
                return type;
            }
        }
        return USER;
    }
}