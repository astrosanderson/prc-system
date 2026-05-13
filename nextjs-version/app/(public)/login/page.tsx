'use client';

import { useRouter } from 'next/navigation';
import { useSession } from '@/context/SessionContext';

export default function LoginPage() {
  const { setSession } = useSession();
  const router = useRouter();

  function handleLogin(role: 'member' | 'admin') {
    if (role === 'member') {
      setSession({
        userId: 'u9',
        role: 'member',
        academyId: '8',
        academyName: 'North Star Elite',
        displayName: 'Sarah Munthali',
      });
      router.push('/dashboard');
    } else {
      setSession({
        userId: 'u1',
        role: 'admin',
        academyId: '',
        academyName: '',
        displayName: 'Admin John',
      });
      router.push('/admin/dashboard');
    }
  }

  return (
    <main className="container hero-container">
      <div className="row w-100 align-items-center">

        {/* Left */}
        <div className="col-lg-6 mb-5 mb-lg-0">
          <span className="portal-label">Academy Portal</span>
          <h1 className="welcome-title">
            WELCOME<br />
            <span>BACK</span>
          </h1>
          <p className="hero-description">
            Access the elite performance ecosystem.
          </p>
          <div className="performance-card">
            <h5>Elite Performance Journal</h5>
            <p>Digital Archive of Excellence</p>
          </div>
        </div>

        {/* Right — login cards */}
        <div className="col-lg-6">
          <div className="login-cards-wrapper">

            <div className="login-card card-member">
              <div className="icon-box">
                <span className="material-symbols-outlined" style={{ fontSize: '1.8rem' }}>school</span>
              </div>
              <h2 className="card-title">Member Sign In</h2>
              <p className="card-subtitle">Academy Representative Access</p>
              <button className="google-btn" onClick={() => handleLogin('member')}>
                <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" />
                Sign in with Google
              </button>
            </div>

            <div className="login-card card-admin">
              <div className="icon-box">
                <span className="material-symbols-outlined" style={{ fontSize: '1.8rem' }}>admin_panel_settings</span>
              </div>
              <h2 className="card-title">Admin Sign In</h2>
              <p className="card-subtitle">League Officials &amp; PRC Admin</p>
              <button className="google-btn" onClick={() => handleLogin('admin')}>
                <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" />
                Admin Google Login
              </button>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
