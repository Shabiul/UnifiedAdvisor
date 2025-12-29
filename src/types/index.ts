export type EmploymentType = 'salaried' | 'freelancer' | 'business' | 'student';
export type RiskProfile = 'low' | 'medium' | 'high';

export interface ExpenseBreakdown {
    food: number;
    rent: number;
    travel: number;
    shopping: number;
    utilities: number;
    others: number;
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
    time_horizon_years: number;
    priority: 'low' | 'medium' | 'high';
    current_amount?: number;
}

export interface Transaction {
    id: string;
    amount: number;
    category: keyof ExpenseBreakdown;
    date: string;
    note?: string;
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
    category: keyof ExpenseBreakdown | 'total';
    limit: number;
    period: 'monthly';
    spent: number; // To track spending against this budget
}

export interface UserState {
    profile: UserProfile;
    financials: FinancialData;
    isOnboarded: boolean;
    setProfile: (profile: Partial<UserProfile>) => void;
    setFinancials: (data: Partial<FinancialData>) => void;
    updateExpenseBreakdown: (category: keyof ExpenseBreakdown, amount: number) => void;
    addGoal: (goal: Goal) => void;
    removeGoal: (id: string) => void;
    addTransaction: (transaction: Transaction) => void;
    setBudget: (budget: Budget) => void;
    completeOnboarding: () => void;
}
