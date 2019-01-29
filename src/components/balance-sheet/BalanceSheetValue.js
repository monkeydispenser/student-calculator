import * as React from "react";
import PropTypes from "prop-types";
import { Input, Select, MenuItem, ListItem, InputAdornment, TextField, Fab, Icon, withStyles } from "@material-ui/core";

const styles = ({ spacing }) => ({
    list: {
        display: "flex",
        flexDirection: "row",
        width: "100%"
    },
    field: {
        flex: "0 1 auto",
        margin: spacing.unit,
        width: "30%"
    },
    valueIncome: {
        display: "flex",
        justifyContent: "flex-end",
        margin: spacing.unit,
        width: "40%"
    },
    valueExpense: {
        display: "flex",
        justifyContent: "flex-start",
        margin: spacing.unit,
        width: "40%"
    },
    income: {
        backgroundColor: "rgba(0, 255, 0, 0.2)",
        width: "50%"
    },
    expense: {
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        width: "50%"
    },
    period: {
        flex: "0 1 auto",
        margin: spacing.unit,
        width: "20%"
    },
    buttons: {
        flex: "0 1 auto",
        margin: spacing.unit,
        width: "10%"
    }
});

// interface Props extends WithStyles<typeof styles>, ValueItem {
//     groupId: number;
//     onChange: (newValue: ValueItem, groupId: number) => void;
//     onDelete: (id: number, groupId: number) => void;
// }

export const BalanceSheetValue = withStyles(styles)(
    class extends React.Component {

        static propTypes = {
            groupId: PropTypes.number.isRequired,
            onChange: PropTypes.func.isRequired,
            onDelete: PropTypes.func.isRequired,
        };

        handleChange = (event) => {
            const {
                groupId,
                id,
                title,
                value,
                period,
                type
            } = this.props;

            const newValue = {
                id,
                title,
                value,
                period,
                type
            };

            const target = event.target;
            const targetValue = target.value;
            const targetName = target.name;

            switch (targetName) {
                case "title":
                    newValue.title = targetValue;
                    break;
                case "value":
                    newValue.value = Number(targetValue);
                    break;
                case "period":
                    newValue.period = targetValue;
                    break;
                default:
                    // Could not identify property changed
                    break;
            }

            // tslint:disable-next-line:no-unused-expression
            this.props.onChange && this.props.onChange(newValue, groupId);
        }

        handleDelete = (event) => {
            const {
                groupId,
                id
            } = this.props;

            // tslint:disable-next-line:no-unused-expression
            this.props.onDelete && this.props.onDelete(id, groupId);
        }

        render() {

            const {
                title,
                value,
                period,
                type,
                classes
            } = this.props;

            return (
                <ListItem
                    className={classes.list}>
                    <Input
                        className={classes.field}
                        type="text"
                        name="title"
                        value={title}
                        onChange={this.handleChange} />
                    <div
                        className={(type === "Income" ? classes.valueIncome : classes.valueExpense)}>
                        <TextField
                            className={(type === "Income" ? classes.income : classes.expense)}
                            type="number"
                            name="value"
                            value={value ? value : ""}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">£</InputAdornment>,
                                inputProps: {
                                    style: { textAlign: "right" },
                                }
                            }}
                            onChange={this.handleChange} />
                    </div>
                    <Select
                        className={classes.period}
                        name="period"
                        value={period}
                        onChange={this.handleChange}>
                        <MenuItem value={"Weekly"}>Weekly</MenuItem>
                        <MenuItem value={"Monthly"}>Monthly</MenuItem>
                        <MenuItem value={"Yearly"}>Yearly</MenuItem>
                    </Select>
                    <div
                        className={classes.buttons}>
                        <Fab
                            color="secondary"
                            aria-label="Delete"
                            onClick={this.handleDelete}>
                            <Icon>delete_icon</Icon>
                        </Fab>
                    </div>
                </ListItem>
            );
        }
    }
)
