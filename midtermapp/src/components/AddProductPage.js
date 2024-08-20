import React, { useState, useEffect } from "react";
import axios from "axios";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
    Button,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Box,
    Typography,
    Container,
    Paper,
    FormControlLabel,
    Checkbox,
    TextareaAutosize,
    Snackbar,
    Alert,
    CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function AddProductPage() {
    const [categories, setCategories] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success"); 
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate(); 

    const validationSchema = Yup.object({
        code: Yup.string()
            .required("Code is a required field")
            .max(6, "Code cannot exceed 6 characters"),
        name: Yup.string()
            .required("Name is a required field")
            .min(3, "Name must be at least 3 characters")
            .max(30, "Name cannot exceed 30 characters"),
        excerpt: Yup.string()
            .required("Excerpt is a required field")
            .max(200, "Excerpt cannot exceed 200 characters"),
        description: Yup.string()
            .required("Description is a required field")
            .min(30, "Description must be at least 30 characters")
            .max(500, "Description cannot exceed 500 characters"),
        category: Yup.string()
            .required("Category is a required field"),
        price: Yup.number()
            .required("Price is a required field")
            .positive("Price must be positive")
            .max(100000, "Price cannot exceed 100,000"),
        status: Yup.boolean().required("Status is a required field"),
    });

    useEffect(() => {
        axios.get("http://localhost:3000/api/v1/categories")
            .then(response => {
                setCategories(response.data.categories);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    const handleSubmit = (values, { resetForm }) => {
        setLoading(true); 
        axios.post("http://localhost:3000/api/v1/products", values)
            .then(function (response) {
                setSnackbarMessage("Product successfully added!");
                setSnackbarSeverity("success");
                setOpenSnackbar(true);
                setTimeout(() => {
                    setLoading(false); 
                    resetForm(); 
                    navigate('/'); 
                }, 2000); 
            })
            .catch(function (err) {
                setSnackbarMessage("Failed to add product.");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
                setLoading(false); 
            });
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Container maxWidth="sm">
           <Box display="flex" justifyContent="flex-end" mb={2}>
    <Button
      variant="contained"
      color="secondary"
      onClick={handleLogout}
    >
      Logout
    </Button>
  </Box>
            <Paper elevation={3} style={{ padding: 20, marginTop: 30 }}>
                <Typography variant="h5" gutterBottom>
                    Add New Product
                </Typography>
                <Formik
                    initialValues={{ code: "", name: "", excerpt: "", description: "", category: "", price: "", status: true }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, values, setFieldValue }) => (
                        <Form>
                            <Box mb={2}>
                                <TextField
                                    fullWidth
                                    name="code"
                                    label="Product Code"
                                    variant="outlined"
                                    placeholder="Enter Product Code"
                                    onChange={(e) => setFieldValue("code", e.target.value)}
                                />
                                <ErrorMessage name="code" component="div" className="error" style={{ color: 'red', marginTop: 5 }} />
                            </Box>

                            <Box mb={2}>
                                <TextField
                                    fullWidth
                                    name="name"
                                    label="Product Name"
                                    variant="outlined"
                                    placeholder="Enter Product Name"
                                    onChange={(e) => setFieldValue("name", e.target.value)}
                                />
                                <ErrorMessage name="name" component="div" className="error" style={{ color: 'red', marginTop: 5 }} />
                            </Box>

                            <Box mb={2}>
                                <TextField
                                    fullWidth
                                    name="excerpt"
                                    label="Excerpt"
                                    variant="outlined"
                                    placeholder="Enter Excerpt"
                                    onChange={(e) => setFieldValue("excerpt", e.target.value)}
                                />
                                <ErrorMessage name="excerpt" component="div" className="error" style={{ color: 'red', marginTop: 5 }} />
                            </Box>

                            <Box mb={2}>
                                <TextareaAutosize
                                    minRows={4}
                                    placeholder="Enter Description"
                                    name="description"
                                    onChange={(e) => setFieldValue("description", e.target.value)}
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                                <ErrorMessage name="description" component="div" className="error" style={{ color: 'red', marginTop: 5 }} />
                            </Box>

                            <Box mb={2}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        label="Category"
                                        name="category"
                                        value={values.category}
                                        onChange={(e) => setFieldValue("category", e.target.value)}
                                    >
                                        <MenuItem value="">
                                            <em>Select Category</em>
                                        </MenuItem>
                                        {categories.map(category => (
                                            <MenuItem key={category._id} value={category._id}>
                                                {category.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <ErrorMessage name="category" component="div" className="error" style={{ color: 'red', marginTop: 5 }} />
                            </Box>

                            <Box mb={2}>
                                <TextField
                                    fullWidth
                                    name="price"
                                    label="Price"
                                    type="number"
                                    variant="outlined"
                                    placeholder="Enter Price"
                                    onChange={(e) => setFieldValue("price", e.target.value)}
                                />
                                <ErrorMessage name="price" component="div" className="error" style={{ color: 'red', marginTop: 5 }} />
                            </Box>

                            <Box mb={2}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={values.status}
                                            onChange={(e) => setFieldValue("status", e.target.checked)}
                                        />
                                    }
                                    label="Status"
                                />
                                <ErrorMessage name="status" component="div" className="error" style={{ color: 'red', marginTop: 5 }} />
                            </Box>

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting || loading}
                                fullWidth
                            >
                                {isSubmitting || loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Paper>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                action={
                    <Button color="inherit" onClick={handleCloseSnackbar}>
                        Close
                    </Button>
                }
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default AddProductPage;
