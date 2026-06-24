import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, message, Empty } from "antd";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { getFavorites, getAuth, parseImages } from "../api";

export default function MyFavorites() {
  const navigate = useNavigate();
  const { token } = getAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (token) {
      getFavorites()
        .then(res => setFavorites(Array.isArray(res) ? res : []))
        .catch(() => setFavorites([]));
    }
  }, [token]);

  const goToDetail = (goodsId) => {
    navigate(`/goods/${goodsId}`);
  };

  const goToHome = () => {
    navigate("/");
  };

  return (
    <div className="page-card">
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: "#0f172a",
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <HeartOutlined style={{ color: "#ef4444" }} />
        我的收藏
      </div>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">❤️</div>
          <div className="empty-title">暂无收藏</div>
          <div className="empty-desc">快去发现心仪的商品吧</div>
          <Button type="primary" icon={<ShoppingCartOutlined />} onClick={goToHome}>
            去逛逛
          </Button>
        </div>
      ) : (
        <div className="goods-grid">
          {favorites.map((item) => {
            const images = parseImages(item.goodsImages);
            return (
              <div
                key={item.id}
                className="goods-card"
                onClick={() => goToDetail(item.goodsId)}
              >
                <div className="goods-image">
                  <img src={images[0]} alt={item.goodsTitle} />
                  <div className="goods-fav-badge">❤️</div>
                </div>
                <div className="goods-info">
                  <div className="goods-title">{item.goodsTitle}</div>
                  <div className="goods-price">¥ {Number(item.goodsPrice || 0).toFixed(2)}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
