import * as React from "react";
import Input from "@material-ui/core/Input";
import { ValueItem, Period } from "../../@types/IBalanceSheet";
import { Select, MenuItem } from "@material-ui/core";

interface Props extends ValueItem {
    groupId: number;
    onChange: (newValue: ValueItem, groupId: number) => void;
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

    public render() {

        const {
            title,
            value,
            period,
            type
        } = this.props;

        return (
            <li>
                <Input
                    type="text"
                    name="title"
                    value={title}
                    onChange={this.handleChange} />
                <Input
                    type="number"
                    name="value"
                    value={value ? value : ""}
                    onChange={this.handleChange} />
                <Select
                    name="period"
                    value={period}
                    onChange={this.handleChange}>
                    <MenuItem value={Period.Weekly}>Weekly</MenuItem>
                    <MenuItem value={Period.Monthly}>Monthly</MenuItem>
                    <MenuItem value={Period.Yearly}>Yearly</MenuItem>
                </Select>
            </li>
        );
    }
}
