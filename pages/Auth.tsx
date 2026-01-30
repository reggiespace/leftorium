import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, Chrome, Hand, ShieldCheck } from "lucide-react";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-6 bg-background">
      <Card className="w-full max-w-[480px] rounded-[2.5rem] shadow-2xl overflow-hidden border-4">
        <div className="relative h-48 bg-primary/10 flex flex-col items-center justify-center p-6 overflow-hidden">
           <div className="absolute top-0 left-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
           <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
           
           <div className="size-20 bg-primary rounded-[1.5rem] flex items-center justify-center text-primary-foreground shadow-xl transform -rotate-12 border-4 border-background relative z-10 transition-transform hover:rotate-0 duration-500">
              <Hand className="h-10 w-10 scale-x-[-1]" />
           </div>
           <p className="text-primary font-black text-xs uppercase tracking-[0.3em] mt-6 relative z-10">Lefties Unite!</p>
        </div>

        <CardContent className="p-10 space-y-8">
           <div className="text-center">
              <h1 className="text-3xl font-black tracking-tight italic">{isLogin ? 'Welcome Back' : 'Join the Resistance'}</h1>
              <p className="text-muted-foreground text-sm mt-2 font-medium">The world is right-handed. Your account isn't.</p>
           </div>

           <div className="flex gap-2 bg-muted p-1 rounded-2xl">
             <Button 
               onClick={() => { setIsLogin(true); setError(''); }}
               variant={isLogin ? 'default' : 'ghost'}
               className={`flex-1 rounded-xl h-11 transition-all ${isLogin ? 'shadow-md' : 'text-muted-foreground'}`}
             >
               Login
             </Button>
             <Button 
               onClick={() => { setIsLogin(false); setError(''); }}
               variant={!isLogin ? 'default' : 'ghost'}
               className={`flex-1 rounded-xl h-11 transition-all ${!isLogin ? 'shadow-md' : 'text-muted-foreground'}`}
             >
               Sign Up
             </Button>
           </div>
           
           {error && (
             <div className="p-4 bg-destructive/10 text-destructive rounded-2xl text-sm text-center font-bold border border-destructive/20 animate-in fade-in zoom-in duration-300">
               {error}
             </div>
           )}

           <form className="space-y-4" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="space-y-2">
                  <Input 
                    placeholder="Username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="h-12 rounded-xl bg-muted/50 border-transparent focus:bg-background transition-colors"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Input 
                  type="email" 
                  placeholder="Southpaw Email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 rounded-xl bg-muted/50 border-transparent focus:bg-background transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Input 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 rounded-xl bg-muted/50 border-transparent focus:bg-background transition-colors"
                />
              </div>
              
              <Button size="lg" className="w-full mt-6 h-14 text-lg font-black rounded-2xl shadow-lg shadow-primary/20 group" disabled={isLoading}>
                 {isLoading ? 'Processing...' : (isLogin ? 'Enter the Hub' : 'Create Account')}
                 <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
           </form>

           <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-muted-foreground/10"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-4 text-muted-foreground font-bold tracking-widest">Or continue with</span></div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" type="button" className="rounded-xl h-11 border-2 font-bold transition-all hover:bg-muted/50">
                 <Chrome className="h-4 w-4 mr-2" />
                 Google
              </Button>
              <Button variant="outline" type="button" className="rounded-xl h-11 border-2 font-bold transition-all hover:bg-muted/50">
                 <ShieldCheck className="h-4 w-4 mr-2" />
                 Apple
              </Button>
           </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
