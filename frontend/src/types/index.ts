export interface User {
  id: number
  dni: number
  name: string
  email: string
  role: string
  status: boolean
  createdAt: string
  createdBy: number | null
  updatedAt: string
  updatedBy: number | null
  totalPoints: number
  exactPredictions: number
  correctOutcomes: number
  totalPredictions: number
}

export interface CreateUserDto {
  dni: number
  name: string
  email: string
  password: string
}

export interface UpdateUserDto {
  name?: string
  email?: string
  password?: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  user: User
}

export interface MonthlyPeriod {
  id: number
  year: number
  month: number
  isClosed: boolean
  status: boolean
  createdAt: string
  createdBy: number | null
  updatedAt: string
  updatedBy: number | null
}

export interface CreatePeriodDto {
  year: number
  month: number
}

export interface ExpenseCategory {
  id: number
  name: string
  key: string
  isCash: boolean
  description: string | null
  status: boolean
  createdAt: string
}

export interface MonthlyExpense {
  id: number
  periodId: number
  categoryId: number
  amount: number
  paidByUserId: number | null
  paidByUser?: User
  category?: ExpenseCategory
  period?: MonthlyPeriod
  notes: string | null
  status: boolean
  createdAt: string
  createdBy: number | null
}

export interface CreateExpenseDto {
  periodId: number
  categoryId: number
  amount: number
  paidByUserId?: number
  notes?: string
}

export interface ExpensePayment {
  id: number
  periodId: number
  userId: number
  categoryId: number
  amount: number
  user?: User
  category?: ExpenseCategory
  period?: MonthlyPeriod
  status: boolean
  createdAt: string
  createdBy: number | null
}

export interface CreatePaymentDto {
  periodId: number
  userId: number
  categoryId: number
  amount: number
}

export interface CashContribution {
  id: number
  periodId: number
  userId: number
  amount: number
  user?: User
  period?: MonthlyPeriod
  status: boolean
  createdAt: string
  createdBy: number | null
}

export interface CreateContributionDto {
  periodId: number
  userId: number
  amount: number
}

export interface AuditLog {
  id: number
  tableName: string
  recordId: number
  action: string
  oldValues: Record<string, unknown> | null
  newValues: Record<string, unknown> | null
  userId: number | null
  createdAt: string
}

export interface CategoryDetail {
  categoryName: string
  amount: number
}

export interface UserSummary {
  userId: number
  userName: string
  sharePerUser: number
  amountAlreadyPaid: number
  cashToPay: number
}

export interface MonthlySummary {
  periodId: number
  month: number
  year: number
  totalExpenses: number
  activeUsers: number
  sharePerUser: number
  rentAmount: number
  categoryDetails: CategoryDetail[]
  userSummaries: UserSummary[]
}

export interface CategoryHistoryItem {
  categoryName: string
  categoryCode: string
  history: { period: string; amount: number }[]
}

export interface UserPaymentHistory {
  userId: number
  userName: string
  payments: { period: string; category: string; amount: number; paymentDate: string }[]
  totalPaid: number
}

export interface Comparison {
  currentPeriod: MonthlySummary
  previousPeriod: MonthlySummary
  percentageChange: number
}

export interface TrendData {
  period: string
  totalExpenses: number
  rent: number
  gas: number
  waterElectricity: number
  limsa: number
  buildingFees: number
}

export interface TrendResponse {
  data: TrendData[]
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
}

export interface Team {
  id: number
  name: string
  code: string
  country: string
  flagUrl: string | null
  logoUrl: string | null
  group: string | null
}

export interface Tournament {
  id: number
  name: string
  season: string
  startDate: string
  endDate: string | null
}

export interface Match {
  id: number
  tournamentId: number
  homeTeamId: number
  awayTeamId: number
  homeTeam: Team
  awayTeam: Team
  tournament: Tournament
  matchDate: string
  matchStatus: 'scheduled' | 'in_play' | 'finished' | 'postponed' | 'cancelled'
  stage: string
  homeScore: number | null
  awayScore: number | null
  matchday: number | null
  status: boolean
}

export interface Prediction {
  id: number
  userId: number
  matchId: number
  user: User
  match: Match
  homeScore: number
  awayScore: number
  points: number
  isExact: boolean
  isCorrectOutcome: boolean
  isScored: boolean
  createdAt: string
  updatedAt: string
}

export interface CreatePredictionDto {
  matchId: number
  homeScore: number
  awayScore: number
}

export interface RankingEntry {
  position: number
  id: number
  username: string
  name: string
  totalPoints: number
  exactPredictions: number
  correctOutcomes: number
  totalPredictions: number
}

export interface GroupStanding {
  group: string
  teams: GroupStandingTeam[]
}

export interface GroupStandingTeam {
  teamId: number
  teamName: string
  flagUrl: string | null
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
}

export interface KnockoutTemplate {
  key: number
  name: string
  home: string
  away: string
  stage: string
  defaultDate: string
}

export interface BulkMatchInput {
  homeTeamId: number
  awayTeamId: number
  matchDate: string
  stage: string
  matchday?: number
  homeScore?: number | null
  awayScore?: number | null
}
