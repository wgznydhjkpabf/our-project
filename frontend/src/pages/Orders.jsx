import { useEffect, useState } from "react";
import { Table, Button, Modal, Rate, Input, message, Tag, Space } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  StarOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import {
  getOrders,
  confirmOrder,
  cancelOrder,
  completeOrder,
  reviewOrder,
  getAuth,
  statusText,
} from "../api";

export default function Orders() {
  const { userId } = getAuth();
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [review, setReview] = useState({
    orderId: null,
    rating: 5,
    content: "",
  });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setOrders(await getOrders());
    } catch (e) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const isSeller = (row) => row.sellerId === Number(userId);
  const isBuyer = (row) => row.buyerId === Number(userId);

  const submitReview = async () => {
    if (!review.rating) {
      message.warn("请先选择评分");
      return;
    }
    try {
      await reviewOrder(review);
      message.success("评价成功，感谢您的反馈！");
      setOpen(false);
      load();
    } catch (e) {
      message.error(e?.message || "评价失败");
    }
  };

  const columns = [
    {
      title: "订单信息",
      dataIndex: "orderNo",
      width: 220,
      render: (no, row) => (
        <div>
          <div style={{ fontWeight: 600, color: "#0f172a" }}>{no}</div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
            {row.createdAt
              ? new Date(row.createdAt).toLocaleString("zh-CN")
              : ""}
          </div>
          <div style={{ marginTop: 4 }}>
            {isBuyer(row) ? (
              <Tag color="blue">🛒 买入</Tag>
            ) : (
              <Tag color="green">📦 卖出</Tag>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "商品",
      dataIndex: "goodsTitle",
      render: (title, row) => (
        <div>
          <div style={{ fontWeight: 500, color: "#0f172a" }}>{title}</div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
            {row.deliveryType === 1 ? "📮 邮寄" : "👋 面交"}
          </div>
        </div>
      ),
    },
    {
      title: "金额",
      dataIndex: "amount",
      width: 120,
      render: (v) => (
        <span style={{ color: "#ef4444", fontWeight: 800, fontSize: 16 }}>
          ¥ {Number(v || 0).toFixed(2)}
        </span>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      width: 120,
      render: (s) => (
        <Tag
          color={["warning", "blue", "green", "default", "red"][s] || "default"}
          style={{ padding: "4px 12px", fontSize: 13 }}
        >
          {statusText.order[s]}
        </Tag>
      ),
    },
    {
      title: "评价",
      dataIndex: "rating",
      width: 140,
      render: (v, row) => {
        if (row.rating) return <Rate disabled value={row.rating} />;
        return <span style={{ color: "#94a3b8" }}>—</span>;
      },
    },
    {
      title: "操作",
      width: 280,
      render: (_, row) => (
        <Space size="small" wrap>
          {isSeller(row) && row.status === 0 && (
            <Button
              type="primary"
              size="small"
              icon={<CheckOutlined />}
              onClick={async () => {
                try {
                  await confirmOrder(row.orderId);
                  message.success("已确认订单");
                  load();
                } catch (e) {
                  message.error(e?.message || "操作失败");
                }
              }}
            >
              确认
            </Button>
          )}
          {row.status < 2 && (
            <Button
              size="small"
              danger
              icon={<CloseOutlined />}
              onClick={async () => {
                try {
                  await cancelOrder(row.orderId);
                  message.success("订单已取消");
                  load();
                } catch (e) {
                  message.error(e?.message || "操作失败");
                }
              }}
            >
              取消
            </Button>
          )}
          {row.status === 1 && (
            <Tooltip title={isBuyer(row) ? "确认收到商品" : "确认已交付商品"}>
              <Button
                type="primary"
                size="small"
                onClick={async () => {
                  try {
                    await completeOrder(row.orderId);
                    message.success("订单已完成！");
                    load();
                  } catch (e) {
                    message.error(e?.message || "操作失败");
                  }
                }}
              >
                完成交易
              </Button>
            </Tooltip>
          )}
          {isBuyer(row) && row.status === 2 && !row.rating && (
            <Button
              size="small"
              icon={<StarOutlined />}
              onClick={() => {
                setReview({ orderId: row.orderId, rating: 5, content: "" });
                setOpen(true);
              }}
            >
              评价
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="page-card" style={{ padding: 0, overflow: "hidden" }}>
      <div
        style={{
          padding: "20px 28px",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <ShoppingCartOutlined style={{ color: "#2563eb", fontSize: 20 }} />
        <span style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>
          我的订单
        </span>
        <span style={{ color: "#64748b", fontSize: 13, marginLeft: 8 }}>
          共 {orders.length} 笔
        </span>
        <Button
          type="primary"
          size="small"
          onClick={load}
          style={{ marginLeft: "auto" }}
        >
          🔄 刷新
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div className="empty-title">暂无订单</div>
          <div className="empty-desc">去首页逛逛，发现心仪的好物吧~</div>
        </div>
      ) : (
        <Table
          rowKey="orderId"
          dataSource={orders}
          columns={columns}
          loading={loading}
          pagination={false}
          rowClassName={(record) =>
            isBuyer(record) ? "order-row-buyer" : "order-row-seller"
          }
          style={{ padding: "8px 16px" }}
        />
      )}

      <Modal
        title="⭐ 订单评价"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={submitReview}
        okText="提交评价"
        cancelText="取消"
      >
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontSize: 14, color: "#64748b", marginBottom: 12 }}>
            请给本次交易打分
          </div>
          <Rate
            value={review.rating}
            onChange={(v) => setReview({ ...review, rating: v })}
            style={{ fontSize: 32 }}
          />
        </div>
        <Input.TextArea
          rows={4}
          placeholder="说点什么吧~（可选）"
          style={{ marginTop: 8 }}
          value={review.content}
          onChange={(e) => setReview({ ...review, content: e.target.value })}
        />
      </Modal>
    </div>
  );
}

function Tooltip({ title, children }) {
  return <span title={title}>{children}</span>;
}
