import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import {
    IconButton,
    makeStyles,
    TableCell,
    Tooltip,
    Typography,
} from "@material-ui/core";
import { RowPropTypes } from "../../../utils/Table/PropTypes";
import { getFieldValue } from "../../../utils/Table/utils";
import { ApplicationStateLabel } from "./ApplicationsReviewTableSchema";
import { Check, Clear, ExpandMore, ExpandLess } from "@material-ui/icons";
import { approveApplication, rejectApplication } from "../../../services/applicationsReviewService";
import { addSnackbar } from "../../../actions/notificationActions";
import { connect } from "react-redux";
import ConfirmRejectDialog from "./ConfirmRejectDialog";

const useStyles = makeStyles(() => ({
    tableRowActions: {
        minWidth: "150px",
    },
}));

const ActionButtons = ({ row, handleAction, isCollapseOpen, toggleCollapse }) => (
    <>
        {getFieldValue(row, "state") === ApplicationStateLabel.PENDING &&
            <>
                <Tooltip
                    title="Approve"
                    placement="top"
                >
                    <IconButton
                        aria-label="Approve Application"
                        onClick={handleAction("Approve")}
                    >
                        <Check />
                    </IconButton>
                </Tooltip>
                <Tooltip
                    title="Reject"
                    placement="top"
                >
                    <IconButton
                        aria-label="Reject Application"
                        onClick={handleAction("Reject")}
                    >
                        <Clear />
                    </IconButton>
                </Tooltip>
            </>
        }
        <IconButton
            aria-label="More Actions"
            edge="end"
            onClick={(e) => {
                e.stopPropagation(); toggleCollapse();
            }}
        >
            {!isCollapseOpen ? <ExpandMore/> : <ExpandLess/>}
        </IconButton>
    </>
);

ActionButtons.propTypes = {
    row: RowPropTypes,
    isCollapseOpen: PropTypes.bool.isRequired,
    toggleCollapse: PropTypes.func.isRequired,
    handleAction: PropTypes.func.isRequired,
};

const RowActionsContainer = ({
    row, actionToConfirm, confirmAction, cancelAction, handleAction, handleApprove, isCollapseOpen, toggleCollapse,
}) => {
    const classes = useStyles();

    return (
        <div className={classes.tableRowActions}>
            {actionToConfirm === "Approve" ?
                <>
                    <Typography
                        variant="body2"
                        display="inline"
                        color="primary"
                    >
                        Approve?
                    </Typography>
                    <IconButton
                        aria-label="Confirm Approval"
                        onClick={confirmAction(handleApprove)}
                    >
                        <Check />
                    </IconButton>
                    <IconButton
                        aria-label="Cancel Approval"
                        onClick={cancelAction}
                    >
                        <Clear />
                    </IconButton>
                </>
                :
                <ActionButtons
                    row={row}
                    handleAction={handleAction}
                    isCollapseOpen={isCollapseOpen}
                    toggleCollapse={toggleCollapse}
                />
            }
        </div>
    );
};

RowActionsContainer.propTypes = {
    row: RowPropTypes,
    isCollapseOpen: PropTypes.bool.isRequired,
    toggleCollapse: PropTypes.func.isRequired,
    actionToConfirm: PropTypes.func.isRequired,
    confirmAction: PropTypes.func.isRequired,
    cancelAction: PropTypes.func.isRequired,
    handleAction: PropTypes.func.isRequired,
    handleApprove: PropTypes.func.isRequired,
};

const BaseRowActions = ({
    addSnackbar, row, submitUndoableAction, context = {}, isCollapseOpen, toggleCollapse,
}) => {

    const [actionToConfirm, setActionToConfirm] = useState(null);
    const [rejectReason, setRejectReason] = useState("");

    const { approveApplicationRow, rejectApplicationRow } = context;

    const handleApprove = useCallback(
        () => {
            setActionToConfirm(null);

            submitUndoableAction(
                row.key,
                `Approving Application for ${getFieldValue(row, "name")}...`,
                () => {
                    approveApplication(row.key)
                        .then(() => approveApplicationRow(row))
                        .catch(() => {
                            addSnackbar({
                                message: `An unexpected error occurred. Could not approve ${getFieldValue(row, "name")}'s application.`,
                                key: `${row.key}-error`,
                            });
                        });
                },
                () => {},
                3000
            );
        },
        [addSnackbar, approveApplicationRow, row, submitUndoableAction],
    );

    const handleReject = useCallback(
        () => {
            setActionToConfirm(null);

            submitUndoableAction(
                row.key,
                `Rejecting Application for ${getFieldValue(row, "name")}...`,
                () => {
                    rejectApplication(row.key, rejectReason)
                        .then(() => {
                            rejectApplicationRow(row, rejectReason);
                        })
                        .catch(() => {
                            addSnackbar({
                                message: `An unexpected error occurred. Could not reject ${getFieldValue(row, "name")}'s application.`,
                                key: `${row.key}-error`,
                            });
                        });
                },
                () => {},
                3000
            );
        }, [addSnackbar, rejectApplicationRow, rejectReason, row, submitUndoableAction]);


    const handleAction = (actionLabel) => (e) => {
        e.stopPropagation();
        setActionToConfirm(actionLabel);
    };

    const cancelAction = (e) => {
        e.stopPropagation();
        setRejectReason("");
        setActionToConfirm(null);
    };

    const confirmAction = (handler) => (e) => {
        e.stopPropagation();
        handler();
    };

    return (
        <>
            <ConfirmRejectDialog
                open={actionToConfirm === "Reject"}
                rejectReason={rejectReason}
                setRejectReason={setRejectReason}
                handleReject={handleReject}
                cancelAction={cancelAction}
            />
            <TableCell align="right">
                <RowActionsContainer
                    row={row}
                    actionToConfirm={actionToConfirm}
                    confirmAction={confirmAction}
                    cancelAction={cancelAction}
                    handleAction={handleAction}
                    handleApprove={handleApprove}
                    handleReject={handleReject}
                    isCollapseOpen={isCollapseOpen}
                    toggleCollapse={toggleCollapse}
                />
            </TableCell>
        </>
    );
};

BaseRowActions.propTypes = {
    addSnackbar: PropTypes.func.isRequired,
    context: PropTypes.shape({
        approveApplicationRow: PropTypes.func.isRequired,
        rejectApplicationRow: PropTypes.func.isRequired,
    }),
    isCollapseOpen: PropTypes.bool.isRequired,
    toggleCollapse: PropTypes.func.isRequired,
    row: RowPropTypes,
    submitUndoableAction: PropTypes.func,
};

const mapStateToProps = () => ({});
const mapDispatchToProps = (dispatch) => ({
    addSnackbar: (notification) => dispatch(addSnackbar(notification)),
});

export const RowActions = connect(mapStateToProps, mapDispatchToProps)(BaseRowActions);
