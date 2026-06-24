-- 邮箱验证码功能迁移脚本（在已有 campus_trade 库上执行）

USE campus_trade;

ALTER TABLE sys_user
  ADD COLUMN email_verified TINYINT NOT NULL DEFAULT 0 COMMENT '0未验证 1已验证' AFTER email;

CREATE TABLE IF NOT EXISTS email_verify_code (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  email       VARCHAR(100) NOT NULL,
  code        VARCHAR(6)   NOT NULL,
  scene       VARCHAR(20)  NOT NULL COMMENT 'register/bind',
  user_id     BIGINT       DEFAULT NULL COMMENT 'bind场景关联用户',
  expire_time DATETIME     NOT NULL,
  used        TINYINT      NOT NULL DEFAULT 0,
  create_time DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email_scene (email, scene),
  INDEX idx_expire (expire_time)
) ENGINE=InnoDB COMMENT='邮箱验证码';

-- 已有用户默认视为已验证（注册时未强制验证码的历史数据）
UPDATE sys_user SET email_verified = 1 WHERE email IS NOT NULL AND email != '';
