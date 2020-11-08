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

const articleObject = {
  title: 'The Shadow Side of Greatness',
  author: 'James Clear',
  content:
    'Pablo Picasso. He is one of the most famous artists of the 20th century and a household name even among people who, like myself, consider themselves to be complete novices in the art world. \
            I recently went to a Picasso exhibition. What impressed me the most was not any individual piece of art, but rather his remarkably prolific output. Researchers have catalogued 26,075 pieces of art created by Picasso and some people believe the total number is closer to 50,000. \
            When I discovered that Picasso lived to be 91 years old, I decided to do the math. Picasso lived for a total of 33,403 days. With 26,075 published works, that means Picasso averaged 1 new piece of artwork every day of his life from age 20 until his death at age 91. He created something new, every day, for 71 years. \
            This unfathomable output not only played a large role in Picasso’s international fame, but also enabled him to amass a huge net worth of approximately $500 million by the time of his death in 1973. His work became so famous and so numerous that, according to the Art Loss Register, Picasso is the most stolen artist in history with over 550 works currently missing. \
            What made Picasso great was not just how much art he produced, but also how he produced it. He co-founded the movement of Cubism and created the style of collage. He was the artist his contemporaries copied. Any discussion of the most well-known artists in history would have to include his name.',
  phrases: [
    { word: 'famous', choices: ['A1', 'A2', 'A3', 'A4'], index: 0 },
    { word: 'unfathomable', choices: ['A1', 'A2', 'A3', 'A4'], index: 0 },
    { word: 'include', choices: ['A1', 'A2', 'A3', 'A4'], index: 0 },
  ],
}

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
    display: 'inline',
    backgroundColor: '#FFFF00',
    cursor: 'pointer',
  },
  greylighted: {
    display: 'inline',
    backgroundColor: 'lightgrey',
    cursor: 'pointer',
  },
  normallighted: {
    display: 'inline',
  },
}))

function ArticleView(props) {
  const classes = useStyles()
  const steps = articleObject.phrases.map((phrase) => phrase.word)

  const [activeStep, setActiveStep] = React.useState(0)
  const [completed] = React.useState({})
  const handleStep = (step) => () => {
    setActiveStep(step)
    // setCompleted({ ...completed, [step]: true })
  }

  const nthIndex = (content, word, index) => {
    var i = -1

    while (index-- && i++ < content.length) {
      i = content.indexOf(word, i)
      if (i < 0) break
    }

    return i
  }

  const nextAlphabetIndex = (content, index) => {
    while (
      index != content.length &&
      !(
        (content[index] >= 'a' && content[index] <= 'z') ||
        (content[index] >= 'A' && content[index] <= 'Z')
      )
    )
      index++
    return index
  }

  const periodsIndex = (content, index) => {
    let startIdx = content.lastIndexOf('.', index)
    let endIdx = content.indexOf('.', index)
    startIdx = startIdx < 0 ? 0 : startIdx
    endIdx = endIdx < 0 ? content.length : endIdx

    return [startIdx, endIdx]
  }

  const processContent = (articleObject) => {
    var outputPairList = []
    var indexPairList = []
    const content = articleObject.content
    const loweredContent = content.toLowerCase()
    articleObject.phrases.forEach((phrase) => {
      const word = phrase.word
      const index = phrase.index
      const loweredWord = word.toLowerCase()

      const wordIdx = nthIndex(loweredContent, loweredWord, index + 1)

      const idxPair = periodsIndex(loweredContent, wordIdx)
      const modifiedPair = [
        nextAlphabetIndex(loweredContent, idxPair[0]),
        idxPair[1] + 1,
      ]

      indexPairList.push(modifiedPair)
    })
    indexPairList = indexPairList.sort((a, b) => a[0] - b[0])

    var start = 0
    var end = 0
    indexPairList.forEach((pair) => {
      end = pair[0]
      outputPairList.push([start, end, false])
      start = pair[0]
      end = pair[1]
      outputPairList.push([start, end, true])
      start = pair[1]
    })
    end = loweredContent.length
    outputPairList.push([start, end, false])

    var output
    var emphasizedPhraseCount = -1
    output = outputPairList.map((pair, idx) => {
      if (pair[2] == true) {
        emphasizedPhraseCount++
        return emphasizedPhraseCount === activeStep ? (
          <Typography key={idx} className={classes.highlighted}>
            {content.substring(pair[0], pair[1])}
          </Typography>
        ) : (
          <Typography
            key={idx}
            onClick={handleStep(emphasizedPhraseCount)}
            className={classes.greylighted}
          >
            {content.substring(pair[0], pair[1])}
          </Typography>
        )
      } else
        return (
          <Typography
            key={idx}
            onClick={handleStep(emphasizedPhraseCount)}
            className={classes.normallighted}
          >
            {content.substring(pair[0], pair[1])}
          </Typography>
        )
    })
    return output
  }

  const processedContent = processContent(articleObject)
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
            <div>{processedContent}</div>
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
