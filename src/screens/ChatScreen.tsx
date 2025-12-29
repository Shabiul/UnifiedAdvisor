import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { styled } from 'nativewind';
import { useUserStore } from '../store/userStore';
import { generateAIResponse } from '../services/aiService';

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
    const { profile, financials } = useUserStore();
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
            className="flex-1 bg-slate-950"
        >
            <StyledView className="flex-1 p-4 pt-12">
                <View className="flex-row justify-between items-center mb-4 border-b border-slate-800 pb-4">
                    <View>
                        <StyledText className="text-white text-xl font-bold">AI Advisor</StyledText>
                        <StyledText className="text-emerald-400 text-xs font-medium">● Online</StyledText>
                    </View>
                </View>

                <ScrollView
                    ref={scrollViewRef}
                    className="flex-1 mb-4"
                    contentContainerStyle={{ paddingBottom: 20 }}
                >
                    {messages.map((msg) => (
                        <View
                            key={msg.id}
                            style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}
                            className={`max-w-[80%] mb-3 p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-600 rounded-tr-none' : 'bg-slate-800 rounded-tl-none'}`}
                        >
                            <StyledText className="text-white">{msg.text}</StyledText>
                            <StyledText className="text-slate-400 text-[10px] mt-1 text-right">
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </StyledText>
                        </View>
                    ))}
                    {isLoading && (
                        <View className="self-start bg-slate-800 p-3 rounded-2xl rounded-tl-none mb-3">
                            <ActivityIndicator size="small" color="#94a3b8" />
                        </View>
                    )}
                </ScrollView>

                <View className="flex-row items-center">
                    <StyledInput
                        className="flex-1 bg-slate-900 text-white p-4 rounded-full border border-slate-800 mr-2"
                        placeholder="Ask about goals, tax..."
                        placeholderTextColor="#64748b"
                        value={input}
                        onChangeText={setInput}
                        onSubmitEditing={handleSend}
                    />
                    <StyledTouchableOpacity
                        onPress={handleSend}
                        className="bg-blue-600 w-12 h-12 rounded-full items-center justify-center p-3"
                    >
                        <StyledText className="text-white font-bold text-lg">↑</StyledText>
                    </StyledTouchableOpacity>
                </View>
            </StyledView>
        </KeyboardAvoidingView>
    );
}
