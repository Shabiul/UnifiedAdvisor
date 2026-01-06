import React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { styled } from 'nativewind';
import { PieChart } from 'react-native-chart-kit';
import { useUserContext } from '../context/UserContext';
import { NeoCard } from '../components/NeoCard';

const StyledView = styled(View);
const StyledText = styled(Text);

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
    backgroundGradientFrom: "#121212",
    backgroundGradientTo: "#121212",
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
};

export default function AnalysisScreen() {
    const { financials } = useUserContext();
    const breakdown = financials.expenses.breakdown;

    const data = Object.keys(breakdown).map((key) => {
        const amount = breakdown[key as keyof typeof breakdown];
        return {
            name: key.charAt(0).toUpperCase() + key.slice(1),
            population: amount,
            color: getColor(key),
            legendFontColor: "#86868b",
            legendFontSize: 12
        };
    }).filter(item => item.population > 0);

    return (
        <StyledView className="flex-1 bg-primary pt-12">
            <StyledText className="text-neo-text text-2xl font-bold mb-6 px-5 uppercase tracking-widest">
                Expense Analysis
            </StyledText>

            <ScrollView className="px-5">
                {data.length > 0 ? (
                    <NeoCard className="items-center mb-6 pt-2 pb-6">
                        <PieChart
                            data={data}
                            width={screenWidth - 70}
                            height={220}
                            chartConfig={chartConfig}
                            accessor={"population"}
                            backgroundColor={"transparent"}
                            paddingLeft={"0"}
                            center={[5, 0]}
                            absolute
                            hasLegend={true}
                        />
                    </NeoCard>
                ) : (
                    <NeoCard className="items-center justify-center p-10 mb-6">
                        <StyledText className="text-neo-subtext font-bold">NO DATA AVAILABLE</StyledText>
                    </NeoCard>
                )}

                <StyledText className="text-neo-subtext text-xs font-bold uppercase mb-4 tracking-widest">
                    Detailed Breakdown
                </StyledText>

                {data.map((item, index) => (
                    <NeoCard key={index} className="flex-row justify-between items-center py-4 mb-3 border-b border-neo-card_border bg-[#1A1A1A] rounded-none border-t-0 border-l-0 border-r-0">
                        <View className="flex-row items-center">
                            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: item.color, marginRight: 12 }} />
                            <StyledText className="text-neo-text font-bold text-base">{item.name}</StyledText>
                        </View>
                        <StyledText className="text-neo-text font-bold text-lg">
                            ₹{item.population.toLocaleString('en-IN')}
                        </StyledText>
                    </NeoCard>
                ))}
            </ScrollView>
        </StyledView>
    );
}

function getColor(category: string) {
    const colors: Record<string, string> = {
        food: '#FF3B30',
        rent: '#3B82F6',
        travel: '#FFD60A',
        shopping: '#BF5AF2',
        utilities: '#32D74B',
        others: '#8E8E93'
    };
    return colors[category] || '#8E8E93';
}
