import { PureComponent } from "react";
import { withRouter } from './common/withRouter';
import { connect } from 'react-redux';
import { createTheme, CssBaseline, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider, Typography } from "@mui/material";
import { Box, Container, styled } from "@mui/system";
import { tableCellClasses } from '@mui/material/TableCell';
// import {
//     ArgumentAxis,
//     ValueAxis,
//     Chart,
//     BarSeries,
//   } from '@devexpress/dx-react-chart-material-ui';
import { getAdvQuery1Results } from "../actions/actions";
    
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

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const data = [
    { argument: 'Saket', value: 30 },
    { argument: 'Rishabh', value: 20 },
    { argument: 'Chinmay', value: 10 },
    { argument: 'Kedar', value: 50 },
    { argument: 'Bruce Wayne', value: 60 },
  ];

export class ShowStats extends PureComponent {
    constructor(props){
        super(props);
        this.state = {
        };
    }

    async componentDidMount () {
        const { getAdvQuery1Results } = this.props;
        await getAdvQuery1Results();
    };

    render(){
        // console.log(this.props.advQuery1Results);
        const { advQuery1Results } = this.props;

        return (
            <div>
                <ThemeProvider theme={theme}>
                    <Container id="edit-user-container" component="main" maxWidth="xs">
                        <CssBaseline/>
                        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                            <Paper elevation={10} style={paperStyle}>
                                <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                                    <Typography sx= {{ marginBottom: 1 }} component="h1" variant="h4">Statistics</Typography>
                                    <Typography sx= {{ marginBottom: 3 }} component="h1" variant="h6">Query 1: Top 5 users who spent time playing a Sport</Typography>
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
                                </Box>
                                
                            </Paper>
                        </Box>
                        
                    </Container>
                </ThemeProvider>
                {/* <Chart
                    data={data}
                >
                    <ArgumentAxis />
                    <ValueAxis />

                    <BarSeries valueField="value" argumentField="argument" />
                </Chart> */}
            </div>
        );
    }

};

const mapStateToProps = (state) => {
    return {
        advQuery1Results: state.advQuery1Results
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getAdvQuery1Results: async () => dispatch(await getAdvQuery1Results()),
        
    };
  };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ShowStats));