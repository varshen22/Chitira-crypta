# Chitira-Crypta

A Python steganography tool that hides AES-256-GCM encrypted data inside PNG images using LSB (Least Significant Bit) encoding.

## How It Works

`
plaintext JSON
      │
      ▼
 PBKDF2-HMAC-SHA256 (key derivation from passphrase)
      │
      ▼
 AES-256-GCM encryption
      │
      ▼
 Binary payload: [MAGIC][SALT][NONCE][TAG][LEN][CIPHERTEXT]
      │
      ▼
 LSB embedding into R,G,B channels of cover image
      │
      ▼
 Lossless PNG output (visually identical to original)
`

## Features

- **AES-256-GCM** — authenticated encryption (detects tampering)
- **PBKDF2-HMAC-SHA256** — secure key derivation (600,000 iterations)
- **LSB steganography** — hides data in the last bit of each pixel channel
- **PNG-only output** — enforces lossless format to protect embedded bits
- **Capacity check** — raises an error if the image is too small

## Installation

`ash
pip install -r requirements.txt
`

## Usage

### As a Python module

`python
from stego_encode import encode_data_to_image
import json

data = json.dumps({"message": "secret payload"})

encode_data_to_image(
    input_image_path="cover.png",
    data_text=data,
    passphrase="your-strong-passphrase",
    output_image_path="output_stego.png"
)
`

### As a CLI tool

`ash
python stego_encode.py cover.png output_stego.png "your-passphrase" --text '{"key": "value"}'
`

## Payload Binary Layout

| Offset | Size | Field |
|--------|------|-------|
| 0 | 4 B | Magic header (STEG) |
| 4 | 16 B | PBKDF2 Salt |
| 20 | 12 B | AES-GCM Nonce |
| 32 | 16 B | AES-GCM Auth Tag |
| 48 | 4 B | Ciphertext length (uint32 big-endian) |
| 52 | N B | Ciphertext |

## Security Notes

- Always send the **passphrase via a separate channel** from the image
- Never re-save the stego image as JPEG — lossy compression destroys the hidden bits
- Output images are visually identical to the original (only LSBs are modified)

## Dependencies

| Package | Purpose |
|---------|---------|
| Pillow | Image loading, pixel access, PNG export |
| pycryptodome | AES-256-GCM encryption, PBKDF2, HMAC |

## Project Structure

`
.
├── stego_encode.py     # Encoder — hides encrypted data into an image
├── requirements.txt    # Python dependencies
└── README.md           # This file
`

## License

MIT
