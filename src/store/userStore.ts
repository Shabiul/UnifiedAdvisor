import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserState, UserProfile, FinancialData, ExpenseBreakdown, Goal } from '../types';

const initialProfile: UserProfile = {
    name: '',
    age: 0,
    city: '',
    employment_type: 'salaried',
    dependents: 0,
};

const initialFinancials: FinancialData = {
    monthly_income: 0,
    additional_income: 0,
    expenses: {
        fixed: 0,
        variable: 0,
        breakdown: {
            food: 0,
            rent: 0,
            travel: 0,
            shopping: 0,
            utilities: 0,
            others: 0,
        },
    },
    assets: {
        bank_balance: 0,
        mutual_funds: 0,
        stocks: 0,
        fd_rd: 0,
        crypto: 0,
    },
    liabilities: {
        credit_card: 0,
        personal_loan: 0,
        education_loan: 0,
        home_loan: 0,
    },
    risk_profile: 'medium',
    goals: [],
    transactions: [],
    budgets: [],
};

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            profile: initialProfile,
            financials: initialFinancials,
            isOnboarded: false,

            setProfile: (profile) =>
                set((state) => ({
                    profile: { ...state.profile, ...profile },
                })),

            setFinancials: (data) =>
                set((state) => ({
                    financials: { ...state.financials, ...data },
                })),

            updateExpenseBreakdown: (category, amount) =>
                set((state) => {
                    const newBreakdown = { ...state.financials.expenses.breakdown, [category]: amount };
                    const totalExpenses = Object.values(newBreakdown).reduce((a, b) => a + b, 0);
                    return {
                        financials: {
                            ...state.financials,
                            expenses: {
                                ...state.financials.expenses,
                                breakdown: newBreakdown,
                            },
                        },
                    };
                }),

            addGoal: (goal) =>
                set((state) => ({
                    financials: {
                        ...state.financials,
                        goals: [...state.financials.goals, goal],
                    },
                })),

            removeGoal: (id) =>
                set((state) => ({
                    financials: {
                        ...state.financials,
                        goals: state.financials.goals.filter((g) => g.id !== id),
                    },
                })),

            addTransaction: (transaction) =>
                set((state) => {
                    const newTransactions = [transaction, ...state.financials.transactions];
                    const isExpense = transaction.type === 'expense';

                    let newBreakdown = { ...state.financials.expenses.breakdown };
                    let newExpenses = { ...state.financials.expenses };

                    if (isExpense) {
                        newBreakdown[transaction.category] = (newBreakdown[transaction.category] || 0) + transaction.amount;
                        // Assumption: All added expenses are Variable unless specified (todo: add type to transaction?)
                        newExpenses.variable += transaction.amount;
                    }

                    // Update budget spent amount
                    const updatedBudgets = state.financials.budgets.map(b => {
                        if (isExpense && (b.category === transaction.category || b.category === 'total')) {
                            return { ...b, spent: b.spent + transaction.amount };
                        }
                        return b;
                    });

                    return {
                        financials: {
                            ...state.financials,
                            transactions: newTransactions,
                            expenses: {
                                ...newExpenses,
                                breakdown: newBreakdown
                            },
                            budgets: updatedBudgets
                        }
                    };
                }),

            setBudget: (budget) =>
                set((state) => {
                    const existingIndex = state.financials.budgets.findIndex(b => b.category === budget.category);
                    let newBudgets = [...state.financials.budgets];
                    if (existingIndex >= 0) {
                        newBudgets[existingIndex] = { ...newBudgets[existingIndex], ...budget };
                    } else {
                        newBudgets.push(budget);
                    }
                    return {
                        financials: {
                            ...state.financials,
                            budgets: newBudgets
                        }
                    };
                }),

            completeOnboarding: () => set({ isOnboarded: true }),
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
