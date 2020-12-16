import React, { useEffect } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core/styles'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import Copyright from '../../components/details/Copyright'
import CustomAppBar from '../../components/details/CustomAppBar'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import * as accounts from '../../ducks/accounts'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

const useStyles = makeStyles(() => ({
  title: {
    margin: 0,
    padding: '5vh',
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

function Statistics(props) {
  const classes = useStyles()
  useEffect(() => {
    props.getScores()
  }, [])

  if (!props.user) {
    return <Redirect to='/' />
  }

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
            Learning Statistics
          </Typography>
        </Grid>
        {props.scores && (
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
                    <Tooltip />
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
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.accounts.user,
  scores: state.accounts.scores,
})

const mapDispatchToProps = (dispatch) => ({
  getScores: () => {
    return dispatch(accounts.getScores())
  },
})

Statistics.propTypes = {
  user: PropTypes.object,
  scores: PropTypes.any,
  getScores: PropTypes.func,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Statistics))
