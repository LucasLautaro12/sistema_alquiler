import { api } from './client'
import type {
  User, CreateUserDto, UpdateUserDto,
  LoginDto, LoginResponse,
  MonthlyPeriod, CreatePeriodDto,
  ExpenseCategory,
  MonthlyExpense, CreateExpenseDto,
  ExpensePayment, CreatePaymentDto,
  CashContribution, CreateContributionDto,
  AuditLog, PaginatedResponse,
  MonthlySummary, CategoryHistoryItem, UserPaymentHistory, Comparison, TrendResponse,
} from '../types'

export const auth = {
  login: (dto: LoginDto) => api.post<LoginResponse>('/auth/login', dto),
}

export const users = {
  list: () => api.get<User[]>('/users'),
  get: (id: number) => api.get<User>(`/users/${id}`),
  create: (dto: CreateUserDto) => api.post<User>('/users', dto),
  update: (id: number, dto: UpdateUserDto) => api.patch<User>(`/users/${id}`, dto),
  delete: (id: number) => api.delete<void>(`/users/${id}`),
}

export const periods = {
  list: () => api.get<MonthlyPeriod[]>('/monthly-periods'),
  get: (id: number) => api.get<MonthlyPeriod>(`/monthly-periods/${id}`),
  create: (dto: CreatePeriodDto) => api.post<MonthlyPeriod>('/monthly-periods', dto),
  close: (id: number) => api.patch<MonthlyPeriod>(`/monthly-periods/${id}/close`, {}),
  delete: (id: number) => api.delete<void>(`/monthly-periods/${id}`),
}

export const categories = {
  list: () => api.get<ExpenseCategory[]>('/expense-categories'),
  get: (id: number) => api.get<ExpenseCategory>(`/expense-categories/${id}`),
}

export const expenses = {
  list: () => api.get<MonthlyExpense[]>('/monthly-expenses'),
  get: (id: number) => api.get<MonthlyExpense>(`/monthly-expenses/${id}`),
  byPeriod: (periodId: number) => api.get<MonthlyExpense[]>(`/monthly-expenses/period/${periodId}`),
  create: (dto: CreateExpenseDto) => api.post<MonthlyExpense>('/monthly-expenses', dto),
  update: (id: number, dto: Partial<CreateExpenseDto>) => api.patch<MonthlyExpense>(`/monthly-expenses/${id}`, dto),
  delete: (id: number) => api.delete<void>(`/monthly-expenses/${id}`),
}

export const payments = {
  list: () => api.get<ExpensePayment[]>('/expense-payments'),
  get: (id: number) => api.get<ExpensePayment>(`/expense-payments/${id}`),
  byPeriod: (periodId: number) => api.get<ExpensePayment[]>(`/expense-payments/period/${periodId}`),
  byUser: (userId: number) => api.get<ExpensePayment[]>(`/expense-payments/user/${userId}`),
  byCategory: (categoryId: number) => api.get<ExpensePayment[]>(`/expense-payments/category/${categoryId}`),
  create: (dto: CreatePaymentDto) => api.post<ExpensePayment>('/expense-payments', dto),
  delete: (id: number) => api.delete<void>(`/expense-payments/${id}`),
}

export const contributions = {
  list: () => api.get<CashContribution[]>('/cash-contributions'),
  get: (id: number) => api.get<CashContribution>(`/cash-contributions/${id}`),
  byPeriod: (periodId: number) => api.get<CashContribution[]>(`/cash-contributions/period/${periodId}`),
  byUser: (userId: number) => api.get<CashContribution[]>(`/cash-contributions/user/${userId}`),
  create: (dto: CreateContributionDto) => api.post<CashContribution>('/cash-contributions', dto),
  delete: (id: number) => api.delete<void>(`/cash-contributions/${id}`),
}

export const reports = {
  monthlySummary: (periodId: number) => api.get<MonthlySummary>(`/reports/monthly-summary/${periodId}`),
  categoryHistory: () => api.get<CategoryHistoryItem[]>('/reports/category-history'),
  userPayments: () => api.get<UserPaymentHistory[]>('/reports/user-payments'),
  comparison: (currentPeriodId: number, previousPeriodId: number) =>
    api.get<Comparison>(`/reports/comparison/${currentPeriodId}/${previousPeriodId}`),
  trends: () => api.get<TrendResponse>('/reports/trends'),
}

export const audit = {
  list: (page = 1, limit = 50) => api.get<PaginatedResponse<AuditLog>>(`/audit?page=${page}&limit=${limit}`),
  byTableAndRecord: (tableName: string, recordId: number) =>
    api.get<AuditLog[]>(`/audit/${tableName}/${recordId}`),
}
