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
    minHeight: 0,
    minWidth: 0,
    width: '100px',
    margin: '0 auto',
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

function LevelTest(props) {
  const classes = useStyles()
  const [questionNumber, setQuestionNumber] = React.useState(0)
  const [value, setValue] = React.useState('')
  const history = useHistory()
  const [testData, setTestData] = React.useState([{ phrase: 'Loading' }])
  const [words, setWords] = React.useState([])
  const [answers, setAnswers] = React.useState([])

  const handleChange = (event) => {
    setValue(event.target.value)
  }
  const onClickNext = (newQuestionNumber) => {
    setQuestionNumber(newQuestionNumber)
  }

  if (!props.user) {
    return <Redirect to='/signin' />
  }

  useEffect(() => {
    props.onGetLeveltest().then((res) => {
      if (res.data.length != 0) {
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
      <div className={classes.root}>
        <h1 className={classes.title}>Level Test</h1>
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
            {questionNumber + 1} / {testData.length}
            <br></br>
            <br></br>
            <Button
              variant='contained'
              disabled={value === ''}
              className={classes.button}
              color='primary'
              onClick={() => {
                if (questionNumber == testData.length - 1) {
                  let tempAnswer = answers
                  tempAnswer.push(value)
                  setAnswers(tempAnswer)
                  setValue('')
                  console.log(words)
                  console.log(answers)
                  props.onSubmitTest(words, answers, 'new').then((res) => {
                    console.log(res.data)
                    history.push('/leveltest/result')
                  })
                } else {
                  onClickNext(questionNumber + 1)
                  let tempAnswer = answers
                  tempAnswer.push(value)
                  setAnswers(tempAnswer)
                  setValue('')
                }
              }}
            >
              {questionNumber == testData.length - 1 ? (
                <span>Submit</span>
              ) : (
                <span>Next</span>
              )}
            </Button>
          </FormControl>
        </div>
        <br></br>
        <Copyright />
        <br></br>
      </div>
    </Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.accounts.user,
})

const mapDispatchToProps = (dispatch) => {
  return {
    onGetLeveltest: () => dispatch(wordtest.getLeveltest()),
    onSubmitTest: (words, answers, type) =>
      dispatch(wordtest.onSubmitTest(words, answers, type)),
  }
}
LevelTest.propTypes = {
  user: PropTypes.object,
  onGetLeveltest: PropTypes.func,
  onSubmitTest: PropTypes.func,
}

export default connect(mapStateToProps, mapDispatchToProps)(LevelTest)
