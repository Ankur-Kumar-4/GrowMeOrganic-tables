import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";

interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

interface SelectionChangeParams {
  value: Artwork[];
}

const Tables: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);
  const [rowClick, setRowClick] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage] = useState(10); // Fixed at 10 as per API limit

  const fetchData = async (page: number) => {
    try {
      const response = await axios.get(
        `https://api.artic.edu/api/v1/artworks?page=${page + 1}` // API uses 1-based index
      );
      const fetchedData = response.data.data.map((artwork: any) => ({
        id: artwork.id,
        title: artwork.title,
        place_of_origin: artwork.place_of_origin,
        artist_display: artwork.artist_display,
        inscriptions: artwork.inscriptions,
        date_start: artwork.date_start,
        date_end: artwork.date_end,
      }));
      setArtworks(fetchedData);
      setTotalRecords(response.data.pagination.total); // Total number of records
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const onPageChange = (event: {
    first: number;
    rows: number;
    page: number;
    pageCount: number;
  }) => {
    setCurrentPage(event.page);
  };

  return (
    <div>
      <DataTable
        value={artworks}
        selectionMode={rowClick ? null : "checkbox"}
        selection={selectedArtworks}
        onSelectionChange={(e: SelectionChangeParams) =>
          setSelectedArtworks(e.value)
        }
        dataKey="id"
        tableStyle={{ minWidth: "50rem" }}
        rows={rowsPerPage} // Fixed rowsPerPage
        first={currentPage * rowsPerPage}
        totalRecords={totalRecords}
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: "3rem" }}
        ></Column>
        <Column field="title" header="Title"></Column>
        <Column field="place_of_origin" header="Place of Origin"></Column>
        <Column field="artist_display" header="Artist"></Column>
        <Column field="inscriptions" header="Inscriptions"></Column>
        <Column field="date_start" header="Date Start"></Column>
        <Column field="date_end" header="Date End"></Column>
      </DataTable>

      <Paginator
        first={currentPage * rowsPerPage}
        rows={rowsPerPage}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
        rowsPerPageOptions={[10]} // Options for rows per page
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
      />
    </div>
  );
};

export default Tables;
