// components/AuthCard.tsx
"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { sendPasswordResetEmail } from "firebase/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Mail, Lock, User, HeartPulse, Loader2, Github } from "lucide-react"
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  GithubAuthProvider // Import GithubAuthProvider
} from "firebase/auth"
import { auth } from "@/lib/firebase"

// A simple SVG for the Google icon
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg role="img" viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.9-5.63 1.9-4.74 0-8.58-3.87-8.58-8.58s3.84-8.58 8.58-8.58c2.69 0 4.38.98 5.39 1.98l2.6-2.6C19.97 3.91 16.4 2 12.48 2 5.88 2 1 7.42 1 13.91s4.88 11.91 11.48 11.91c6.48 0 11.02-4.34 11.02-11.02 0-.74-.07-1.42-.2-2.06H12.48z"
    ></path>
  </svg>
)

export default function AuthCard() {
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Separate state for login and register forms
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleStateReset = () => {
    setError(null);
  };
  
  // Generic handler for different providers
  const handleSocialSignIn = async (provider: GoogleAuthProvider | GithubAuthProvider) => {
    setIsLoading(true);
    handleStateReset();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
       setError(err.message.replace('Firebase: ', ''));
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleGoogleSignIn = () => handleSocialSignIn(new GoogleAuthProvider());
  const handleGithubSignIn = () => handleSocialSignIn(new GithubAuthProvider());


  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      setError("Please fill in both email and password.");
      return;
    }
    setIsLoading(true);
    handleStateReset();
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setIsLoading(false);
    }
  };
  const handleForgotPassword = async () => {
  if (!loginEmail) {
    setError("Please enter your email to reset password.");
    return;
  }

  setIsLoading(true);
  handleStateReset();
  try {
    await sendPasswordResetEmail(auth, loginEmail);
    alert("Password reset email sent! Check your inbox.");
  } catch (err: any) {
    setError(err.message.replace("Firebase: ", ""));
  } finally {
    setIsLoading(false);
  }
};


  const handleRegister = async () => {
    if (!registerName || !registerEmail || !registerPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (registerPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    handleStateReset();
    try {
      await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-card shadow-lg border-none animate-in fade-in-0 zoom-in-95">
      <CardHeader className="text-center space-y-2">
       <div className="flex justify-center">
            <img src="/logo.png" alt="MedIoT Logo" className="w-32 h-32 mix-blend-multiply" />
       </div>

        <CardDescription>Securely access your health and device data</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" className="w-full" onValueChange={(value) => { setActiveTab(value); handleStateReset(); }}>
          <TabsList className="grid grid-cols-2 w-full bg-muted">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          {/* LOGIN TAB */}
          <TabsContent value="login" className="space-y-4 pt-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input type="email" placeholder="email@example.com" className="pl-10" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} disabled={isLoading} />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input type="password" placeholder="Password" className="pl-10" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} disabled={isLoading} />
            </div>
             <div className="flex items-center justify-end -mt-2">
                <Button 
  variant="link" 
  size="sm" 
  className="h-auto p-0 text-primary"
  onClick={handleForgotPassword}
  disabled={isLoading}
>
  Forgot Password?
</Button>

            </div>
            {error && activeTab === 'login' && <p className="text-sm text-center text-destructive">{error}</p>}
            <Button className="w-full font-semibold" onClick={handleLogin} disabled={isLoading}>
              {isLoading && activeTab === 'login' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
          </TabsContent>

          {/* REGISTER TAB */}
          <TabsContent value="register" className="space-y-4 pt-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Full Name" className="pl-10" value={registerName} onChange={(e) => setRegisterName(e.target.value)} disabled={isLoading} />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input type="email" placeholder="email@example.com" className="pl-10" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} disabled={isLoading} />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input type="password" placeholder="Password" className="pl-10" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} disabled={isLoading} />
            </div>
             <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input type="password" placeholder="Confirm Password" className="pl-10" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} />
            </div>
            {error && activeTab === 'register' && <p className="text-sm text-center text-destructive">{error}</p>}
            <Button className="w-full font-semibold" onClick={handleRegister} disabled={isLoading}>
              {isLoading && activeTab === 'register' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </TabsContent>
        </Tabs>

        {/* --- OR --- Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        {/* Social Logins */}
        <div className="space-y-2">
            <Button variant="outline" className="w-full font-semibold" onClick={handleGoogleSignIn} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-4 w-4" />}
                Google
            </Button>
             <Button variant="outline" className="w-full font-semibold" onClick={handleGithubSignIn} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Github className="mr-2 h-4 w-4" />}
                GitHub
            </Button>
        </div>
      </CardContent>
    </Card>
  )
}