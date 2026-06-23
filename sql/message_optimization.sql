USE campus_trade;

ALTER TABLE user_message
  ADD COLUMN order_id BIGINT DEFAULT NULL AFTER goods_id,
  ADD COLUMN message_type TINYINT DEFAULT 0 AFTER order_id,
  ADD INDEX idx_msg_receiver_read (receiver_id, is_read),
  ADD INDEX idx_msg_type (message_type),
  ADD INDEX idx_msg_order (order_id);

UPDATE user_message SET message_type = 0 WHERE message_type IS NULL;