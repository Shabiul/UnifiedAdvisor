import { retrieveContext } from './ragService';
import { UserProfile, FinancialData } from '../types';

export const generateAIResponse = async (
    query: string,
    profile: UserProfile,
    financials: FinancialData
): Promise<string> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const context = retrieveContext(query);
    const lowerQuery = query.toLowerCase();

    // Contextual Personalization
    const name = profile.name.split(' ')[0];
    const income = financials.monthly_income;
    const savings = income - (financials.expenses.fixed + financials.expenses.variable);

    let baseResponse = '';

    if (lowerQuery.includes('save') || lowerQuery.includes('saving')) {
        baseResponse = `Hi ${name}, based on your income of ₹${income}, you are currently saving ₹${savings}. `;
    } else if (lowerQuery.includes('invest')) {
        baseResponse = `For your profile, starting early is key. `;
    } else {
        baseResponse = `That's a good question, ${name}. `;
    }

    if (context) {
        return `${baseResponse}Here is some relevant info:\n\n${context}\n\nBased on this, I suggest aligning this with your goals.`;
    } else {
        // Fallback or Generic AI Mock
        if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
            return `Hello ${profile.name}! I am your AI Financial Advisor. How can I help you regarding your finances today?`;
        }
        return `I found this interesting. While I don't have specific data on that right now, generally speaking, prudent financial planning involves tracking expenses and setting clear goals. Can you be more specific?`;
    }
};
