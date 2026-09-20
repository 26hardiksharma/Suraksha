import json
import random
import time
from datetime import datetime, timedelta


class TrafficSimulator:
    def __init__(self, api_url='http://localhost:5000/api/traffic'):
        self.api_url = api_url
        self.normal_ips = ['192.168.1.12', '10.0.0.24', '172.16.2.19', '203.0.113.8']
        self.attack_ips = ['198.51.100.42', '203.0.113.77', '192.0.2.14']

    def generate_payload(self, scenario='normal'):
        if scenario == 'sql_injection':
            return {
                'sourceIP': random.choice(self.attack_ips),
                'destinationIP': '10.0.0.5',
                'sourcePort': random.randint(1024, 65535),
                'destinationPort': 80,
                'protocol': 'HTTP',
                'method': 'GET',
                'endpoint': '/search?q=UNION+SELECT+*+FROM+users',
                'payload': "' OR 1=1 --",
                'packetSize': random.randint(900, 1800),
                'timestamp': datetime.utcnow().isoformat() + 'Z',
            }

        if scenario == 'xss':
            return {
                'sourceIP': random.choice(self.attack_ips),
                'destinationIP': '10.0.0.5',
                'sourcePort': random.randint(1024, 65535),
                'destinationPort': 80,
                'protocol': 'HTTP',
                'method': 'POST',
                'endpoint': '/comment',
                'payload': '<script>alert(1)</script>',
                'packetSize': random.randint(700, 1200),
                'timestamp': datetime.utcnow().isoformat() + 'Z',
            }

        if scenario == 'normal':
            return {
                'sourceIP': random.choice(self.normal_ips),
                'destinationIP': '10.0.0.5',
                'sourcePort': random.randint(1024, 65535),
                'destinationPort': 80,
                'protocol': 'HTTP',
                'method': 'GET',
                'endpoint': '/api/products',
                'payload': '{"action":"view"}',
                'packetSize': random.randint(300, 900),
                'timestamp': datetime.utcnow().isoformat() + 'Z',
            }

        return self.generate_payload('normal')

    def send(self, payload):
        try:
            import requests
            response = requests.post(self.api_url, json=payload, timeout=5)
            print(f"[{datetime.utcnow().isoformat()}] Status: {response.status_code} -> {response.text[:150]}")
        except Exception as exc:
            print(f"Simulator error: {exc}")

    def run(self, scenario='normal', count=10, delay=1.0):
        for _ in range(count):
            self.send(self.generate_payload(scenario))
            time.sleep(delay)


if __name__ == '__main__':
    simulator = TrafficSimulator()
    print('Suraksha traffic simulator initialized')
    simulator.run('normal', count=5, delay=1)
