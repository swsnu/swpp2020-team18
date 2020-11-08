import React from 'react'
// import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import { Redirect } from 'react-router-dom'
import * as accounts from '../../ducks/accounts'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepButton from '@material-ui/core/StepButton'
import Divider from '@material-ui/core/Divider'
import { makeStyles } from '@material-ui/core/styles'

function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {'Copyright © '}
      <Link color='inherit' href='/'>
        Term&#39;inator
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  highlighted: {
    color: 'red',
    display: 'inline-block',
    backgroundColor: '#FFFF00',
    cursor: 'pointer',
  },
}))

function ArticleView(props) {
  const classes = useStyles()
  const steps = ['a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c', 'a']

  const [activeStep, setActiveStep] = React.useState(0)
  const [completed, setCompleted] = React.useState({})
  const handleStep = (step) => () => {
    setActiveStep(step)
    setCompleted({ ...completed, [step]: true })
  }
  // const handleComplete = () => {
  //   const newCompleted = completed;
  //   newCompleted[activeStep] = true;
  //   setCompleted(newCompleted);
  //   handleNext();
  // };

  if (props.user) {
    return <Redirect to='/' />
  }

  return (
    <Container component='main' maxWidth='md'>
      <CssBaseline />
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stepper alternativeLabel nonLinear activeStep={activeStep}>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepButton
                    onClick={handleStep(index)}
                    completed={completed[index]}
                  >
                    {label}
                  </StepButton>
                </Step>
              ))}
            </Stepper>
          </Grid>
          <Grid item xs={8}>
            <div>
              {' '}
              Lorem ipsum dolor{' '}
              <Typography display='inline' className={classes.highlighted}>
                sit amet
              </Typography>
              , consectetur adipiscing elit. Sed euismod risus a feugiat
              sagittis. Phasellus libero enim, commodo non tellus non, tempus
              porttitor velit. Pellentesque mauris dui, imperdiet in dui non,
              dictum maximus diam. Cras non lorem ac sem dictum aliquam. Nam
              iaculis dignissim nisi nec convallis. Aenean eu sagittis nisi.
              Curabitur non nulla in justo accumsan maximus. Aliquam scelerisque
              a nibh sit amet feugiat. Curabitur non massa quis ligula dignissim
              laoreet vel quis ante. Donec a libero sed eros fringilla imperdiet
              eu et nulla. Donec vitae justo porttitor, egestas quam sed, porta
              lacus. Cras elementum venenatis risus id pretium. Nunc vehicula
              efficitur dictum. Mauris vestibulum bibendum turpis, vitae
              consectetur magna feugiat quis. Nunc eu blandit neque. Nulla mattis
              sit amet ex ac malesuada. Cras ac metus sapien. Sed augue mauris,
              eleifend et aliquet quis, pellentesque id arcu. Suspendisse nisi
              augue, ultricies ac rhoncus a, iaculis at lacus. Proin quis
              hendrerit mi, eu venenatis lacus. Phasellus ut euismod urna. Sed
              tincidunt accumsan turpis a aliquet. Praesent est felis, mattis ac
              scelerisque ut, tristique in eros. Nullam commodo nisl purus,
              consequat viverra ligula congue sit amet. Fusce odio sem, convallis
              id sem sed, sollicitudin lobortis nunc. Quisque velit arcu,
              tincidunt at auctor at, porttitor quis ipsum. Morbi luctus lectus
              et tincidunt lobortis. Aliquam egestas porttitor enim a mollis.
              Nunc ornare et ipsum eget porta. Curabitur et hendrerit diam.
              Aenean quis rhoncus lacus. Ut sit amet scelerisque risus. Proin nec
              porta enim. Nulla odio odio, mollis vitae purus sit amet, fermentum
              aliquet diam. Nullam eu tristique tellus, sed finibus enim.
              Pellentesque aliquet consequat ex ut scelerisque. Vestibulum
              vestibulum justo non tellus tempor pellentesque. Ut eget tellus
              vehicula, facilisis turpis ac, aliquam urna. Curabitur id
              vestibulum metus. Aenean pulvinar augue felis, nec viverra purus
              imperdiet at. Donec viverra ut risus non accumsan. Curabitur auctor
              sodales augue. Proin consectetur sem sit amet augue imperdiet
              eleifend. Nulla dolor erat, rhoncus vel fermentum in, laoreet et
              nisi. Nulla semper nunc risus, et sollicitudin dui rhoncus
              tincidunt. Quisque sed varius orci. Pellentesque eget facilisis
              augue. Curabitur ac ex sollicitudin, faucibus arcu vel, tempor
              odio. Vivamus maximus, mi at eleifend vulputate, lorem urna
              malesuada lacus, vitae porttitor orci diam eget nunc. Cras
              tincidunt, ante vel condimentum suscipit, velit elit finibus enim,
              eget lobortis enim enim eget sapien. Nunc tempus consectetur quam
              sed pharetra.{' '}
            </div>
          </Grid>
          <Divider flexItem orientation='vertical' />
          <Grid item xs={3}>
            <div> Prororeo </div>
          </Grid>
        </Grid>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  )
}

const mapStateToProps = (state) => ({
  user: state.accounts.user,
})

const mapDispatchToProps = (dispatch) => ({
  onSignUp: (accountInfo) => dispatch(accounts.signUp(accountInfo)),
})

ArticleView.propTypes = {
  user: PropTypes.object,
  onSignUp: PropTypes.func,
}

export default connect(mapStateToProps, mapDispatchToProps)(ArticleView)
