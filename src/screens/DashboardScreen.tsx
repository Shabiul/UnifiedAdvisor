import React, { useState } from 'react';
import { View, Text, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { useUserContext } from '../context/UserContext';
import { NeoCard } from '../components/NeoCard';
import { NeoButton } from '../components/NeoButton';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

export default function DashboardScreen() {
    const { profile, financials } = useUserContext();
    const navigation = useNavigation<DashboardScreenNavigationProp>();

    // Calculate Net Worth
    const netWorth = (
        financials.assets.bank_balance +
        financials.assets.mutual_funds +
        financials.assets.stocks +
        financials.assets.fd_rd +
        financials.assets.crypto
    ) - (
            financials.liabilities.credit_card +
            financials.liabilities.personal_loan +
            financials.liabilities.education_loan +
            financials.liabilities.home_loan
        );

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('en-IN', {
            maximumFractionDigits: 0,
            style: 'currency',
            currency: 'INR'
        });
    };

    return (
        <StyledView className="flex-1 bg-primary pt-12">
            <StatusBar barStyle="light-content" backgroundColor="#000000" />
            <StyledScrollView className="px-5" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <StyledView className="flex-row justify-between items-center mb-8">
                    <View>
                        <StyledText className="text-neo-subtext text-xs uppercase tracking-widest font-bold">
                            Welcome back
                        </StyledText>
                        <StyledText className="text-neo-text text-2xl font-bold mt-1">
                            {profile.name}
                        </StyledText>
                    </View>
                    <StyledView className="bg-neo-card p-3 rounded-full border border-neo-card_border">
                        <MaterialCommunityIcons name="bell-outline" size={24} color="#F5F5F7" />
                    </StyledView>
                </StyledView>

                {/* Net Worth Card */}
                <NeoCard className="mb-8 relative overflow-hidden">
                    <StyledView className="absolute top-0 right-0 p-4 opacity-10">
                        <MaterialCommunityIcons name="credit-card-chip-outline" size={120} color="#3B82F6" />
                    </StyledView>
                    <StyledText className="text-neo-subtext text-xs font-bold uppercase tracking-widest mb-2">
                        Total Net Worth
                    </StyledText>
                    <StyledText className="text-white text-4xl font-bold tracking-tighter mb-6">
                        {formatCurrency(netWorth)}
                    </StyledText>

                    <StyledView className="flex-row justify-between mt-4 border-t border-neo-card_border pt-4">
                        <View>
                            <StyledText className="text-neo-subtext text-[10px] uppercase tracking-wider mb-1">Assets</StyledText>
                            <StyledText className="text-neo-success text-lg font-bold">
                                {formatCurrency(Object.values(financials.assets).reduce((a, b) => a + b, 0))}
                            </StyledText>
                        </View>
                        <View>
                            <StyledText className="text-neo-subtext text-[10px] uppercase tracking-wider mb-1 text-right">Liabilities</StyledText>
                            <StyledText className="text-neo-danger text-lg font-bold text-right">
                                {formatCurrency(Object.values(financials.liabilities).reduce((a, b) => a + b, 0))}
                            </StyledText>
                        </View>
                    </StyledView>
                </NeoCard>

                {/* Quick Actions Grid */}
                <StyledText className="text-neo-subtext text-xs font-bold uppercase mb-4 tracking-widest">
                    Quick Actions
                </StyledText>

                <StyledView className="flex-row flex-wrap justify-between mb-6">
                    {[
                        { title: 'Add Expense', icon: 'plus', route: 'AddExpense', color: '#39ff14' },
                        { title: 'Budget', icon: 'chart-pie', route: 'Budget', color: '#FF3B30' },
                        { title: 'Goals', icon: 'flag', route: 'Goal', color: '#FFD700' },
                        { title: 'Analysis', icon: 'google-analytics', route: 'Analysis', color: '#3B82F6' },
                    ].map((action, index) => (
                        <NeoCard
                            key={index}
                            onPress={() => navigation.navigate(action.route as any)}
                            className="w-[48%] h-32 justify-between mb-4"
                        >
                            <MaterialCommunityIcons name={action.icon as any} size={28} color={action.color} />
                            <StyledText className="text-neo-text font-bold text-base mt-2">
                                {action.title}
                            </StyledText>
                        </NeoCard>
                    ))}
                </StyledView>

                {/* AI Advisor Banner */}
                <NeoButton
                    title="Ask AI Advisor"
                    onPress={() => navigation.navigate('Chat')}
                    className="mb-8 bg-neo-brand border-none"
                />

                {/* Recent Transactions */}
                <StyledView className="flex-row justify-between items-center mb-4">
                    <StyledText className="text-neo-subtext text-xs font-bold uppercase tracking-widest">
                        Recent Activity
                    </StyledText>
                    <TouchableOpacity>
                        <StyledText className="text-neo-brand text-xs font-bold uppercase tracking-widest">View All</StyledText>
                    </TouchableOpacity>
                </StyledView>

                {financials.transactions.slice(0, 5).map((txn) => (
                    <NeoCard key={txn.id} className="mb-4 flex-row justify-between items-center py-4 px-4 bg-neo-bg border-b border-neo-card_border rounded-none border-t-0 border-l-0 border-r-0">
                        <View className="flex-row items-center flex-1">
                            <StyledView className="w-10 h-10 rounded-full bg-[#1A1A1A] items-center justify-center mr-4">
                                <MaterialCommunityIcons
                                    name={txn.type === 'expense' ? 'arrow-top-right' : 'arrow-bottom-left'}
                                    size={20}
                                    color={txn.type === 'expense' ? '#FF3B30' : '#34C759'}
                                />
                            </StyledView>
                            <View className="flex-1">
                                <StyledText className="text-neo-text font-bold text-base capitalize" numberOfLines={1}>
                                    {txn.description || txn.category}
                                </StyledText>
                                <StyledText className="text-neo-subtext text-xs">
                                    {new Date(txn.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • {txn.category}
                                </StyledText>
                            </View>
                        </View>
                        <StyledText className={`font-bold text-base ${txn.type === 'expense' ? 'text-neo-text' : 'text-neo-success'}`}>
                            {txn.type === 'expense' ? '-' : '+'} {formatCurrency(txn.amount)}
                        </StyledText>
                    </NeoCard>
                ))}
            </StyledScrollView>
        </StyledView>
    );
}
