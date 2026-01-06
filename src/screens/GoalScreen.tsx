import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Switch } from 'react-native';
import { styled } from 'nativewind';
import { useUserContext } from '../context/UserContext';
import { Goal } from '../types';
import { NeoCard } from '../components/NeoCard';
import { NeoButton } from '../components/NeoButton';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function GoalScreen() {
    const { financials, addGoal, removeGoal } = useUserContext();
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [years, setYears] = useState('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [inflationAdjusted, setInflationAdjusted] = useState(false);

    const goals = financials.goals;

    const calculateSIP = (target: number, years: number) => {
        const rate = 0.12 / 12;
        const months = years * 12;

        if (rate === 0) return target / months;

        const factor = ((Math.pow(1 + rate, months) - 1) / rate) * (1 + rate);
        let monthly = target / factor;

        if (inflationAdjusted) {
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
            saved_amount: 0
        };

        addGoal(newGoal);
        setName('');
        setTargetAmount('');
        setYears('');
    };

    return (
        <StyledView className="flex-1 bg-primary pt-12">
            <View className="flex-row items-center mb-6 px-6">
                <StyledTouchableOpacity onPress={() => navigation.goBack()} className="mr-4 w-10 h-10 rounded-full bg-neo-card items-center justify-center border border-neo-card_border">
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                </StyledTouchableOpacity>
                <StyledText className="text-neo-text text-xl font-bold uppercase tracking-widest">Financial Goals</StyledText>
            </View>

            <ScrollView className="px-5">
                <NeoCard className="mb-8">
                    <StyledText className="text-neo-text font-bold mb-4 text-lg uppercase tracking-widest">Add New Goal</StyledText>

                    <InputLabel label="Goal Name" />
                    <StyledInput
                        className="bg-neo-bg text-white p-4 rounded-xl mb-4 border border-neo-card_border"
                        placeholder="e.g. Dream Car"
                        placeholderTextColor="#666"
                        value={name}
                        onChangeText={setName}
                    />

                    <InputLabel label="Target Amount (₹)" />
                    <StyledInput
                        className="bg-neo-bg text-white p-4 rounded-xl mb-4 border border-neo-card_border"
                        placeholder="1,000,000"
                        placeholderTextColor="#666"
                        keyboardType="numeric"
                        value={targetAmount}
                        onChangeText={setTargetAmount}
                    />

                    <InputLabel label="Time Horizon (Years)" />
                    <StyledInput
                        className="bg-neo-bg text-white p-4 rounded-xl mb-4 border border-neo-card_border"
                        placeholder="5"
                        placeholderTextColor="#666"
                        keyboardType="numeric"
                        value={years}
                        onChangeText={setYears}
                    />

                    <View className="flex-row items-center justify-between mb-4 bg-neo-bg p-3 rounded-xl border border-neo-card_border">
                        <StyledText className="text-neo-subtext text-xs font-bold uppercase tracking-wider">Inflation Adjusted (6%)</StyledText>
                        <Switch value={inflationAdjusted} onValueChange={setInflationAdjusted} trackColor={{ false: "#333", true: "#39ff14" }} thumbColor={inflationAdjusted ? "#fff" : "#666"} />
                    </View>

                    {years && targetAmount ? (
                        <StyledView className="bg-[#1A1A1A] p-4 rounded-xl mb-6 border border-neo-card_border">
                            <StyledText className="text-neo-subtext text-xs uppercase tracking-widest mb-1">Required Monthly SIP</StyledText>
                            <StyledText className="text-neo-brand font-bold text-2xl">
                                ₹{calculateSIP(parseFloat(targetAmount), parseFloat(years)).toLocaleString()}
                            </StyledText>
                            <StyledText className="text-neo-subtext text-[10px] mt-1">
                                Assuming 12% annual returns
                            </StyledText>
                        </StyledView>
                    ) : null}

                    <NeoButton title="Add Goal" onPress={handleAddGoal} className="bg-white" />
                </NeoCard>

                <StyledText className="text-neo-subtext text-xs font-bold uppercase mb-4 tracking-widest">Your Goals</StyledText>
                {goals.map((goal) => (
                    <NeoCard key={goal.id} className="flex-row justify-between items-center py-5">
                        <View>
                            <StyledText className="text-neo-text font-bold text-lg mb-1">{goal.name}</StyledText>
                            <StyledText className="text-neo-subtext text-xs font-medium">{goal.time_horizon_years} Years • ₹{goal.target_amount.toLocaleString()}</StyledText>
                            <StyledText className="text-neo-brand text-xs font-bold mt-2 uppercase tracking-wide">
                                SIP: ₹{calculateSIP(goal.target_amount, goal.time_horizon_years || 0).toLocaleString()}/mo
                            </StyledText>
                        </View>
                        <StyledTouchableOpacity onPress={() => removeGoal(goal.id)} className="bg-neo-danger w-8 h-8 rounded-full items-center justify-center">
                            <MaterialCommunityIcons name="trash-can-outline" size={16} color="white" />
                        </StyledTouchableOpacity>
                    </NeoCard>
                ))}

                <View className="h-10" />
            </ScrollView>
        </StyledView>
    );
}

function InputLabel({ label }: { label: string }) {
    return <StyledText className="text-neo-subtext mb-2 font-bold text-xs uppercase tracking-widest">{label}</StyledText>;
}
