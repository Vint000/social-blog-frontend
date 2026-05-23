import { Link } from 'react-router-dom';

function PostCard({ post }) {
  const preview = post.content?.length > 120
    ? post.content.slice(0, 120) + '...'
    : post.content;

  const dataFormatada = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('pt-BR')
    : '';

  return (
    <Link
      to={`/posts/${post.id}`}
      className="block bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 hover:border-blue-400 hover:shadow-md transition"
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
        {post.title}
      </h2>
      <p className="text-sm text-gray-500 mb-2">
        {post.author} · {dataFormatada}
      </p>
      <p className="text-gray-600 text-sm leading-relaxed">
        {preview}
      </p>
    </Link>
  );
}

export default PostCard;
