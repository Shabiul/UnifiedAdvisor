import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { styled } from 'nativewind';
import { useUserStore } from '../store/userStore';
import { ExpenseBreakdown } from '../types';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

const CATEGORIES: (keyof ExpenseBreakdown)[] = ['food', 'rent', 'travel', 'shopping', 'utilities', 'others'];

export default function BudgetScreen() {
    const { financials, setBudget } = useUserStore();
    const income = financials.monthly_income;
    const expenses = financials.expenses.breakdown;

    // 50-30-20 Logic
    const needsLimit = income * 0.5;
    const wantsLimit = income * 0.3;
    const savingsTarget = income * 0.2;

    const currentNeeds = (expenses.rent || 0) + (expenses.utilities || 0) + (expenses.food || 0) * 0.5; // Assumption: 50% food is Need
    const currentWants = (expenses.shopping || 0) + (expenses.travel || 0) + (expenses.others || 0) + (expenses.food || 0) * 0.5;

    const [editingCategory, setEditingCategory] = useState<string | null>(null);
    const [newLimit, setNewLimit] = useState('');

    const handleSetLimit = (category: string) => {
        if (!newLimit) return;
        setBudget({
            category: category as any,
            limit: parseFloat(newLimit),
            period: 'monthly',
            spent: expenses[category as keyof ExpenseBreakdown] || 0
        });
        setEditingCategory(null);
        setNewLimit('');
    };

    const getBudget = (category: string) => {
        return financials.budgets.find(b => b.category === category);
    };

    return (
        <StyledView className="flex-1 bg-slate-950 p-6 pt-12">
            <StyledText className="text-white text-2xl font-bold mb-6">Budget Planning</StyledText>

            <ScrollView>
                {/* 50-30-20 Summary */}
                <StyledView className="bg-slate-900 p-4 rounded-2xl mb-6 border border-slate-800">
                    <StyledText className="text-white font-bold mb-4 text-lg">50-30-20 Analysis</StyledText>

                    <BudgetBar
                        label="Needs (50%)"
                        spent={currentNeeds}
                        limit={needsLimit}
                        color="bg-blue-500"
                    />
                    <BudgetBar
                        label="Wants (30%)"
                        spent={currentWants}
                        limit={wantsLimit}
                        color="bg-purple-500"
                    />
                    <StyledView className="mt-2">
                        <StyledText className="text-emerald-400 font-bold">Goal Savings (20%): ₹{savingsTarget}</StyledText>
                        <StyledText className="text-slate-400 text-xs">Current Savings: ₹{income - (financials.expenses.fixed + financials.expenses.variable)}</StyledText>
                    </StyledView>
                </StyledView>

                <StyledText className="text-white text-lg font-bold mb-4">Category Budgets</StyledText>

                {CATEGORIES.map(cat => {
                    const budget = getBudget(cat);
                    const spent = expenses[cat] || 0;
                    const limit = budget?.limit || 0;
                    const percent = limit > 0 ? (spent / limit) * 100 : 0;
                    const isExceeded = limit > 0 && spent > limit;

                    return (
                        <StyledView key={cat} className="bg-slate-900 p-4 rounded-xl mb-3 border border-slate-800">
                            <View className="flex-row justify-between items-center mb-2">
                                <StyledText className="text-white font-medium capitalize">{cat}</StyledText>
                                {editingCategory === cat ? (
                                    <View className="flex-row items-center">
                                        <StyledInput
                                            className="bg-slate-800 text-white p-1 px-2 rounded w-20 mr-2 border border-slate-700"
                                            keyboardType="numeric"
                                            value={newLimit}
                                            onChangeText={setNewLimit}
                                            placeholder="Limit"
                                            placeholderTextColor="#64748b"
                                            autoFocus
                                        />
                                        <StyledTouchableOpacity onPress={() => handleSetLimit(cat)}>
                                            <StyledText className="text-blue-400 font-bold">✓</StyledText>
                                        </StyledTouchableOpacity>
                                    </View>
                                ) : (
                                    <View className="flex-row items-center">
                                        <StyledText className="text-slate-400 mr-2">
                                            ₹{spent} / {limit > 0 ? `₹${limit}` : 'No Limit'}
                                        </StyledText>
                                        <StyledTouchableOpacity onPress={() => setEditingCategory(cat)}>
                                            <StyledText className="text-blue-400 text-xs font-bold">EDIT</StyledText>
                                        </StyledTouchableOpacity>
                                    </View>
                                )}
                            </View>

                            {limit > 0 && (
                                <View className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <View
                                        style={{ width: `${Math.min(percent, 100)}%` }}
                                        className={`h-full ${isExceeded ? 'bg-red-500' : 'bg-emerald-500'}`}
                                    />
                                </View>
                            )}
                            {isExceeded && <StyledText className="text-red-400 text-xs mt-1">Budget Exceeded!</StyledText>}
                        </StyledView>
                    )
                })}

            </ScrollView>
        </StyledView>
    );
}

function BudgetBar({ label, spent, limit, color }: { label: string, spent: number, limit: number, color: string }) {
    const percent = Math.min((spent / limit) * 100, 100);
    return (
        <View className="mb-3">
            <View className="flex-row justify-between mb-1">
                <StyledText className="text-slate-300 text-xs">{label}</StyledText>
                <StyledText className="text-slate-300 text-xs">₹{Math.round(spent)} / ₹{Math.round(limit)}</StyledText>
            </View>
            <View className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <View style={{ width: `${percent}%` }} className={`h-full ${color}`} />
            </View>
        </View>
    );
}
