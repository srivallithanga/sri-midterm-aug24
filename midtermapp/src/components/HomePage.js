import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment-timezone';
import DataTable from 'react-data-table-component';
import { Button, Typography, Container, Paper, Box, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
    text: {
      primary: '#333',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: 16,
          marginBottom: 16,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          marginRight: 8,
        },
      },
    },
  },
});

function HomePage() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  useEffect(() => {
    if (isLoggedIn) {
      displayProducts();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (id) {
      viewProductDetails(id);
    }
  }, [id]);

  const displayProducts = () => {
    axios.get("http://localhost:3000/api/v1/products")
      .then(response => {
        setData(response.data.products);
      })
      .catch(error => {
        console.error(error);
        alert("Error fetching products.");
      });
  };

  const viewProductDetails = (productId) => {
    axios.get(`http://localhost:3000/api/v1/products/${productId}`)
      .then(response => {
        navigate(`/ShowProducts/${productId}`);
      })
      .catch(error => {
        console.error(error);
      });
  };

  

  

  const formatCreatedAt = (createdAt) => {
    return moment.utc(createdAt).tz('Asia/Kolkata').format('DD-MMM-YY');
  };

  const columns = [
    { name: 'Name', selector: row => row.name, sortable: true },
    { name: 'Description', selector: row => row.description},
    { name: 'Price', selector: row => row.price, sortable: true },
    { name: 'Status', selector: row => row.status ? 'Active' : 'Inactive'},
  ];

  const handleRowSelected = (state) => {
    setSelectedRows(state.selectedRows);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const filteredData = data
    .filter(product =>
      (product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === '' || (statusFilter === 'active' ? product.status : !product.status))
    );

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
        {isLoggedIn ? (
          <>
            <Typography variant="h4" gutterBottom>
              Display All Products
            </Typography>
            <Box marginBottom={2} display="flex" justifyContent="flex-end">
              <Button variant="contained" color="secondary" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
            <Paper>
              <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
                <TextField
                  label="Search by Name or Description"
                  variant="outlined"
                  onChange={handleSearch}
                  value={search}
                  sx={{ width: 300 }}
                />
                <FormControl variant="outlined" sx={{ width: 200 }}>
                  <InputLabel>Filter by Status</InputLabel>
                  <Select
                    label="Filter by Status"
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                  >
                    <MenuItem value="">All Statuses</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Paper>
            <Paper>
              <DataTable
                columns={columns}
                data={filteredData}
                pagination
                paginationPerPage={5}
                paginationRowsPerPageOptions={[3, 5, 10]}
                onSelectedRowsChange={handleRowSelected}
                expandableRows
                expandOnRowClicked
                expandableRowsComponent={({ data }) => (
                  <Paper style={{ padding: 16, marginTop: 8 }}>
                    <Typography variant="body1"><b>Code:</b> {data.code}</Typography>
                    <Typography variant="body1"><b>Name:</b> {data.name}</Typography>
                    <Typography variant="body1"><b>Description:</b> {data.description}</Typography>
                    <Typography variant="body1"><b>Status:</b> {data.status ? 'Active' : 'Inactive'}</Typography>
                    <Typography variant="body1"><b>Price:</b> {data.price}</Typography>
                    <Typography variant="body1"><b>Created At:</b> {formatCreatedAt(data.created_at)}</Typography>
                  </Paper>
                )}
                highlightOnHover
                pointerOnHover
              />
            </Paper>
          </>
        ) : (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '60vh'
            }}
          >
            <Typography variant="h3" component="div">
              Hello, welcome to my app!
            </Typography>
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default HomePage;
