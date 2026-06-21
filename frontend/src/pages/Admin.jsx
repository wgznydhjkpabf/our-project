import { useEffect, useState } from "react";
import {
  Card,
  Table,
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Tag,
  Space,
  Row,
  Col,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
  UserOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  AuditOutlined,
} from "@ant-design/icons";
import {
  adminDashboard,
  adminPendingGoods,
  adminAuditGoods,
  adminUsers,
  adminUpdateUserStatus,
  getCategories,
  adminAddCategory,
  adminDeleteCategory,
} from "../api";

export default function Admin() {
  const [stats, setStats] = useState({});
  const [pending, setPending] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setStats(await adminDashboard());
      setPending((await adminPendingGoods({ page: 1, size: 50 })).list || []);
      setUsers(await adminUsers());
      setCategories(await getCategories());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const audit = async (id, pass) => {
    await adminAuditGoods(id, pass);
    message.success(pass ? "已通过审核" : "已驳回");
    load();
  };

  const toggleUser = async (row) => {
    await adminUpdateUserStatus(row.userId, row.status === 1 ? 0 : 1);
    message.success("状态已更新");
    load();
  };

  const addCategory = async (values) => {
    await adminAddCategory(values);
    form.resetFields();
    message.success("分类已添加");
    load();
  };

  const pendingColumns = [
    {
      title: "商品标题",
      dataIndex: "title",
      render: (v) => <span style={{ fontWeight: 500 }}>{v}</span>,
    },
    {
      title: "价格",
      dataIndex: "price",
      width: 120,
      render: (v) => (
        <span style={{ color: "#ef4444", fontWeight: 600 }}>
          ¥ {Number(v).toFixed(2)}
        </span>
      ),
    },
    { title: "分类", dataIndex: "categoryName", width: 120 },
    { title: "卖家", dataIndex: "sellerNickname", width: 140 },
    {
      title: "成色",
      dataIndex: "conditionLevel",
      width: 100,
      render: (v) => `${v} 成新`,
    },
    {
      title: "操作",
      width: 180,
      render: (_, row) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<CheckOutlined />}
            onClick={() => audit(row.goodsId, true)}
          >
            通过
          </Button>
          <Button
            size="small"
            danger
            icon={<CloseOutlined />}
            onClick={() => audit(row.goodsId, false)}
          >
            驳回
          </Button>
        </Space>
      ),
    },
  ];

  const userColumns = [
    { title: "学号", dataIndex: "studentNo", width: 140 },
    { title: "昵称", dataIndex: "nickname", width: 140 },
    { title: "邮箱", dataIndex: "email" },
    { title: "院系", dataIndex: "college", width: 140 },
    {
      title: "信誉分",
      dataIndex: "creditScore",
      width: 100,
      render: (v) => <Tag color="gold">⭐ {v}</Tag>,
    },
    {
      title: "状态",
      dataIndex: "status",
      width: 100,
      render: (s) =>
        s === 1 ? (
          <Tag color="success">正常</Tag>
        ) : (
          <Tag color="error">禁用</Tag>
        ),
    },
    {
      title: "操作",
      width: 120,
      render: (_, row) =>
        row.role !== 1 ? (
          <Button
            size="small"
            danger={row.status === 1}
            onClick={() => toggleUser(row)}
          >
            {row.status === 1 ? "禁用" : "启用"}
          </Button>
        ) : (
          <Tag color="blue">管理员</Tag>
        ),
    },
  ];

  const categoryColumns = [
    {
      title: "分类名称",
      dataIndex: "name",
      render: (v, r) => <span style={{ fontWeight: 500 }}>📂 {v}</span>,
    },
    { title: "排序", dataIndex: "sortOrder", width: 120 },
    { title: "ID", dataIndex: "categoryId", width: 80 },
    {
      title: "操作",
      width: 120,
      render: (_, row) => (
        <Button
          type="link"
          danger
          onClick={async () => {
            await adminDeleteCategory(row.categoryId);
            message.success("已删除");
            load();
          }}
        >
          删除
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Card
        className="page-card"
        title={
          <>
            <AuditOutlined style={{ color: "#2563eb", marginRight: 8 }} />{" "}
            管理仪表盘
          </>
        }
        style={{ marginBottom: 24 }}
      >
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-label">
              <UserOutlined style={{ marginRight: 6 }} /> 用户总数
            </span>
            <strong className="stat-value">{stats.userCount ?? 0}</strong>
          </div>
          <div className="stat-card success">
            <span className="stat-label">
              <ShopOutlined style={{ marginRight: 6 }} /> 商品总数
            </span>
            <strong className="stat-value">{stats.goodsCount ?? 0}</strong>
          </div>
          <div className="stat-card warning">
            <span className="stat-label">
              <ShoppingCartOutlined style={{ marginRight: 6 }} /> 订单总数
            </span>
            <strong className="stat-value">{stats.orderCount ?? 0}</strong>
          </div>
          <div className="stat-card danger">
            <span className="stat-label">
              <AuditOutlined style={{ marginRight: 6 }} /> 待审核
            </span>
            <strong className="stat-value">
              {stats.pendingGoodsCount ?? 0}
            </strong>
          </div>
        </div>
      </Card>

      <Card
        className="page-card"
        title={
          <>
            <AuditOutlined style={{ color: "#f59e0b", marginRight: 8 }} />{" "}
            待审核商品 ({pending.length})
          </>
        }
        style={{ marginBottom: 24 }}
      >
        {pending.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✅</div>
            <div className="empty-title">暂无待审核商品</div>
            <div className="empty-desc">所有商品都已处理完毕</div>
          </div>
        ) : (
          <Table
            rowKey="goodsId"
            dataSource={pending}
            columns={pendingColumns}
            pagination={false}
            loading={loading}
          />
        )}
      </Card>

      <Card
        className="page-card"
        title={
          <>
            <UserOutlined style={{ color: "#2563eb", marginRight: 8 }} />{" "}
            用户管理 ({users.length})
          </>
        }
        style={{ marginBottom: 24 }}
      >
        <Table
          rowKey="userId"
          dataSource={users}
          columns={userColumns}
          pagination={false}
          loading={loading}
        />
      </Card>

      <Card
        className="page-card"
        title={
          <>
            <PlusOutlined style={{ color: "#10b981", marginRight: 8 }} />{" "}
            分类管理 ({categories.length})
          </>
        }
      >
        <Form
          form={form}
          layout="inline"
          onFinish={addCategory}
          style={{ marginBottom: 16 }}
        >
          <Form.Item name="name" rules={[{ required: true }]}>
            <Input placeholder="分类名称" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="sortOrder" initialValue={0}>
            <InputNumber min={0} placeholder="排序" style={{ width: 120 }} />
          </Form.Item>
          <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
            添加分类
          </Button>
        </Form>
        <Table
          rowKey="categoryId"
          dataSource={categories}
          columns={categoryColumns}
          pagination={false}
          loading={loading}
        />
      </Card>
    </div>
  );
}
