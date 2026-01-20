import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFeaturedNewsBySlug } from "../services/featuredNewService";

const FeaturedNewsDetail = () => {
  const { slug } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await getFeaturedNewsBySlug(slug);
        setNews(res);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p>Đang tải bài viết...</p>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p>Không tìm thấy bài viết.</p>
      </div>
    );
  }

  return (
    <section className="bg-[#FFF8F2] py-10">
      <div className="max-w-4xl mx-auto px-4 bg-white rounded shadow">
        {/* Thumbnail */}
        {news.thumbnail && (
          <img
            src={news.thumbnail}
            alt={news.title}
            className="w-full h-80 object-cover rounded-t"
          />
        )}

        <div className="p-6">
          {/* Title */}
          <h1 className="text-3xl font-bold text-green-800 mb-4">
            {news.title}
          </h1>

          {/* Date */}
          {news.created_at && (
            <p className="text-sm text-gray-500 mb-6">
              Ngày đăng:{" "}
              {new Date(news.created_at).toLocaleDateString()}
            </p>
          )}

          {/* Content */}
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: news.recipe_content,
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturedNewsDetail;
