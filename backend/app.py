from flask import Flask, jsonify
from flask_cors import CORS
import random
import time

app = Flask(__name__)
CORS(app)

# Simulated bus routes with initial locations
buses = {
    "Bus 101": [[28.6139, 77.2090], [28.6200, 77.2150], [28.6250, 77.2200]],  # Route 1
    "Bus 202": [[28.5355, 77.3910], [28.5400, 77.4000], [28.5500, 77.4100]],  # Route 2
    "Bus 303": [[28.7041, 77.1025], [28.7100, 77.1100], [28.7150, 77.1200]],  # Route 3
}

bus_positions = {bus: buses[bus][0] for bus in buses}  # Start from first point

@app.route('/buses', methods=['GET'])
def get_bus_locations():
    global bus_positions

    # Move each bus along its route randomly
    for bus, route in buses.items():
        current_index = route.index(bus_positions[bus])
        next_index = (current_index + 1) % len(route)  # Loop back after last stop
        bus_positions[bus] = route[next_index]

    return jsonify(bus_positions)

if __name__ == '__main__':
    app.run(debug=True)
