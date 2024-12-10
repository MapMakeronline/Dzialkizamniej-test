import { useCallback } from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuthStore } from '../../store/authStore';
import { GOOGLE_CLIENT_ID } from '../../config/auth';
import { LogIn } from 'lucide-react';

export const GoogleAuth = () => {
  const { setUser, logout, user, displayName } = useAuthStore();

  const handleSuccess = useCallback(async (credentialResponse: any) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      setUser(decoded);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  }, [setUser]);

  return (
    <div className="fixed top-2 right-4 z-[1005] flex items-center gap-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg">
      {!user ? (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sign in with Google</span>
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => console.error('Login Failed')}
              theme="outline"
              shape="rectangular"
              size="medium"
              text="signin"
            />
          </GoogleOAuthProvider>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {user.photoURL && (
              <img 
                src={user.photoURL} 
                alt="Profile" 
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="text-sm text-gray-600">{displayName}</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogIn className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};