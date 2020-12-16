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
    marin: 0,
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
}))

// const fakeData = [
//   {
//     phrase: 'To [marry] is to halve your rights and double your duties.',
//     answer1: '결혼하다',
//     answer2: '즐겁다',
//     answer3: '산딸기',
//     answer4: '달팽이',
//   },
//   {
//     phrase: 'He makes no [friend] who never made a foe.',
//     answer1: '이웃',
//     answer2: '가족',
//     answer3: '친구',
//     answer4: '아버지',
//   },
//   {
//     phrase: 'Common sense is the collection of [prejudices] acquired by age 18.',
//     answer1: '정의',
//     answer2: '구타',
//     answer3: '편견',
//     answer4: '의견',
//   },
//   {
//     phrase:
//       'The unleashed power of the atom has changed everything save our modes of thinking, and we thus drift toward unparalleled [catastrophes].',
//     answer1: '세계',
//     answer2: '구원',
//     answer3: '카타르시스',
//     answer4: '재난',
//   },
//   {
//     phrase: 'Nothing is more despicable than [respect] based on fear.',
//     answer1: '존경심',
//     answer2: '재검사',
//     answer3: '두려움',
//     answer4: '경멸',
//   },
//   {
//     phrase:
//       'Television has [proved] that people will look at anything rather than each other.',
//     answer1: '제공하다',
//     answer2: '미디어',
//     answer3: '빼앗다',
//     answer4: '입증하다',
//   },
//   {
//     phrase: "[Business]? It's quite simple. It's other people's money.",
//     answer1: '사업',
//     answer2: '돈',
//     answer3: '직장',
//     answer4: '친구',
//   },
//   {
//     phrase: 'I would as soon leave my son a [curse] as the almighty dollar.',
//     answer1: '돈',
//     answer2: '저주',
//     answer3: '아들',
//     answer4: '물려주다',
//   },
//   {
//     phrase: 'A [hungry] man is not a free man.',
//     answer1: '배고픈',
//     answer2: '부유한',
//     answer3: '가난한',
//     answer4: '남자',
//   },
//   {
//     phrase: 'Truth is generally the best [vindication] against slander.',
//     answer1: '진실',
//     answer2: '모략',
//     answer3: '해명',
//     answer4: '방어',
//   },
// ]

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
          let tempData = {
            phrase: question['phrase'].replace(
              question['word'],
              '[' + question['word'] + ']'
            ),
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
              {testData[questionNumber]['phrase']}
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
                  console.log(words)
                  console.log(answers)
                  props.onSubmitTest(words, answers, 'new').then((res) => {
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
