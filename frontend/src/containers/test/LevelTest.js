import React, { Fragment } from 'react'
import CustomAppBar from 'components/details/CustomAppBar'
import { makeStyles } from '@material-ui/core/styles'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button'
import { useHistory, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

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

const fakeData = [
  {
    phrase: 'To [marry] is to halve your rights and double your duties.',
    answer1: '결혼하다',
    answer2: '즐겁다',
    answer3: '산딸기',
    answer4: '달팽이',
  },
  {
    phrase: 'He makes no [friend] who never made a foe.',
    answer1: '이웃',
    answer2: '가족',
    answer3: '친구',
    answer4: '아버지',
  },
  {
    phrase: 'Common sense is the collection of [prejudices] acquired by age 18.',
    answer1: '정의',
    answer2: '구타',
    answer3: '편견',
    answer4: '의견',
  },
  {
    phrase:
      'The unleashed power of the atom has changed everything save our modes of thinking, and we thus drift toward unparalleled [catastrophes].',
    answer1: '세계',
    answer2: '구원',
    answer3: '카타르시스',
    answer4: '재난',
  },
  {
    phrase: 'Nothing is more despicable than [respect] based on fear.',
    answer1: '존경심',
    answer2: '재검사',
    answer3: '두려움',
    answer4: '경멸',
  },
  {
    phrase:
      'Television has [proved] that people will look at anything rather than each other.',
    answer1: '제공하다',
    answer2: '미디어',
    answer3: '빼앗다',
    answer4: '입증하다',
  },
  {
    phrase: "[Business]? It's quite simple. It's other people's money.",
    answer1: '사업',
    answer2: '돈',
    answer3: '직장',
    answer4: '친구',
  },
  {
    phrase: 'I would as soon leave my son a [curse] as the almighty dollar.',
    answer1: '돈',
    answer2: '저주',
    answer3: '아들',
    answer4: '물려주다',
  },
  {
    phrase: 'A [hungry] man is not a free man.',
    answer1: '배고픈',
    answer2: '부유한',
    answer3: '가난한',
    answer4: '남자',
  },
  {
    phrase: 'Truth is generally the best [vindication] against slander.',
    answer1: '진실',
    answer2: '모략',
    answer3: '해명',
    answer4: '방어',
  },
]

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

function LevelTest(props) {
  const classes = useStyles()
  const [questionNumber, setQuestionNumber] = React.useState(0)
  const [value, setValue] = React.useState('female')
  const history = useHistory()

  const handleChange = (event) => {
    setValue(event.target.value)
  }
  const onClickNext = (newQuestionNumber) => {
    setQuestionNumber(newQuestionNumber)
  }

  if (!props.user) {
    return <Redirect to='/signin' />
  }

  return (
    <Fragment>
      <CustomAppBar />
      <div className={classes.root}>
        <h1 className={classes.title}>Level Test</h1>
        <div className={classes.test}>
          <FormControl component='fieldset'>
            <h3 className={classes.phrase}>
              {fakeData[questionNumber]['phrase']}
            </h3>
            <RadioGroup
              aria-label='gender'
              name='gender1'
              value={value}
              onChange={handleChange}
              className={classes.select}
            >
              <FormControlLabel
                value='female'
                control={<Radio />}
                label={fakeData[questionNumber]['answer1']}
              />
              <FormControlLabel
                value='male'
                control={<Radio />}
                label={fakeData[questionNumber]['answer2']}
              />
              <FormControlLabel
                value='other'
                control={<Radio />}
                label={fakeData[questionNumber]['answer3']}
              />
              <FormControlLabel
                value='disabled'
                control={<Radio />}
                label={fakeData[questionNumber]['answer4']}
              />
            </RadioGroup>
            <Button
              className={classes.Button}
              color='inherit'
              onClick={() => {
                if (questionNumber == 9) {
                  history.push('/')
                } else {
                  onClickNext(questionNumber + 1)
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

LevelTest.propTypes = {
  user: PropTypes.object,
}

export default connect(mapStateToProps, null)(LevelTest)
