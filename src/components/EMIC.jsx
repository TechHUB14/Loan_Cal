import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    TextField,
    Button,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    TablePagination,
    Grid,
    AppBar,
    Toolbar,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    CssBaseline,
    Switch
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';
import { useEMICalculator } from '../hooks/useEMICalculator';


const API_KEY = 'eb46df82b47648b9c3f1deb4';
const API_URL = 'https://open.er-api.com/v6/latest/USD';

export const EMIC = () => {
    const [principal, setPrincipal] = useState('');
    const [rate, setRate] = useState('');
    const [term, setTerm] = useState('');
    const [currency, setCurrency] = useState('INR');
    const [exchangeRates, setExchangeRates] = useState({});
    const [convertedEMI, setConvertedEMI] = useState(null);
    const [page, setPage] = useState(0); // Pagination state
    const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page state
    const [drawerOpen, setDrawerOpen] = useState(false); // State for mobile drawer
    const [darkMode, setDarkMode] = useState(false); // Dark Mode state

    const { emi, schedule, calculateEMI } = useEMICalculator();
    const navigate = useNavigate();

    const API_URL = 'https://open.er-api.com/v6/latest/USD';

    useEffect(() => {
        const fetchExchangeRates = async () => {
            try {
                const response = await axios.get(API_URL);
                const data = response.data;
                if (data.result === 'success') {
                    setExchangeRates(data.rates);
                } else {
                    console.error('Failed to fetch exchange rates:', data['error-type']);
                }
            } catch (error) {
                console.error('Error fetching exchange rates:', error);
            }
        };

        fetchExchangeRates();
    }, [currency]);



    useEffect(() => {
        if (!emi) return;
    
        if (currency === 'INR') {
            setConvertedEMI(emi.toFixed(2)); // No conversion needed
        } else if (exchangeRates[currency] && exchangeRates['INR']) {
            const rate = exchangeRates[currency]; // USD to selected currency
            const inUSD = emi / exchangeRates['INR']; // INR to USD
            const converted = inUSD * rate; // USD to target currency
            setConvertedEMI(converted.toFixed(2));
        }
    }, [emi, currency, exchangeRates]);
    

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setDarkMode(savedTheme === 'dark');
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const exchangeRateEntries = Object.entries(exchangeRates);

    const paginatedRates = exchangeRateEntries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
        },
    });

    const handleCalculate = () => {
        if (principal && rate && term) {
            calculateEMI(principal, rate, term);
        } else {
            alert("Please fill in all the fields to calculate EMI.");
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="sticky" sx={{ backgroundColor: 'rgba(29, 26, 26, 0.7)', backdropFilter: 'blur(5px)' }}>
            
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6">Loan Calculator</Typography>
                    <Switch
                        checked={darkMode}
                        onChange={() => setDarkMode(!darkMode)}
                        color="default"
                        aria-label="toggle dark mode"
                        sx={{ marginLeft: 'auto' }}
                    />
                </Toolbar>
            </AppBar>

            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
                <List>
                    <ListItem button onClick={() => navigate('/')}>
                        <ListItemText primary="Home" />
                    </ListItem>
                    <ListItem button onClick={() => navigate('/exchange-rates')}>
                        <ListItemText primary="Live Exchange Rates" />
                    </ListItem>
                    <ListItem button onClick={() => navigate('/*')}>
                        <ListItemText primary="Error Page" />
                    </ListItem>
                </List>
            </Drawer>

            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
             

                padding: 2,
            }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} md={6}>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Box
                               sx={{
                                maxWidth: 600,
                                mx: 'auto',
                                p: 3,
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: 2,
                                boxShadow: 3,
                                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                                backdropFilter: 'blur(8px)',
                                color: 'text.primary',
                            }}
                            >
                                <Typography variant="h5" gutterBottom>
                                    Loan EMI Calculator
                                </Typography>

                                <TextField
                                    fullWidth
                                    label="Loan Amount"
                                    type="number"
                                    margin="normal"
                                    value={principal}
                                    onChange={(e) => setPrincipal(e.target.value)}
                                />

                                <TextField
                                    fullWidth
                                    label="Annual Interest Rate (%)"
                                    type="number"
                                    margin="normal"
                                    value={rate}
                                    onChange={(e) => setRate(e.target.value)}
                                />

                                <TextField
                                    fullWidth
                                    label="Loan Term (months)"
                                    type="number"
                                    margin="normal"
                                    value={term}
                                    onChange={(e) => setTerm(e.target.value)}
                                />

                                <FormControl fullWidth sx={{ mt: 2 }}>
                                    <InputLabel>Currency</InputLabel>
                                    <Select
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value)}
                                        label="Currency"
                                    >
                                        <MenuItem value="INR">INR</MenuItem>
                                        <MenuItem value="USD">USD</MenuItem>
                                        <MenuItem value="EUR">EUR</MenuItem>
                                        <MenuItem value="GBP">GBP</MenuItem>
                                    </Select>
                                </FormControl>

                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    onClick={handleCalculate}
                                >
                                    Calculate EMI
                                </Button>

                                {emi && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.3 }}
                                    >
                                        <Typography
                                            variant="h6"
                                            color="primary"
                                            align="center"
                                            sx={{ mt: 3 }}
                                        >
                                            Monthly EMI: {currency} {convertedEMI || emi}
                                        </Typography>
                                    </motion.div>
                                )}

                                {schedule.length > 0 && (
                                    <TableContainer component={Paper} sx={{ mt: 4 }}>
                                        <Typography variant="h6" sx={{ p: 2 }}>
                                            Amortization Schedule
                                        </Typography>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Month</TableCell>
                                                    <TableCell>EMI</TableCell>
                                                    <TableCell>Principal</TableCell>
                                                    <TableCell>Interest</TableCell>
                                                    <TableCell>Balance</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {schedule.map((row, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{row.month}</TableCell>
                                                        <TableCell>{row.emi}</TableCell>
                                                        <TableCell>{row.principal}</TableCell>
                                                        <TableCell>{row.interest}</TableCell>
                                                        <TableCell>{row.balance}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </Box>
                        </motion.div>
                    </Grid>
                </Grid>
            </Box>
        </ThemeProvider>
    );
};

