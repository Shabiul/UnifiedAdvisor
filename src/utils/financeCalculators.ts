import { FinancialData } from '../types';

export const calculateFinancialHealthScore = (financials: FinancialData): number => {
    let score = 0;
    const { monthly_income, expenses, assets, liabilities } = financials;

    const totalExpenses = expenses.fixed + expenses.variable;
    const savings = monthly_income - totalExpenses;
    const savingsRatio = monthly_income > 0 ? (savings / monthly_income) : 0;

    // 1. Savings Ratio (Max 40 points)
    if (savingsRatio >= 0.20) score += 40;
    else if (savingsRatio >= 0.10) score += 20;
    else if (savingsRatio > 0) score += 10;

    // 2. Emergency Fund Coverage (Max 30 points)
    // Ideal: 6 months of expenses in liquid assets (Bank + FD)
    const liquidAssets = assets.bank_balance + assets.fd_rd;
    const monthlyRunRate = totalExpenses || 1; // avoid div by 0
    const coverageMonths = liquidAssets / monthlyRunRate;

    if (coverageMonths >= 6) score += 30;
    else if (coverageMonths >= 3) score += 15;
    else if (coverageMonths >= 1) score += 5;

    // 3. Debt-to-Income Ratio (Max 30 points)
    // EMI / Income. Ideal < 30%
    // We don't have explicit EMIs yet, assume Liabilities are total debt, we need monthly EMI.
    // For now, let's use a proxy: if liabilities are 0, full score.
    const totalDebt = liabilities.credit_card + liabilities.personal_loan + liabilities.education_loan + liabilities.home_loan;

    // Simplification: If Total Debt < 3 * Monthly Income => Good logic? No, let's just stick to "Has High Interest Debt?"
    // If Credit Card debt > 0 -> -10 penalty
    if (liabilities.credit_card === 0) score += 10;

    // General Debt Check (Max 20)
    if (totalDebt === 0) score += 20;
    else if (totalDebt < monthly_income * 6) score += 10;

    return Math.min(score, 100);
};

export const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
};
