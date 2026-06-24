-- 校园二手交易平台 数据库脚本
CREATE DATABASE IF NOT EXISTS campus_trade
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE campus_trade;

CREATE TABLE sys_user (
  user_id      BIGINT PRIMARY KEY AUTO_INCREMENT,
  student_no   VARCHAR(20)  NOT NULL UNIQUE,
  email        VARCHAR(100) NOT NULL UNIQUE,
  email_verified TINYINT    NOT NULL DEFAULT 0 COMMENT '0未验证 1已验证',
  password     VARCHAR(255) NOT NULL,
  nickname     VARCHAR(50)  NOT NULL,
  avatar       VARCHAR(255) DEFAULT NULL,
  phone        VARCHAR(20)  DEFAULT NULL,
  college      VARCHAR(100) DEFAULT NULL,
  credit_score DECIMAL(3,2) DEFAULT 5.00,
  role         TINYINT      DEFAULT 0 COMMENT '0学生 1管理员',
  status       TINYINT      DEFAULT 1 COMMENT '0禁用 1正常',
  create_time  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_time  DATETIME     DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB COMMENT='用户表';

CREATE TABLE goods_category (
  category_id INT PRIMARY KEY AUTO_INCREMENT,
  name        VARCHAR(50) NOT NULL UNIQUE,
  sort_order  INT         DEFAULT 0,
  status      TINYINT     DEFAULT 1
) ENGINE=InnoDB COMMENT='商品分类';

CREATE TABLE goods (
  goods_id        BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id         BIGINT        NOT NULL,
  category_id     INT           NOT NULL,
  title           VARCHAR(100)  NOT NULL,
  description     TEXT,
  price           DECIMAL(10,2) NOT NULL,
  original_price  DECIMAL(10,2) DEFAULT NULL,
  condition_level TINYINT       DEFAULT 3,
  images          JSON          DEFAULT NULL,
  trade_location  VARCHAR(200)  DEFAULT NULL,
  view_count      INT           DEFAULT 0,
  status          TINYINT       DEFAULT 0 COMMENT '0待审核 1在售 2已售 3下架',
  create_time     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_time     DATETIME      DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_goods_user FOREIGN KEY (user_id) REFERENCES sys_user(user_id),
  CONSTRAINT fk_goods_category FOREIGN KEY (category_id) REFERENCES goods_category(category_id),
  CONSTRAINT chk_goods_price CHECK (price > 0)
) ENGINE=InnoDB COMMENT='商品表';

CREATE TABLE trade_order (
  order_id      BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_no      VARCHAR(32)   NOT NULL UNIQUE,
  goods_id      BIGINT        NOT NULL,
  buyer_id      BIGINT        NOT NULL,
  seller_id     BIGINT        NOT NULL,
  amount        DECIMAL(10,2) NOT NULL,
  delivery_type TINYINT       DEFAULT 0 COMMENT '0面交 1邮寄',
  address       VARCHAR(255)  DEFAULT NULL,
  status        TINYINT       DEFAULT 0 COMMENT '0待确认 1待交易 2已完成 3已取消',
  create_time   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  finish_time   DATETIME      DEFAULT NULL,
  CONSTRAINT fk_order_goods FOREIGN KEY (goods_id) REFERENCES goods(goods_id),
  CONSTRAINT fk_order_buyer FOREIGN KEY (buyer_id) REFERENCES sys_user(user_id),
  CONSTRAINT fk_order_seller FOREIGN KEY (seller_id) REFERENCES sys_user(user_id)
) ENGINE=InnoDB COMMENT='订单表';

CREATE TABLE order_review (
  review_id   BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id    BIGINT       NOT NULL UNIQUE,
  reviewer_id BIGINT       NOT NULL,
  rating      TINYINT      NOT NULL,
  content     VARCHAR(500) DEFAULT NULL,
  create_time DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_review_order FOREIGN KEY (order_id) REFERENCES trade_order(order_id),
  CONSTRAINT fk_review_reviewer FOREIGN KEY (reviewer_id) REFERENCES sys_user(user_id),
  CONSTRAINT chk_review_rating CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB COMMENT='评价表';

CREATE TABLE user_message (
  message_id  BIGINT PRIMARY KEY AUTO_INCREMENT,
  sender_id   BIGINT NOT NULL,
  receiver_id BIGINT NOT NULL,
  goods_id    BIGINT DEFAULT NULL,
  content     TEXT   NOT NULL,
  is_read     TINYINT DEFAULT 0,
  create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_msg_sender FOREIGN KEY (sender_id) REFERENCES sys_user(user_id),
  CONSTRAINT fk_msg_receiver FOREIGN KEY (receiver_id) REFERENCES sys_user(user_id),
  CONSTRAINT fk_msg_goods FOREIGN KEY (goods_id) REFERENCES goods(goods_id)
) ENGINE=InnoDB COMMENT='消息表';

CREATE TABLE user_address (
  address_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id    BIGINT       NOT NULL,
  receiver   VARCHAR(50)  NOT NULL,
  phone      VARCHAR(20)  NOT NULL,
  detail     VARCHAR(255) NOT NULL,
  is_default TINYINT      DEFAULT 0,
  CONSTRAINT fk_address_user FOREIGN KEY (user_id) REFERENCES sys_user(user_id)
) ENGINE=InnoDB COMMENT='地址表';

CREATE TABLE email_verify_code (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  email       VARCHAR(100) NOT NULL,
  code        VARCHAR(6)   NOT NULL,
  scene       VARCHAR(20)  NOT NULL COMMENT 'register/bind',
  user_id     BIGINT       DEFAULT NULL,
  expire_time DATETIME     NOT NULL,
  used        TINYINT      NOT NULL DEFAULT 0,
  create_time DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email_scene (email, scene)
) ENGINE=InnoDB COMMENT='邮箱验证码';

INSERT INTO goods_category (name, sort_order) VALUES
('教材书籍', 1), ('电子产品', 2), ('生活用品', 3),
('服饰鞋包', 4), ('运动器材', 5), ('其他', 99);

DELIMITER //
CREATE PROCEDURE sp_complete_order(IN p_order_id BIGINT)
BEGIN
  DECLARE v_goods_id BIGINT;
  DECLARE v_seller_id BIGINT;
  DECLARE v_avg_rating DECIMAL(3,2);

  SELECT goods_id, seller_id INTO v_goods_id, v_seller_id
  FROM trade_order WHERE order_id = p_order_id AND status = 1;

  IF v_goods_id IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '订单不存在或状态不允许完成';
  END IF;

  UPDATE trade_order SET status = 2, finish_time = NOW() WHERE order_id = p_order_id;
  UPDATE goods SET status = 2 WHERE goods_id = v_goods_id;

  SELECT IFNULL(AVG(r.rating), 5.00) INTO v_avg_rating
  FROM order_review r
  JOIN trade_order o ON r.order_id = o.order_id
  WHERE o.seller_id = v_seller_id;

  UPDATE sys_user SET credit_score = v_avg_rating WHERE user_id = v_seller_id;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER trg_order_status_before_update
BEFORE UPDATE ON trade_order
FOR EACH ROW
BEGIN
  IF OLD.status = 2 AND NEW.status != 2 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '已完成订单不可变更状态';
  END IF;
END //
DELIMITER ;
