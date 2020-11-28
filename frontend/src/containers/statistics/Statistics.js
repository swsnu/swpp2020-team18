import React from 'react'
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

// var d = new Date();
// var n = d.getDay();

const data = [
  {
    name: 'MON',
    score: 4000,
    num_read_articles: 2,
  },
  {
    name: 'TUE',
    score: 3000,
    num_read_articles: 1,
  },
  {
    name: 'WED',
    score: 2000,
    num_read_articles: 0,
  },
  {
    name: 'THU',
    score: 2780,
    num_read_articles: 4,
  },
  {
    name: 'FRI',
    score: 1890,
    num_read_articles: 5,
  },
  {
    name: 'SAT',
    score: 2390,
    num_read_articles: 1,
  },
  {
    name: 'SUN',
    score: 3490,
    num_read_articles: 2,
  },
]

const useStyles = makeStyles(() => ({
  title: {
    margin: 0,
    padding: '5vh',
  },
}))

function Statistics() {
  const classes = useStyles()

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
        <div>
          <Grid container justify='center' alignItems='center'>
            <Typography variant='h5' component='h4' gutterBottom>
              Your Score
            </Typography>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} alignItems='center' justify='center'>
              <ResponsiveContainer width='100%' height={400}>
                <AreaChart
                  width={500}
                  height={400}
                  data={data}
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
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </div>
  )
}

export default Statistics
