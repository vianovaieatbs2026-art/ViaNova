export type UserType = 'conductor' | 'aspirante' | 'estudiante' | 'ciudadano';

export type ScreenId = 
  | 'landing'
  | 'inicio'
  | 'servicios'
  | 'storyboard'
  | 'busqueda'
  | 'educacion_vial'
  | 'senales'
  | 'quiz'
  | 'simulador'
  | 'reportes'
  | 'perfil'
  | 'registro'
  | 'login';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  userType: UserType;
  avatarUrl?: string;
  safetyScore: number;
  completedHours: number;
  passedExams: number;
  activeReports: number;
  gamificationPoints?: number;
  licenseNumber?: string;
  licenseCategory?: string;
  city?: string;
  phone?: string;
  primer_ingreso?: boolean;
  emailVerified?: boolean;
  termsAccepted?: boolean;
}

export interface RoadSafetyCampaign {
  id: string;
  title: string;
  slogan: string;
  targetAudience: string;
  description: string;
  legalContext: string;
  tips: string[];
  bannerBg: string;
  badge: string;
}

export interface SafetyResource {
  id: string;
  title: string;
  type: 'manual' | 'ley' | 'guia' | 'infografia' | 'formato';
  format: 'PDF' | 'DOC' | 'INTERACTIVO';
  fileSize?: string;
  description: string;
  author: string;
  downloadUrl?: string;
  category: string;
}

export interface SearchResultItem {
  id: string;
  title: string;
  categoryType: 'educacion' | 'senales' | 'campanas' | 'recursos' | 'evaluacion' | 'reportes';
  categoryLabel: string;
  subtitle: string;
  description: string;
  tags: string[];
  badgeColor?: string;
  targetScreen?: ScreenId;
  metadata?: string;
}

export interface TrafficSign {
  id: string;
  code: string; // Official Colombian code e.g. SR-01, SP-33, SI-01, ST-01
  name: string;
  category: 'reglamentaria' | 'preventiva' | 'informativa' | 'transitoria';
  description: string;
  meaning: string;
  colombianNorm?: string;
  finePenalty?: string; // Colombian infracción code e.g. Infracción C.02, C.29
  shape: 'circle' | 'diamond' | 'rectangle' | 'octagon' | 'triangle';
  bgHex: string;
  borderHex: string;
  iconName: string;
}

export interface ExamQuestion {
  id: number;
  category: string;
  licenseCategory?: 'A2' | 'B1' | 'C1' | 'todas';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  legalReference?: string;
  signCode?: string;
  signType?: string;
  signHint?: string;
}

export interface QuizTopic {
  id: string;
  title: string;
  description: string;
  icon: string;
  questionCount: number;
  durationMinutes: number;
  questions: ExamQuestion[];
}

export interface EducationModule {
  id: string;
  title: string;
  subtitle: string;
  readTime: string;
  icon: string;
  summary: string;
  legalBasis: string;
  contentSections: {
    heading: string;
    body: string;
    keyPoints?: string[];
  }[];
}

export interface RoadIncident {
  id: string;
  title: string;
  category: 'bache' | 'semaforo' | 'bloqueo' | 'obras' | 'accidente' | 'senal_caida';
  location: string;
  city: string;
  lat?: number;
  lng?: number;
  description: string;
  severity: 'baja' | 'media' | 'alta' | 'critica';
  status: 'reportado' | 'en_proceso' | 'resuelto';
  reportedAt: string;
  authorName: string;
  upvotes: number;
}
