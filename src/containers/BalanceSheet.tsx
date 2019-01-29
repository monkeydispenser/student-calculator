import * as React from "react";
import { BalanceSheetGroup } from "../components/balance-sheet/BalanceSheetGroup";
import { BalanceSheetValue } from "../components/balance-sheet/BalanceSheetValue";
import { ValueGroup, ValueItem, Period, ValueType } from "../@types/IBalanceSheet";
import { Input, Typography, withStyles, InputAdornment, TextField } from "@material-ui/core";
import green from "@material-ui/core/colors/green";
import Cookies from "js-cookie";

const styles: any = (theme: any) => ({
    root: {
        padding: theme.spacing.unit,
        [theme.breakpoints.down("sm")]: {
            width: theme.breakpoints.values.sm
        },
        [theme.breakpoints.up("md")]: {
            width: theme.breakpoints.values.md
        },
        [theme.breakpoints.up("lg")]: {
            width: theme.breakpoints.values.lg
        },
    },
    result: {
        width: "70%",
        display: "flex",
        justifyContent: "flex-end"
    }
});

interface Props {
    cached?: any;
    classes: any;
}

interface State {
    balanceSheet: ValueGroup[];
}

class BalanceSheet extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        const previousStateString = Cookies.get("balance-sheet");

        const previousState = previousStateString ?
            JSON.parse(previousStateString) :
            [{
                id: 1,
                title: "Incomes",
                values: [{
                    id: 1,
                    title: "Maintenance Loan",
                    value: 0,
                    period: Period.Yearly,
                    type: ValueType.Income
                }]
            }, {
                id: 2,
                title: "Life",
                values: [{
                    id: 2,
                    title: "Rent",
                    value: 0,
                    period: Period.Yearly,
                    type: ValueType.Expense
                }, {
                    id: 3,
                    title: "Food",
                    value: 0,
                    period: Period.Weekly,
                    type: ValueType.Expense
                }]
            }, {
                id: 3,
                title: "Bills",
                values: [{
                    id: 4,
                    title: "Streaming Services",
                    value: 0,
                    period: Period.Monthly,
                    type: ValueType.Expense
                }]
            }];

        this.state = {
            balanceSheet: previousState
        };
    }

    private handleValueChange = (updatedValue: ValueItem, groupId: number) => {
        const valueGroups = [...this.state.balanceSheet];

        const groupIndex = valueGroups.findIndex((x) => x.id === groupId);
        const group = valueGroups[groupIndex];
        const values = [...group.values];

        const existingValueIndex = values.findIndex((x) => x.id === updatedValue.id);
        if (existingValueIndex > -1) {
            values[existingValueIndex] = updatedValue;
            group.values = values;
        }

        this.updateState(valueGroups);
    }

    private handleAddValue = (groupId: number, type: ValueType) => {
        const valueGroups = [...this.state.balanceSheet];

        const groupIndex = valueGroups.findIndex((x) => x.id === groupId);
        const group = valueGroups[groupIndex];

        const currentIds = valueGroups.flatMap((valueGroup: ValueGroup) => {
            return valueGroup.values.map((value: ValueItem) => value.id);
        });

        group.values.push({
            id: Math.max(...currentIds) + 1,
            title: type === ValueType.Income ? "New Income" : "New Expense",
            value: 0,
            period: Period.Weekly,
            type
        });

        this.updateState(valueGroups);
    }

    private handleDeleteValue = (id: number, groupId: number) => {
        const valueGroups = [...this.state.balanceSheet];

        const groupIndex = valueGroups.findIndex((x) => x.id === groupId);
        const group = valueGroups[groupIndex];
        const values = [...group.values];

        const existingValueIndex = values.findIndex((x) => x.id === id);
        if (existingValueIndex > -1) {
            values.splice(existingValueIndex, 1);
            group.values = values;
        }

        this.updateState(valueGroups);
    }

    private updateState = (balanceSheets: ValueGroup[]) => {
        Cookies.set("balance-sheet", JSON.stringify(balanceSheets));

        this.setState({
            balanceSheet: balanceSheets
        });
    }

    private calculateWeeklyAvailable = () => {
        let weeklyAvailable: number = 0;

        const balanceSheets = [...this.state.balanceSheet];

        for (const balanceSheet of balanceSheets) {
            for (const value of balanceSheet.values) {
                let weeklyValue: number = 0;
                switch (value.period) {
                    case Period.Yearly:
                        weeklyValue = value.value / 52;
                        break;
                    case Period.Monthly:
                        weeklyValue = (value.value * 12) / 52;
                        break;
                    case Period.Weekly:
                        weeklyValue = value.value;
                        break;
                }

                switch (value.type) {
                    case ValueType.Income:
                        weeklyAvailable = weeklyAvailable + weeklyValue;
                        break;
                    case ValueType.Expense:
                        weeklyAvailable = weeklyAvailable - weeklyValue;
                        break;
                }
            }
        }

        return weeklyAvailable;
    }

    public render() {
        const {
            balanceSheet
        } = this.state;

        const {
            classes
        } = this.props;

        const weeklyAvailable = this.calculateWeeklyAvailable();

        return (
            <div className={classes.root}>
                <Typography variant="h2" gutterBottom>Income and Expenditure</Typography>
                {
                    balanceSheet.map((valueGroup: ValueGroup, index: number) => {
                        const {
                            values,
                            ...rest
                        } = valueGroup;

                        return <BalanceSheetGroup key={index} {...rest} onAdd={this.handleAddValue}>
                            {
                                values.map((value: ValueItem, subIndex: number) => (
                                    <BalanceSheetValue key={subIndex} groupId={valueGroup.id} {...value} onChange={this.handleValueChange} onDelete={this.handleDeleteValue} />
                                ))
                            }
                        </BalanceSheetGroup>;
                    })
                }
                <Typography variant="h3" gutterBottom>Available Weekly Cash</Typography>
                <div
                    className={classes.result}>
                    <TextField
                        type="number"
                        value={weeklyAvailable.toFixed(2)}
                        inputProps={{
                            style: { textAlign: "right" },
                        }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">£</InputAdornment>,
                        }}
                        variant="filled"/>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(BalanceSheet);
