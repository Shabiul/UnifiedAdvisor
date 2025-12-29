export interface KnowledgeChunk {
    id: string;
    topic: string;
    content: string;
    keywords: string[];
}

const KNOWLEDGE_BASE: KnowledgeChunk[] = [
    {
        id: '1',
        topic: 'New Tax Regime 2024',
        content: 'Under the New Tax Regime (FY 2024-25), income up to ₹3 Lakhs is nil. ₹3-7L is 5%, ₹7-10L is 10%, ₹10-12L is 15%, ₹12-15L is 20%, and above ₹15L is 30%. Standard deduction of ₹50,000 is available.',
        keywords: ['tax', 'slab', 'new regime', '2024', '2025']
    },
    {
        id: '2',
        topic: 'Emergency Fund',
        content: 'An emergency fund should cover 6-12 months of your living expenses. It should be kept in liquid assets like Savings Account or Fixed Deposits, accessible immediately.',
        keywords: ['emergency', 'fund', 'savings', 'liquid']
    },
    {
        id: '3',
        topic: '50-30-20 Rule',
        content: 'The 50-30-20 rule suggests allocating 50% of income to Needs (Rent, Food), 30% to Wants (Shopping, Travel), and 20% to Savings & Investments.',
        keywords: ['budget', '50-30-20', 'rule', 'allocation']
    },
    {
        id: '4',
        topic: 'Mutual Funds',
        content: 'Mutual Funds pool money from investors to purchase securities. Equity funds invest in stocks for high growth (high risk), Debt funds in bonds for stability (low risk), and Hybrid funds mix both.',
        keywords: ['mutual fund', 'equity', 'debt', 'sip', 'invest']
    },
    {
        id: '5',
        topic: 'NPS (National Pension System)',
        content: 'NPS is a retirement savings scheme. It offers tax benefits under Sec 80CCD(1B) up to ₹50,000 over the ₹1.5L 80C limit. It has equity and debt options.',
        keywords: ['nps', 'pension', 'retirement', '80c', 'tax']
    }
];

export const retrieveContext = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    const relevantChunks = KNOWLEDGE_BASE.filter(chunk =>
        chunk.keywords.some(keyword => lowerQuery.includes(keyword)) ||
        chunk.content.toLowerCase().includes(lowerQuery)
    );

    if (relevantChunks.length === 0) return '';

    return relevantChunks.map(chunk => `[${chunk.topic}]: ${chunk.content}`).join('\n\n');
};
