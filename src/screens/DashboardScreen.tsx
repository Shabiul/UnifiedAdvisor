import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { useNavigation } from '@react-navigation/native';
import { useUserStore } from '../store/userStore';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

import { calculateFinancialHealthScore, getHealthScoreColor } from '../utils/financeCalculators';

// ... (styled definitions remain same, assume they are outside this block or I need to be careful)

export default function DashboardScreen() {
    const navigation = useNavigation();
    const { profile, financials } = useUserStore();

    const healthScore = calculateFinancialHealthScore(financials);
    const scoreColor = getHealthScoreColor(healthScore);

    const handleReset = () => {
        useUserStore.setState({ isOnboarded: false });
    };

    return (
        <StyledView className="flex-1 bg-slate-950 p-6 pt-12">
            <View className="flex-row justify-between items-center mb-6">
                <View>
                    <StyledText className="text-slate-400 text-sm">Welcome back,</StyledText>
                    <StyledText className="text-white text-2xl font-bold">{profile.name}</StyledText>
                </View>
                <View className="bg-slate-800 px-3 py-1 rounded-full">
                    <StyledText className={`${scoreColor} font-bold`}>Health: {healthScore}</StyledText>
                </View>
            </View>

            <ScrollView>
                {/* Financial Summary Card */}
                <StyledTouchableOpacity
                    onPress={() => navigation.navigate('Analysis' as never)}
                    className="bg-blue-600 rounded-3xl p-6 mb-6"
                >
                    <StyledText className="text-blue-100 mb-1">Total Monthly Savings</StyledText>
                    <StyledText className="text-white text-4xl font-bold">
                        ₹{financials.monthly_income - (financials.expenses.fixed + financials.expenses.variable)}
                    </StyledText>
                    <View className="flex-row mt-4 space-x-4">
                        <View>
                            <StyledText className="text-blue-200 text-xs"> INCOME </StyledText>
                            <StyledText className="text-white font-semibold">₹{financials.monthly_income}</StyledText>
                        </View>
                        <View className="ml-6">
                            <StyledText className="text-blue-200 text-xs"> EXPENSE </StyledText>
                            <StyledText className="text-white font-semibold">₹{financials.expenses.fixed + financials.expenses.variable}</StyledText>
                        </View>
                    </View>
                    <StyledText className="absolute bottom-4 right-4 text-blue-300 text-xs">Tap for Analysis →</StyledText>
                </StyledTouchableOpacity>

                <StyledText className="text-white text-lg font-bold mb-4">Quick Actions</StyledText>

                <View className="flex-row flex-wrap justify-between">
                    <ActionCard
                        title="Add Expense"
                        icon="💸"
                        onPress={() => navigation.navigate('AddExpense' as never)}
                    />
                    <ActionCard
                        title="Set Budget"
                        icon="📊"
                        onPress={() => navigation.navigate('Budget' as never)}
                    />
                    <ActionCard
                        title="Goals"
                        icon="🎯"
                        onPress={() => navigation.navigate('Goals' as never)}
                    />
                    <ActionCard title="Ask AI" icon="🤖" />
                </View>

                <StyledTouchableOpacity onPress={handleReset} className="mt-10 bg-red-900 p-4 rounded-xl">
                    <StyledText className="text-red-200 text-center">Reset Profile (Debug)</StyledText>
                </StyledTouchableOpacity>

            </ScrollView>
        </StyledView>
    );
}

function ActionCard({ title, icon, onPress }: { title: string, icon: string, onPress?: () => void }) {
    return (
        <StyledTouchableOpacity onPress={onPress} className="bg-slate-900 w-[48%] p-4 rounded-2xl mb-4 border border-slate-800 items-center">
            <StyledText className="text-2xl mb-2">{icon}</StyledText>
            <StyledText className="text-slate-300 font-medium">{title}</StyledText>
        </StyledTouchableOpacity>
    );
}
