import React, { useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import * as accounts from '../../ducks/accounts'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import LayersIcon from '@material-ui/icons/Layers'
import Fab from '@material-ui/core/Fab'
import Tooltip from '@material-ui/core/Tooltip'

const useStyles = makeStyles(() => ({
  title: {
    margin: 0,
    padding: '5vh',
  },
  subtitle: {
    margin: 0,
    padding: '3vh',
  },
}))

const getTier = (percentile) => {
  if (percentile > 95) return 0 // Diamond
  if (percentile > 90) return 1 // Gold
  if (percentile > 80) return 2 // Silver
  if (percentile > 50) return 3 // Bronze
  return 4 // Unranked
}

const getTierMessage = (tier) => {
  switch (tier) {
    case 0:
      return (
        <>
          Diamond{' '}
          <Tooltip title='Diamond tier is given to people over 95% percentile. Diamond is hardest material on earth. You study as hard as diamond!'>
            <Fab size='small' style={{ backgroundColor: '#1d1135' }}>
              <LayersIcon style={{ fill: '#B9F2FF' }} />
            </Fab>
          </Tooltip>
        </>
      )
    case 1:
      return (
        <>
          Gold{' '}
          <Tooltip title='Gold tier is given to people within 90%~95% percentile. Gold is very precious metal. You are also very precious!'>
            <Fab size='small' style={{ backgroundColor: '#1d1135' }}>
              <LayersIcon style={{ fill: 'gold' }} />
            </Fab>
          </Tooltip>
        </>
      )
    case 2:
      return (
        <>
          Silver{' '}
          <Tooltip title='Silver tier is given to people within 80%~90% percentile. Silver is well known for highest electrical conductivity. Let us enjoy the electricity!'>
            <Fab size='small' style={{ backgroundColor: '#1d1135' }}>
              <LayersIcon style={{ fill: 'silver' }} />
            </Fab>
          </Tooltip>
        </>
      )
    case 3:
      return (
        <>
          Bronze{' '}
          <Tooltip title='Bronze tier is given to people within 50%~80% percentile. Human widely used bronze in early era. Let us build civilization!'>
            <Fab size='small' style={{ backgroundColor: '#1d1135' }}>
              <LayersIcon style={{ fill: '#804A00' }} />
            </Fab>
          </Tooltip>
        </>
      )
    case 4:
      return (
        <>
          Unranked{' '}
          <Tooltip title='Unranked tier is given to people under 50% percentile. We have tons of possibility. Move forward and wreck havoc!'>
            <Fab size='small' style={{ backgroundColor: '#1d1135' }}>
              <LayersIcon style={{ fill: 'grey' }} />
            </Fab>
          </Tooltip>
        </>
      )
  }
}

function Leaderboard(props) {
  const classes = useStyles()
  useEffect(() => {
    // props.updateUserInfo()
    props.getRanking()
  }, [])

  if (!props.user) {
    return <Redirect to='/' />
  }

  const user = props.user
  const ranking = props.ranking

  if (props.ranking) {
    return (
      <div>
        <Grid container justify='center' alignItems='center'>
          <Typography
            variant='h5'
            component='h4'
            gutterBottom
            className={classes.subtitle}
          >
            Your Ranking
          </Typography>
        </Grid>
        <Grid container spacing={2}>
          {/* <Grid item xs={6} alignItems='center' justify='center'>Weekly</Grid>
                <Grid item xs={6} alignItems='center' justify='center'>Lifetime</Grid>
                <Grid item xs={6} alignItems='center' justify='center'>Icon</Grid>
                <Grid item xs={6} alignItems='center' justify='center'>Icon</Grid> */}

          <Grid item xs={12} alignItems='center' justify='center'>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label='simple table'>
                <TableHead>
                  <TableRow>
                    <TableCell>Time</TableCell>
                    <TableCell align='right'>Score</TableCell>
                    <TableCell align='right'>Rank ( Your / Total )</TableCell>
                    <TableCell align='right'>Percentile</TableCell>
                    <TableCell align='right'>Tier</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Weekly</TableCell>
                    <TableCell align='right'>{user.weekly_score}</TableCell>
                    <TableCell align='right'>{`${ranking.weeklyRank} / ${ranking.total_user_num}`}</TableCell>
                    <TableCell align='right'>
                      {(
                        ((ranking.total_user_num - ranking.weeklyRank) /
                          ranking.total_user_num) *
                        100
                      ).toFixed(2)}
                      {'%'}
                    </TableCell>
                    <TableCell align='right'>
                      {getTierMessage(
                        getTier(
                          ((ranking.total_user_num - ranking.weeklyRank) /
                            ranking.total_user_num) *
                            100
                        )
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
                <TableBody>
                  <TableRow>
                    <TableCell>Lifetime</TableCell>
                    <TableCell align='right'>{user.score}</TableCell>
                    <TableCell align='right'>{`${ranking.rank} / ${ranking.total_user_num}`}</TableCell>
                    <TableCell align='right'>
                      {(
                        ((ranking.total_user_num - ranking.rank) /
                          ranking.total_user_num) *
                        100
                      ).toFixed(2)}
                      {'%'}
                    </TableCell>
                    <TableCell align='right'>
                      {getTierMessage(
                        getTier(
                          ((ranking.total_user_num - ranking.rank) /
                            ranking.total_user_num) *
                            100
                        )
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </div>
    )
  }

  return null
}

const mapStateToProps = (state) => ({
  user: state.accounts.user,
  ranking: state.accounts.ranking,
})

const mapDispatchToProps = (dispatch) => ({
  getRanking: () => {
    return dispatch(accounts.getRanking())
  },
  updateUserInfo: () => dispatch(accounts.checkLogin()),
})

Leaderboard.propTypes = {
  user: PropTypes.object,
  ranking: PropTypes.any,
  getRanking: PropTypes.func,
  updateUserInfo: PropTypes.func,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Leaderboard))
