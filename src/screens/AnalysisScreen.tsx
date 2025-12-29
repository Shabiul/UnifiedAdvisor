import React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { styled } from 'nativewind';
import { PieChart } from 'react-native-chart-kit';
import { useUserStore } from '../store/userStore';

const StyledView = styled(View);
const StyledText = styled(Text);

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
    backgroundGradientFrom: "#1e293b",
    backgroundGradientTo: "#0f172a",
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
};

export default function AnalysisScreen() {
    const breakdown = useUserStore((state) => state.financials.expenses.breakdown);

    const data = Object.keys(breakdown).map((key) => {
        const amount = breakdown[key as keyof typeof breakdown];
        return {
            name: key.charAt(0).toUpperCase() + key.slice(1),
            population: amount,
            color: getColor(key),
            legendFontColor: "#cbd5e1",
            legendFontSize: 12
        };
    }).filter(item => item.population > 0);

    return (
        <StyledView className="flex-1 bg-slate-950 p-6 pt-12">
            <StyledText className="text-white text-2xl font-bold mb-6">Expense Analysis</StyledText>

            {data.length > 0 ? (
                <View className="items-center bg-slate-900 rounded-3xl p-4 mb-6">
                    <PieChart
                        data={data}
                        width={screenWidth - 60}
                        height={220}
                        chartConfig={chartConfig}
                        accessor={"population"}
                        backgroundColor={"transparent"}
                        paddingLeft={"15"}
                        center={[10, 0]}
                        absolute
                    />
                </View>
            ) : (
                <StyledView className="items-center justify-center p-10 bg-slate-900 rounded-3xl mb-6">
                    <StyledText className="text-slate-400">No expenses recorded yet.</StyledText>
                </StyledView>
            )}

            <StyledText className="text-white text-lg font-bold mb-4">Breakdown</StyledText>
            <ScrollView>
                {data.map((item, index) => (
                    <View key={index} className="flex-row justify-between items-center bg-slate-900 p-4 rounded-xl mb-3 border border-slate-800">
                        <View className="flex-row items-center">
                            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: item.color, marginRight: 10 }} />
                            <StyledText className="text-white font-medium">{item.name}</StyledText>
                        </View>
                        <StyledText className="text-white font-bold">₹{item.population}</StyledText>
                    </View>
                ))}
            </ScrollView>
        </StyledView>
    );
}

function getColor(category: string) {
    const colors: Record<string, string> = {
        food: '#f87171', // red-400
        rent: '#60a5fa', // blue-400
        travel: '#fbbf24', // amber-400
        shopping: '#c084fc', // purple-400
        utilities: '#4ade80', // green-400
        others: '#94a3b8' // slate-400
    };
    return colors[category] || '#94a3b8';
}
