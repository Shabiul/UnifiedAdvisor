import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserState, UserProfile, FinancialData, Goal, Transaction, Budget, ExpenseBreakdown } from '../types';

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

const UserContext = createContext<UserState | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [profile, setProfileState] = useState<UserProfile>(initialProfile);
    const [financials, setFinancialsState] = useState<FinancialData>(initialFinancials);
    const [isOnboarded, setIsOnboarded] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false); // To track if initial load is done

    // Load from Async Storage
    useEffect(() => {
        const loadData = async () => {
            try {
                const storedProfile = await AsyncStorage.getItem('user-profile');
                const storedFinancials = await AsyncStorage.getItem('user-financials');
                const storedOnboarding = await AsyncStorage.getItem('user-onboarding');

                if (storedProfile) setProfileState(JSON.parse(storedProfile));
                if (storedFinancials) setFinancialsState(JSON.parse(storedFinancials));
                if (storedOnboarding) setIsOnboarded(JSON.parse(storedOnboarding));
            } catch (e) {
                console.error("Failed to load data", e);
            } finally {
                setIsHydrated(true);
            }
        };
        loadData();
    }, []);

    // Seed Data for Demo
    useEffect(() => {
        if (!isHydrated) return;

        const seedData = async () => {
            if (!profile.name) {
                const dummyProfile: UserProfile = {
                    name: 'Rohan Gupta',
                    age: 29,
                    city: 'Bangalore',
                    employment_type: 'salaried',
                    dependents: 1,
                };

                const dummyFinancials: FinancialData = {
                    monthly_income: 150000,
                    additional_income: 20000,
                    expenses: {
                        fixed: 45000,
                        variable: 35000,
                        breakdown: {
                            food: 12000,
                            rent: 25000,
                            travel: 8000,
                            shopping: 15000,
                            utilities: 5000,
                            others: 15000,
                        },
                    },
                    assets: {
                        bank_balance: 450000,
                        mutual_funds: 1200000,
                        stocks: 800000,
                        fd_rd: 200000,
                        crypto: 50000,
                    },
                    liabilities: {
                        credit_card: 12000,
                        personal_loan: 0,
                        education_loan: 0,
                        home_loan: 0,
                    },
                    risk_profile: 'aggressive',
                    goals: [
                        { id: '1', name: 'Europe Trip', target_amount: 300000, saved_amount: 120000, deadline: '2025-12-01', priority: 'medium' },
                        { id: '2', name: 'MacBook Pro', target_amount: 250000, saved_amount: 200000, deadline: '2025-06-01', priority: 'high' }
                    ],
                    transactions: [
                        { id: '1', amount: 1200, category: 'food', date: '2025-05-20', type: 'expense', description: 'Lunch at Truffles' },
                        { id: '2', amount: 850, category: 'travel', date: '2025-05-19', type: 'expense', description: 'Uber to Office' },
                        { id: '3', amount: 5000, category: 'shopping', date: '2025-05-18', type: 'expense', description: 'Zara Sale' },
                        { id: '4', amount: 150000, category: 'salary', date: '2025-05-01', type: 'income', description: 'Salary Credited' }
                    ],
                    budgets: [
                        { id: '1', category: 'food', limit: 15000, spent: 12000, period: 'monthly' }
                    ],
                };

                setProfileState(dummyProfile);
                setFinancialsState(dummyFinancials);
                setIsOnboarded(true);
            }
        };
        seedData();
    }, [isHydrated, profile.name]);

    // Save to Async Storage whenever state changes
    useEffect(() => {
        if (!isHydrated) return;
        const saveData = async () => {
            try {
                await AsyncStorage.setItem('user-profile', JSON.stringify(profile));
                await AsyncStorage.setItem('user-financials', JSON.stringify(financials));
                await AsyncStorage.setItem('user-onboarding', JSON.stringify(isOnboarded));
            } catch (e) {
                console.error("Failed to save data", e);
            }
        };
        saveData();
    }, [profile, financials, isOnboarded, isHydrated]);


    const setProfile = (newProfile: Partial<UserProfile>) => {
        setProfileState(prev => ({ ...prev, ...newProfile }));
    };

    const setFinancials = (newData: Partial<FinancialData>) => {
        setFinancialsState(prev => ({ ...prev, ...newData }));
    };

    const updateExpenseBreakdown = (category: string, amount: number) => {
        setFinancialsState(prev => {
            const newBreakdown = { ...prev.expenses.breakdown, [category]: amount };
            return {
                ...prev,
                expenses: {
                    ...prev.expenses,
                    breakdown: newBreakdown,
                }
            };
        });
    };

    const addGoal = (goal: Goal) => {
        setFinancialsState(prev => ({
            ...prev,
            goals: [...prev.goals, goal]
        }));
    };

    const removeGoal = (id: string) => {
        setFinancialsState(prev => ({
            ...prev,
            goals: prev.goals.filter(g => g.id !== id)
        }));
    };

    const addTransaction = (transaction: Transaction) => {
        setFinancialsState(prev => {
            const newTransactions = [transaction, ...prev.transactions];
            const isExpense = transaction.type === 'expense';
            let newBreakdown = { ...prev.expenses.breakdown };
            let newExpenses = { ...prev.expenses };

            if (isExpense) {
                // @ts-ignore
                newBreakdown[transaction.category] = (newBreakdown[transaction.category] || 0) + transaction.amount;
                newExpenses.variable += transaction.amount;
            }

            const updatedBudgets = prev.budgets.map(b => {
                if (isExpense && (b.category === transaction.category || b.category === 'total')) {
                    return { ...b, spent: b.spent + transaction.amount };
                }
                return b;
            });

            return {
                ...prev,
                transactions: newTransactions,
                expenses: {
                    ...newExpenses,
                    breakdown: newBreakdown
                },
                budgets: updatedBudgets
            };
        });
    };

    const setBudget = (budget: Budget) => {
        setFinancialsState(prev => {
            const existingIndex = prev.budgets.findIndex(b => b.category === budget.category);
            let newBudgets = [...prev.budgets];
            if (existingIndex >= 0) {
                newBudgets[existingIndex] = { ...newBudgets[existingIndex], ...budget };
            } else {
                newBudgets.push(budget);
            }
            return {
                ...prev,
                budgets: newBudgets
            };
        });
    };

    const completeOnboarding = () => setIsOnboarded(true);

    const resetUser = () => {
        setIsOnboarded(false);
        // Optionally reset other states if needed for debug
    };

    // We can also expose a partial 'setState' if strictly needed to match exact API, 
    // but better to expose explicit methods.  However, for compatibility with the 
    // existing codebase which might use `useUserStore.setState`, we should ideally refactor 
    // that call site. There is only one in DashboardScreen.

    return (
        <UserContext.Provider value={{
            profile,
            financials,
            isOnboarded,
            setProfile,
            setFinancials,
            updateExpenseBreakdown,
            addGoal,
            removeGoal,
            addTransaction,
            setBudget,
            completeOnboarding
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
};
