import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import { useState } from "react";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  LoginOutlined,
  TeamOutlined,
  RocketOutlined,
  SafetyOutlined,
  GiftOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { register, sendRegisterEmailCode } from "../api";

export default function Register() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const submit = async (values) => {
    await register(values);
    message.success("注册成功，请登录~");
    setTimeout(() => navigate("/login"), 500);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #4facfe 0%, #667eea 50%, #f093fb 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1080,
          background: "#fff",
          borderRadius: 20,
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "1fr 1.15fr",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(135deg, #06b6d4 0%, #2563eb 50%, #7c3aed 100%)",
            padding: 48,
            color: "#fff",
          }}
        >
          <div style={{ fontSize: 56, marginBottom: 24 }}>📝</div>
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
            创建新账号
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
            加入校园二手交易平台 · 发现更多惊喜
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Feature
              icon={<RocketOutlined style={{ fontSize: 20 }} />}
              title="快速上手"
              desc="30秒完成注册 · 即刻开始购物"
            />
            <Feature
              icon={<SafetyOutlined style={{ fontSize: 20 }} />}
              title="隐私保护"
              desc="校园身份验证 · 信息严格保密"
            />
            <Feature
              icon={<GiftOutlined style={{ fontSize: 20 }} />}
              title="新人福利"
              desc="首单立减 · 专属优惠券"
            />
            <Feature
              icon={<StarOutlined style={{ fontSize: 20 }} />}
              title="信誉体系"
              desc="公平透明的交易环境"
            />
          </div>

          <div style={{ marginTop: 48, display: "flex", gap: 24 }}>
            <MiniStat label="新用户" value="10+/日" />
            <MiniStat label="热门分类" value="20+" />
            <MiniStat label="平台评分" value="4.8⭐" />
          </div>
        </div>

        <div style={{ padding: 48, overflowY: "auto", maxHeight: "95vh" }}>
          <div style={{ marginBottom: 28 }}>
            <div
              style={{
                fontSize: 12,
                color: "#64748b",
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              JOIN US TODAY �
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
              创建您的账号
            </h2>
            <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>
              让校园生活更美好
            </p>
          </div>

          <Form form={form} layout="vertical" onFinish={submit} size="large">
            <Form.Item
              name="studentNo"
              label="学号"
              rules={[{ required: true, message: "请输入学号" }]}
            >
              <Input
                prefix={<UserOutlined style={{ color: "#94a3b8" }} />}
                placeholder="请输入学号"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { required: true, message: "请输入邮箱" },
                { type: "email", message: "请输入有效的邮箱地址" },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: "#94a3b8" }} />}
                placeholder="your@email.com"
              />
            </Form.Item>

            <Form.Item label="邮箱验证码" required>
              <div style={{ display: "flex", gap: 8 }}>
                <Form.Item
                  name="verifyCode"
                  noStyle
                  rules={[
                    { required: true, message: "请输入验证码" },
                    { len: 6, message: "验证码为6位数字" },
                  ]}
                >
                  <Input placeholder="6位验证码" maxLength={6} style={{ flex: 1 }} />
                </Form.Item>
                <SendCodeButton form={form} />
              </div>
            </Form.Item>

            <Form.Item
              name="nickname"
              label="昵称"
              rules={[{ required: true, message: "请输入昵称" }]}
            >
              <Input
                prefix={<TeamOutlined style={{ color: "#94a3b8" }} />}
                placeholder="给自己起个好听的名字"
              />
            </Form.Item>

            <Form.Item name="college" label="院系（选填）">
              <Input
                prefix={<TeamOutlined style={{ color: "#94a3b8" }} />}
                placeholder="例如：计算机学院"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="密码"
              rules={[
                { required: true, message: "请输入密码" },
                { min: 6, message: "密码至少 6 个字符" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#94a3b8" }} />}
                placeholder="至少 6 位字符"
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
              注册账号
            </Button>

            <div
              style={{
                textAlign: "center",
                marginTop: 20,
                fontSize: 14,
                color: "#64748b",
              }}
            >
              已有账号？
              <a
                style={{ color: "#2563eb", fontWeight: 600, marginLeft: 4 }}
                onClick={() => navigate("/login")}
              >
                去登录 →
              </a>
            </div>
          </Form>
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

function SendCodeButton({ form }) {
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const send = async () => {
    try {
      const email = form.getFieldValue("email");
      if (!email) {
        message.warning("请先填写邮箱");
        return;
      }
      setLoading(true);
      await sendRegisterEmailCode({ email, scene: "register" });
      message.success("验证码已发送，请查收邮箱（开发模式请看后端控制台）");
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown(c => {
          if (c <= 1) {
            clearInterval(timer);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={send} loading={loading} disabled={countdown > 0} style={{ minWidth: 120 }}>
      {countdown > 0 ? `${countdown}s` : "获取验证码"}
    </Button>
  );
}
