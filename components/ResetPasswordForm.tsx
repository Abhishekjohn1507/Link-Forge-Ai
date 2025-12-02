'use client';



interface ResetPasswordFormProps {
  token: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ResetPasswordForm({ token, onSuccess, onCancel }: ResetPasswordFormProps) {
  // const [newPassword, setNewPassword] = useState('');
  // const [confirmPassword, setConfirmPassword] = useState('');
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState('');
  
  // const { resetPassword } = useAuth();

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   setError('');

  //   if (newPassword !== confirmPassword) {
  //     setError('Passwords do not match');
  //     setIsLoading(false);
  //     return;
  //   }

  //   if (newPassword.length < 6) {
  //     setError('Password must be at least 6 characters long');
  //     setIsLoading(false);
  //     return;
  //   }

  //   try {
  //     await resetPassword(token, newPassword);
  //     onSuccess();
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : 'Password reset failed');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // return (
  //   <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
  //     <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
  //       Reset Your Password
  //     </h2>
      
  //     <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 text-center">
  //       Enter your new password below.
  //     </p>
      
  //     <form onSubmit={handleSubmit} className="space-y-4">
  //       <div>
  //         <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
  //           New Password
  //         </label>
  //         <input
  //           type="password"
  //           id="newPassword"
  //           value={newPassword}
  //           onChange={(e) => setNewPassword(e.target.value)}
  //           className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
  //           required
  //         />
  //       </div>

  //       <div>
  //         <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
  //           Confirm Password
  //         </label>
  //         <input
  //           type="password"
  //           id="confirmPassword"
  //           value={confirmPassword}
  //           onChange={(e) => setConfirmPassword(e.target.value)}
  //           className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
  //           required
  //         />
  //       </div>

  //       {error && (
  //         <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
  //           <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
  //         </div>
  //       )}

  //       <div className="flex space-x-4">
  //         <button
  //           type="button"
  //           onClick={onCancel}
  //           className="w-1/2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
  //         >
  //           Cancel
  //         </button>
  //         <button
  //           type="submit"
  //           disabled={isLoading}
  //           className="w-1/2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
  //         >
  //           {isLoading ? 'Resetting...' : 'Reset Password'}
  //         </button>
  //       </div>
  //     </form>
  //   </div>
  // );
}