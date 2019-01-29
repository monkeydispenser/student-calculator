import * as React from "react";
import { Button, Typography, List } from "@material-ui/core";

// interface Props {
//     id: number;
//     title: string;
//     onAdd: (groupId: number, type: ValueType) => void;
// }

export class BalanceSheetGroup extends React.Component {

    render() {
        const {
            id,
            title,
            children
        } = this.props;

        return (
            <>
                <Typography variant="h3" gutterBottom>{title}</Typography>
                <Button onClick={() => { this.props.onAdd(id, "Income"); }}>Add Income</Button>
                <Button onClick={() => { this.props.onAdd(id, "Expense"); }}>Add Expense</Button>
                <List>
                    {children}
                </List>
            </>
        );
    }
}
