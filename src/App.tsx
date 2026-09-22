/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ScreenId, UserProfile } from './types';
import { Navigation } from './components/Navigation';
import { AuthGatewayScreen } from './components/AuthGatewayScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { SearchScreen } from './components/SearchScreen';
import { EducationScreen } from './components/EducationScreen';
import { ExamSimulatorScreen } from './components/ExamSimulatorScreen';
import { TrafficSignsScreen } from './components/TrafficSignsScreen';
import { QuizScreen } from './components/QuizScreen';
import { MobilityReportsScreen } from './components/MobilityReportsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { Footer } from './components/Footer';
import { DeleteAccountModal } from './components/DeleteAccountModal';
import { PasswordResetModal } from './components/PasswordResetModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { CheckCircle2 } from 'lucide-react';
import { ThemeLanguageProvider, useThemeLanguage } from './context/ThemeLanguageContext';
import { 
  getActiveUserSession, 
  setActiveUserSession, 
  clearActiveUserSession 
} from './utils/authStorage';

function AppContent() {
  // Always start disconnected (not connected to any account) on page load
  const [user, setUser] = useState<UserProfile | null>(null);
  
  // Unauthenticated view state: 'landing' (default Hero/Portada), 'login', or 'registro'
  const [unauthView, setUnauthView] = useState<'landing' | 'login' | 'registro'>('landing');
  
  // Authenticated screen state
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('inicio');

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [authNoticeMessage, setAuthNoticeMessage] = useState<string>('');

  // Password reset recovery state (from email link or manual input)
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [resetPasswordCode, setResetPasswordCode] = useState('');
  const [prefillLoginEmail, setPrefillLoginEmail] = useState('');

  const { t } = useThemeLanguage();

  // Restore active user session only if the user previously logged in on this device
  useEffect(() => {
    const saved = getActiveUserSession();
    if (saved) {
      setUser(saved);
      setCurrentScreen('inicio');
    }
  }, []);

  // Detect email recovery link parameters (?mode=resetPassword&oobCode=...) on load
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const parseParams = () => {
      const searchParams = new URLSearchParams(window.location.search);
      let mode = searchParams.get('mode');
      let oobCode = searchParams.get('oobCode');

      // Check hash if params are in hash format (#/?mode=... or similar)
      if ((!mode || !oobCode) && window.location.hash.includes('?')) {
        const hashQuery = window.location.hash.substring(window.location.hash.indexOf('?'));
        const hashParams = new URLSearchParams(hashQuery);
        if (!mode) mode = hashParams.get('mode');
        if (!oobCode) oobCode = hashParams.get('oobCode');
      }

      // Check entire URL as fallback
      if (!oobCode && window.location.href.includes('oobCode=')) {
        const match = window.location.href.match(/[?&]oobCode=([^&#]+)/);
        if (match && match[1]) {
          oobCode = decodeURIComponent(match[1]);
        }
      }

      return { mode, oobCode };
    };

    const { mode, oobCode } = parseParams();

    if (oobCode && (!mode || mode === 'resetPassword' || mode === 'signIn')) {
      setResetPasswordCode(oobCode);
      setIsResetPasswordModalOpen(true);
      setUnauthView('login');
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Called when user registers: activates session immediately
  const handleRegisterSuccess = (newUser: UserProfile) => {
    setActiveUserSession(newUser);
    setUser(newUser);
    setCurrentScreen('inicio');
    showToast(`${t('toast_welcome_prefix', '¡Bienvenido a ViaNova,')} ${newUser.name}!`);
  };

  // Called from Login: direct entry to dashboard
  const handleLoginSuccess = (loggedUser: UserProfile) => {
    setAuthNoticeMessage('');
    setActiveUserSession(loggedUser);
    setUser(loggedUser);
    setCurrentScreen('inicio');
    showToast(`${t('toast_login_success', '¡Sesión iniciada con éxito! Bienvenido,')} ${loggedUser.name}.`);
  };

  const handleLogout = () => {
    clearActiveUserSession();
    setUser(null);
    setUnauthView('login');
    setCurrentScreen('inicio');
    showToast(t('toast_logged_out', 'Has cerrado sesión correctamente.'));
  };

  const handleExamCompleted = (score: number) => {
    if (user) {
      const updatedUser: UserProfile = {
        ...user,
        safetyScore: Math.min(100, Math.round((user.safetyScore + score) / 2)),
        passedExams: user.passedExams + (score >= 75 ? 1 : 0),
        completedHours: user.completedHours + 1
      };
      setActiveUserSession(updatedUser);
      setUser(updatedUser);
    }
  };

  const handleUpdateUser = (updated: UserProfile) => {
    setActiveUserSession(updated);
    setUser(updated);
  };

  // Safe navigation handler
  const handleNavigate = (screen: ScreenId) => {
    if (!user) {
      if (screen === 'registro') {
        setUnauthView('registro');
      } else {
        setUnauthView('login');
      }
      return;
    }

    if (screen === 'servicios') {
      setCurrentScreen('inicio');
      setTimeout(() => {
        document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }

    if (screen === 'storyboard') {
      setCurrentScreen('inicio');
      setTimeout(() => {
        document.getElementById('storyboard')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }

    setCurrentScreen(screen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#0b1120] text-[#0f172a] dark:text-slate-100 transition-colors duration-200">
      {/* Top Header Navigation */}
      <Navigation
        currentScreen={!user ? 'landing' : currentScreen}
        onNavigate={handleNavigate}
        user={user}
        onLogout={handleLogout}
        onOpenDeleteAccountModal={() => setIsDeleteModalOpen(true)}
      />

      {/* Main Content Area: STRICT AUTH GATE */}
      <main className="flex-1 flex flex-col justify-start">
        {!user ? (
          /* ================= ESTADO 1: PANTALLA INICIAL (SOLO AUTENTICACIÓN: [INICIAR SESIÓN] / [CREAR CUENTA]) ================= */
          <AuthGatewayScreen
            onAuthSuccess={handleLoginSuccess}
            initialTab={unauthView === 'registro' ? 'register' : 'login'}
            initialEmail={prefillLoginEmail}
            initialMessage={authNoticeMessage}
            onOpenResetCodeModal={(code) => {
              setResetPasswordCode(code || '');
              setIsResetPasswordModalOpen(true);
            }}
          />
        ) : (
          /* ================= ESTADO 2: DENTRO DE LA APP (USUARIO AUTENTICADO) ================= */
          <ErrorBoundary onReset={() => setCurrentScreen('inicio')}>
            {currentScreen === 'inicio' && (
              <DashboardScreen
                user={user}
                onNavigate={setCurrentScreen}
              />
            )}

            {currentScreen === 'busqueda' && (
              <SearchScreen
                onNavigate={setCurrentScreen}
              />
            )}

            {currentScreen === 'educacion_vial' && (
              <EducationScreen
                user={user}
                onNavigateToQuiz={() => setCurrentScreen('quiz')}
                onNavigateToSimulator={() => setCurrentScreen('simulador')}
              />
            )}

            {currentScreen === 'senales' && (
              <TrafficSignsScreen
                onBackToDashboard={() => setCurrentScreen('inicio')}
              />
            )}

            {currentScreen === 'quiz' && (
              <QuizScreen
                user={user}
                onNavigateToEducation={() => setCurrentScreen('educacion_vial')}
                onNavigateToSimulator={() => setCurrentScreen('simulador')}
              />
            )}

            {currentScreen === 'simulador' && (
              <ExamSimulatorScreen
                user={user}
                onBackToDashboard={() => setCurrentScreen('inicio')}
                onExamCompleted={handleExamCompleted}
              />
            )}

            {currentScreen === 'reportes' && (
              <MobilityReportsScreen
                user={user}
                onBackToDashboard={() => setCurrentScreen('inicio')}
                onNavigateToAuth={(m) => {
                  if (m === 'login' || m === 'registro') setUnauthView(m);
                }}
                onUpdateUser={handleUpdateUser}
              />
            )}

            {currentScreen === 'perfil' && (
              <ProfileScreen
                user={user}
                onBackToDashboard={() => setCurrentScreen('inicio')}
                onNavigateToAuth={(m) => {
                  if (m === 'login' || m === 'registro') setUnauthView(m);
                }}
                onLogout={handleLogout}
                onUpdateUser={handleUpdateUser}
                onDeleteAccountRequested={() => setIsDeleteModalOpen(true)}
              />
            )}
          </ErrorBoundary>
        )}
      </main>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0f172a] dark:bg-slate-800 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-fade-in border border-[#334155] dark:border-slate-700">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Permanent Account Deletion Modal */}
      {user && (
        <DeleteAccountModal
          isOpen={isDeleteModalOpen}
          userId={user.id}
          userEmail={user.email}
          onClose={() => setIsDeleteModalOpen(false)}
          onSuccess={() => {
            setIsDeleteModalOpen(false);
            setUser(null);
            clearActiveUserSession();
            setUnauthView('login');
            setAuthNoticeMessage('');
          }}
        />
      )}

      {/* Password Reset Recovery Modal (handles URL link from email and direct code/link pasting) */}
      <PasswordResetModal
        isOpen={isResetPasswordModalOpen}
        initialCode={resetPasswordCode}
        onClose={() => {
          setIsResetPasswordModalOpen(false);
          setResetPasswordCode('');
        }}
        onSuccessLogin={(email) => {
          setIsResetPasswordModalOpen(false);
          setResetPasswordCode('');
          setPrefillLoginEmail(email);
          setUnauthView('login');
          showToast('¡Contraseña restablecida! Inicia sesión con tus nuevas credenciales.');
        }}
        onRequestNewLink={() => {
          setIsResetPasswordModalOpen(false);
          setResetPasswordCode('');
          setUnauthView('login');
        }}
      />

      {/* Institutional Footer with Dark/Light Mode Switch & Language */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeLanguageProvider>
      <AppContent />
    </ThemeLanguageProvider>
  );
}
