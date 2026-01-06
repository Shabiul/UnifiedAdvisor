import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { styled } from 'nativewind';

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);

interface NeoButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    className?: string;
}

export const NeoButton: React.FC<NeoButtonProps> = ({ title, onPress, variant = 'primary', className = '' }) => {
    let bgClass = 'bg-white';
    let textClass = 'text-black';

    if (variant === 'secondary') {
        bgClass = 'bg-[#1a1a1a] border border-[#333]';
        textClass = 'text-white';
    } else if (variant === 'danger') {
        bgClass = 'bg-red-500';
        textClass = 'text-white';
    }

    return (
        <StyledTouchableOpacity
            onPress={onPress}
            className={`h-14 rounded-full justify-center items-center ${bgClass} ${className}`}
            activeOpacity={0.8}
        >
            <StyledText className={`font-bold text-lg ${textClass}`}>{title}</StyledText>
        </StyledTouchableOpacity>
    );
};
