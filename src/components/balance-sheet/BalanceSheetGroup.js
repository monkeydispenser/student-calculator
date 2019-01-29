import * as React from "react";
import PropTypes from "prop-types";
import { Button, Typography, List } from "@material-ui/core";

export class BalanceSheetGroup extends React.Component {

    static propTypes = {
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        onAdd: PropTypes.func.isRequired,
    };

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
