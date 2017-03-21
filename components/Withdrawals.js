/**
 * Withdrawal object.  This is responsible for displaying and managing actions for withdrawals tied to a given account_id.
 * The information contained in each withdrawal object is minimal.  The most important aspect is likely the "withdrawal_uri" which is a link the merchant can go to in order to see more information about a particular withdrawal.
 * This link is WePay hosted so they will have to use their WePay login credentials to get to it, but that shouldn't be a problem.
 * These links are not typically exposed to the merchants by partners, but giving their support people access to them should help them solve some issues with withdrawals.
 *
 */
import React, { PropTypes } from 'react'
import {FormGroup, FormControl, Row, Col, ControlLabel, Table} from "react-bootstrap"
import { connect } from 'react-redux'
import {addCheckouts} from "../actions/checkouts"
import {BootstrapTable} from "react-bootstrap-table"

import Base from "./Base"

var Withdrawals= React.createClass({
    /**
     * Get the initial state for the withdrawals object
     *
     * This object doesn't really maintain any state information internally, so this is an empty object
     */
    getInitialState: function() {
        return {}
    },
    /**
     * Format the withdrawal id
     *
     * This turns all withdrawal_ids into links that, when clicked, will take the user to the uri that has more information about the withdrawal.
     * WARNING:     these uris are hosted on WePay.com.  The user will need to use their wepay email and password to get in.
     *              for whitelabeled partners, they may not want to use this option
     */
    formatWithdrawalId: function(cell, row) {
        return "<a target='_blank' href="+ row.withdrawal_data_withdrawal_uri + " id=" + cell + ">" + cell + "</a>";

    },
    /**
     * Flatten the dictionaries in the list of withdrawals.  React-bootstrap-table can't handle nested dictionaries
     *
     * @param info  -   the list of dictionaries we want to flatten
     */
    serializeWithdrawals: function(info) {
        var array = [];
        for (var i = 0; i < info.length; i++) {
            array.push(Base.flatten(info[i]));
        }
        return array;
    },
    /**
     * Flatten the dictionaries in the list of reserves.  React-bootstrap-table can't handle nested dictionaries.
     *
     * The reserves object needs a little special treatment because what we really want to flatten is the list "withdrwawals_schedule" which is returned when we fetch the reserves information.
     *
     * @param info  -   the list of dictionaries we want to flatten
     */
    serializeReserves: function(info) {
        var array = [];
        for (var i = 0; i < info.withdrawals_schedule.length; i++) {
            var f = Base.flatten(info.withdrawals_schedule[i]);
            f.account_id = info.account_id;
            f.reserved_amount = info.reserved_amount;
            f.currency = info.currency;
            array.push(f);
        }
        return array;
    },
    /**
     * Format the bank name and last four.
     *
     * @param cell  -   the cell that contains the last four digits of the merchant's bank account
     * @param row   -   the row that holds the cell.  We get the bank name from `row.bank_data_bank_name`
     */
    formatBank: function(cell, row) {
        return row.bank_data_bank_name + " XXXXXX" + cell;
    },
    /**
     * Format the "state" information of a given withdrawal.
     *
     * We want to display the state and the time that the withdrawal entered that state.  
     * These times are in different fields depending on the state.
     */
    formatState:function(cell, row) {
        if (cell == "captured") {
            return (<div>{cell}<br></br>{Base.formatDate(row.withdrawal_data_capture_time)}</div>);
        }
        else if(cell == "started") {
            return (<div>{cell}<br></br>{Base.formatDate(row.withdrawal_data_create_time)}</div>);
        }
        return (<div>{cell}</div>);
    },
    /**
     * Render the withdrawals and reserves information.
     *
     * Withdrawals and reserves are displayed in two different tables.
     */
    render: function() {
        var withdrawals = this.props.withdrawalInfo;
        var reserve = this.props.reserveInfo;
        var withdrawal_content = (<div></div>);
        var reserve_content = (<div></div>);
        var this2 = this;
        if (this.props.isFetching) {
            return Base.isFetchingSpinner();
        }
        if (this.props.withdrawalInfo === undefined || $.isEmptyObject(this.props.error) == false){
            withdrawal_content = withdrawal_content;
        }
        else {
            withdrawals = this.serializeWithdrawals(withdrawals);
            withdrawal_content = (
                <div id="withdrawals_table">
                    <h4>Withdrawals</h4>
                    <BootstrapTable
                        data={withdrawals}
                        striped={true}
                        hover={true}
                        pagination={true}
                    >
                        <TableHeaderColumn 
                            dataField="withdrawal_id" 
                            isKey={true}  
                            dataFormat={this.formatWithdrawalId}
                            >
                            Withdrawal ID
                        </TableHeaderColumn>
                        <TableHeaderColumn 
                            dataField="amount" 
                            >
                            Amount ({withdrawals[0] ? withdrawals[0].currency : "Currency"})
                        </TableHeaderColumn>
                        <TableHeaderColumn 
                            dataField="state"
                            dataSort={true} 
                            dataFormat={this.formatState}
                            >
                            State
                        </TableHeaderColumn>
                        <TableHeaderColumn 
                            dataField="bank_data_account_last_four" 
                            dataFormat={this.formatBank}
                            >
                            Bank
                        </TableHeaderColumn>
                    </BootstrapTable>
                    <hr></hr>
                </div>
            );
        }

        if(reserve == null || $.isEmptyObject(this.props.error) == false){
            reserve_content = reserve_content;
        }
        else {
            reserve = this.serializeReserves(reserve);
            console.log("RESERVES: ", reserve);
            reserve_content = (
                <div id="reserves_table">
                    <h4>Reserves</h4>
                    <BootstrapTable
                        data={reserve}
                        striped={true}
                        hover={true}
                        pagination={true}
                    >
                        <TableHeaderColumn 
                            dataField="account_id" 
                            >
                            Account ID
                        </TableHeaderColumn>
                        <TableHeaderColumn
                            dataField = "reserved_amount"
                            >
                            Total Reserved ({reserve[0] ? reserve[0].currency : "Currency"})
                        </TableHeaderColumn>
                        <TableHeaderColumn
                            dataField="amount"
                            >
                            Next Withdrawal Amount
                        </TableHeaderColumn>
                        <TableHeaderColumn
                            dataField="time"
                            dataFormat={Base.formatDate}
                            isKey={true}  
                            >
                            Next Withdrawal Date
                        </TableHeaderColumn>
                    </BootstrapTable>
                    <hr></hr>
                </div>
            )
        }
        return (<div id="withdrawal_reserve">{withdrawal_content}{reserve_content}</div>);
    }
});

/**
 * Map the Redux state to the properties for this object.
 *
 * withdrawalInfo:  the list of withdrawals
 * reserveInfo:     the list of reserves
 * erorr:           error information relating to withdrawals or reserves raised by /actions/withdrawal or /reducer/withdrawal
 * isFetching:      true if the withdrawal object is fetching (which fetches reserves at the same time)
 */
const mapStateToProps = (state) => {
    return {
        withdrawalInfo:     state.wepay_withdrawal.withdrawal.withdrawalInfo,
        reserveInfo:        state.wepay_withdrawal.withdrawal.reserveInfo,
        error:              state.errors.withdrawal ? state.errors.withdrawal.info : {},
        isFetching:         state.wepay_withdrawal.withdrawal.isFetching,
        userInfo:           state.wepay_user.user.userInfo

    }
}

Withdrawals = connect(mapStateToProps)(Withdrawals);


export default Withdrawals
