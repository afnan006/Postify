import { motion } from 'framer-motion';
import { Edit2, Trash2 } from 'lucide-react';
import { useAuthStore } from '../lib/store';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    user_id: string;
  };
  onEdit: () => void;
  onDelete: () => void;
}

export function PostCard({ post, onEdit, onDelete }: PostCardProps) {
  const { userId } = useAuthStore();
  const isOwner = userId === post.user_id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 backdrop-blur-xl rounded-xl p-6 shadow-lg"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100">
          {post.title}
        </h3>
        {isOwner && (
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="p-2 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 transition-colors"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>
      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
        {post.content}
      </p>
    </motion.div>
  );
}