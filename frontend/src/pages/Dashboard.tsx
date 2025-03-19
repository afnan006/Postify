import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePostsStore, useAuthStore } from '../lib/store';
import { PostCard } from '../components/PostCard';
import { PostForm } from '../components/PostForm';
import { Pagination } from '../components/Pagination';
import { type PostInput } from '../lib/validations';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { LogOut, Plus } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export function Dashboard() {
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();
  const {
    posts,
    totalPages,
    currentPage,
    setPosts,
    setCurrentPage,
    addPost,
    updatePost,
    deletePost,
  } = usePostsStore();
  const [isCreating, setIsCreating] = useState(false);
  const [editingPost, setEditingPost] = useState<{
    id: string;
    title: string;
    content: string;
  } | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  const fetchPosts = async () => {
    try {
      const response = await api.get(`/posts?page=${currentPage}&limit=10`);
      setPosts(response.data.posts, response.data.total_pages);
    } catch (error) {
      toast.error('Failed to fetch posts');
    }
  };

  const handleCreate = async (data: PostInput) => {
    try {
      const response = await api.post('/posts', data);
      addPost(response.data);
      setIsCreating(false);
      toast.success('Post created successfully');
    } catch (error) {
      toast.error('Failed to create post');
    }
  };

  const handleUpdate = async (data: PostInput) => {
    if (!editingPost) return;
    try {
      const response = await api.put(`/posts/${editingPost.id}`, data);
      updatePost(response.data);
      setEditingPost(null);
      toast.success('Post updated successfully');
    } catch (error) {
      toast.error('Failed to update post');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/posts/${id}`);
      deletePost(id);
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
      <div className="max-w-4xl mx-auto p-4">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-purple-900 dark:text-purple-100">
            Postify
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus size={20} />
              New Post
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {(isCreating || editingPost) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <PostForm
                onSubmit={editingPost ? handleUpdate : handleCreate}
                onCancel={() => {
                  setIsCreating(false);
                  setEditingPost(null);
                }}
                initialData={editingPost || undefined}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-6">
          <AnimatePresence>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onEdit={() =>
                  setEditingPost({
                    id: post.id,
                    title: post.title,
                    content: post.content,
                  })
                }
                onDelete={() => handleDelete(post.id)}
              />
            ))}
          </AnimatePresence>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}