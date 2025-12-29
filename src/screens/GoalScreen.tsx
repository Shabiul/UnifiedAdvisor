import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Switch } from 'react-native';
import { styled } from 'nativewind';
import { useUserStore } from '../store/userStore';
import { Goal } from '../types';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function GoalScreen() {
    const { financials, addGoal, removeGoal } = useUserStore();
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [years, setYears] = useState('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [inflationAdjusted, setInflationAdjusted] = useState(false);

    const goals = financials.goals;

    const calculateSIP = (target: number, years: number) => {
        // Simple SIP Formula: P = M * [ ( (1 + i)^n - 1 ) / i ] * (1 + i)
        // Reverse it to find M (Monthly Investment)
        // Assume 12% annual return for equity
        const rate = 0.12 / 12; // Monthly rate
        const months = years * 12;

        if (rate === 0) return target / months;

        // Formula for Target Amount = M * ...
        // M = Target / ( [ ( (1 + i)^n - 1 ) / i ] * (1 + i) )
        const factor = ((Math.pow(1 + rate, months) - 1) / rate) * (1 + rate);
        let monthly = target / factor;

        if (inflationAdjusted) {
            // Rough heuristic: Increase target by 6% inflation
            // FV = PV * (1+r)^n
            const realTarget = target * Math.pow(1.06, years);
            monthly = realTarget / factor;
        }

        return Math.round(monthly);
    };

    const handleAddGoal = () => {
        if (!name || !targetAmount || !years) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        const newGoal: Goal = {
            id: Date.now().toString(),
            name,
            target_amount: parseFloat(targetAmount),
            time_horizon_years: parseFloat(years),
            priority,
            current_amount: 0
        };

        addGoal(newGoal);
        setName('');
        setTargetAmount('');
        setYears('');
    };

    return (
        <StyledView className="flex-1 bg-slate-950 p-6 pt-12">
            <StyledText className="text-white text-2xl font-bold mb-6">Financial Goals</StyledText>

            <ScrollView>
                <StyledView className="bg-slate-900 p-4 rounded-2xl mb-6 border border-slate-800">
                    <StyledText className="text-white font-bold mb-4 text-lg">Add New Goal</StyledText>

                    <InputLabel label="Goal Name" />
                    <StyledInput
                        className="bg-slate-800 text-white p-3 rounded-xl mb-3 border border-slate-700"
                        placeholder="e.g. Buy Car"
                        placeholderTextColor="#64748b"
                        value={name}
                        onChangeText={setName}
                    />

                    <InputLabel label="Target Amount (₹)" />
                    <StyledInput
                        className="bg-slate-800 text-white p-3 rounded-xl mb-3 border border-slate-700"
                        placeholder="e.g. 1000000"
                        placeholderTextColor="#64748b"
                        keyboardType="numeric"
                        value={targetAmount}
                        onChangeText={setTargetAmount}
                    />

                    <InputLabel label="Time Horizon (Years)" />
                    <StyledInput
                        className="bg-slate-800 text-white p-3 rounded-xl mb-3 border border-slate-700"
                        placeholder="e.g. 5"
                        placeholderTextColor="#64748b"
                        keyboardType="numeric"
                        value={years}
                        onChangeText={setYears}
                    />

                    <View className="flex-row items-center justify-between mb-4">
                        <StyledText className="text-slate-300">Adjust for Inflation (6%)</StyledText>
                        <Switch value={inflationAdjusted} onValueChange={setInflationAdjusted} trackColor={{ false: "#334155", true: "#2563eb" }} />
                    </View>

                    {years && targetAmount ? (
                        <StyledView className="bg-slate-800 p-3 rounded-xl mb-4">
                            <StyledText className="text-slate-400 text-xs">Required Monthly SIP (12% Return)</StyledText>
                            <StyledText className="text-emerald-400 font-bold text-xl">
                                ₹{calculateSIP(parseFloat(targetAmount), parseFloat(years))}
                            </StyledText>
                        </StyledView>
                    ) : null}

                    <StyledTouchableOpacity onPress={handleAddGoal} className="bg-blue-600 p-3 rounded-xl items-center">
                        <StyledText className="text-white font-bold">Add Goal</StyledText>
                    </StyledTouchableOpacity>
                </StyledView>

                <StyledText className="text-white text-lg font-bold mb-4">Your Goals</StyledText>
                {goals.map((goal) => (
                    <StyledView key={goal.id} className="bg-slate-900 p-4 rounded-xl mb-3 border border-slate-800 flex-row justify-between items-center">
                        <View>
                            <StyledText className="text-white font-bold text-lg">{goal.name}</StyledText>
                            <StyledText className="text-slate-400 text-xs">{goal.time_horizon_years} Years • ₹{goal.target_amount}</StyledText>
                            <StyledText className="text-blue-400 text-xs font-semibold mt-1">SIP: ₹{calculateSIP(goal.target_amount, goal.time_horizon_years)}/mo</StyledText>
                        </View>
                        <StyledTouchableOpacity onPress={() => removeGoal(goal.id)} className="bg-red-900 p-2 rounded-lg">
                            <StyledText className="text-red-200 text-xs">Del</StyledText>
                        </StyledTouchableOpacity>
                    </StyledView>
                ))}

            </ScrollView>
        </StyledView>
    );
}

function InputLabel({ label }: { label: string }) {
    return <StyledText className="text-slate-300 mb-1 font-medium text-xs">{label}</StyledText>;
}
