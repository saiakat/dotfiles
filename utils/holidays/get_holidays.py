import requests
from datetime import date 
from dotenv import load_dotenv
from os import getenv
from pathlib import Path

home = str(Path.home())
load_dotenv(dotenv_path=home + '/dotfiles/utils/.env')
state = getenv('STATE')
today = date.today()

mockdata = None

# mockdata = { 'feiertage': [{'date': '2027-04-29', 'fname': 'test'}, {'date': '2027-05-02', 'fname': 'test'}]}

def get_response(year):
    return requests.get(f'https://get.api-feiertage.de/?years={year}&states={state}')
    

def get_next_holiday(raw: dict, year: int, today_flag: bool, idx = 0, name = '', name_today = '') -> str:
    data: list[dict] = raw['feiertage']
    next_holiday: date = date(2,2,2)

    for entry in data:
        holiday = date.strptime(entry['date'], "%Y-%m-%d")
        if holiday == today: 
            name_today = entry["fname"]
            today_flag = True
        elif holiday > today:
            name = entry["fname"]
            next_holiday = holiday
            break

    if name == '':
        year += 1
        return get_next_holiday(get_response(year).json(), year, today_flag, idx, name, name_today)
    diff = abs((next_holiday - today).days)
    if today_flag == False: return f'{{"text": "󰧒 {diff}", "tooltip": "Next Holiday ({name}) in: {diff} days"}}'

    return f'{{"text": "󰧒 {name_today}", "tooltip": "Next Holiday: ({name}) in: {diff} days"}}'

def main():
    year = date.today().year
    response = get_response(year)
    if response.status_code == 200:
        data: dict = response.json()
        if mockdata != None: 
            print(get_next_holiday(mockdata, year, False))
            quit()
        print(get_next_holiday(data, year, False))
    else:
        print(f'Unable to reach api: {response.status_code}')
        
if __name__ == "__main__":
    main()

