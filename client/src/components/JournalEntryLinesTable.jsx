import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {MaterialReactTable} from "material-react-table";
import { fetchJournalEntryLines } from "../features/journalEntryLines/journalEntryLinesSlice";

export const JournalEntryLinesTable = () => {
  const dispatch = useDispatch();
  const { lines, loading, error } = useSelector(state => state.journalEntryLines);

  useEffect(() => {
    dispatch(fetchJournalEntryLines());
  }, [dispatch]);

  const columns = [
    { header: "تاريخ القيد", accessorKey: "JournalEntry.entry_date" },
    { header: "الوصف", accessorKey: "JournalEntry.description" },
    { header: "الحساب", accessorKey: "Account.name" },
    { header: "مدين", accessorKey: "debit" },
    { header: "دائن", accessorKey: "credit" }
  ];

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <MaterialReactTable
      columns={columns}
      data={lines}
      enableColumnFilters
      enableSorting
      enablePagination
    />
  );
};
