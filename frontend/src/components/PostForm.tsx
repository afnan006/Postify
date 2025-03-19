import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postSchema, type PostInput } from '../lib/validations';
import { X } from 'lucide-react';

interface PostFormProps {
  onSubmit: (data: PostInput) => void;
  onCancel: () => void;
  initialData?: PostInput;
}

export function PostForm({ onSubmit, onCancel, initialData }: PostFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-100">
          {initialData ? 'Edit Post' : 'Create Post'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <X size={24} />
        </button>
      </div>
      <div>
        <input
          {...register('title')}
          placeholder="Title"
          className="w-full px-4 py-2 rounded-lg border border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>
      <div>
        <textarea
          {...register('content')}
          placeholder="Write your post..."
          rows={5}
          className="w-full px-4 py-2 rounded-lg border border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}