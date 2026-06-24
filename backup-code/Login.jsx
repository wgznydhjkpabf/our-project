import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  LoginOutlined,
  ShoppingOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { login, setAuth } from "../api";

export default function Login() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const submit = async (values) => {
    const data = await login(values);
    setAuth(data);
    message.success("登录成功，欢迎回来~");
    setTimeout(() => navigate(data.role === 1 ? "/admin" : "/"), 300);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 960,
          background: "#fff",
          borderRadius: 20,
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #ec4899 100%)",
            padding: 48,
            color: "#fff",
            position: "relative",
          }}
        >
          <div style={{ fontSize: 56, marginBottom: 24 }}>🎓</div>
          <h1
            style={{
              color: "#fff",
              fontSize: 32,
              fontWeight: 800,
              margin: 0,
              marginBottom: 12,
              lineHeight: 1.3,
            }}
          >
            校园二手交易
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: 15,
              margin: 0,
              marginBottom: 36,
              lineHeight: 1.7,
            }}
          >
            让闲置物品流动起来 · 省钱又环保 · 大学生专属交易空间
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Feature
              icon={<ShoppingOutlined style={{ fontSize: 20 }} />}
              title="海量商品"
              desc="覆盖书籍、电子产品、生活用品"
            />
            <Feature
              icon={<SafetyOutlined style={{ fontSize: 20 }} />}
              title="安全可靠"
              desc="校园身份认证 · 信誉分机制"
            />
            <Feature
              icon={<ThunderboltOutlined style={{ fontSize: 20 }} />}
              title="便捷高效"
              desc="面对面交易 · 极速达成"
            />
          </div>

          <div style={{ marginTop: 48, display: "flex", gap: 24 }}>
            <MiniStat label="在售商品" value="100+" />
            <MiniStat label="校园用户" value="500+" />
            <MiniStat label="日成交" value="50+" />
          </div>
        </div>

        <div style={{ padding: 48 }}>
          <div style={{ marginBottom: 32 }}>
            <div
              style={{
                fontSize: 12,
                color: "#64748b",
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              WELCOME BACK 👋
            </div>
            <h2
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: "#0f172a",
                margin: 0,
                marginBottom: 6,
              }}
            >
              登录您的账号
            </h2>
            <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>
              开始您的校园二手之旅
            </p>
          </div>

          <Form form={form} layout="vertical" onFinish={submit} size="large">
            <Form.Item
              name="account"
              label="账号"
              rules={[{ required: true, message: "请输入学号或邮箱" }]}
            >
              <Input
                prefix={<UserOutlined style={{ color: "#94a3b8" }} />}
                placeholder="学号 / 邮箱 / 用户名"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: "请输入密码" }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#94a3b8" }} />}
                placeholder="请输入密码"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              icon={<LoginOutlined />}
              style={{
                height: 48,
                fontSize: 15,
                fontWeight: 600,
                marginTop: 8,
                background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                border: "none",
                boxShadow: "0 8px 20px rgba(37,99,235,0.25)",
              }}
            >
              登录
            </Button>

            <div
              style={{
                textAlign: "center",
                marginTop: 20,
                fontSize: 14,
                color: "#64748b",
              }}
            >
              还没有账号？
              <a
                style={{ color: "#2563eb", fontWeight: 600, marginLeft: 4 }}
                onClick={() => navigate("/register")}
              >
                立即注册 →
              </a>
            </div>
          </Form>

          <div
            style={{
              marginTop: 32,
              padding: 16,
              background: "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)",
              borderRadius: 12,
              fontSize: 13,
              color: "#64748b",
            }}
          >
            <div style={{ fontWeight: 600, color: "#475569", marginBottom: 8 }}>
              <StarOutlined style={{ color: "#f59e0b" }} /> 测试账号
            </div>
            <div style={{ marginBottom: 4 }}>
              <span style={{ fontWeight: 600, color: "#dc2626" }}>管理员：</span>
              admin / admin123
            </div>
            <div style={{ marginBottom: 4 }}>
              <span style={{ fontWeight: 600, color: "#2563eb" }}>学生用户：</span>
              2021001 / 123456（张三）
            </div>
            <div style={{ marginBottom: 4 }}>
              <span style={{ fontWeight: 600, color: "#2563eb" }}>学生用户：</span>
              2021002 / 123456（李四）
            </div>
            <div>
              <span style={{ fontWeight: 600, color: "#2563eb" }}>学生用户：</span>
              2021003-2021005 / 123456
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: "rgba(255,255,255,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>
          {title}
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>
          {desc}
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1 }}>
        {value}
      </div>
      <div
        style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", marginTop: 4 }}
      >
        {label}
      </div>
    </div>
  );
}
