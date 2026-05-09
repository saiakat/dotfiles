import requests
from datetime import date 
from dotenv import load_dotenv
from os import getenv
from pathlib import Path

home = str(Path.home())
load_dotenv(dotenv_path=home + '/dotfiles/utils/.env')
state = getenv('STATE')
today = date.today()
year = date.today().year

response = requests.get(f'https://get.api-feiertage.de/?years={year}&states={state}')
mockdata = None
# mockdata = { 'feiertage': [{'date': '2027-04-29', 'fname': 'test'}, {'date': '2027-05-02', 'fname': 'test'}]}

def get_next_holiday(raw: dict, year: int) -> str:
    data: list[dict] = raw['feiertage']
    name: str = '' 
    next_holiday: date = date(2,2,2)
    today_flag: bool = False

    for entry in data:
        holiday = date.strptime(entry['date'], "%Y-%m-%d")
        if holiday == today: 
            today_flag = True
            name = entry['fname']
        if holiday > today: 
            if today_flag == False: name = entry['fname'] 
            next_holiday = holiday
            break

    if next_holiday == date(2,2,2): 
        year += 1
        tmp = requests.get(f'https://get.api-feiertage.de/?years={year}&states=be').json()
        return get_next_holiday(tmp, year)

    diff = abs((next_holiday - today).days)
    if today_flag == False: return f'{{"text": "󰧒 {diff}", "tooltip": "Next Holiday ({name}) in: {diff} days"}}'

    return f'{{"text": "󰧒 {name}", "tooltip": "Next Holiday in: {diff} days"}}'

if response.status_code == 200:
    data: dict = response.json()
    if mockdata != None: 
        print(get_next_holiday(mockdata, year))
        quit()
    print(get_next_holiday(data, year))
else:
    print(f'Unable to reach api: {response.status_code}')

