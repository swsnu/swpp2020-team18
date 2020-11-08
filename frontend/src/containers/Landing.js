import React, { Fragment } from 'react'
// import { connect } from 'react-redux';
import articleImage from '../images/article.png'
import wordlistImage from '../images/wordlist.svg'
import testImage from '../images/exam.svg'
import statisticsImage from '../images/bar-chart.svg'
import '../App.css'
import './Landing.css'
import logoImage from '../images/logo.png'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
// import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { Link as RouterLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
// import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Link from '@material-ui/core/Link'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  logoutButton: {
    Right: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  logo: {
    marginRight: theme.spacing(2),
    maxWidth: 160,
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
}))

function Landing(props) {
  const classes = useStyles()

  if (props.user) {
    return <Redirect to='/signin' />
  }

  return (
    <Fragment className='frame flex-center'>
      <div className={classes.root}>
        <AppBar position='static'>
          <Toolbar>
            <img src={logoImage} alt='terminator' className={classes.logo} />
            <Typography variant='h6' className={classes.title}></Typography>
            <Button className={classes.logoutButton} color='inherit'>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      </div>

      <div className='container'>
        <Link
          className='item article'
          underline='none'
          component={RouterLink}
          to='/terminator/article'
        >
          <Card>
            <CardActionArea>
              <CardMedia
                component='img'
                alt='Article'
                // height='100%'
                image={articleImage}
                title='Article'
                // inline-block='false'
              />
              <CardContent>
                <Typography gutterBottom variant='h5' component='h2'>
                  Article Recommendation
                </Typography>
                <Typography variant='body2' color='textSecondary' component='p'>
                  Learn words from context through recommended articles! Articles
                  will be recommended based on your word proficiency.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Link>
        <Card className='item wordlist'>
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <Typography component='h5' variant='h5'>
                Live From Space
              </Typography>
              <Typography variant='subtitle1' color='textSecondary'>
                Mac Miller
              </Typography>
            </CardContent>
          </div>
          <CardMedia
            className={classes.cover}
            image={wordlistImage}
            title='Live from space album cover'
          />
        </Card>
        <button className='item test'>
          <img src={testImage} width='30%' alt='test' />
        </button>
        <button className='item stats'>
          <img src={statisticsImage} width='30%' alt='stats' />
        </button>
      </div>
    </Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.accounts.user,
})

Landing.propTypes = {
  user: PropTypes.object,
}

export default connect(mapStateToProps, null)(Landing)
