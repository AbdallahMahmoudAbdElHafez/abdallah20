import { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchIssueVoucherTypes,
  createIssueVoucherType,
  updateIssueVoucherType,
  deleteIssueVoucherType,
} from "../features/issueVoucherTypes/issueVoucherTypesSlice";

import { Button } from "@mui/material";

function IssueVoucherTypesPage() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.issueVoucherTypes);

  const [rowValues, setRowValues] = useState({});

  useEffect(() => {
    dispatch(fetchIssueVoucherTypes());
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "code",
        header: "Code",
      },
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "description",
        header: "Description",
      },
    ],
    []
  );

  return (
    <div className="p-4">
      <MaterialReactTable
        columns={columns}
        data={list}
        state={{ isLoading: loading }}
        enableEditing
        onEditingRowSave={({ values }) => {
          if (values.id) {
            dispatch(updateIssueVoucherType({ id: values.id, data: values }));
          } else {
            dispatch(createIssueVoucherType(values));
          }
        }}
        renderTopToolbarCustomActions={() => (
          <Button
            variant="contained"
            onClick={() => setRowValues({})}
          >
            Add New
          </Button>
        )}
        renderRowActions={({ row }) => (
          <Button
            color="error"
            onClick={() => dispatch(deleteIssueVoucherType(row.original.id))}
          >
            Delete
          </Button>
        )}
      />
    </div>
  );
}

export default IssueVoucherTypesPage;
