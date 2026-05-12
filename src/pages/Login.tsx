import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-pine animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Access Granted', {
          description: 'Welcome back to the Admin Panel'
        });
        navigate('/admin');
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pine/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky/10 rounded-full blur-[120px] animate-pulse delay-700" />
      
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <Card className="w-full max-w-md bg-neutral-900/40 border-neutral-800/50 backdrop-blur-2xl shadow-2xl relative z-10 overflow-hidden transform transition-all duration-500 hover:shadow-pine/5">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-pine to-transparent opacity-50" />
        
        <CardHeader className="space-y-4 pt-8 text-center">
          <div className="mx-auto w-16 h-16 bg-pine/10 rounded-2xl flex items-center justify-center border border-pine/20 group hover:scale-110 transition-transform duration-300">
            <ShieldCheck className="w-8 h-8 text-pine group-hover:rotate-12 transition-transform" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold tracking-tight text-white">Baguio Kiosk</CardTitle>
            <CardDescription className="text-neutral-400 text-base">
              Administrator Login
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-2">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-neutral-300 ml-1">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-neutral-500 group-focus-within:text-pine transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@baguio.gov.ph"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-neutral-800/50 border-neutral-700/50 text-white placeholder:text-neutral-600 focus:ring-pine/50 focus:border-pine/50 h-11 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <Label htmlFor="password" text-neutral-300>Password</Label>
                <button type="button" className="text-xs text-pine hover:text-pine-light transition-colors">
                  Forgot?
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-neutral-500 group-focus-within:text-pine transition-colors" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-neutral-800/50 border-neutral-700/50 text-white placeholder:text-neutral-600 focus:ring-pine/50 focus:border-pine/50 h-11 transition-all"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-pine hover:bg-pine-light text-white font-semibold h-12 transition-all duration-300 transform active:scale-95 group shadow-lg shadow-pine/20"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Authorize Access <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="pb-8 pt-2 flex flex-col gap-4">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent px-2 text-neutral-500">Security Encrypted</span>
            </div>
          </div>
          <p className="text-xs text-center text-neutral-600">
            Unauthorized access attempts are logged and monitored.
          </p>
        </CardFooter>
      </Card>
      
      {/* Bottom Footer Info */}
      <div className="absolute bottom-8 left-0 w-full text-center">
        <p className="text-neutral-600 text-xs font-medium tracking-widest uppercase">
          &copy; 2026 Baguio City Information Office
        </p>
      </div>
    </div>
  );
};

export default Login;
