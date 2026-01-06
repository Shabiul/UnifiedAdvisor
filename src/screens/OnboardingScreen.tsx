import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { styled } from 'nativewind';
import { useUserContext } from '../context/UserContext';
import { NeoButton } from '../components/NeoButton';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);

export default function OnboardingScreen() {
    const { setProfile, setFinancials, completeOnboarding } = useUserContext();

    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [city, setCity] = useState('');
    const [monthlyIncome, setMonthlyIncome] = useState('');
    const [monthlyExpense, setMonthlyExpense] = useState('');

    const handleNext = () => {
        if (step === 1) {
            if (!name || !age || !city) {
                Alert.alert('Missing Fields', 'Please fill all details.');
                return;
            }
            setProfile({ name, age: parseInt(age), city, employment_type: 'salaried', dependents: 0 });
            setStep(2);
        } else if (step === 2) {
            if (!monthlyIncome || !monthlyExpense) {
                Alert.alert('Missing Fields', 'Please fill all details.');
                return;
            }
            setFinancials({
                monthly_income: parseFloat(monthlyIncome),
                expenses: {
                    fixed: parseFloat(monthlyExpense) * 0.6,
                    variable: parseFloat(monthlyExpense) * 0.4,
                    breakdown: { food: 0, rent: 0, travel: 0, shopping: 0, utilities: 0, others: 0 }
                }
            });
            completeOnboarding();
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-primary">
            <StyledView className="flex-1 p-6 pt-12 justify-center">
                <View className="mb-8">
                    <View className="w-12 h-12 rounded-full bg-neo-card items-center justify-center border border-neo-card_border mb-4">
                        <MaterialCommunityIcons name={step === 1 ? "account" : "finance"} size={24} color="#39ff14" />
                    </View>
                    <StyledText className="text-3xl font-bold text-neo-text mb-2 uppercase tracking-wide">
                        {step === 1 ? 'Personal Profile' : 'Financial Basics'}
                    </StyledText>
                    <StyledText className="text-neo-subtext">
                        {step === 1 ? 'Tell us a bit about yourself.' : 'Lets understand your money flow.'}
                    </StyledText>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {step === 1 && (
                        <>
                            <InputLabel label="Name" />
                            <NeoInput value={name} onChangeText={setName} placeholder="e.g. Rahul Kumar" />

                            <InputLabel label="Age" />
                            <NeoInput value={age} onChangeText={setAge} placeholder="e.g. 28" keyboardType="numeric" />

                            <InputLabel label="City" />
                            <NeoInput value={city} onChangeText={setCity} placeholder="e.g. Bangalore" />
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <InputLabel label="Monthly Income (₹)" />
                            <NeoInput value={monthlyIncome} onChangeText={setMonthlyIncome} placeholder="e.g. 150000" keyboardType="numeric" />

                            <InputLabel label="Monthly Expenses (Approx ₹)" />
                            <NeoInput value={monthlyExpense} onChangeText={setMonthlyExpense} placeholder="e.g. 45000" keyboardType="numeric" />
                        </>
                    )}
                </ScrollView>

                <NeoButton
                    title={step === 1 ? 'Next' : 'Complete Setup'}
                    onPress={handleNext}
                    className="mt-6 bg-neo-brand"
                />
            </StyledView>
        </KeyboardAvoidingView>
    );
}

function InputLabel({ label }: { label: string }) {
    return <StyledText className="text-neo-subtext mb-2 font-bold text-xs uppercase tracking-widest">{label}</StyledText>;
}

function NeoInput(props: any) {
    return (
        <StyledInput
            className="bg-neo-bg text-white p-4 rounded-xl mb-6 border border-neo-card_border text-lg font-medium"
            placeholderTextColor="#666"
            {...props}
        />
    );
}
