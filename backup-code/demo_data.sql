-- 校园二手交易平台 - 演示数据（完整重置）
USE campus_trade;

SET NAMES utf8mb4;

-- 关闭外键约束
SET FOREIGN_KEY_CHECKS = 0;

-- 清空所有表（按外键顺序）
TRUNCATE TABLE user_address;
TRUNCATE TABLE order_review;
TRUNCATE TABLE user_message;
TRUNCATE TABLE trade_order;
TRUNCATE TABLE goods;
TRUNCATE TABLE sys_user;
TRUNCATE TABLE goods_category;

-- 重新开启外键约束
SET FOREIGN_KEY_CHECKS = 1;

-- 插入分类数据
INSERT INTO goods_category (category_id, name, sort_order, status) VALUES
(1, '教材书籍', 1, 1),
(2, '电子产品', 2, 1),
(3, '生活用品', 3, 1),
(4, '服饰鞋包', 4, 1),
(5, '运动器材', 5, 1),
(6, '美妆护肤', 6, 1),
(7, '其他', 99, 1);

-- 插入用户数据（密码都是123456）
INSERT INTO sys_user (user_id, student_no, email, password, nickname, phone, college, credit_score, role, status) VALUES
(1, 'admin', 'admin@campus.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjzqAKL9xL5jvMFVdNJHvGCgTq/VEq', '系统管理员', '13800138000', '计算机学院', 5.00, 1, 1),
(2, '2021001', 'zhangsan@campus.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjzqAKL9xL5jvMFVdNJHvGCgTq/VEq', '张三', '13800138001', '计算机学院', 4.85, 0, 1),
(3, '2021002', 'lisi@campus.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjzqAKL9xL5jvMFVdNJHvGCgTq/VEq', '李四', '13800138002', '经济管理学院', 4.90, 0, 1),
(4, '2021003', 'wangwu@campus.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjzqAKL9xL5jvMFVdNJHvGCgTq/VEq', '王五', '13800138003', '外国语学院', 4.70, 0, 1),
(5, '2021004', 'zhaoliu@campus.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjzqAKL9xL5jvMFVdNJHvGCgTq/VEq', '赵六', '13800138004', '机械工程学院', 5.00, 0, 1),
(6, '2021005', 'sunqi@campus.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjzqAKL9xL5jvMFVdNJHvGCgTq/VEq', '孙七', '13800138005', '艺术设计学院', 4.60, 0, 1);

-- 插入商品数据
INSERT INTO goods (goods_id, user_id, category_id, title, description, price, original_price, condition_level, images, trade_location, view_count, status) VALUES
-- 教材书籍类
(1, 2, 1, '高等数学（第七版）上下册', '同济大学第七版，上下册全套，有少量笔记标注，整体成色很好。适合大一新生使用。', 35.00, 98.00, 8, '["https://neeko-copilot.bytedance.net/api/text_to_image?prompt=textbook%20math%20calculus%20book%20higher%20mathematics%20clean%20cover&image_size=landscape_4_3"]', '图书馆门口', 125, 1),
(2, 3, 1, 'Java编程思想（第四版）', '经典Java学习书籍，中文版，无划线笔记，附赠书签。', 45.00, 109.00, 7, '["https://neeko-copilot.bytedance.net/api/text_to_image?prompt=java%20programming%20thinking%20book%20programming%20language%20blue%20cover&image_size=landscape_4_3"]', '二食堂门口', 89, 1),
(3, 4, 1, '考研英语真题解析（2020-2024）', '五年真题全套，有详细解析，适合备考2025考研的同学。', 25.00, 68.00, 9, '["https://neeko-copilot.bytedance.net/api/text_to_image?prompt=english%20exam%20preparation%20book%20study%20material%20red%20cover&image_size=landscape_4_3"]', '教学楼A栋', 234, 1),

-- 电子产品类
(4, 2, 2, 'iPhone 13 128G 蓝色', '自用iPhone 13，128G蓝色，电池健康度89%，无磕碰划痕，配件齐全。', 3800.00, 5999.00, 8, '["https://neeko-copilot.bytedance.net/api/text_to_image?prompt=iphone%2013%20blue%20smartphone%20mobile%20phone%20on%20desk&image_size=landscape_4_3"]', '宿舍楼下', 567, 1),
(5, 3, 2, 'MacBook Air M2 8+256G', '2023款MacBook Air，M2芯片，8+256G，保修期到2025年。', 6500.00, 9499.00, 9, '["https://neeko-copilot.bytedance.net/api/text_to_image?prompt=macbook%20air%20laptop%20silver%20apple%20computer%20clean%20desk&image_size=landscape_4_3"]', '科技园A座', 342, 1),
(6, 5, 2, 'AirPods Pro 2代', '第二代AirPods Pro，带MagSafe充电盒，使用半年，成色很新。', 850.00, 1899.00, 9, '["https://neeko-copilot.bytedance.net/api/text_to_image?prompt=airpods%20pro%20earbuds%20white%20apple%20wireless%20earphones&image_size=landscape_4_3"]', '音乐楼', 189, 1),
(7, 6, 2, 'iPad Pro 11寸 2021', 'M1芯片，128G，Wi-Fi版，附带Apple Pencil二代。', 4200.00, 6299.00, 8, '["https://neeko-copilot.bytedance.net/api/text_to_image?prompt=ipad%20pro%20tablet%20apple%20with%20pencil%20stylus&image_size=landscape_4_3"]', '图书馆', 267, 1),

-- 生活用品类
(8, 2, 3, '宜家书架 白色', '宜家BILLY书架，白色，高2米，九层，可拆卸搬运。', 180.00, 399.00, 7, '["https://neeko-copilot.bytedance.net/api/text_to_image?prompt=white%20bookshelf%20ikea%20billy%20style%20wooden%20furniture&image_size=landscape_4_3"]', '学生公寓', 78, 1),
(9, 4, 3, '小米空气净化器2S', '家用空气净化器，带滤芯，使用一年，功能正常。', 150.00, 599.00, 6, '["https://neeko-copilot.bytedance.net/api/text_to_image?prompt=xiaomi%20air%20purifier%20white%20home%20appliance%20modern&image_size=landscape_4_3"]', '研究生宿舍', 45, 1),
(10, 5, 3, '九阳豆浆机', '家用全自动豆浆机，可预约，送过滤杯。', 80.00, 299.00, 7, '["https://neeko-copilot.bytedance.net/api/text_to_image?prompt=soy%20milk%20machine%20appliance%20kitchen%20white%20modern&image_size=landscape_4_3"]', '女生宿舍', 32, 1),
(11, 6, 3, '美的电饭煲 3L', '3升容量，适合2-3人使用，不粘锅内胆。', 120.00, 359.00, 8, '["https://neeko-copilot.bytedance.net/api/text_to_image?prompt=rice%20cooker%20white%20kitchen%20appliance%20modern%20design&image_size=landscape_4_3"]', '食堂附近', 56, 1),

-- 服饰鞋包类
(12, 3, 4, 'Nike Air Force 1 白色 42码', '经典款AF1，白色，42码，穿过几次，鞋底干净。', 350.00, 799.00, 8, '["https://neeko-copilot.bytedance.net/api/text_to_image?prompt=nike%20air%20force%201%20white%20sneakers%20shoes%20fashion&image_size=landscape_4_3"]', '体育馆', 145, 1),
(13, 4, 4, '优衣库羽绒服 男M码', '轻薄款羽绒服，黑色，M码，保暖性好。', 150.00, 399.00, 7, '["https://neeko-copilot.bytedance.net/api/text_to_image?prompt=uniqlo%20down%20jacket%20black%20winter%20coat%20fashion&image_size=landscape_4_3"]', '南门', 89, 1),
(14, 5, 4, 'Coach单肩包', '经典款单肩包，棕色，成色很好。', 450.00, 1200.00, 8, '["https://neeko-copilot.bytedance.net/api/text_to_image?prompt=coach%20handbag%20brown%20leather%20fashion%20bag&image_size=landscape_4_3"]', '商业街', 123, 1),

-- 运动器材类
(15, 2, 5, '羽毛球拍 尤尼克斯', '尤尼克斯NR-D11，新手入门款，送球和手胶。', 85.00, 299.00, 7, '["https://neeko-copilot.bytedance.net/api/text_to_image?prompt=badminton%20racket%20yonex%20sports%20equipment%20professional&image_size=landscape_4_3"]', '羽毛球馆', 67, 1),
(16, 6, 5, '篮球 斯伯丁', '室外用篮球，手感好，弹性佳。', 65.00, 199.00, 7, '["https://neeko-copilot.bytedance.net/api/text_to_image?prompt=spalding%20basketball%20orange%20sports%20equipment%20outdoor&image_size=landscape_4_3"]', '篮球场', 45, 1),
(17, 3, 5, '跑步鞋 亚瑟士 43码', '亚瑟士GEL系列，缓震好，适合长跑，43码。', 380.00, 899.00, 7, '["https://neeko-copilot.bytedance.net/api/text_to_image?prompt=asics%20running%20shoes%20sports%20athletic%20footwear%20blue&image_size=landscape_4_3"]', '田径场', 98, 1),

-- 美妆护肤类
(18, 5, 6, 'SK-II神仙水 230ml', '正品SK-II神仙水，余量约80%，有效期到2026年。', 580.00, 1590.00, 8, '["https://neeko-copilot.bytedance.net/api/text_to_image?prompt=skii%20facial%20treatment%20essence%20skincare%20bottle%20luxury&image_size=landscape_4_3"]', '女生宿舍', 234, 1),
(19, 6, 6, '兰蔻菁纯面霜 50ml', '兰蔻菁纯臻颜面霜，用过几次，保质期新鲜。', 850.00, 2580.00, 9, '["https://neeko-copilot.bytedance.net/api/text_to_image?prompt=lancome%20cream%20jar%20skincare%20luxury%20beauty%20gold&image_size=landscape_4_3"]', '商业街', 156, 1),

-- 其他类
(20, 2, 7, '吉他 雅马哈F310', '雅马哈入门吉他，原木色，带吉他包和调音器。', 550.00, 899.00, 7, '["https://neeko-copilot.bytedance.net/api/text_to_image?prompt=yamaha%20acoustic%20guitar%20wooden%20music%20instrument&image_size=landscape_4_3"]', '音乐楼', 78, 1),
(21, 4, 7, '任天堂Switch OLED', 'Switch OLED版，红蓝配色，带塞尔达传说游戏。', 2200.00, 2599.00, 9, '["https://neeko-copilot.bytedance.net/api/text_to_image?prompt=nintendo%20switch%20oled%20gaming%20console%20red%20blue%20joycons&image_size=landscape_4_3"]', '宿舍', 345, 1);

-- 插入订单数据
INSERT INTO trade_order (order_id, order_no, goods_id, buyer_id, seller_id, amount, delivery_type, address, status, create_time, finish_time) VALUES
(1, '202606200001', 1, 3, 2, 35.00, 0, NULL, 2, '2026-06-20 10:30:00', '2026-06-20 15:00:00'),
(2, '202606220002', 4, 5, 2, 3800.00, 1, '北京市朝阳区xxx街道xxx小区1号楼101室', 1, '2026-06-22 14:15:00', NULL),
(3, '202606240003', 6, 6, 5, 850.00, 0, NULL, 0, '2026-06-24 09:00:00', NULL),
(4, '202606180004', 8, 2, 4, 180.00, 0, NULL, 2, '2026-06-18 16:45:00', '2026-06-18 20:00:00'),
(5, '202606230005', 12, 4, 3, 350.00, 0, NULL, 1, '2026-06-23 11:20:00', NULL),
(6, '202606210006', 20, 5, 2, 550.00, 0, NULL, 3, '2026-06-21 08:30:00', '2026-06-21 09:00:00');

-- 插入评价数据
INSERT INTO order_review (review_id, order_id, reviewer_id, rating, content, create_time) VALUES
(1, 1, 3, 5, '书的成色很好，卖家也很耐心，交易很顺利！', '2026-06-20 16:00:00'),
(2, 4, 2, 4, '书架质量不错，就是搬运有点费劲，总体满意。', '2026-06-19 10:00:00');

-- 插入消息数据
INSERT INTO user_message (message_id, sender_id, receiver_id, goods_id, order_id, message_type, content, is_read, create_time) VALUES
-- 用户消息
(1, 2, 3, 1, NULL, 'text', '您好，请问这本书还在吗？', 1, '2026-06-19 09:30:00'),
(2, 3, 2, 1, NULL, 'text', '在的，你什么时候方便取？', 1, '2026-06-19 09:35:00'),
(3, 2, 3, 1, NULL, 'text', '今天下午三点图书馆门口可以吗？', 1, '2026-06-19 09:40:00'),
(4, 3, 2, 1, NULL, 'text', '可以的，不见不散~', 1, '2026-06-19 09:42:00'),
(5, 5, 2, 4, NULL, 'text', 'iPhone 13最低多少钱出？', 1, '2026-06-21 10:00:00'),
(6, 2, 5, 4, NULL, 'text', '最低3600，诚心要可以再谈', 0, '2026-06-21 10:05:00'),
-- 系统消息
(7, NULL, 2, 1, 1, 'order_create', '用户李四购买了您的商品「高等数学（第七版）上下册」，请及时确认订单', 1, '2026-06-20 10:30:00'),
(8, NULL, 5, 4, 2, 'order_confirm', '卖家已确认订单「iPhone 13 128G 蓝色」，请准备交易', 0, '2026-06-22 15:00:00');

-- 插入地址数据
INSERT INTO user_address (address_id, user_id, receiver, phone, detail, is_default) VALUES
(1, 2, '张三', '13800138001', '学生公寓3号楼302室', 1),
(2, 2, '张三', '13800138001', '北京市朝阳区xxx街道xxx小区1号楼101室', 0),
(3, 3, '李四', '13800138002', '学生公寓5号楼501室', 1),
(4, 5, '孙七', '13800138005', '女生宿舍2号楼205室', 1);

SELECT '演示数据插入完成！' AS result;
