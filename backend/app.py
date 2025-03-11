from flask import Flask, jsonify, request
from flask_cors import CORS # type: ignore
import requests
from dotenv import load_dotenv # type: ignore
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

TOMTOM_API_KEY = os.getenv("TOMTOM_API_KEY")

if not TOMTOM_API_KEY:
    raise ValueError("Missing TomTom API Key. Ensure it's set in the .env file")

@app.route('/route', methods=['GET'])
def get_route():
    start_lat = request.args.get('start_lat')
    start_lng = request.args.get('start_lng')
    end_lat = request.args.get('end_lat')
    end_lng = request.args.get('end_lng')

    if not all([start_lat, start_lng, end_lat, end_lng]):
        return jsonify({"error": "Missing coordinates"}), 400

    # TomTom Routing API URL
    url = f"https://api.tomtom.com/routing/1/calculateRoute/{start_lat},{start_lng}:{end_lat},{end_lng}/json?key={TOMTOM_API_KEY}&routeType=fastest&travelMode=car"

    response = requests.get(url)
    data = response.json()

    if "routes" in data and len(data["routes"]) > 0:
        route_points = [{"lat": p["latitude"], "lng": p["longitude"]} for p in data["routes"][0]["legs"][0]["points"]]
        return jsonify({"route": route_points})

    return jsonify({"error": "No route found"}), 404

if __name__ == '__main__':
    app.run(debug=True)