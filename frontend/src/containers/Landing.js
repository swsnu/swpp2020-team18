import React, { Fragment, useEffect } from 'react'
import articleImage from '../images/article.png'
import wordlistImage from '../images/wordlist.svg'
import testImage from '../images/exam.svg'
import statisticsImage from '../images/statistics.svg'
import './Landing.css'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { Link as RouterLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Link from '@material-ui/core/Link'
import CustomAppBar from '../components/details/CustomAppBar'
import Copyright from '../components/details/Copyright'
import * as accounts from '../ducks/accounts'

const useStyles = makeStyles(() => ({
  root: {
    height: '100vh',
    backgroundColor: '#f5f5f5',
  },
  card: {
    padding: 10,
  },
  cardContent: {
    height: 10,
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  cover: {
    width: 151,
  },
  content: {
    flex: '1 0 auto',
    textAlign: 'left',
  },
  side: {
    display: 'flex',
    height: '100%',
    justifyContent: 'space-between',
  },
  container: {
    display: 'grid',
    alignItems: 'stretch',
    justifyItems: 'stretch',
    rowGap: '10px',
    columnGap: '60px',
    gridTemplateColumns: '0 1fr 1fr',
    gridTemplateRows: '1fr 1fr 1fr',
    gridTemplateAreas: `"left article wordlist right"
       "left article test right"
       "left article stats right"`,
    paddingTop: '5vw',
    paddingBottom: '5vw',
    backgroundColor: '#f5f5f5',
  },
  article: {
    gridArea: 'article',
  },
  wordlist: {
    gridArea: 'wordlist',
  },
  test: {
    gridArea: 'test',
  },
  stats: {
    gridArea: 'stats',
  },
}))

function Landing(props) {
  const classes = useStyles()
  useEffect(() => {
    props.updateUserInfo()
  }, [])

  const random_number = 1 + Math.floor(Math.random() * 10)

  if (!props.user) {
    return <Redirect to='/signin' />
  }

  let article_url = props.user.recommendation_list
    ? `/article/${props.user.recommendation_list[0]}`
    : `/article/${random_number}`

  return (
    <Fragment>
      <CustomAppBar />
      <div className={classes.root}>
        <div className={classes.container}>
          <Link
            className={`${classes.article} item`}
            underline='none'
            component={RouterLink}
            to={article_url}
          >
            <Card>
              <CardActionArea>
                <CardMedia
                  component='img'
                  alt='Article'
                  image={articleImage}
                  title='Article'
                />
                <CardContent>
                  <Typography gutterBottom variant='h5' component='h2'>
                    Article Recommendation
                  </Typography>
                  <Typography
                    variant='body2'
                    color='textSecondary'
                    component='p'
                  >
                    Learn words from context through recommended articles!
                    Articles will be recommended based on your word proficiency.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Link>
          <Link
            className={`${classes.wordlist} item`}
            underline='none'
            component={RouterLink}
            to='/wordlist'
          >
            <Card className={classes.side}>
              <div className={classes.details}>
                <CardContent className={classes.content}>
                  <Typography component='h5' variant='h4'>
                    Wordlist
                  </Typography>
                  <Typography
                    variant='body2'
                    color='textSecondary'
                    component='p'
                  >
                    Look around your customized wordlist and review them!
                  </Typography>
                </CardContent>
              </div>
              <CardMedia className={classes.cover} image={wordlistImage} />
            </Card>
          </Link>
          <Link
            className={`${classes.test} item`}
            underline='none'
            component={RouterLink}
            to='/reviewtest'
          >
            <Card className={classes.side}>
              <div className={classes.details}>
                <CardContent className={classes.content}>
                  <Typography component='h5' variant='h4'>
                    Review Test
                  </Typography>
                  <Typography
                    variant='body2'
                    color='textSecondary'
                    component='p'
                  >
                    Take a review test so you can see your progress.
                  </Typography>
                </CardContent>
              </div>
              <CardMedia className={classes.cover} image={testImage} />
            </Card>
          </Link>
          <Link
            className={`${classes.stats} item`}
            underline='none'
            component={RouterLink}
            to='/statistics'
          >
            <Card className={classes.side}>
              <div className={classes.details}>
                <CardContent className={classes.content}>
                  <Typography component='h5' variant='h4'>
                    Statistics
                  </Typography>
                  <Typography
                    variant='body2'
                    color='textSecondary'
                    component='p'
                  >
                    Go and see how far you have reached.
                  </Typography>
                </CardContent>
              </div>
              <CardMedia className={classes.cover} image={statisticsImage} />
            </Card>
          </Link>
        </div>
        <Copyright />
        <br></br>
      </div>
    </Fragment>
  )
}

const mapDispatchToProps = (dispatch) => ({
  updateUserInfo: () => dispatch(accounts.checkLogin()),
})

const mapStateToProps = (state) => ({
  user: state.accounts.user,
})

Landing.propTypes = {
  user: PropTypes.object,
  updateUserInfo: PropTypes.func,
}

export default connect(mapStateToProps, mapDispatchToProps)(Landing)
