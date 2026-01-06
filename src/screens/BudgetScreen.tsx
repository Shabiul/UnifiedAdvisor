import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { styled } from 'nativewind';
import { useUserContext } from '../context/UserContext';
import { ExpenseBreakdown } from '../types';
import { NeoCard } from '../components/NeoCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

const CATEGORIES: (keyof ExpenseBreakdown)[] = ['food', 'rent', 'travel', 'shopping', 'utilities', 'others'];

export default function BudgetScreen() {
    const { financials, setBudget } = useUserContext();
    const navigation = useNavigation();
    const income = financials.monthly_income;
    const expenses = financials.expenses.breakdown;

    // 50-30-20 Logic
    const needsLimit = income * 0.5;
    const wantsLimit = income * 0.3;
    const savingsTarget = income * 0.2;

    const currentNeeds = (expenses.rent || 0) + (expenses.utilities || 0) + (expenses.food || 0) * 0.5;
    const currentWants = (expenses.shopping || 0) + (expenses.travel || 0) + (expenses.others || 0) + (expenses.food || 0) * 0.5;

    const [editingCategory, setEditingCategory] = useState<string | null>(null);
    const [newLimit, setNewLimit] = useState('');

    const handleSetLimit = (category: string) => {
        if (!newLimit) return;
        setBudget({
            id: Date.now().toString(),
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
        <StyledView className="flex-1 bg-primary pt-12">
            <View className="flex-row items-center mb-6 px-6">
                <StyledTouchableOpacity onPress={() => navigation.goBack()} className="mr-4 w-10 h-10 rounded-full bg-neo-card items-center justify-center border border-neo-card_border">
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                </StyledTouchableOpacity>
                <StyledText className="text-neo-text text-xl font-bold uppercase tracking-widest">Budget</StyledText>
            </View>

            <ScrollView className="px-5">
                {/* 50-30-20 Summary */}
                <NeoCard>
                    <StyledText className="text-neo-text font-bold mb-6 text-lg uppercase tracking-widest">50-30-20 Rule</StyledText>

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
                    <StyledView className="mt-4 pt-4 border-t border-neo-card_border flex-row justify-between items-center">
                        <StyledText className="text-neo-text text-xs uppercase tracking-widest font-bold">Savings Target</StyledText>
                        <StyledText className="text-neo-success font-bold text-lg">₹{savingsTarget.toLocaleString()}</StyledText>
                    </StyledView>
                </NeoCard>

                <StyledText className="text-neo-subtext text-xs font-bold uppercase mb-4 mt-2 tracking-widest">Category Limits</StyledText>

                {CATEGORIES.map(cat => {
                    const budget = getBudget(cat);
                    const spent = expenses[cat] || 0;
                    const limit = budget?.limit || 0;
                    const percent = limit > 0 ? (spent / limit) * 100 : 0;
                    const isExceeded = limit > 0 && spent > limit;

                    return (
                        <NeoCard key={cat} className="mb-3 py-4">
                            <View className="flex-row justify-between items-center mb-3">
                                <StyledText className="text-neo-text font-bold capitalize text-base">{cat}</StyledText>
                                {editingCategory === cat ? (
                                    <View className="flex-row items-center">
                                        <StyledInput
                                            className="bg-neo-bg text-white p-2 px-3 rounded-lg w-24 mr-2 border border-neo-card_border font-bold text-right"
                                            keyboardType="numeric"
                                            value={newLimit}
                                            onChangeText={setNewLimit}
                                            placeholder="Limit"
                                            placeholderTextColor="#64748b"
                                            autoFocus
                                        />
                                        <StyledTouchableOpacity onPress={() => handleSetLimit(cat)} className="bg-neo-brand p-2 rounded-full">
                                            <MaterialCommunityIcons name="check" size={16} color="black" />
                                        </StyledTouchableOpacity>
                                    </View>
                                ) : (
                                    <View className="flex-row items-center">
                                        <StyledText className="text-neo-subtext mr-3 font-medium text-xs">
                                            ₹{spent.toLocaleString()} / {limit > 0 ? `₹${limit.toLocaleString()}` : '∞'}
                                        </StyledText>
                                        <StyledTouchableOpacity onPress={() => setEditingCategory(cat)}>
                                            <MaterialCommunityIcons name="pencil" size={16} color="#3B82F6" />
                                        </StyledTouchableOpacity>
                                    </View>
                                )}
                            </View>

                            {limit > 0 && (
                                <View className="h-1 bg-neo-bg rounded-full overflow-hidden">
                                    <View
                                        style={{ width: `${Math.min(percent, 100)}%` }}
                                        className={`h-full ${isExceeded ? 'bg-neo-danger' : 'bg-neo-success'}`}
                                    />
                                </View>
                            )}
                            {isExceeded && <StyledText className="text-neo-danger text-[10px] uppercase font-bold mt-2 tracking-wider">Over Budget</StyledText>}
                        </NeoCard>
                    )
                })}

            </ScrollView>
        </StyledView>
    );
}

function BudgetBar({ label, spent, limit, color }: { label: string, spent: number, limit: number, color: string }) {
    const percent = Math.min((spent / limit) * 100, 100);
    return (
        <View className="mb-4">
            <View className="flex-row justify-between mb-2">
                <StyledText className="text-neo-subtext text-xs uppercase font-bold tracking-wider">{label}</StyledText>
                <StyledText className="text-white text-xs font-bold">₹{Math.round(spent).toLocaleString()} / ₹{Math.round(limit).toLocaleString()}</StyledText>
            </View>
            <View className="h-1 bg-neo-bg rounded-full overflow-hidden">
                <View style={{ width: `${percent}%` }} className={`h-full ${color}`} />
            </View>
        </View>
    );
}
