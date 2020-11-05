# swpp2020-team18

# Term'inator

[![Build
Status](https://travis-ci.org/swsnu/swpp2020-team18.svg?branch=main)](https://travis-ci.org
/swsnu/swpp2020-team18)
[![Quality Gate
Status](https://sonarcloud.io/api/project_badges/measure?project=swsnu_swpp2020-team18&metr
ic=alert_status)](https://sonarcloud.io/dashboard?id=swsnu_swpp2020-team18)
[![Coverage
Status](https://coveralls.io/repos/github/swsnu/swpp2020-team18/badge.svg?branch=main)](htt
ps://coveralls.io/github/swsnu/swpp2020-team18?branch=main)


## Project Overview

### Our mission
- Provide better, efficient experience in vocabulary learning

### Features
#### Completed
- Account management
#### To be implemented
- Provide personalized vocabulary quiz by ML
- Create & Update user’s custom word list
- Examine and standardize each user’s knowledge by ML
- Put an article(e.g. news, essaies) by URL into our web application, then it provides additional functions(e.g. meanings of not learned words, click-and-add to word list) for the article
- [optional] Recommend article(e.g. news, essaies) according to user’s vocabulary skills with ML
- [optional] Provide user’s learning statistics
- [optional] Visualize statistics with diagrams, charts and graphs
- [optional] Provide ranking system: each word and article is categorized by difficulty and frequency of use. users can make their own vocabulary list, memorize it by quiz, and compare their score with others
- [optional] Customize quiz setting

### Project Timeline
| | Start | End | TA meeting |
|-|-------|-----|------------|
| Sprint 1 | Oc1. 5 (Mon)| Oct. 17 (Sat), 6pm(report due) | TH/F |
| Sprint 2 | Oct. 19 (Mon)| Oct. 31 (Sat), 6pm(report due) | TH/F |
| Sprint 3 | Nov. 2 (Mon)| Nov. 14 (Sat), 6pm(report due) | TH/F |
| Project progress presentation | Nov. 11, Nov. 12 | | |
| Sprint 4 | Nov. 16 (Mon)| Nov. 28 (Sat), 6pm(report due) | TH/F|
| Sprint 5 | Nov. 30 (Mon)| Dec. 12 (Sat), 6pm(report due) | TH/F |
| Final poster | Dec. 17 (Thu) | | | 
| Final report |  | Dec. 18 (Thu) 6pm | | 



## Installation Guideline (To run locally)

### Backend

1. Create a Python 3.7.5 virtualenv

``` bash
virtualenv backend-venv --python=3.7.5
./backend-venv/Scripts/activate
```

2. Install dependencies

``` bash
cd swpp2020-team18/backend
pip install -r requirements.txt
```

3. Migrate database

``` bash
python manage.py makemigrations
python manage.py migrate
```

4. Run server

``` bash
python manage.py runserver
```


### Frontend

1. Install dependencies

``` bash
yarn
```

2. Run dev server

``` bash
yarn start
```
