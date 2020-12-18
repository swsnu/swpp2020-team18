import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory, Redirect } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { Tooltip as Tooltip_recharts } from 'recharts'
import { PieChart, Pie, Cell } from 'recharts'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import Copyright from '../../components/details/Copyright'
import CustomAppBar from '../../components/details/CustomAppBar'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import Paper from '@material-ui/core/Paper'
import Tooltip from '@material-ui/core/Tooltip'
import InfoIcon from '@material-ui/icons/Info'
import AddIcon from '@material-ui/icons/Add'
import Leaderboard from '../statistics/Leaderboard'

import * as wordlist from '../../ducks/wordlist'
import * as accounts from '../../ducks/accounts'

// var d = new Date();
// var n = d.getDay();

const CORRECT_COLOR = '#E7F1E8'
const WRONG_COLOR = '#FFD5D4'

const COLORS = [CORRECT_COLOR, WRONG_COLOR]

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill='black'
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline='central'
    >
      {`${index == 0 ? 'Correct ' : 'Wrong '}`}
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

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
    display: 'inline-block',
    padding: 0,
    minHeight: 0,
    minWidth: 0,
  },
  points: {
    color: '#228B22',
  },
  subbutton: {
    paddingTop: 30,
    minHeight: 0,
    minWidth: 0,
    width: '18%',
    margin: '0 auto',
  },
}))

const mapToDayname = (num) => {
  switch (num) {
    case 0:
      return 'MON'
    case 1:
      return 'TUE'
    case 2:
      return 'WED'
    case 3:
      return 'THU'
    case 4:
      return 'FRI'
    case 5:
      return 'SAT'
    case 6:
      return 'SUN'
  }
}

function ArticleResult(props) {
  const classes = useStyles()
  const history = useHistory()

  const [addedSet, setAddedSet] = React.useState([])

  if (!props.user) {
    return <Redirect to='/signin' />
  }

  // const arr = Object.entries(props.scores);

  // const data = arr.map((score) => ({
  //   name: mapToDayname(score[1]['day']),
  //   score: score[2]['score'],
  // })
  // )

  // console.log(arr)

  console.log(props.result)

  console.log('Render ArticleResult!')

  return (
    <div>
      <CustomAppBar />
      <Container component='main' maxWidth='md'>
        <CssBaseline />
        <Grid container justify='center' alignItems='center'>
          <Typography
            className={classes.title}
            variant='h3'
            component='h2'
            gutterBottom
          >
            Article Practice Result
          </Typography>
        </Grid>

        {
          // Pie Chart
          props.result && props.scores && (
            <>
              <Grid container justify='center' alignItems='center'>
                <Typography
                  variant='h5'
                  component='h4'
                  gutterBottom
                  className={classes.subtitle}
                >
                  Your Score
                </Typography>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6} alignItems='center' justify='center'>
                  <PieChart width={400} height={400}>
                    <Pie
                      data={[
                        {
                          name: 'Correct',
                          value: props.result.correct_answer_count,
                        },
                        {
                          name: 'Wrong',
                          value:
                            props.result.total_count -
                            props.result.correct_answer_count,
                        },
                      ]}
                      cx={200}
                      cy={200}
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={180}
                      fill='#8884d8'
                      dataKey='value'
                    >
                      {[
                        {
                          name: 'Correct',
                          value: props.result.correct_answer_count,
                        },
                        {
                          name: 'Wrong',
                          value:
                            props.result.total_count -
                            props.result.correct_answer_count,
                        },
                      ].map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </Grid>
                <Grid item xs={6} alignItems='center' justify='center'>
                  <Typography variant='h6' component='h6' gutterBottom>
                    You made {props.result.correct_answer_count} out of{' '}
                    {props.result.total_count}!
                  </Typography>

                  <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label='simple table'>
                      <TableHead>
                        <TableRow>
                          <TableCell>Keyword</TableCell>
                          <TableCell align='right'>Selected Answer</TableCell>
                          <TableCell align='right'>Correct Answer</TableCell>
                          <TableCell align='right'>Phrase</TableCell>
                          <TableCell align='right'>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {props.result.scored_phrases.map((phrase, idx) => (
                          <TableRow
                            key={idx}
                            className={
                              phrase.is_correct
                                ? classes.correctAnswer
                                : classes.wrongAnswer
                            }
                          >
                            <TableCell component='th' scope='row'>
                              {phrase.keyword}
                            </TableCell>
                            <TableCell align='right'>{phrase.answer}</TableCell>
                            <TableCell align='right'>
                              {phrase.correct_answer}
                            </TableCell>
                            <TableCell align='right'>
                              <Tooltip
                                title={phrase.content}
                                aria-label={phrase.content}
                              >
                                <InfoIcon />
                              </Tooltip>
                            </TableCell>

                            <TableCell align='right'>
                              {addedSet.includes(idx) ? (
                                'Added'
                              ) : (
                                <Tooltip
                                  title='Add phrase to wordlist'
                                  aria-label='Add phrase to wordlist'
                                >
                                  <IconButton
                                    onClick={() => {
                                      console.log('Add button clicked!')
                                      props.addWord(phrase.content)
                                      setAddedSet([...addedSet, idx])
                                      console.log(addedSet)
                                    }}
                                  >
                                    <AddIcon />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </>
          )
        }
        <br></br>
        {props.result && props.scores && (
          <div>
            <Grid container justify='center' alignItems='center'>
              <Typography
                variant='h5'
                component='h4'
                gutterBottom
                className={classes.subtitle}
              >
                Your Weekly Progress
              </Typography>
            </Grid>
            <Grid container justify='center' alignItems='center'>
              <Typography
                variant='h6'
                component='h6'
                gutterBottom
                className={classes.points}
              >
                + {props.result.correct_answer_count * 10} points!
              </Typography>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} alignItems='center' justify='center'>
                <ResponsiveContainer width='100%' height={400}>
                  <AreaChart
                    width={500}
                    height={400}
                    data={Object.entries(props.scores).map((score) => ({
                      name: mapToDayname(score[1]['day']),
                      score: score[1]['score'],
                    }))}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='name' />
                    <YAxis />
                    <Tooltip_recharts />
                    <Area
                      type='monotone'
                      dataKey='score'
                      stroke='#f1711b'
                      fill='#f1711b'
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Grid>
            </Grid>
          </div>
        )}
        <Leaderboard />
        <div className={classes.subbutton}>
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
      </Container>
    </div>
  )
}
const mapStateToProps = (state) => ({
  user: state.accounts.user,
  result: state.article.result,
  scores: state.accounts.scores,
})

const mapDispatchToProps = (dispatch) => ({
  addWord: (phrase) => {
    return dispatch(wordlist.addWord(phrase))
  },
  getScores: () => {
    return dispatch(accounts.getScores())
  },
})

ArticleResult.propTypes = {
  user: PropTypes.object,
  scores: PropTypes.any,
  addWord: PropTypes.func,
  getScores: PropTypes.func,
  result: PropTypes.object,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ArticleResult))
