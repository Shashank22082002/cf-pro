import { useEffect, useMemo, useState } from "react";
import { useTable } from "react-table";

// columns of the table
const COLUMNS = [
    {
        Header: "#",
        accessor: "#"
    },
    {
        Header: "Problem - Title",
        accessor: "name"
    },
    {
        Header: "Tags",
        accessor: "tags"
    },
    {
        Header: "Rating",
        accessor: "rating"
    },
    {
        Header: "Link",
        accessor: "link",
        Cell: ({ value }) => (
            <a href={value} target="_blank" rel="noopener noreferrer">
                Link
            </a>
        )
    }
];

export const Table = (props) => {
    // console.log('Props table', props)
    const [data, setData] = useState([]);
    const columns = useMemo(() => COLUMNS, []);

    useEffect(() => {
        setData(props.list)
    }, [props.list])

    const tableInstance = useTable({
        columns,
        data
    });

    // get props from react - table
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = tableInstance;

    
    return (
        <div className="table-box">
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps()}>
                                    {" "}
                                    {column.render("Header")}{" "}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows?.map((row) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell) => {
                                    return (
                                        <td {...cell.getCellProps()}> {cell.render("Cell")} </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}   