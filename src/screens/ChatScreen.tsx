import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { styled } from 'nativewind';
import { useUserContext } from '../context/UserContext';
import { generateAIResponse } from '../services/aiService';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NeoCard } from '../components/NeoCard';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

export default function ChatScreen() {
    const { profile, financials } = useUserContext();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: `Hi ${profile.name}! I'm your Personal AI Wealth Manager. Ask me anything about taxes, investments, or your budget.`,
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const aiText = await generateAIResponse(userMsg.text, profile, financials);
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: aiText,
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    }, [messages]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-primary"
        >
            <StyledView className="flex-1 p-5 pt-12">
                {/* Header */}
                <View className="flex-row justify-between items-center mb-6 pb-4 border-b border-neo-card_border">
                    <View className="flex-row items-center">
                        <StyledView className="w-10 h-10 rounded-full bg-neo-card items-center justify-center mr-3 border border-neo-brand">
                            <MaterialCommunityIcons name="robot" size={20} color="#39ff14" />
                        </StyledView>
                        <View>
                            <StyledText className="text-neo-text text-lg font-bold">AI Wealth Manager</StyledText>
                            <StyledText className="text-neo-brand text-xs font-bold uppercase tracking-widest">● Online</StyledText>
                        </View>
                    </View>
                </View>

                {/* Messages */}
                <ScrollView
                    ref={scrollViewRef}
                    className="flex-1 mb-4"
                    contentContainerStyle={{ paddingBottom: 20 }}
                    showsVerticalScrollIndicator={false}
                >
                    {messages.map((msg) => (
                        <View
                            key={msg.id}
                            style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}
                            className={`max-w-[85%] mb-4 p-4 rounded-2xl ${msg.sender === 'user'
                                    ? 'bg-neo-card border-none rounded-br-none'
                                    : 'bg-[#1a1a1a] border border-neo-card_border rounded-bl-none'
                                }`}
                        >
                            <StyledText className={`text-base leading-5 ${msg.sender === 'user' ? 'text-white' : 'text-neo-subtext'}`}>
                                {msg.text}
                            </StyledText>
                            <StyledText className="text-neo-subtext opacity-50 text-[10px] mt-2 text-right uppercase tracking-wider font-bold">
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </StyledText>
                        </View>
                    ))}
                    {isLoading && (
                        <View className="self-start bg-[#1a1a1a] border border-neo-card_border p-4 rounded-2xl rounded-bl-none mb-4">
                            <ActivityIndicator size="small" color="#39ff14" />
                        </View>
                    )}
                </ScrollView>

                {/* Input Area */}
                <View className="flex-row items-center bg-neo-card p-2 rounded-full border border-neo-card_border">
                    <StyledInput
                        className="flex-1 text-white px-4 py-2 font-medium"
                        placeholder="Ask for advice..."
                        placeholderTextColor="#666"
                        value={input}
                        onChangeText={setInput}
                        onSubmitEditing={handleSend}
                    />
                    <StyledTouchableOpacity
                        onPress={handleSend}
                        disabled={!input.trim()}
                        className={`w-10 h-10 rounded-full items-center justify-center ${input.trim() ? 'bg-neo-brand' : 'bg-neo-card_border'}`}
                    >
                        <MaterialCommunityIcons name="arrow-up" size={24} color={input.trim() ? "#000" : "#666"} />
                    </StyledTouchableOpacity>
                </View>
            </StyledView>
        </KeyboardAvoidingView>
    );
}
