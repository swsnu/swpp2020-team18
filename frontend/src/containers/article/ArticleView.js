import React from 'react'
import { useEffect } from 'react'
// import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import { Redirect } from 'react-router-dom'
import * as article from '../../ducks/article'
import * as accounts from '../../ducks/accounts'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepButton from '@material-ui/core/StepButton'
import Divider from '@material-ui/core/Divider'
import { makeStyles } from '@material-ui/core/styles'
import ArticleSideTest from '../../components/article/ArticleSideTest'
import { withRouter } from 'react-router-dom'
import Copyright from '../../components/details/Copyright'
import CustomAppBar from '../../components/details/CustomAppBar'
import StickyBox from 'react-sticky-box'
import * as wordtest from '../../ducks/wordtest'

const useStyles = makeStyles((theme) => ({
  title: {
    margin: 0,
    padding: '5vh',
  },
  stepper: {
    backgroundColor: '#fafafa',
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
    props.getArticle(props.match.params.id).then((res) => {
      console.log(res.data.phrases)
      let keywordList = []
      for (var i = 0; i < res.data.phrases.length; i++) {
        keywordList.push(res.data.phrases[i].keyword)
      }
      props.makeHistory(keywordList)
      props.getArticleTest(props.match.params.id).then(() => setLoading(false))
    })
  }, [])
  const classes = useStyles()

  const handleAnswerChoice = (idx) => (newAnswer) => {
    setSelectedAnswers(
      selectedAnswers.map((currentChoice, i) =>
        idx === i ? newAnswer : currentChoice
      )
    )
  }

  const handleStep = (step) => () => {
    setActiveStep(step)
  }
  const handleSubmit = () => {
    console.log('Submit!')
    console.log(props.submitArticleTest)
    console.log(props.match.params.id)
    console.log(selectedAnswers)
    props.submitArticleTest(props.match.params.id, selectedAnswers).then(() => {
      props.getScores()
    })
    props.history.push('/article/' + props.match.params.id + '/result')
  }

  const nthIndex = (content, word, index) => {
    var i = -1

    while (index-- && i++ < content.length) {
      i = content.indexOf(word, i)
      if (i < 0) break
    }

    return i
  }

  const processContent = (articleObject) => {
    var outputPairList = []
    var indexPairList = []
    const content = articleObject.content
    const loweredContent = content.toLowerCase()
    console.log(articleObject.phrases)
    articleObject.phrases.forEach((phrase, idx) => {
      const index = 0
      const loweredPhraseContent = phrase.content.toLowerCase()

      const wordIdx = nthIndex(loweredContent, loweredPhraseContent, index + 1)

      // const idxPair = periodsIndex(loweredContent, wordIdx)
      const modifiedPair = [wordIdx, wordIdx + phrase.content.length, idx]

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
      let l_content = content.toLowerCase()
      let l_word = word.toLowerCase()
      const idx = l_content.indexOf(l_word)
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

    const sort_map = indexPairList.map((pair) => pair[2])

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
              articleObject.phrases[sort_map[emphasizedPhraseCount]].keyword,
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
              articleObject.phrases[sort_map[emphasizedPhraseCount]].keyword,
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
    return [output, sort_map]
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
    return null
  }

  const articleObject = props.article
  const steps = articleObject.phrases.map((phrase) => phrase.word)
  const processdContent = processContent(articleObject)[0]
  const sort_map = processContent(articleObject)[1]

  if (selectedAnswers.length == 0) {
    setSelectedAnswers(Array(steps.length).fill(null))
  }

  let completed = []
  completed = selectedAnswers.map(() => false)
  console.log(selectedAnswers)
  for (var j = 0; j < completed.length; j++) {
    if (selectedAnswers[sort_map[j]]) completed[j] = true
  }
  console.log(sort_map)
  console.log(completed)

  return (
    <>
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
              <div>{!articleObject ? null : processdContent}</div>
            </Grid>
            <Divider flexItem orientation='vertical' />

            <Grid item xs={3}>
              <StickyBox offsetTop={10} offsetBottom={10}>
                <Grid container spacing={8}>
                  <Grid item xs={12}>
                    {!articleObject || !articleObject.phrases ? null : (
                      <ArticleSideTest
                        selectedPhrase={
                          articleObject.phrases[sort_map[activeStep]]
                        }
                        onAnswerChoice={handleAnswerChoice(sort_map[activeStep])}
                        answer={selectedAnswers[sort_map[activeStep]]}
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
              </StickyBox>
            </Grid>
          </Grid>
        </div>
        <Box mt={5}>
          <Copyright />
        </Box>
      </Container>
    </>
  )
}

const mapStateToProps = (state) => ({
  user: state.accounts.user,
  article: state.article.article,
  result: state.article.result,
  scores: state.accounts.scores,
})

const mapDispatchToProps = (dispatch) => ({
  getArticle: (id) => {
    return dispatch(article.getArticle(id))
  },
  getArticleTest: (id) => dispatch(article.getArticleTest(id)),
  submitArticleTest: (id, answers) =>
    dispatch(article.submitArticleTest({ id: id, answers: answers })),
  getScores: () => {
    return dispatch(accounts.getScores())
  },
  makeHistory: (words) => dispatch(wordtest.makeHistory(words)),
})

ArticleView.propTypes = {
  user: PropTypes.object,
  article: PropTypes.object,
  getArticle: PropTypes.func,
  getArticleTest: PropTypes.func,
  submitArticleTest: PropTypes.func,
  getScores: PropTypes.func,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.number,
    }),
  }),
  history: PropTypes.any,
  result: PropTypes.object,
  makeHistory: PropTypes.func,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ArticleView))
