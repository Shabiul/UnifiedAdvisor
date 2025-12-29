import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { styled } from 'nativewind';
import { useUserStore } from '../store/userStore';
import { EmploymentType, RiskProfile } from '../types';
import { useNavigation } from '@react-navigation/native';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function OnboardingScreen() {
    const navigation = useNavigation();
    const { setProfile, setFinancials, completeOnboarding } = useUserStore();

    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [city, setCity] = useState('');
    const [monthlyIncome, setMonthlyIncome] = useState('');
    const [monthlyExpense, setMonthlyExpense] = useState(''); // Aggregate for now

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
                    fixed: parseFloat(monthlyExpense) * 0.6, // Assumption
                    variable: parseFloat(monthlyExpense) * 0.4,
                    breakdown: { food: 0, rent: 0, travel: 0, shopping: 0, utilities: 0, others: 0 }
                }
            });
            completeOnboarding();
            // Navigation to Dashboard will happen via AppNavigator checking 'isOnboarded' or explicit navigate
            // navigation.replace('Dashboard'); // But let's rely on state change for root nav
        }
    };

    return (
        <StyledView className="flex-1 bg-slate-900 p-6 pt-12">
            <StyledText className="text-3xl font-bold text-white mb-2">
                {step === 1 ? 'Personal Profile' : 'Financial Basics'}
            </StyledText>
            <StyledText className="text-slate-400 mb-8">
                {step === 1 ? 'Tell us a bit about yourself.' : 'Lets understand your money flow.'}
            </StyledText>

            <ScrollView className="flex-1">
                {step === 1 && (
                    <>
                        <InputLabel label="Name" />
                        <StyledInput
                            className="bg-slate-800 text-white p-4 rounded-xl mb-4 border border-slate-700"
                            placeholder="e.g. Rahul Kumar"
                            placeholderTextColor="#64748b"
                            value={name}
                            onChangeText={setName}
                        />

                        <InputLabel label="Age" />
                        <StyledInput
                            className="bg-slate-800 text-white p-4 rounded-xl mb-4 border border-slate-700"
                            placeholder="e.g. 28"
                            placeholderTextColor="#64748b"
                            keyboardType="numeric"
                            value={age}
                            onChangeText={setAge}
                        />

                        <InputLabel label="City" />
                        <StyledInput
                            className="bg-slate-800 text-white p-4 rounded-xl mb-4 border border-slate-700"
                            placeholder="e.g. Bangalore"
                            placeholderTextColor="#64748b"
                            value={city}
                            onChangeText={setCity}
                        />
                    </>
                )}

                {step === 2 && (
                    <>
                        <InputLabel label="Monthly Income (₹)" />
                        <StyledInput
                            className="bg-slate-800 text-white p-4 rounded-xl mb-4 border border-slate-700"
                            placeholder="e.g. 80000"
                            placeholderTextColor="#64748b"
                            keyboardType="numeric"
                            value={monthlyIncome}
                            onChangeText={setMonthlyIncome}
                        />

                        <InputLabel label="Monthly Expenses (Approx ₹)" />
                        <StyledInput
                            className="bg-slate-800 text-white p-4 rounded-xl mb-4 border border-slate-700"
                            placeholder="e.g. 35000"
                            placeholderTextColor="#64748b"
                            keyboardType="numeric"
                            value={monthlyExpense}
                            onChangeText={setMonthlyExpense}
                        />
                    </>
                )}
            </ScrollView>

            <StyledTouchableOpacity
                className="bg-blue-600 p-4 rounded-xl items-center mt-4"
                onPress={handleNext}
            >
                <StyledText className="text-white font-bold text-lg">
                    {step === 1 ? 'Next' : 'Complete Setup'}
                </StyledText>
            </StyledTouchableOpacity>
        </StyledView>
    );
}

function InputLabel({ label }: { label: string }) {
    return <StyledText className="text-slate-300 mb-2 font-medium">{label}</StyledText>;
}
