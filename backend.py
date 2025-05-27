# backend.py

# Enhanced backend.py functions

@app.route("/api/save-event", methods=["POST"])
def save_event():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        required_fields = ["title", "date", "type", "host"]
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400
            
        data["timestamp"] = datetime.datetime.now().isoformat()
        data["id"] = len(events) + 1
        events.append(data)
        
        return jsonify({
            "message": "Event saved successfully", 
            "event_id": data["id"],
            "event": data
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/clone-event", methods=["POST"])
def clone_event():
    try:
        data = request.json
        event_id = data.get("event_id")
        new_title = data.get("new_title")
        new_date = data.get("new_date")
        
        if not all([event_id, new_title, new_date]):
            return jsonify({"error": "Missing required fields"}), 400
            
        event_id = int(event_id)
        if not (1 <= event_id <= len(events)):
            return jsonify({"error": "Invalid event ID"}), 400
            
        original = events[event_id - 1].copy()
        original["title"] = new_title
        original["date"] = new_date
        original["id"] = len(events) + 1
        original["timestamp"] = datetime.datetime.now().isoformat()
        original["cloned_from"] = event_id
        
        events.append(original)
        return jsonify({"message": "Event cloned successfully", "event": original})
        
    except ValueError:
        return jsonify({"error": "Invalid event ID format"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500