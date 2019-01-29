export interface ValueGroup {
    id: number;
    title: string;
    values: ValueItem[];
}

export interface ValueItem {
    id: number;
    title: string;
    value: number;
    period: Period;
    type: ValueType;
}

export enum Period {
    Weekly,
    Monthly,
    Yearly
}

export enum ValueType {
    Income,
    Expense
}