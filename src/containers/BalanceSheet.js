import * as React from "react";
import PropTypes from "prop-types";
import { BalanceSheetGroup } from "../components/balance-sheet/BalanceSheetGroup";
import { BalanceSheetValue } from "../components/balance-sheet/BalanceSheetValue";
import { Typography, InputAdornment, TextField, withStyles } from "@material-ui/core";
import Cookies from "js-cookie";

const styles = theme => ({
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

// interface Props {
//     cached?: any;
// }

// interface State {
//     balanceSheet: ValueGroup[];
// }

class BalanceSheet extends React.Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
    };

    constructor(props) {
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
                    period: "Yearly",
                    type: "Income"
                }]
            }, {
                id: 2,
                title: "Life",
                values: [{
                    id: 2,
                    title: "Rent",
                    value: 0,
                    period: "Yearly",
                    type: "Expense"
                }, {
                    id: 3,
                    title: "Food",
                    value: 0,
                    period: "Weekly",
                    type: "Expense"
                }]
            }, {
                id: 3,
                title: "Bills",
                values: [{
                    id: 4,
                    title: "Streaming Services",
                    value: 0,
                    period: "Monthly",
                    type: "Expense"
                }]
            }];

        this.state = {
            balanceSheet: previousState
        };
    }

    handleValueChange = (updatedValue, groupId) => {
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

    handleAddValue = (groupId, type) => {
        const valueGroups = [...this.state.balanceSheet];

        const groupIndex = valueGroups.findIndex((x) => x.id === groupId);
        const group = valueGroups[groupIndex];

        const currentIds = valueGroups.flatMap((valueGroup) => {
            return valueGroup.values.map((value) => value.id);
        });

        group.values.push({
            id: Math.max(...currentIds) + 1,
            title: type === "Income" ? "New Income" : "New Expense",
            value: 0,
            period: "Weekly",
            type
        });

        this.updateState(valueGroups);
    }

    handleDeleteValue = (id, groupId) => {
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

    updateState = (balanceSheets) => {
        Cookies.set("balance-sheet", JSON.stringify(balanceSheets));

        this.setState({
            balanceSheet: balanceSheets
        });
    }

    calculateWeeklyAvailable = () => {
        let weeklyAvailable = 0;

        const balanceSheets = [...this.state.balanceSheet];

        for (const balanceSheet of balanceSheets) {
            for (const value of balanceSheet.values) {
                let weeklyValue = 0;
                switch (value.period) {
                    case "Yearly":
                        weeklyValue = value.value / 52;
                        break;
                    case "Monthly":
                        weeklyValue = (value.value * 12) / 52;
                        break;
                    default:    // "Weekly"
                        weeklyValue = value.value;
                        break;
                }

                switch (value.type) {
                    case "Income":
                        weeklyAvailable = weeklyAvailable + weeklyValue;
                        break;
                    default:    // "Expense"
                        weeklyAvailable = weeklyAvailable - weeklyValue;
                        break;
                }
            }
        }

        return weeklyAvailable;
    }

    render() {
        const {
            balanceSheet
        } = this.state;

        const {
            classes
        } = this.props;

        const weeklyAvailable = this.calculateWeeklyAvailable();

        return (
            <div className={classes.root }>
                <Typography variant="h2" gutterBottom>Income and Expenditure</Typography>
                {
                    balanceSheet.map((valueGroup, index) => {
                        const {
                            values,
                            ...rest
                        } = valueGroup;

                        return <BalanceSheetGroup key={index} {...rest} onAdd={this.handleAddValue}>
                            {
                                values.map((value, subIndex) => (
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
                        InputProps={{
                            startAdornment: <InputAdornment position="start">£</InputAdornment>,
                            inputProps: {
                                style: { textAlign: "right" },
                            }
                        }}
                        variant="filled" />
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(BalanceSheet);