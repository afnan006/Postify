import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  setAuth: (userId: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem('accessToken'),
  userId: null,
  setAuth: (userId) => set({ isAuthenticated: true, userId }),
  clearAuth: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ isAuthenticated: false, userId: null });
  },
}));

interface Post {
  id: string;
  title: string;
  content: string;
  user_id: string;
}

interface PostsState {
  posts: Post[];
  totalPages: number;
  currentPage: number;
  setPosts: (posts: Post[], totalPages: number) => void;
  setCurrentPage: (page: number) => void;
  addPost: (post: Post) => void;
  updatePost: (post: Post) => void;
  deletePost: (id: string) => void;
}

export const usePostsStore = create<PostsState>((set) => ({
  posts: [],
  totalPages: 1,
  currentPage: 1,
  setPosts: (posts, totalPages) => set({ posts, totalPages }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  updatePost: (post) => set((state) => ({
    posts: state.posts.map((p) => (p.id === post.id ? post : p)),
  })),
  deletePost: (id) => set((state) => ({
    posts: state.posts.filter((p) => p.id !== id),
  })),
}));