import subprocess
from sys import argv

process = argv[1]
memory: float = 0

result = subprocess.run(['ps', 'aux', '--sort=-%mem'], capture_output=True, text=True)
lines = result.stdout.split('\n')

for line in lines:
    if line == lines[0]:
        print(line.split()[3])
        continue
    if not process in line: continue
    parts = line.split()
    memory += float(parts[3])


print(f'Process: {process} Memory-used: {int(memory)}%')
