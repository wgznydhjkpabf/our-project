import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Table, Button, Tag, message, Space } from "antd";
import { ShopOutlined, EyeOutlined, CloseOutlined } from "@ant-design/icons";
import { getGoodsList, offShelfGoods, getAuth, statusText } from "../api";

export default function MyGoods() {
  const navigate = useNavigate();
  const { userId } = getAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getGoodsList({ userId, page: 1, size: 100 });
      setList(data.list || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const off = async (id) => {
    try {
      await offShelfGoods(id);
      message.success("已下架");
      load();
    } catch (e) {
      message.error("操作失败");
    }
  };

  const statusColors = {
    0: "warning",
    1: "success",
    2: "default",
    3: "error",
  };

  const columns = [
    {
      title: "商品",
      dataIndex: "title",
      render: (v, row) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {row.images && row.images !== "null" ? (
            <img
              src={JSON.parse(row.images)[0]}
              alt=""
              style={{
                width: 48,
                height: 48,
                objectFit: "cover",
                borderRadius: 6,
                border: "1px solid #e2e8f0",
              }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          ) : (
            <div
              style={{
                width: 48,
                height: 48,
                background: "#f1f5f9",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              📦
            </div>
          )}
          <div>
            <div style={{ fontWeight: 500, color: "#0f172a" }}>{v}</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
              {row.categoryName || "—"}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "价格",
      dataIndex: "price",
      width: 120,
      render: (v) => (
        <span style={{ color: "#ef4444", fontWeight: 700, fontSize: 15 }}>
          ¥ {Number(v).toFixed(2)}
        </span>
      ),
    },
    {
      title: "成色",
      dataIndex: "conditionLevel",
      width: 100,
      render: (v) => `${v} 成新`,
    },
    {
      title: "浏览",
      dataIndex: "viewCount",
      width: 80,
      render: (v) => <span style={{ color: "#64748b" }}>👁 {v}</span>,
    },
    {
      title: "状态",
      dataIndex: "status",
      width: 110,
      render: (s) => <Tag color={statusColors[s]}>{statusText.goods[s]}</Tag>,
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      width: 160,
      render: (v) => (v ? new Date(v).toLocaleDateString("zh-CN") : "—"),
    },
    {
      title: "操作",
      width: 180,
      render: (_, row) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/goods/${row.goodsId}`)}
          >
            查看
          </Button>
          {row.status === 1 && (
            <Button
              size="small"
              danger
              icon={<CloseOutlined />}
              onClick={() => off(row.goodsId)}
            >
              下架
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card
      className="page-card"
      title={
        <>
          <ShopOutlined style={{ color: "#2563eb", marginRight: 8 }} />{" "}
          我发布的商品
        </>
      }
      extra={
        <Button
          type="primary"
          icon={<ShopOutlined />}
          onClick={() => navigate("/publish")}
        >
          + 发布新商品
        </Button>
      }
    >
      {list.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <div className="empty-title">还没有发布商品</div>
          <div className="empty-desc" style={{ marginBottom: 16 }}>
            把闲置物品变现吧~
          </div>
          <Button
            type="primary"
            size="large"
            onClick={() => navigate("/publish")}
          >
            + 立即发布
          </Button>
        </div>
      ) : (
        <Table
          rowKey="goodsId"
          dataSource={list}
          columns={columns}
          loading={loading}
          pagination={false}
        />
      )}
    </Card>
  );
}
