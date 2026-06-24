import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Rate,
  Upload,
  Button,
  message,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  SaveOutlined,
  ShopOutlined,
  DollarOutlined,
  TagOutlined,
  EnvironmentOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { getCategories, publishGoods, uploadFile } from "../api";

export default function Publish() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const customUpload = async ({ file, onSuccess, onError }) => {
    try {
      const url = await uploadFile(file);
      setImageUrls((prev) => [...prev, url]);
      onSuccess(url);
    } catch (e) {
      onError(e);
      message.error("图片上传失败");
    }
  };

  const submit = async (values) => {
    await publishGoods({
      ...values,
      conditionLevel: values.conditionLevel || 3,
      images: JSON.stringify(imageUrls),
    });
    message.success("发布成功，等待管理员审核");
    navigate("/my-goods");
  };

  return (
    <Card
      className="page-card"
      title={
        <>
          <ShopOutlined style={{ color: "#2563eb", marginRight: 8 }} />{" "}
          发布新商品
        </>
      }
      extra={
        <span style={{ color: "#64748b", fontSize: 13 }}>
          📌 发布后需管理员审核通过方可上架
        </span>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={submit}
        initialValues={{ price: 1, conditionLevel: 3 }}
      >
        <Row gutter={32}>
          <Col lg={14}>
            <Form.Item
              name="title"
              label={
                <>
                  <TagOutlined style={{ marginRight: 4 }} /> 商品标题
                </>
              }
              rules={[{ required: true, message: "请输入商品标题" }]}
            >
              <Input
                size="large"
                placeholder="例如：九成新 iPad Air 5 64G WiFi版"
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="categoryId"
                  label={
                    <>
                      <TagOutlined style={{ marginRight: 4 }} /> 商品分类
                    </>
                  }
                  rules={[{ required: true, message: "请选择分类" }]}
                >
                  <Select
                    size="large"
                    placeholder="请选择分类"
                    options={categories.map((c) => ({
                      value: c.categoryId,
                      label: c.name,
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="conditionLevel"
                  label={
                    <>
                      <StarOutlined style={{ marginRight: 4 }} /> 成色
                    </>
                  }
                  tooltip="5星代表全新，1星代表较旧"
                >
                  <Rate count={5} style={{ fontSize: 24 }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="price"
                  label={
                    <>
                      <DollarOutlined
                        style={{ color: "#ef4444", marginRight: 4 }}
                      />{" "}
                      售价 (元)
                    </>
                  }
                  rules={[{ required: true, message: "请输入售价" }]}
                >
                  <InputNumber
                    min={0.01}
                    precision={2}
                    size="large"
                    style={{ width: "100%" }}
                    placeholder="0.00"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="originalPrice" label="原价 (参考)">
                  <InputNumber
                    min={0}
                    precision={2}
                    size="large"
                    style={{ width: "100%" }}
                    placeholder="原价（选填）"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="tradeLocation"
              label={
                <>
                  <EnvironmentOutlined style={{ marginRight: 4 }} /> 交易地点
                </>
              }
              tooltip="面交地点或邮寄地址"
            >
              <Input size="large" placeholder="例如：图书馆门口 / 邮寄" />
            </Form.Item>

            <Form.Item
              name="description"
              label={
                <>
                  <TagOutlined style={{ marginRight: 4 }} /> 商品描述
                </>
              }
            >
              <Input.TextArea
                rows={6}
                placeholder="请详细描述商品的使用情况、购买时间、配件、是否有发票保修等信息..."
                style={{ fontSize: 14 }}
              />
            </Form.Item>
          </Col>

          <Col lg={10}>
            <div
              style={{
                background: "linear-gradient(135deg, #eff6ff, #f0fdf4)",
                padding: 24,
                borderRadius: 12,
                position: "sticky",
                top: 24,
              }}
            >
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: 0,
                  marginBottom: 16,
                }}
              >
                📸 商品图片
              </h3>
              <p style={{ color: "#64748b", fontSize: 13, marginBottom: 16 }}>
                最多上传 5 张图片，建议使用清晰的实拍图，可以大幅提高售出几率
              </p>

              <Form.Item label=" ">
                <Upload
                  listType="picture-card"
                  customRequest={customUpload}
                  fileList={fileList}
                  onChange={({ fileList: fl }) => setFileList(fl)}
                  style={{ width: "100%" }}
                >
                  {fileList.length >= 5 ? null : (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>上传图片</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>

              <div
                style={{
                  background: "#fff",
                  borderRadius: 8,
                  padding: 16,
                  marginTop: 24,
                }}
              >
                <h4
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#0f172a",
                    margin: 0,
                    marginBottom: 12,
                  }}
                >
                  💡 发布建议
                </h4>
                <ul
                  style={{
                    color: "#64748b",
                    fontSize: 13,
                    lineHeight: 1.8,
                    margin: 0,
                    paddingLeft: 16,
                  }}
                >
                  <li>标题简短明确，包含品牌和型号</li>
                  <li>价格合理，可以参考同类商品</li>
                  <li>提供清晰的实物照片，包括瑕疵</li>
                  <li>详细描述使用情况和配件</li>
                  <li>使用真实图片，避免盗图</li>
                </ul>
              </div>

              <Button
                type="primary"
                size="large"
                htmlType="submit"
                icon={<SaveOutlined />}
                block
                style={{ marginTop: 24, height: 48, fontSize: 15 }}
              >
                📦 提交审核并发布
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}
