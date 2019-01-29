import * as React from "react";
import { Button } from "@material-ui/core";
import { ValueType } from "../../@types/IBalanceSheet";

interface Props {
    id: number;
    title: string;
    onAdd: (groupId: number, type: ValueType) => void;
}

export class BalanceSheetGroup extends React.Component<Props> {

    public render() {
        const {
            id,
            title,
            children
        } = this.props;

        return (
            <>
                <h2>{title}</h2>
                <Button onClick={() => { this.props.onAdd(id, ValueType.Income); }}>Add Income</Button>
                <Button onClick={() => { this.props.onAdd(id, ValueType.Expense); }}>Add Expense</Button>
                <ul>
                    {children}
                </ul>
            </>
        );
    }
}
