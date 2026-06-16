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
