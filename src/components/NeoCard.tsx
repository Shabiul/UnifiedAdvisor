import React from 'react';
import { View, TouchableOpacity, ViewProps } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface NeoCardProps extends ViewProps {
    onPress?: () => void;
    children: React.ReactNode;
    className?: string; // Add explicit className prop support for TS
}

export const NeoCard: React.FC<NeoCardProps> = ({ onPress, children, className = '', ...props }) => {
    const baseStyle = `bg-[#121212] border border-[#2A2A2A] rounded-3xl p-5 mb-4 ${className}`;

    if (onPress) {
        return (
            <StyledTouchableOpacity onPress={onPress} className={baseStyle} activeOpacity={0.7} {...props}>
                {children}
            </StyledTouchableOpacity>
        );
    }

    return (
        <StyledView className={baseStyle} {...props}>
            {children}
        </StyledView>
    );
};
