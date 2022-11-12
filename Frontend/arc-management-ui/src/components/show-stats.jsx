import { PureComponent } from "react";
import { withRouter } from './common/withRouter';
import { connect } from 'react-redux';
import { createTheme, CssBaseline, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Box, Container, styled } from "@mui/system";
import { tableCellClasses } from '@mui/material/TableCell';
import { getAdvQuery1Results, getAdvQuery2Results, getAllSports } from "../actions/actions";
import "./show-stats.css";

const theme = createTheme({
    typography: {
      fontFamily: [
        "Gill Sans", "sans-serif",
      ].join(','),
    }
});

const paperStyle = {padding : 20, alignItems: 'center'};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

export class ShowStats extends PureComponent {
    constructor(props){
        super(props);
        this.state = {
            selectedSport: 0,
            showGraph1: false
        };
    }

    async componentDidMount () {
        const { getAllSports, getAdvQuery2Results } = this.props;
        await getAllSports();
        await getAdvQuery2Results();
    };

    getAllSportsOption = () => {
        const { allSports } = this.props;
        const { selectedSport } = this.state;
        return (
            <FormControl id ="stats-sports-form" fullWidth>
                <InputLabel id="sports-label">Sport</InputLabel>
                <Select
                    labelId="sports-label"
                    id="all-sports-select"
                    value={selectedSport}
                    label="Sport"
                    onChange={(e) => this.onChangeSport(e)}
                >
                    <MenuItem value={0} key={0}>Select Sport</MenuItem>
                    {
                        allSports && allSports.length>0 && allSports.map((sport, i) => {
                            return (<MenuItem value={sport["sportId"]} key={i+1}>{sport["sportName"]}</MenuItem>);
                        })
                    }                    
                </Select>
            </FormControl>
        )
    };

    onChangeSport = async (e) => {
        const { getAdvQuery1Results } = this.props;
        const selectedSport = e.target.value;
        this.setState({selectedSport: selectedSport});
        if(selectedSport > 0){
            await getAdvQuery1Results(selectedSport);
            this.setState({showGraph1: true});
        }
        else{
            this.setState({showGraph1: false});
        }
    }

    render(){
        // console.log(this.props.advQuery1Results);
        const { advQuery1Results, advQuery2Results, allSports } = this.props;
        const { showGraph1 } = this.state;
        return (
            <div>
                <ThemeProvider theme={theme}>
                    <Container id="stats-container" component="main" maxWidth="xs">
                        <CssBaseline/>
                        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                            <Paper elevation={10} style={paperStyle}>
                                <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                                    <Typography sx= {{ marginBottom: 1 }} component="h1" variant="h4">Statistics</Typography>
                                    <Typography sx= {{ marginBottom: 3 }} component="h1" variant="h6">Query 1: Top 5 users who spent time playing a Sport</Typography>
                                    {allSports && allSports.length>0 && this.getAllSportsOption()}
                                    {showGraph1 && 
                                        <TableContainer component={Paper}>
                                            <Table sx={{ minWidth: 500 }} aria-label="customized table">
                                                <TableHead>
                                                <TableRow>
                                                    <StyledTableCell align="center">User Name</StyledTableCell>
                                                    <StyledTableCell align="center">Time Spent</StyledTableCell>
                                                </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                {advQuery1Results && advQuery1Results.map((row) => (
                                                    <StyledTableRow key={row.userName}>
                                                    <StyledTableCell align="center" component="th" scope="row">
                                                        {row.userName}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">{row.timeSpent}</StyledTableCell>
                                                    </StyledTableRow>
                                                ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    }
                                    <Typography sx= {{ marginBottom: 3 }} id="advanced-query-2 title" component="h1" variant="h6">Query 2: Top 10 most profitable events</Typography>
                                        <TableContainer component={Paper}>
                                            <Table sx={{ minWidth: 500 }} aria-label="customized table">
                                                <TableHead>
                                                <TableRow>
                                                    <StyledTableCell align="center">Event Name</StyledTableCell>
                                                    <StyledTableCell align="center">Profit Earned(in dollars)</StyledTableCell>
                                                </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                {advQuery2Results && advQuery2Results.map((row, i) => (
                                                    <StyledTableRow key={i}>
                                                    <StyledTableCell align="center" component="th" scope="row">
                                                        {row.eventName}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">{row.amountReceived}</StyledTableCell>
                                                    </StyledTableRow>
                                                ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                </Box> 
                            </Paper>
                        </Box>
                        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                            <Paper elevation={10} style={paperStyle}>
                                <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                                    <Typography sx= {{ marginBottom: 3 }} component="h1" variant="h6">Query 2: Top 5 revenue earning Events</Typography>
                                    <TableContainer component={Paper}>
                                        <Table sx={{ minWidth: 500 }} aria-label="customized table">
                                            <TableHead>
                                            <TableRow>
                                                <StyledTableCell align="center">Event Name</StyledTableCell>
                                                <StyledTableCell align="center">Total Revenue</StyledTableCell>
                                            </TableRow>
                                            </TableHead>
                                            <TableBody>
                                            {advQuery2Results && advQuery2Results.map((row) => (
                                                <StyledTableRow key={row.eventName}>
                                                <StyledTableCell align="center" component="th" scope="row">
                                                    {row.eventName}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">{row.totalRevenue}</StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                                
                            </Paper>
                        </Box>
                    </Container>
                </ThemeProvider>
            </div>
        );
    }

};

const mapStateToProps = (state) => {
    return {
        advQuery1Results: state.advQuery1Results,
        advQuery2Results: state.advQuery2Results,
        allSports: state.allSports
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getAdvQuery1Results: async (sportId) => dispatch(await getAdvQuery1Results(sportId)),
        getAdvQuery2Results: async () => dispatch(await getAdvQuery2Results()),
        getAllSports: async () => dispatch(await getAllSports())        
    };
  };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ShowStats));