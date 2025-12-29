import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { styled } from 'nativewind';
import { useNavigation } from '@react-navigation/native';
import { useUserStore } from '../store/userStore';
import { ExpenseBreakdown } from '../types';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

const CATEGORIES: (keyof ExpenseBreakdown)[] = ['food', 'rent', 'travel', 'shopping', 'utilities', 'others'];

export default function AddExpenseScreen() {
    const navigation = useNavigation();
    const addTransaction = useUserStore((state) => state.addTransaction);

    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState<keyof ExpenseBreakdown>('food');
    const [note, setNote] = useState('');

    const handleSave = () => {
        if (!amount) {
            Alert.alert('Error', 'Please enter an amount');
            return;
        }

        addTransaction({
            id: Date.now().toString(),
            amount: parseFloat(amount),
            category,
            date: new Date().toISOString(),
            note,
            type: 'expense'
        });

        navigation.goBack();
    };

    return (
        <StyledView className="flex-1 bg-slate-950 p-6 pt-12">
            <View className="flex-row items-center mb-6">
                <StyledTouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
                    <StyledText className="text-white text-xl">←</StyledText>
                </StyledTouchableOpacity>
                <StyledText className="text-white text-2xl font-bold">Add Expense</StyledText>
            </View>

            <View className="mb-6">
                <StyledText className="text-slate-400 mb-2">Amount</StyledText>
                <StyledInput
                    className="bg-slate-900 text-white text-3xl p-4 rounded-xl border border-slate-700"
                    placeholder="0"
                    placeholderTextColor="#64748b"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                    autoFocus
                />
            </View>

            <View className="mb-6">
                <StyledText className="text-slate-400 mb-2">Category</StyledText>
                <View className="flex-row flex-wrap">
                    {CATEGORIES.map((cat) => (
                        <StyledTouchableOpacity
                            key={cat}
                            onPress={() => setCategory(cat)}
                            className={`mr-2 mb-2 px-4 py-2 rounded-full border ${category === cat ? 'bg-blue-600 border-blue-500' : 'bg-slate-900 border-slate-700'}`}
                        >
                            <StyledText className={`${category === cat ? 'text-white' : 'text-slate-400'} capitalize`}>
                                {cat}
                            </StyledText>
                        </StyledTouchableOpacity>
                    ))}
                </View>
            </View>

            <View className="mb-8">
                <StyledText className="text-slate-400 mb-2">Note (Optional)</StyledText>
                <StyledInput
                    className="bg-slate-900 text-white p-4 rounded-xl border border-slate-700"
                    placeholder="What was this for?"
                    placeholderTextColor="#64748b"
                    value={note}
                    onChangeText={setNote}
                />
            </View>

            <StyledTouchableOpacity
                className="bg-blue-600 p-4 rounded-xl items-center"
                onPress={handleSave}
            >
                <StyledText className="text-white font-bold text-lg">Save Transaction</StyledText>
            </StyledTouchableOpacity>
        </StyledView>
    );
}
