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
import { useHistory } from 'react-router-dom'
// import FormLabel from '@material-ui/core/FormLabel';

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
    phrase:
      'It wasn’t until I began my research in graduate [school] that I learned sociopaths exist along a wide spectrum, like many people with psychiatric disorders.',
    answer1: '학교',
    answer2: '감옥',
    answer3: '연수',
    answer4: '차가움',
  },
  {
    phrase:
      'It wasn’t until college that a therapist told me what I had long suspected: My lack of [emotion] and empathy are hallmarks of sociopathy.',
    answer1: '행동',
    answer2: '추진력',
    answer3: '감정',
    answer4: '사회성',
  },
  {
    phrase:
      '[Climbers] typically take around four to six days to reach the top, using a variety of routes.',
    answer1: '몽상가',
    answer2: '오이',
    answer3: '빗',
    answer4: '등산가',
  },
  {
    phrase:
      'Grohl conceded defeat, and since then the two have continued playing [music] for each other.',
    answer1: '놀이',
    answer2: '음악',
    answer3: '박자',
    answer4: '예술',
  },
  {
    phrase:
      'The Trump administration has a dirty little secret: It’s not just planning to increase [taxes] on most Americans.',
    answer1: '요금',
    answer2: '긍지',
    answer3: '세금',
    answer4: '복지',
  },
  // 여기 문제
  // {
  //   phrase: 'Television has [proved] that people will look at anything rather than each other.',
  //   answer1: '제공하다',
  //   answer2: '미디어',
  //   answer3: '빼앗다',
  //   answer4: '입증하다',
  // },
  // {
  //   phrase: "Given the estimate that the vaccine is over 90 percent effective, however, we can safely assume very few people who were [vaccinated] got Covid-19.",
  //   answer1: '예방 접종',
  //   answer2: '고소',
  //   answer3: '청소',
  //   answer4: '봉사',
  // },
  // {
  //   phrase: 'I would as soon leave my son a [curse] as the almighty dollar.',
  //   answer1: '돈',
  //   answer2: '저주',
  //   answer3: '아들',
  //   answer4: '물려주다',
  // },
  // {
  //   phrase: 'A [hungry] man is not a free man.',
  //   answer1: '배고픈',
  //   answer2: '부유한',
  //   answer3: '가난한',
  //   answer4: '남자',
  // },
  // {
  //   phrase: 'Truth is generally the best [vindication] against slander.',
  //   answer1: '진실',
  //   answer2: '모략',
  //   answer3: '해명',
  //   answer4: '방어',
  // },
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

function ReviewTest() {
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

  return (
    <Fragment>
      <CustomAppBar />
      <div className={classes.root}>
        <h1 className={classes.title}>Review Test</h1>
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
                if (questionNumber == 4) {
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

export default ReviewTest
