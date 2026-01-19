import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import { useAuth } from '../context/AuthContext';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { login, register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(username, email, password);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-6">
      <div className="w-full max-w-[480px] bg-white dark:bg-[#1a2131] rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="relative h-48 bg-gradient-to-br from-primary/20 to-transparent flex flex-col items-center justify-center p-6">
           <div className="size-20 bg-primary rounded-2xl flex items-center justify-center text-white shadow-2xl transform -rotate-6">
              {/* Flipped Hand Icon for Auth Hero */}
              <span className="material-symbols-outlined text-4xl inline-block scale-x-[-1]">front_hand</span>
           </div>
           <p className="text-primary font-bold text-sm uppercase tracking-widest mt-6">Lefties Unite!</p>
        </div>

        <div className="p-10 space-y-8">
           <div className="text-center">
              <h1 className="text-3xl font-black tracking-tight">{isLogin ? 'Welcome Back' : 'Join the Resistance'}</h1>
              <p className="text-slate-500 text-sm mt-2">The world is right-handed. Your account isn't.</p>
           </div>

           <div className="flex gap-2 bg-slate-100 dark:bg-background-dark p-1 rounded-xl">
             <Button 
               onClick={() => { setIsLogin(true); setError(''); }}
               variant={isLogin ? 'primary' : 'ghost'}
               className={`flex-1 ${!isLogin && 'bg-transparent shadow-none text-slate-500'}`}
             >
               Login
             </Button>
             <Button 
               onClick={() => { setIsLogin(false); setError(''); }}
               variant={!isLogin ? 'primary' : 'ghost'}
               className={`flex-1 ${isLogin && 'bg-transparent shadow-none text-slate-500'}`}
             >
               Sign Up
             </Button>
           </div>
           
           {error && (
             <div className="p-3 bg-red-100 text-red-600 rounded-lg text-sm text-center font-medium">
               {error}
             </div>
           )}

           <form className="space-y-4" onSubmit={handleSubmit}>
              {!isLogin && (
                <Input 
                  placeholder="Username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              )}
              <Input 
                type="email" 
                placeholder="Southpaw Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              
              <Button fullWidth className="mt-6 h-14 text-lg" disabled={isLoading}>
                 {isLoading ? 'Processing...' : (isLogin ? 'Enter the Hub' : 'Create Account')}
              </Button>
           </form>

           <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-[#1a2131] px-2 text-slate-400">Or continue with</span></div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" type="button" className="text-sm">
                 <img src="https://www.google.com/favicon.ico" className="w-4 h-4 mr-2" alt="G" />
                 Google
              </Button>
              <Button variant="outline" type="button" className="text-sm">
                 <span className="material-symbols-outlined text-sm mr-2">apple</span>
                 Apple
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
