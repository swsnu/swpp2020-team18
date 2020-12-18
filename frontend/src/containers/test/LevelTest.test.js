import React from 'react'
// import { shallow, mount } from 'enzyme';
import LevelTest from './LevelTest'
import { getMockStore } from '../../test-utils/mocks'
import { history } from '../../test-utils/mocks'
// import * as actionCreators from '../../ducks/accounts';
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { Route, Switch } from 'react-router-dom'
import { createMount } from '@material-ui/core/test-utils'

const stubInitialState = {
  ranking: {
    rank: 1,
    weeklyRank: 1,
    total_user_num: 33,
  },
  user: {
    id: 34,
    username: 'gorani',
    email: 'gorani@gorani.com',
    score: 590,
    weekly_score: 560,
    recommendation_list: [24, 14, 13],
  },
  article: {
    article: {
      content:
        'The actor Tom Cruise recently erupted at crew members on the set of “Mission: Impossible 7” over a breach of Covid-19 protocols in an apparent effort to prevent further disruptions to a film whose production has already been delayed by the pandemic.“We are creating thousands of jobs,” Mr. Cruise, the star of the film, can be heard saying in a leaked audio clip that is littered with expletives. “I don’t ever want to see it again! Ever! And if you don’t do it, you’re fired!”The recording was published on Tuesday by The Sun, a British tabloid, and its authenticity was confirmed to The New York Times by two sources close to the film. One source said that Mr. Cruise had been speaking to members of the “Mission: Impossible 7” crew about a breach in Covid-19 protocols on the set in London, and that further details were not immediately available.Mr. Cruise apparently became enraged after spotting two crew members standing together at a computer screen, in violation of an on-set rule requiring people to stand about six feet apart, The Sun reported.Paramount Pictures declined to comment, and The Sun did not say when the recording of Mr. Cruise, 58, had been made. Reuters reported that the filmmakers for “Mission: Impossible 7” — the latest installment in the 24-year-old series — arrived in London earlier this month.In February, production on the film was shuttered in Venice, Italy, amid a raging coronavirus outbreak in that country, Reuters reported. Production resumed in September, and has since moved between Italy, Norway and Britain.Production was paused again in October after 12 crew members on a set in Italy tested positive for the virus, Variety reported.The leaked audio is of Mr. Cruise addressing about 50 staff members at a Warner Bros. film production complex in Leavesden, northwest of London, The Sun reported. The tabloid said that the actor wears a mask on the set and has been personally enforcing Covid-19 rules, an effort to prevent further delays in shooting.In the leaked clip, Mr. Cruise told the crew that the production was the “gold standard” for Hollywood, and that he had been speaking with studios, producers and insurance companies who were all “looking at us and using us to make their movies.”He said he would not accept any apologies for what had happened on the set, an apparent reference to the breach in Covid-19 protocol.“You can tell it to the people that are losing their homes because our industry is shut down,” Mr. Cruise said, adding an expletive. “It’s not going to put food on their table or pay for their college education.”The sixth film in the series, “Mission: Impossible — Fallout” was released in 2018 and took in $791 million in global ticket sales. It was also filmed in Europe, among other places, and its production was delayed after Mr. Cruise broke his ankle while performing a stunt in which he slams into the side of a building.',
      title:
        'Tom Cruise Erupts at ‘Mission: Impossible’ Crew Over Covid-19 Breach',
      author: 'Mike Ives',
      phrases: [
        {
          content:
            'The actor Tom Cruise recently erupted at crew members on the set of “Mission: Impossible 7” over a breach of Covid-19 protocols in an apparent effort to prevent further disruptions to a film whose production has already been delayed by the pandemic.“We are creating thousands of jobs,” Mr. Cruise, the star of the film, can be heard saying in a leaked audio clip that is littered with expletives.',
          keyword: 'cruise',
        },
        {
          content:
            'Reuters reported that the filmmakers for “Mission: Impossible 7” — the latest installment in the 24-year-old series — arrived in London earlier this month.In February, production on the film was shuttered in Venice, Italy, amid a raging coronavirus outbreak in that country, Reuters reported.',
          keyword: 'production',
        },
        {
          content:
            'Cruise apparently became enraged after spotting two crew members standing together at a computer screen, in violation of an on-set rule requiring people to stand about six feet apart, The Sun reported.Paramount Pictures declined to comment, and The Sun did not say when the recording of Mr. Cruise, 58, had been made.',
          keyword: 'reported',
        },
        {
          content:
            'Production resumed in September, and has since moved between Italy, Norway and Britain.Production was paused again in October after 12 crew members on a set in Italy tested positive for the virus, Variety reported.The leaked audio is of Mr. Cruise addressing about 50 staff members at a Warner Bros. film production complex in Leavesden, northwest of London, The Sun reported.',
          keyword: 'italy',
        },
        {
          content:
            'One source said that Mr. Cruise had been speaking to members of the “Mission: Impossible 7” crew about a breach in Covid-19 protocols on the set in London, and that further details were not immediately available.Mr.',
          keyword: 'said',
        },
        {
          content:
            'The tabloid said that the actor wears a mask on the set and has been personally enforcing Covid-19 rules, an effort to prevent further delays in shooting.In the leaked clip, Mr. Cruise told the crew that the production was the “gold standard” for Hollywood, and that he had been speaking with studios, producers and insurance companies who were all “looking at us and using us to make their movies.”He said he would not accept any apologies for what had happened on the set, an apparent reference to the breach in Covid-19 protocol.“You can tell it to the people that are losing their homes because our industry is shut down,” Mr. Cruise said, adding an expletive.',
          keyword: 'covid',
        },
      ],
    },
    result: {
      scored_phrases: [
        {
          content:
            'Vaping IllnessesAs of Dec. 20, there have been 2,506 vaping illnesses and 54 deaths.',
          keyword: 'illnesses',
          answer:
            '1.(항상 단수로 써서) 상태\n2.(사회상의) 지위\n3.(높은 신분이나 부자다운) 위엄\n4.(중앙) 정부의\n5.(미) (연방을 구성하고 있는) 주(州)의',
          correct_answer: '1.병\n2.기분이 좋지 않음\n3.불쾌\n4.건강이 좋지 않음',
          is_correct: false,
        },
        {
          content:
            'Cases of lung illness\n\n\nDeaths\n\n\n0\n\n\n10\n\n\n50\n\n\n100\n\n\n150\n\n\n250\n\n\nMont.',
          keyword: 'illness',
          answer:
            '1.…을 얻다\n2.…을 획득하다\n3.(영·비격식) 하다\n4.이르다\n5.서서히 (…하게) 되다',
          correct_answer: '1.질병\n2.병\n3.질환',
          is_correct: false,
        },
        {
          content: 'Ill.\n\n\nN.J.\n\n\nUtah\n\n\nDel.',
          keyword: 'ill',
          answer: '1.공화당의\n2.공화국의',
          correct_answer: '1.아픈\n2.나쁜\n3.잘못된\n4.좋지 않은\n5.고생하다',
          is_correct: false,
        },
        {
          content:
            'Fla.\n\n\nVirgin\nIslands\n\n\n2\n\n\n\n\n\n\n\n\nCases of vaping-related lung illness\n\n\nDeaths\n\n\n0\n\n\n10\n\n\n50\n\n\n100\n\n\n150\n\n\n250\n\n\nMont.',
          keyword: 'islands',
          answer:
            '1.섬\n2.(대초원 가운데의) 삼림 지대\n3.(횡단로 가운데의) 안전 지대(traffic island, (미) safety island)\n4.…을 섬으로 만들다\n5.…을 섬처럼 산재시키다',
          correct_answer:
            '1.섬\n2.(대초원 가운데의) 삼림 지대\n3.(횡단로 가운데의) 안전 지대(traffic island, (미) safety island)\n4.…을 섬으로 만들다\n5.…을 섬처럼 산재시키다',
          is_correct: true,
        },
        {
          content:
            'Fla.\n\n\n2\n\n\nVirgin\nIslands\n\n\n\n\n\n\n\n\nCases of vaping-related lung illness\n\n\nDeaths\n\n\n0\n\n\n10\n\n\n50\n\n\n100\n\n\n150\n\n\n250\n\n\nMont.',
          keyword: 'vaping',
          answer: '1.젊은\n2.어린\n3.청년의\n4.새끼\n5.경험이 없는',
          correct_answer: '1.전자담배\n2.전자담배를 피우다',
          is_correct: false,
        },
        {
          content:
            'Fla.\n\n\nVirgin\nIslands\n\n\nHawaii\n\n\n2\n\n\n\n\n\n\nBy The New York Times | Source: Centers for Disease Control and Prevention and state agencies',
          keyword: 'source',
          answer:
            '1.(한정적) 가족의\n2.가족 특유의\n3.가족용의\n4.(집합적) 가족\n5.(집합적) (한 가족의) 아이들',
          correct_answer: '1.정보원\n2.원천\n3.소스\n4.공급자\n5.자료',
          is_correct: false,
        },
      ],
      correct_answer_count: 1,
      total_count: 6,
    },
  },
  wordlist: [
    {
      word: 'season',
      phrase:
        'Jodie Whittaker begins her second season as the Doctor in this first chapter of a two-part season opener, cheekily titled “Spyfall.” As ever, few details have been released, though it has been announced that Stephen Fry and the British comedian Lenny Henry will appear.',
      korean_meaning: '1.시즌\n2.계절\n3.시기\n4.제철\n5.적기',
      confidence: 2,
      created_at: '2020-12-17T08:53:02.566Z',
    },
    {
      word: 'netflix',
      phrase:
        'In the 1990s, Deakins received his first Academy Award nomination for filming this classic Stephen King adaptation, about the camaraderie of two men (played by Tim Robbins and Morgan Freeman) at a fictional state prison in Maine.What’s StreamingImageKaya Scodelario in “Spinning Out.”Credit...Christos Kalohoridis/NetflixSPINNING OUT Stream on Netflix.',
      korean_meaning: '[고유] 넷플릭스, 미국의 동영상 유통회사',
      confidence: 3,
      created_at: '2020-12-17T08:53:02.954Z',
    },
  ],
  scores: {
    '2020-12-12': {
      day: 5,
      score: 0,
    },
    '2020-12-13': {
      day: 6,
      score: 120,
    },
    '2020-12-14': {
      day: 0,
      score: 80,
    },
    '2020-12-15': {
      day: 1,
      score: 0,
    },
    '2020-12-16': {
      day: 2,
      score: 180,
    },
    '2020-12-17': {
      day: 3,
      score: 180,
    },
    '2020-12-18': {
      day: 4,
      score: 0,
    },
  },
  testResult: {
    scored_words: [
      {
        content: 'mrs',
        answer: '1.회사\n2.대\n3.따르다\n4.출자자\n5.집단',
        correct_answer: '1.…부인\n2.미세스',
        is_correct: false,
      },
    ],
    correct_answer_count: 0,
    total_count: 1,
  },
}

const mockStore = getMockStore(stubInitialState)

describe('<LevelTest />', () => {
  let articleResult
  let mount

  beforeEach(() => {
    mount = createMount()
    articleResult = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route
              path='/'
              exact
              render={() => (
                <LevelTest
                  selectedPhrase={{
                    selectedPhrase: {
                      content:
                        'The actor Tom Cruise recently erupted at crew members on the set of “Mission: Impossible 7” over a breach of Covid-19 protocols in an apparent effort to prevent further disruptions to a film whose production has already been delayed by the pandemic.“We are creating thousands of jobs,” Mr. Cruise, the star of the film, can be heard saying in a leaked audio clip that is littered with expletives.',
                      keyword: 'cruise',
                      choices: [
                        '1.판사\n2.판단하다\n3.심사하다\n4.평가하다\n5.판결하다',
                        '잘 맞음',
                        '1.크루즈\n2.유람선\n3.순항하다\n4.여행하다\n5.돌아다니다',
                        'a port in southern Yemen on the Gulf of Aden to the east of Aden',
                      ],
                    },
                    answer: null,
                  }}
                />
              )}
            />
          </Switch>
        </ConnectedRouter>
      </Provider>
    )
  })

  it('should render without errors', () => {
    const component = mount(articleResult)
    // console.log(component.debug())
    const wrapper = component.find('LevelTest')
    expect(wrapper.length).toBe(1)
  })

  //   it('should change input values', () => {
  //     const component = mount(articleResult)
  //     // console.log(component.debug())
  //     const wrapper = component.find('input#password')
  //     wrapper.simulate('change', { target: { value: 'Hello' } })
  //     const wrapper2 = component.find('input#username')
  //     wrapper2.simulate('change', { target: { value: 'gorani' } })
  //     const wrapper3 = component.find('input#email')
  //     wrapper3.simulate('change', { target: { value: 'ee@ee.com' } })
  //     expect(wrapper.length).toBe(1)
  //   })

  //   it('should render without errors', () => {
  //     const component = mount(articleResult)
  //     // console.log(component.debug())
  //     const wrapper = component.find('button')
  //     wrapper.simulate('click')
  //     expect(wrapper.length).toBe(1)
  //   })

  //   it('should validate erroneous input', () => {
  //     const component = mount(articleResult)
  //     // console.log(component.debug())
  //     const wrapper2 = component.find('input#username')
  //     wrapper2.simulate('change', { target: { value: '' } })
  //     const wrapper3 = component.find('input#email')
  //     wrapper3.simulate('change', { target: { value: 'ee@ee.com' } })
  //     const wrapper = component.find('input#password')
  //     wrapper.simulate('change', { target: { value: '1234' } })
  //     const wrapper5 = component.find('button')
  //     wrapper5.simulate('click')
  //     expect(wrapper5.length).toBe(1)
  //   })

  //   it('should validate erroneous input', () => {
  //     const component = mount(articleResult)
  //     // console.log(component.debug())
  //     const wrapper2 = component.find('input#username')
  //     wrapper2.simulate('change', { target: { value: 'gorani' } })
  //     const wrapper3 = component.find('input#email')
  //     wrapper3.simulate('change', { target: { value: 'ee@ee.com' } })
  //     const wrapper = component.find('input#password')
  //     wrapper.simulate('change', { target: { value: '1234' } })
  //     const wrapper5 = component.find('button')
  //     wrapper5.simulate('click')
  //     expect(wrapper5.length).toBe(1)
  //   })

  //   it('should validate erroneous input', () => {
  //     const component = mount(articleResult)
  //     // console.log(component.debug())
  //     const wrapper2 = component.find('input#username')
  //     wrapper2.simulate('change', { target: { value: 'gorani' } })
  //     const wrapper3 = component.find('input#email')
  //     wrapper3.simulate('change', { target: { value: 'aab' } })
  //     const wrapper = component.find('input#password')
  //     wrapper.simulate('change', { target: { value: '1234' } })
  //     const wrapper5 = component.find('button')
  //     wrapper5.simulate('click')
  //     expect(wrapper5.length).toBe(1)
  //   })
})
