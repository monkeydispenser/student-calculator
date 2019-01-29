import * as React from "react";
import { ValueItem, ValueType, Period } from "../../@types/IBalanceSheet";
import { Input, Select, MenuItem, ListItem, InputAdornment, TextField, Fab, Icon } from "@material-ui/core";

const styles: any = {
    list: {
        display: "flex",
        flexDirection: "row",
        width: "100%"
    },
    field: {
        flex: "0 1 auto",
        margin: "4px",
        width: "30%"
    },
    valueIncome: {
        display: "flex",
        justifyContent: "flex-end",
        margin: "4px",
        width: "40%"
    },
    valueExpense: {
        display: "flex",
        justifyContent: "flex-start",
        margin: "4px",
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
        margin: "4px",
        width: "20%"
    },
    button: {
        flex: "0 1 auto",
        margin: "4px",
        width: "10%"
    }
};

interface Props extends ValueItem {
    groupId: number;
    onChange: (newValue: ValueItem, groupId: number) => void;
    onDelete: (id: number, groupId: number) => void;
}

export class BalanceSheetValue extends React.Component<Props> {

    private handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {
            groupId,
            id,
            title,
            value,
            period,
            type
        } = this.props;

        const newValue: ValueItem = {
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
                newValue.period = Number(targetValue);
                break;
        }

        // tslint:disable-next-line:no-unused-expression
        this.props.onChange && this.props.onChange(newValue, groupId);
    }

    private handleDelete = (event: React.MouseEvent) => {
        const {
            groupId,
            id
        } = this.props;

        // tslint:disable-next-line:no-unused-expression
        this.props.onDelete && this.props.onDelete(id, groupId);
    }

    public render() {

        const {
            title,
            value,
            period,
            type
        } = this.props;

        return (
            <ListItem
                style={styles.list}>
                <Input
                    style={styles.field}
                    type="text"
                    name="title"
                    value={title}
                    onChange={this.handleChange} />
                <div
                    style={(type === ValueType.Income ? styles.valueIncome : styles.valueExpense)}>
                    <TextField
                        style={(type === ValueType.Income ? styles.income : styles.expense)}
                        type="number"
                        name="value"
                        value={value ? value : ""}
                        inputProps={{
                            style: { textAlign: "right" },
                        }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">£</InputAdornment>,
                        }}
                        onChange={this.handleChange} />
                </div>
                <Select
                    style={styles.period}
                    name="period"
                    value={period}
                    onChange={this.handleChange}>
                    <MenuItem value={Period.Weekly}>Weekly</MenuItem>
                    <MenuItem value={Period.Monthly}>Monthly</MenuItem>
                    <MenuItem value={Period.Yearly}>Yearly</MenuItem>
                </Select>
                <div
                    style={styles.buttons}>
                    <Fab
                        color="secondary"
                        aria-label="Delete"
                        style={styles.fab}
                        onClick={this.handleDelete}>
                        <Icon>delete_icon</Icon>
                    </Fab>
                </div>
            </ListItem>
        );
    }
}
