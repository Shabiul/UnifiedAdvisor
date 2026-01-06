import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { styled } from 'nativewind';
import { useNavigation } from '@react-navigation/native';
import { useUserContext } from '../context/UserContext';
import { ExpenseBreakdown } from '../types';
import { NeoButton } from '../components/NeoButton';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

const CATEGORIES: (keyof ExpenseBreakdown)[] = ['food', 'rent', 'travel', 'shopping', 'utilities', 'others'];

export default function AddExpenseScreen() {
    const navigation = useNavigation();
    const { addTransaction } = useUserContext();

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
            description: note,
            type: 'expense'
        });

        navigation.goBack();
    };

    return (
        <StyledView className="flex-1 bg-primary p-6 pt-12">
            <View className="flex-row items-center mb-8">
                <StyledTouchableOpacity onPress={() => navigation.goBack()} className="mr-4 w-10 h-10 rounded-full bg-neo-card items-center justify-center border border-neo-card_border">
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                </StyledTouchableOpacity>
                <StyledText className="text-neo-text text-xl font-bold uppercase tracking-widest">Add Expense</StyledText>
            </View>

            <View className="mb-8">
                <StyledText className="text-neo-subtext mb-2 text-xs font-bold uppercase tracking-widest">Amount</StyledText>
                <StyledInput
                    className="bg-transparent text-white text-5xl font-bold p-2 border-b border-neo-card_border"
                    placeholder="0"
                    placeholderTextColor="#333"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                    autoFocus
                />
            </View>

            <View className="mb-8">
                <StyledText className="text-neo-subtext mb-4 text-xs font-bold uppercase tracking-widest">Category</StyledText>
                <View className="flex-row flex-wrap">
                    {CATEGORIES.map((cat) => (
                        <StyledTouchableOpacity
                            key={cat}
                            onPress={() => setCategory(cat)}
                            className={`mr-3 mb-3 px-6 py-3 rounded-full border ${category === cat ? 'bg-neo-brand border-neo-brand' : 'bg-neo-card border-neo-card_border'}`}
                        >
                            <StyledText className={`${category === cat ? 'text-black font-bold' : 'text-neo-subtext font-medium'} capitalize`}>
                                {cat}
                            </StyledText>
                        </StyledTouchableOpacity>
                    ))}
                </View>
            </View>

            <View className="mb-8 flex-1">
                <StyledText className="text-neo-subtext mb-2 text-xs font-bold uppercase tracking-widest">Note (Optional)</StyledText>
                <StyledInput
                    className="bg-neo-card text-white p-4 rounded-3xl border border-neo-card_border text-base"
                    placeholder="What was this for?"
                    placeholderTextColor="#666"
                    value={note}
                    onChangeText={setNote}
                />
            </View>

            <NeoButton
                title="Save Transaction"
                onPress={handleSave}
            />
        </StyledView>
    );
}
