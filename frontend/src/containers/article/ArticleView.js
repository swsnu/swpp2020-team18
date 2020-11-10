import React from 'react'
import { useEffect } from 'react'
// import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import { Redirect } from 'react-router-dom'
import * as article from '../../ducks/article'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepButton from '@material-ui/core/StepButton'
import Divider from '@material-ui/core/Divider'
import { makeStyles } from '@material-ui/core/styles'
import ArticleSideTest from '../../components/article/ArticleSideTest'
import { withRouter } from 'react-router-dom'

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
  stepper: {
    backgroundColor: '#fafafa',
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
  highlightedWord: {
    color: 'red',
    display: 'inline',
    backgroundColor: '#FFBC42',
    cursor: 'pointer',
  },
  greylightedWord: {
    display: 'inline',
    backgroundColor: 'darkgrey',
    cursor: 'pointer',
  },
}))

function ArticleView(props) {
  const [loading, setLoading] = React.useState(true)
  const [selectedAnswers, setSelectedAnswers] = React.useState([])
  const [activeStep, setActiveStep] = React.useState(0)
  useEffect(() => {
    setLoading(true)
    props.getArticle(props.match.params.id)
    props.getArticleTest(props.match.params.id)
    setLoading(false)
  }, [])
  const classes = useStyles()

  const handleAnswerChoice = (idx) => (newAnswer) => {
    setSelectedAnswers(
      selectedAnswers.map((currentChoice, i) =>
        idx === i ? newAnswer : currentChoice
      )
    )
    console.log(selectedAnswers)
  }

  const handleStep = (step) => () => {
    setActiveStep(step)
  }
  const handleSubmit = () => {
    console.log('Submit!')
    props.history.push('/')
  }

  const nthIndex = (content, word, index) => {
    var i = -1

    while (index-- && i++ < content.length) {
      i = content.indexOf(word, i)
      if (i < 0) break
    }

    return i
  }

  // const nextAlphabetIndex = (content, index) => {
  //   while (
  //     index != content.length &&
  //     !(
  //       (content[index] >= 'a' && content[index] <= 'z') ||
  //       (content[index] >= 'A' && content[index] <= 'Z')
  //     )
  //   )
  //     index++
  //   return index
  // }

  // const periodsIndex = (content, index) => {
  //   let startIdx = content.lastIndexOf('.', index)
  //   let endIdx = content.indexOf('.', index)
  //   startIdx = startIdx < 0 ? 0 : startIdx
  //   endIdx = endIdx < 0 ? content.length : endIdx

  //   return [startIdx, endIdx]
  // }

  const processContent = (articleObject) => {
    var outputPairList = []
    var indexPairList = []
    const content = articleObject.content
    const loweredContent = content.toLowerCase()
    articleObject.phrases.forEach((phrase) => {
      const index = 0
      const loweredPhraseContent = phrase.content.toLowerCase()

      const wordIdx = nthIndex(loweredContent, loweredPhraseContent, index + 1)

      // const idxPair = periodsIndex(loweredContent, wordIdx)
      const modifiedPair = [wordIdx, wordIdx + phrase.content.length]

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

    let wrapWordElement = (content, word, selected) => {
      const idx = content.indexOf(word)
      const style = selected ? classes.highlightedWord : classes.greylightedWord

      return (
        <React.Fragment>
          {content.substring(0, idx)}
          <Typography key={idx} className={style}>
            {content.substring(idx, idx + word.length)}
          </Typography>
          {content.substring(idx + word.length, content.length)}
        </React.Fragment>
      )
    }

    var output
    var emphasizedPhraseCount = -1
    output = outputPairList.map((pair, idx) => {
      if (pair[2] == true) {
        emphasizedPhraseCount++
        const selected = emphasizedPhraseCount === activeStep
        return selected ? (
          <Typography key={idx} className={classes.highlighted}>
            {wrapWordElement(
              content.substring(pair[0], pair[1]),
              articleObject.phrases[emphasizedPhraseCount].keyword,
              selected
            )}
          </Typography>
        ) : (
          <Typography
            key={idx}
            onClick={handleStep(emphasizedPhraseCount)}
            className={classes.greylighted}
          >
            {wrapWordElement(
              content.substring(pair[0], pair[1]),
              articleObject.phrases[emphasizedPhraseCount].keyword,
              selected
            )}
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

  // const handleComplete = () => {
  //   const newCompleted = completed;
  //   newCompleted[activeStep] = true;
  //   setCompleted(newCompleted);
  //   handleNext();
  // };

  if (!props.user) {
    return <Redirect to='/' />
  }

  // if (props.article)
  //   console.log(props.article.phrases[0])

  if (
    loading ||
    !props.article ||
    !props.article.content ||
    !props.article.phrases
  ) {
    console.log(props.article)
    console.log('not yet')
    return null
  }

  const articleObject = props.article
  console.log(loading)
  console.log(props)
  const steps = articleObject.phrases.map((phrase) => phrase.word)

  console.log(selectedAnswers)
  if (selectedAnswers.length == 0) {
    console.log('WHWHWH')
    setSelectedAnswers(Array(steps.length).fill(null))
  }

  const completed = selectedAnswers.map((answer) => (answer ? true : false))

  return (
    <Container component='main' maxWidth='md'>
      <CssBaseline />
      <Grid container justify='center' alignItems='center'>
        <Typography variant='h3' component='h2' gutterBottom>
          Practice with Article!
        </Typography>
      </Grid>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stepper
              alternativeLabel
              nonLinear
              className={classes.stepper}
              activeStep={activeStep}
            >
              {!steps
                ? null
                : steps.map((label, index) => (
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
          <Grid item xs={12}>
            <Grid container justify='center' alignItems='center'>
              <Typography variant='h4' component='h3' gutterBottom>
                {!articleObject ? null : articleObject.title}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container justify='center' alignItems='center'>
              <Typography variant='h6' component='h6' gutterBottom>
                {!articleObject ? null : articleObject.author}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={8}>
            <div>{!articleObject ? null : processContent(articleObject)}</div>
          </Grid>
          <Divider flexItem orientation='vertical' />
          <Grid item xs={3}>
            <Grid container spacing={8}>
              <Grid item xs={12}>
                {!articleObject || !articleObject.phrases ? null : (
                  <ArticleSideTest
                    selectedPhrase={articleObject.phrases[activeStep]}
                    onAnswerChoice={handleAnswerChoice(activeStep)}
                    answer={selectedAnswers[activeStep]}
                  />
                )}
              </Grid>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={6}>
                    <Button
                      variant='outlined'
                      disabled={activeStep === 0}
                      onClick={() => handleStep(activeStep - 1)()}
                    >
                      Prev
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    {activeStep === steps.length - 1 ? (
                      <Button
                        variant='contained'
                        color='primary'
                        disabled={completed.some((e) => e === false)}
                        onClick={() => handleSubmit()}
                      >
                        Submit
                      </Button>
                    ) : (
                      <Button
                        variant='outlined'
                        color='primary'
                        onClick={() => handleStep(activeStep + 1)()}
                      >
                        Next
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
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
  article: state.article.article,
})

const mapDispatchToProps = (dispatch) => ({
  getArticle: (id) => {
    return dispatch(article.getArticle(id))
  },
  getArticleTest: (id) => dispatch(article.getArticleTest(id)),
})

ArticleView.propTypes = {
  user: PropTypes.object,
  article: PropTypes.object,
  getArticle: PropTypes.func,
  getArticleTest: PropTypes.func,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.number,
    }),
  }),
  history: PropTypes.any,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ArticleView))
