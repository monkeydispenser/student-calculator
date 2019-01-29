import * as React from "react";
import "typeface-roboto";
import BalanceSheet from "./containers/BalanceSheet";

export default class App extends React.Component {
    public render() {
        return (
            <>
                <BalanceSheet />
            </>
        );
    }
}
