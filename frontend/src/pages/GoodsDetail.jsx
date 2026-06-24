import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Row,
  Col,
  Carousel,
  Button,
  Tag,
  Modal,
  Form,
  Radio,
  Input,
  message,
} from "antd";
import {
  ShoppingCartOutlined,
  MessageOutlined,
  EnvironmentOutlined,
  UserOutlined,
  HeartOutlined,
  HeartFilled,
} from "@ant-design/icons";
import {
  getGoodsDetail,
  createOrder,
  sendMessage,
  getAuth,
  parseImages,
  statusText,
  toggleFavorite,
  getFavoriteStatus,
} from "../api";

export default function GoodsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, userId } = getAuth();
  const [goods, setGoods] = useState(null);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    getGoodsDetail(id)
      .then(setGoods)
      .catch(() => setGoods(null));
  }, [id]);

  useEffect(() => {
    if (token && goods) {
      getFavoriteStatus(goods.goodsId)
        .then(res => setIsFavorited(res !== undefined ? res : false))
        .catch(() => setIsFavorited(false));
    }
  }, [token, goods]);

  if (!goods) {
    return (
      <div className="page-card">
        <div className="empty-state">
          <div className="empty-icon">⏳</div>
          <div className="empty-title">加载中...</div>
        </div>
      </div>
    );
  }

  const images = parseImages(goods.images);
  const isOwnItem = goods.userId === Number(userId);

  const create = async (values) => {
    try {
      await createOrder({ goodsId: goods.goodsId, ...values });
      message.success("下单成功！请前往「我的订单」查看");
      setOpen(false);
      navigate("/my-orders");
    } catch (e) {
      message.error(e?.message || "下单失败");
    }
  };

  const contactSeller = async () => {
    try {
      await sendMessage({
        receiverId: goods.userId,
        goodsId: goods.goodsId,
        content: `你好，我对「${goods.title}」感兴趣，方便聊聊吗？`,
      });
      message.success("消息已发送");
      navigate("/messages");
    } catch (e) {
      message.error(e?.message || "发送失败");
    }
  };

  const handleFavorite = async () => {
    try {
      await toggleFavorite(goods.goodsId);
      setIsFavorited(!isFavorited);
      message.success(isFavorited ? "已取消收藏" : "收藏成功");
    } catch (e) {
      message.error(e?.message || "操作失败");
    }
  };

  return (
    <>
      <div className="page-card">
        <Row gutter={32}>
          <Col xs={24} lg={11}>
            <div className="detail-gallery">
              {images.length > 0 ? (
                <Carousel autoplay dots arrows>
                  {images.map((img, idx) => (
                    <div key={idx}>
                      <img src={img} alt={`图片${idx + 1}`} />
                    </div>
                  ))}
                </Carousel>
              ) : (
                <div
                  style={{
                    height: 520,
                    background: "linear-gradient(135deg,#f0f9ff,#dbeafe)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 96,
                  }}
                >
                  📦
                </div>
              )}
            </div>
          </Col>

          <Col xs={24} lg={13}>
            <div className="detail-info">
              {goods.status !== 1 && (
                <Tag
                  color={
                    goods.status === 0
                      ? "warning"
                      : goods.status === 2
                        ? "default"
                        : "error"
                  }
                  style={{
                    fontSize: 13,
                    padding: "4px 12px",
                    marginBottom: 12,
                  }}
                >
                  {statusText.goods[goods.status]}
                </Tag>
              )}
              <h1>{goods.title}</h1>

              <div className="detail-price">
                {Number(goods.price || 0).toFixed(2)}
              </div>

              <div className="detail-meta-row">
                <div className="meta-item">
                  <span className="label">📂 分类</span>
                  <span className="value">{goods.categoryName || "—"}</span>
                </div>
                <div className="meta-item">
                  <span className="label">⭐ 成色</span>
                  <span className="value">
                    {goods.conditionLevel || 3} 成新
                  </span>
                </div>
                <div className="meta-item">
                  <span className="label">📍 交易地点</span>
                  <span className="value">{goods.tradeLocation || "面议"}</span>
                </div>
                <div className="meta-item">
                  <span className="label">👁️ 浏览次数</span>
                  <span className="value">{goods.viewCount || 0} 次</span>
                </div>
              </div>

              <div
                style={{
                  background:
                    "linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)",
                  borderRadius: 12,
                  padding: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #2563eb, #10b981)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 26,
                  }}
                >
                  <UserOutlined />
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}
                  >
                    {goods.sellerNickname || "卖家"}
                  </div>
                  <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
                    信誉分{" "}
                    <strong style={{ color: "#f59e0b" }}>
                      {goods.sellerCreditScore || 100}
                    </strong>
                  </div>
                </div>
                <Button icon={<MessageOutlined />} onClick={contactSeller}>
                  💬 联系卖家
                </Button>
              </div>

              {token && goods.status === 1 && !isOwnItem && (
                <div className="detail-action-bar">
                  <Button
                    type="primary"
                    size="large"
                    icon={<ShoppingCartOutlined />}
                    onClick={() => setOpen(true)}
                  >
                    立即购买
                  </Button>
                  <Button
                    size="large"
                    icon={<MessageOutlined />}
                    onClick={contactSeller}
                  >
                    联系卖家
                  </Button>
                  <Button
                    size="large"
                    icon={isFavorited ? <HeartFilled /> : <HeartOutlined />}
                    onClick={handleFavorite}
                    style={{
                      color: isFavorited ? "#ef4444" : undefined,
                      borderColor: isFavorited ? "#ef4444" : undefined,
                    }}
                  >
                    {isFavorited ? "已收藏" : "收藏"}
                  </Button>
                </div>
              )}

              {isOwnItem && (
                <div
                  style={{
                    marginTop: 24,
                    padding: 16,
                    background: "#fef3c7",
                    borderRadius: 12,
                    color: "#b45309",
                  }}
                >
                  ⚠️ 这是你自己发布的商品
                </div>
              )}

              {!token && goods.status === 1 && (
                <div
                  style={{
                    marginTop: 24,
                    padding: 16,
                    background: "#eff6ff",
                    borderRadius: 12,
                    color: "#1e40af",
                  }}
                >
                  🔒 请先登录后再进行购买或联系卖家
                </div>
              )}
            </div>
          </Col>
        </Row>
      </div>

      <div className="page-card">
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: 16,
          }}
        >
          📝 商品描述
        </div>
        <div
          style={{
            color: "#475569",
            fontSize: 15,
            lineHeight: 1.9,
            background: "#f8fafc",
            padding: 24,
            borderRadius: 12,
            whiteSpace: "pre-wrap",
          }}
        >
          {goods.description || "卖家暂未添加商品描述~"}
        </div>
      </div>

      <Modal
        title="🛒 提交订单"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={520}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ deliveryType: 0 }}
          onFinish={create}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)",
              padding: 16,
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            <div style={{ color: "#64748b", fontSize: 13 }}>商品</div>
            <div style={{ fontWeight: 600, marginTop: 4 }}>{goods.title}</div>
            <div
              style={{
                color: "#ef4444",
                fontSize: 22,
                fontWeight: 800,
                marginTop: 6,
              }}
            >
              ¥ {Number(goods.price || 0).toFixed(2)}
            </div>
          </div>
          <Form.Item
            name="deliveryType"
            label="交易方式"
            rules={[{ required: true, message: "请选择交易方式" }]}
          >
            <Radio.Group>
              <Radio value={0}>👋 面对面交易</Radio>
              <Radio value={1}>📮 邮寄</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prev, cur) => prev.deliveryType !== cur.deliveryType}
          >
            {({ getFieldValue }) =>
              getFieldValue("deliveryType") === 1 ? (
                <Form.Item
                  name="address"
                  label="收货地址"
                  rules={[{ required: true, message: "请填写收货地址" }]}
                >
                  <Input.TextArea
                    rows={3}
                    placeholder="请填写详细的收货地址、联系人及联系方式"
                  />
                </Form.Item>
              ) : null
            }
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large">
            确认提交订单
          </Button>
        </Form>
      </Modal>
    </>
  );
}
