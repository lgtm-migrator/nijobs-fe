import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import SelectableTable from "./SelectableTable";
import MutableDataTable from "./MutableDataTable";
import { RowPropTypes } from "./PropTypes";

const FilterableTable = ({
    tableComponent: Table = SelectableTable,
    rows,
    setRows,
    ...props
}) => {

    const [activeFilters, setActiveFilters] = useState({});
    const [initialRows] = useState(rows);

    useEffect(() => {
        const newRows = Object.values(activeFilters).reduce((updatedRows, filter) => filter(updatedRows), initialRows);
        setRows(newRows);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeFilters]);
    return (
        <Table
            rows={rows}
            setRows={setRows}
            filterable
            setActiveFilters={setActiveFilters}
            {...props}
        />
    );
};

FilterableTable.propTypes = {
    rows: PropTypes.arrayOf(RowPropTypes).isRequired,
    setRows: PropTypes.func,
    filters: PropTypes.arrayOf(
        PropTypes.shape({
            render: PropTypes.elementType.isRequired,
            id: PropTypes.string.isRequired,
        })
    ).isRequired,
    tableComponent: PropTypes.elementType,
};


const UncontrolledFilterableTable = (props) => (
    <MutableDataTable tableType={FilterableTable} {...props} />
);

export default UncontrolledFilterableTable;
