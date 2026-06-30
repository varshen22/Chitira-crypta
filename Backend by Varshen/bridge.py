import sys
import os
import json
import traceback

# Add parent directories to Python path so we can import from logesh and shiv
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'logesh')))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'shiv')))

from stego_encode import encode_data_to_image
from stego_decode import decode_data_from_image

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Missing command"}))
        sys.exit(1)

    command = sys.argv[1]

    try:
        if command == "encode":
            if len(sys.argv) != 6:
                print(json.dumps({"error": "Invalid arguments for encode"}))
                sys.exit(1)
            
            input_image = sys.argv[2]
            text = sys.argv[3]
            passphrase = sys.argv[4]
            output_image = sys.argv[5]

            encode_data_to_image(input_image, text, passphrase, output_image)
            print(json.dumps({"success": True}))
            
        elif command == "decode":
            if len(sys.argv) != 4:
                print(json.dumps({"error": "Invalid arguments for decode"}))
                sys.exit(1)
            
            input_image = sys.argv[2]
            passphrase = sys.argv[3]

            extracted_text = decode_data_from_image(input_image, passphrase)
            print(json.dumps({"success": True, "data": extracted_text}))
            
        else:
            print(json.dumps({"error": f"Unknown command: {command}"}))
            sys.exit(1)

    except Exception as e:
        print(json.dumps({"error": str(e), "trace": traceback.format_exc()}))
        sys.exit(1)

if __name__ == "__main__":
    main()
