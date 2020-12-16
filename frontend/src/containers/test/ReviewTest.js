import React, { useEffect, Fragment } from 'react'
import CustomAppBar from 'components/details/CustomAppBar'
import { makeStyles } from '@material-ui/core/styles'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button'
import { useHistory, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Copyright from '../../components/details/Copyright'
import * as wordtest from '../../ducks/wordtest'

const useStyles = makeStyles(() => ({
  root: {
    height: '110vh',
    backgroundColor: '#f5f5f5',
  },
  title: {
    margin: 0,
    padding: '5vh',
  },
  button: {
    margin: '5vh',
  },
  test: {
    width: '70%',
    margin: '0 auto',
  },
  phrase: {
    textAlign: 'left',
    color: 'black !important',
    marginTop: 0,
    marginBottom: '5vh',
  },
  select: {
    marginTop: '5vh',
    marginBottom: '20vh',
    textAlign: 'center',
  },
  keyword: {
    backgroundColor: '#fff2a8',
  },
}))

function ReviewTest(props) {
  const classes = useStyles()
  const [questionNumber, setQuestionNumber] = React.useState(0)
  const [value, setValue] = React.useState('')
  const history = useHistory()
  const [empty, setEmpty] = React.useState(true)
  const [testData, setTestData] = React.useState([{ phrase: 'Loading' }])
  const [words, setWords] = React.useState([])
  const [answers, setAnswers] = React.useState([])

  const handleChange = (event) => {
    setValue(event.target.value)
    console.log(value)
  }
  const onClickNext = (newQuestionNumber) => {
    setQuestionNumber(newQuestionNumber)
  }

  if (!props.user) {
    return <Redirect to='/signin' />
  }

  useEffect(() => {
    props.onGetWordtest().then((res) => {
      if (res.data.length != 0) {
        setEmpty(false)
        let tempMergedData = []
        let tempMergedWords = []
        res.data.map((question) => {
          let rawPhrase = question['phrase']
          let indexOfWord = rawPhrase
            .toLowerCase()
            .indexOf(question['word'].toLowerCase())
          let highlightedPhrase = (
            <span>
              <span>{rawPhrase.substring(0, indexOfWord)}</span>
              <span className={classes.keyword}>
                {rawPhrase.substring(
                  indexOfWord,
                  indexOfWord + question['word'].length
                )}
              </span>
              <span>
                {rawPhrase.substring(indexOfWord + question['word'].length)}
              </span>
            </span>
          )

          let tempData = {
            phrase: highlightedPhrase,
            word: question['word'],
            option1: question['options'][0],
            option2: question['options'][1],
            option3: question['options'][2],
            option4: question['options'][3],
          }
          tempMergedData.push(tempData)
          tempMergedWords.push(question['word'])
        })
        setTestData(tempMergedData)
        setWords(tempMergedWords)
      }
    })
  }, [])

  return (
    <Fragment>
      <CustomAppBar />
      {!empty ? (
        <div className={classes.root}>
          <h1 className={classes.title}>Review Test</h1>
          <div className={classes.test}>
            <FormControl component='fieldset'>
              <h3 className={classes.phrase}>
                {questionNumber + 1}. {testData[questionNumber]['phrase']}
              </h3>
              <RadioGroup
                aria-label='gender'
                name='gender1'
                value={value}
                onChange={handleChange}
                className={classes.select}
              >
                <FormControlLabel
                  value={testData[questionNumber]['option1']}
                  control={<Radio />}
                  label={testData[questionNumber]['option1']}
                />
                <FormControlLabel
                  value={testData[questionNumber]['option2']}
                  control={<Radio />}
                  label={testData[questionNumber]['option2']}
                />
                <FormControlLabel
                  value={testData[questionNumber]['option3']}
                  control={<Radio />}
                  label={testData[questionNumber]['option3']}
                />
                <FormControlLabel
                  value={testData[questionNumber]['option4']}
                  control={<Radio />}
                  label={testData[questionNumber]['option4']}
                />
              </RadioGroup>
              <Button
                disabled={value === ''}
                className={classes.Button}
                color='inherit'
                onClick={() => {
                  if (questionNumber == testData.length - 1) {
                    let tempAnswer = answers
                    tempAnswer.push(value)
                    setAnswers(tempAnswer)
                    props.onSubmitTest(words, answers, 'review').then((res) => {
                      alert(res.data + ' out of ' + words.length + ' correct!')
                      history.push('/')
                    })
                  } else {
                    onClickNext(questionNumber + 1)
                    let tempAnswer = answers
                    tempAnswer.push(value)
                    setAnswers(tempAnswer)
                  }
                }}
              >
                Next
              </Button>
            </FormControl>
          </div>
          <br></br>
          <Copyright />
          <br></br>
        </div>
      ) : (
        <div className={classes.root}>
          <h1 className={classes.title}>Review Test</h1>
          <div className={classes.test}>There are no words to review</div>
          <Button
            variant='contained'
            color='primary'
            className={classes.button}
            onClick={() => history.push('/')}
          >
            Back
          </Button>
        </div>
      )}
    </Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.accounts.user,
})

const mapDispatchToProps = (dispatch) => {
  return {
    onGetWordtest: () => dispatch(wordtest.getWordtest()),
    onSubmitTest: (words, answers, type) =>
      dispatch(wordtest.onSubmitTest(words, answers, type)),
  }
}

ReviewTest.propTypes = {
  user: PropTypes.object,
  onGetWordtest: PropTypes.func,
  onSubmitTest: PropTypes.func,
}

export default connect(mapStateToProps, mapDispatchToProps)(ReviewTest)
