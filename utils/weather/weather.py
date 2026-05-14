import requests
from sys import exit
from pathlib import Path
from os import getenv
from dotenv import load_dotenv

home = str(Path.home())
load_dotenv(dotenv_path=home + '/dotfiles/utils/.env')
api = getenv('WEATHER_API')
location: str = ''

with open(home + '/dotfiles/utils/config/weather', 'r', encoding='utf-8') as f:
    content = f.read().strip('\n')
    location = content.split('=')[1]

if location == 'no':
    headers = { 'User-Agent': 'Waybar-Weather-Widget-Private' }
    response = requests.get(api, headers=headers)

    def get_temp_speed(data: dict):
        temp = data["data"]["instant"]["details"]["air_temperature"]
        speed = data["data"]["instant"]["details"]["wind_speed"]
        return f'{{"text": "󰖐 {temp}°C  {speed}m/s", "tooltip": "Temperature: {temp}°C\\nWindspeed: {speed}m/s", "ags": {{"temp": {temp}, "speed": {speed}}}}}'
    if response.status_code == 200:
        data: dict = response.json()
        data_today = data['properties']['timeseries'][0]
        print(get_temp_speed(data_today))
        exit()
    else:
        exit()

if location == 'de':
    print('{ "text": "N/A", "tooltip": "Germany not supported yet" }')
    exit()
