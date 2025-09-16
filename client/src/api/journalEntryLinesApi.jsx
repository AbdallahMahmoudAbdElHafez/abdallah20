// services/journalEntriesApi.js
import axios from "axios";

const API_URL = "/api/journal-entries";

export const fetchJournalEntries = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};
