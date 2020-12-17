import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory, Redirect } from 'react-router-dom'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

import Copyright from '../../components/details/Copyright'
import CustomAppBar from '../../components/details/CustomAppBar'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import Paper from '@material-ui/core/Paper'
import badResultImage from '../../images/badresult.png'
import middleResultImage from '../../images/middleresult.png'
import goodResultImage from '../../images/goodresult.png'

import * as wordlist from '../../ducks/wordlist'
import * as accounts from '../../ducks/accounts'

const CORRECT_COLOR = '#E7F1E8'
const WRONG_COLOR = '#FFD5D4'

const useStyles = makeStyles(() => ({
  title: {
    margin: 0,
    padding: '5vh',
  },
  subtitle: {
    margin: 0,
    padding: '3vh',
  },
  wrongAnswer: {
    backgroundColor: WRONG_COLOR,
  },
  correctAnswer: {
    backgroundColor: CORRECT_COLOR,
  },
  button: {
    padding: 0,
    minHeight: 0,
    minWidth: 0,
    width: '18%',
    margin: '0 auto',
  },
  image: {
    width: '300px',
  },
  bigImage: {
    width: '200px',
  },
  table: {
    width: '80%',
    margin: '0 auto',
  },
  tableHead: {
    backgroundColor: '#414141',
  },
  tableHeadText: {
    color: 'white',
  },
  points: {
    color: '#228B22',
  },
}))

function ReviewTestResult(props) {
  const classes = useStyles()
  const history = useHistory()

  if (!props.user) {
    return <Redirect to='/signin' />
  }

  return (
    <div>
      <CustomAppBar />
      <div className={classes.root}>
        <CssBaseline />
        <h1 className={classes.title}>Review Test Result</h1>

        {props.result && (
          <>
            <div className={classes.result}>
              <div alignItems='center' justify='center'>
                {props.result.correct_answer_count / props.result.total_count <
                0.3 ? (
                  <img className={classes.bigImage} src={badResultImage}></img>
                ) : (
                  <img
                    className={classes.image}
                    src={
                      props.result.correct_answer_count /
                        props.result.total_count <
                      0.7
                        ? middleResultImage
                        : goodResultImage
                    }
                  ></img>
                )}
                <br></br>
                <br></br>
                <Typography variant='h6' component='h6' gutterBottom>
                  You made {props.result.correct_answer_count} out of{' '}
                  {props.result.total_count}!
                </Typography>
                <Typography
                  variant='h6'
                  component='h6'
                  gutterBottom
                  className={classes.points}
                >
                  + {10 * props.result.correct_answer_count} points!
                </Typography>
              </div>
              <br></br>
              <div alignItems='center' justify='center'>
                <TableContainer className={classes.table} component={Paper}>
                  <Table aria-label='simple table'>
                    <TableHead className={classes.tableHead}>
                      <TableRow>
                        <TableCell
                          className={classes.tableHeadText}
                          align='center'
                        >
                          Word
                        </TableCell>
                        <TableCell
                          className={classes.tableHeadText}
                          align='center'
                        >
                          Selected Answer
                        </TableCell>
                        <TableCell
                          className={classes.tableHeadText}
                          align='center'
                        >
                          Correct Answer
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {props.result.scored_words.map((word, idx) => (
                        <TableRow
                          key={idx}
                          className={
                            word.is_correct
                              ? classes.correctAnswer
                              : classes.wrongAnswer
                          }
                        >
                          <TableCell component='th' scope='row' align='center'>
                            {word.content}
                          </TableCell>
                          <TableCell align='center'>{word.answer}</TableCell>
                          <TableCell align='center'>
                            {word.correct_answer}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
          </>
        )}
        <br></br>
        <br></br>
        <div className={classes.button}>
          <Grid container>
            <Grid item xs={6}>
              <Button
                variant='contained'
                color='primary'
                onClick={() => history.push('/')}
              >
                OK
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant='contained'
                color='primary'
                onClick={() => history.push('/statistics')}
              >
                Statistics
              </Button>
            </Grid>
          </Grid>
        </div>

        <Box mt={8}>
          <Copyright />
        </Box>
        <br></br>
      </div>
    </div>
  )
}
const mapStateToProps = (state) => ({
  user: state.accounts.user,
  result: state.wordtest.testResult,
})

const mapDispatchToProps = (dispatch) => ({
  addWord: (word) => {
    return dispatch(wordlist.addWord(word))
  },
  getScores: () => {
    return dispatch(accounts.getScores())
  },
})

ReviewTestResult.propTypes = {
  user: PropTypes.object,
  addWord: PropTypes.func,
  getScores: PropTypes.func,
  result: PropTypes.object,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ReviewTestResult))
