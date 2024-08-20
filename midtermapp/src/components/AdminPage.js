import React, { useState } from "react";
import { Container, Typography, TextField, Button, Box, Snackbar, Alert, CircularProgress, Paper } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); 

    const validationSchema = Yup.object({
        name: Yup.string()
            .required("Category name is required")
            .min(3, "Category name must be at least 3 characters")
            .max(30, "Category name cannot exceed 30 characters"),
        description: Yup.string()
            .required("Description is required")
            .min(50, "Description must be at least 50 characters")
            .max(500, "Description cannot exceed 500 characters"),
    });

    const handleSubmit = async (values, { resetForm }) => {
        setLoading(true);
        try {
            await axios.post("http://localhost:3000/api/v1/categories", values, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setMessage("Category added successfully!");
            resetForm(); 
            setTimeout(() => {
                navigate("/admin/add-product"); 
            }, 3000); 
        } catch (error) {
            console.error("Error adding category:", error);
            setMessage("Error adding category.");
        } finally {
            setLoading(false);
        }
    };
    

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
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
            <Paper elevation={3} style={{ padding: 20 }}>
                <Typography variant="h4" gutterBottom>
                    Add Category
                </Typography>
                <Formik
                    initialValues={{ name: "", description: "" }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <Field
                                name="name"
                                as={TextField}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                label="Category Name"
                                helperText={<ErrorMessage name="name" />}
                                error={Boolean(<ErrorMessage name="name" />)}
                                InputProps={{
                                    style: { color: '#333' }, 
                                }}
                                InputLabelProps={{
                                    style: { color: '#555' }, 
                                }}
                            />
                            <Field
                                name="description"
                                as={TextField}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                label="Description"
                                multiline
                                rows={4}
                                helperText={<ErrorMessage name="description" />}
                                error={Boolean(<ErrorMessage name="description" />)}
                                InputProps={{
                                    style: { color: '#333' }, 
                                }}
                                InputLabelProps={{
                                    style: { color: '#555' }, 
                                }}
                            />
                            <Box marginTop={2} display="flex" justifyContent="center">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={isSubmitting || loading}
                                    fullWidth
                                    style={{ position: 'relative' }}
                                >
                                    {loading ? (
                                        <CircularProgress size={24} style={{ position: 'absolute', left: '50%', top: '50%', marginLeft: -12, marginTop: -12 }} />
                                    ) : "Add Category"}
                                </Button>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Paper>
            {message && (
                <Snackbar
                    open={Boolean(message)}
                    autoHideDuration={6000}
                    onClose={() => setMessage("")}
                >
                    <Alert onClose={() => setMessage("")} severity={message.includes("Error") ? "error" : "success"}>
                        {message}
                    </Alert>
                </Snackbar>
            )}
        </Container>
    );
};

export default AdminPage;
