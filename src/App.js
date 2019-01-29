import * as React from "react";
import "typeface-roboto";
import CssBaseline from "@material-ui/core/CssBaseline";
import BalanceSheet from "./containers/BalanceSheet";

export default class App extends React.Component {
    render() {
        return (
            <>
                <CssBaseline />
                <BalanceSheet />
            </>
        );
    }
}
