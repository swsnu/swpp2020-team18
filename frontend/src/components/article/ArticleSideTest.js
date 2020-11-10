import React from 'react'
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core'
import PropTypes from 'prop-types'

function ArticleSideTest(props) {
  console.log(props)
  const value = props.answer
  const setValue = props.onAnswerChoice
  const handleChange = (event) => {
    setValue(event.target.value)
  }

  const options = !props.selectedPhrase.choices
    ? null
    : props.selectedPhrase.choices.map((choice, idx) => {
        return (
          <React.Fragment key={idx}>
            <FormControlLabel
              value={choice}
              control={<Radio />}
              label={choice}
            />
          </React.Fragment>
        )
      })

  return (
    <FormControl component='fieldset'>
      <FormLabel component='legend'>{props.selectedPhrase.keyword}</FormLabel>
      <RadioGroup
        aria-label={props.selectedPhrase.keyword}
        name='gender1'
        value={value}
        onChange={handleChange}
      >
        {options}
      </RadioGroup>
    </FormControl>
  )
}

ArticleSideTest.propTypes = {
  answer: PropTypes.string,
  onAnswerChoice: PropTypes.func,
  selectedPhrase: PropTypes.object,
}

export default ArticleSideTest
