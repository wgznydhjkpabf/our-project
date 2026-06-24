import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Select, Pagination } from "antd";
import {
  SearchOutlined,
  ShopOutlined,
  UserOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { getCategories, getGoodsList, parseImages } from "../api";

export default function Home() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [list, setList] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState(undefined);
  const [sortBy, setSortBy] = useState(undefined);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const size = 16;

  const load = async (p = page, cat = categoryId, kw = keyword, sort = sortBy) => {
    try {
      const data = await getGoodsList({
        keyword: kw || undefined,
        categoryId: cat,
        status: 1,
        sortBy: sort || undefined,
        page: p,
        size,
      });
      setList(data.list || []);
      setTotal(data.total || 0);
    } catch (e) {
      setList([]);
      setTotal(0);
    }
  };

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    load(page, categoryId, keyword, sortBy);
  }, [page, categoryId, sortBy]);

  const search = () => {
    setPage(1);
    load(1, categoryId, keyword);
  };

  return (
    <>
      <div className="hero-card">
        <h1>🎓 校园二手交易平台</h1>
        <p className="hero-subtitle">
          让闲置物品流动起来 · 省钱又环保 · 大学生专属交易空间
        </p>

        <Input
          size="large"
          placeholder="搜索你想要的商品，例如：笔记本、自行车、考研资料..."
          prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onPressEnter={search}
          suffix={<ButtonGhost onClick={search}>搜索</ButtonGhost>}
        />

        <div className="hero-stats">
          <div className="stat">
            <strong>{total || 0}</strong>
            <span>在售商品</span>
          </div>
          <div className="stat">
            <strong>{categories.length}</strong>
            <span>商品分类</span>
          </div>
          <div className="stat">
            <strong>24h</strong>
            <span>极速响应</span>
          </div>
          <div className="stat">
            <strong>100%</strong>
            <span>校园专属</span>
          </div>
        </div>
      </div>

      <div className="filter-card">
        <span className="filter-label">📂 分类筛选：</span>
        <Select
          allowClear
          placeholder="全部分类"
          style={{ minWidth: 180 }}
          options={[
            ...categories.map((c) => ({ value: c.categoryId, label: c.name })),
          ]}
          value={categoryId}
          onChange={(val) => {
            setCategoryId(val);
            setPage(1);
          }}
        />
        <span className="filter-label" style={{ marginLeft: 24 }}>📊 排序方式：</span>
        <Select
          allowClear
          placeholder="默认排序"
          style={{ minWidth: 140 }}
          options={[
            { value: 'time', label: '⏰ 最新发布' },
            { value: 'price_asc', label: '💰 价格从低到高' },
            { value: 'price_desc', label: '💎 价格从高到低' },
            { value: 'view_count', label: '🔥 浏览量最高' },
          ]}
          value={sortBy}
          onChange={(val) => {
            setSortBy(val);
            setPage(1);
          }}
        />
        <span style={{ color: "#94a3b8", marginLeft: "auto", fontSize: 14 }}>
          共 <strong style={{ color: "#2563eb" }}>{total || 0}</strong> 件商品
        </span>
      </div>

      {list.length === 0 ? (
        <div className="page-card">
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">暂无相关商品</div>
            <div className="empty-desc">换个关键词或分类试试吧~</div>
          </div>
        </div>
      ) : (
        <>
          <div className="goods-grid">
            {list.map((item) => {
              const img = parseImages(item.images)[0];
              return (
                <div
                  key={item.goodsId}
                  className="goods-card"
                  onClick={() => navigate(`/goods/${item.goodsId}`)}
                >
                  {img ? (
                    <img src={img} alt={item.title} />
                  ) : (
                    <div
                      style={{
                        height: 200,
                        background: "linear-gradient(135deg,#f0f9ff,#dbeafe)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 56,
                      }}
                    >
                      📦
                    </div>
                  )}
                  <div className="goods-card-body">
                    <h3>{item.title}</h3>
                    <div className="goods-price">
                      ¥ {Number(item.price || 0).toFixed(2)}
                    </div>
                    <div className="goods-meta">
                      <span>{item.categoryName || "其他"}</span>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <UserOutlined /> {item.sellerNickname || "卖家"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pagination-wrapper">
            <Pagination
              current={page}
              pageSize={size}
              total={total}
              onChange={(p) => {
                setPage(p);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </>
  );
}

function ButtonGhost({ onClick, children }) {
  return (
    <span
      onClick={onClick}
      style={{
        cursor: "pointer",
        color: "#2563eb",
        fontWeight: 600,
        fontSize: 14,
        paddingLeft: 8,
        paddingRight: 4,
      }}
    >
      {children}
    </span>
  );
}
