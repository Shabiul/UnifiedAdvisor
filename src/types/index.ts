export type EmploymentType = 'salaried' | 'freelancer' | 'business' | 'student';
export type RiskProfile = 'low' | 'medium' | 'high' | 'aggressive';

export interface ExpenseBreakdown {
    food: number;
    rent: number;
    travel: number;
    shopping: number;
    utilities: number;
    others: number;
    [key: string]: number; // Allow flexible categories
}

export interface Expenses {
    fixed: number;
    variable: number;
    breakdown: ExpenseBreakdown;
}

export interface Assets {
    bank_balance: number;
    mutual_funds: number;
    stocks: number;
    fd_rd: number;
    crypto: number;
}

export interface Liabilities {
    credit_card: number;
    personal_loan: number;
    education_loan: number;
    home_loan: number;
}

export interface Goal {
    id: string;
    name: string;
    target_amount: number;
    saved_amount?: number;
    deadline?: string;
    time_horizon_years?: number;
    priority: 'low' | 'medium' | 'high';
}

export interface Transaction {
    id: string;
    amount: number;
    category: string; // Changed from strict keyof to string to allow 'salary' etc
    date: string;
    description?: string;
    type: 'expense' | 'income';
}

export interface UserProfile {
    name: string;
    age: number;
    city: string;
    employment_type: EmploymentType;
    dependents: number;
}

export interface FinancialData {
    monthly_income: number;
    additional_income: number;
    expenses: Expenses;
    assets: Assets;
    liabilities: Liabilities;
    risk_profile: RiskProfile;
    goals: Goal[];
    transactions: Transaction[];
    budgets: Budget[];
}

export interface Budget {
    id: string;
    category: string;
    limit: number;
    period: 'monthly' | 'weekly' | 'yearly';
    spent: number;
}

export interface UserState {
    profile: UserProfile;
    financials: FinancialData;
    isOnboarded: boolean;
    setProfile: (profile: Partial<UserProfile>) => void;
    setFinancials: (data: Partial<FinancialData>) => void;
    updateExpenseBreakdown: (category: string, amount: number) => void;
    addGoal: (goal: Goal) => void;
    removeGoal: (id: string) => void;
    addTransaction: (transaction: Transaction) => void;
    setBudget: (budget: Budget) => void;
    completeOnboarding: () => void;
}
