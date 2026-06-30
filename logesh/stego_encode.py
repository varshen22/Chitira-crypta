import os
import struct
from PIL import Image
from Crypto.Cipher import AES
from Crypto.Protocol.KDF import scrypt
from Crypto.Random import get_random_bytes

# --- Constants ---
MAGIC_BYTES    = b"STEG"   # 4-byte sentinel for decoder validation
SCRYPT_N       = 131072    # CPU/Memory cost factor
SCRYPT_R       = 8         # Block size
SCRYPT_P       = 1         # Parallelization factor
SALT_SIZE      = 16        # bytes
NONCE_SIZE     = 12        # bytes (standard GCM nonce)
TAG_SIZE       = 16        # bytes (GCM authentication tag)
KEY_SIZE       = 32        # bytes (256-bit AES key)
LEN_FIELD_SIZE = 4         # bytes (uint32, big-endian)


def _derive_key(passphrase: str, salt: bytes) -> bytes:
    """Derive a 256-bit AES key from passphrase using scrypt for higher security."""
    return scrypt(
        passphrase,
        salt,
        key_len=KEY_SIZE,
        N=SCRYPT_N,
        r=SCRYPT_R,
        p=SCRYPT_P
    )


def _encrypt(data_text: str, passphrase: str) -> bytes:
    """
    Encrypt data_text with AES-256-GCM. Returns binary payload:
        MAGIC(4) | SALT(16) | NONCE(12) | TAG(16) | LEN(4) | CIPHERTEXT(N)
    """
    salt  = get_random_bytes(SALT_SIZE)
    nonce = get_random_bytes(NONCE_SIZE)
    key   = _derive_key(passphrase, salt)

    cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
    ciphertext, tag = cipher.encrypt_and_digest(data_text.encode("utf-8"))

    # 4-byte big-endian length so decoder knows exactly how many bytes to read
    length_prefix = struct.pack(">I", len(ciphertext))
    return MAGIC_BYTES + salt + nonce + tag + length_prefix + ciphertext


def _bytes_to_bits(data: bytes):
    """Yield individual bits MSB-first from a byte sequence."""
    for byte in data:
        for shift in range(7, -1, -1):  # bit7 down to bit0
            yield (byte >> shift) & 1   # extract single bit


def _embed_bit_in_channel(channel_value: int, bit: int) -> int:
    """
    Replace the LSB of a pixel channel value with 'bit'.
    0xFE = 11111110 — clears bit-0, then ORs in the new bit.
    """
    return (channel_value & 0xFE) | bit


def encode_data_to_image(
    input_image_path: str,
    data_text: str,
    passphrase: str,
    output_image_path: str,
) -> None:
    """
    Encrypt data_text and embed it into input_image_path via LSB steganography.
    Saves result as lossless PNG. Raises ValueError if image is too small.
    """
    if not output_image_path.lower().endswith(".png"):
        raise IOError(
            f"Output must be a .png file to stay lossless. Got: '{output_image_path}'"
        )

    # Build encrypted binary payload
    payload      = _encrypt(data_text, passphrase)
    payload_bits = list(_bytes_to_bits(payload))
    total_bits   = len(payload_bits)

    # Load image, normalise to RGB, check capacity
    image = Image.open(input_image_path).convert("RGB")
    width, height = image.size
    max_bits = width * height * 3  # 3 channels x 1 bit each

    if total_bits > max_bits:
        required_px = (total_bits + 2) // 3
        raise ValueError(
            f"Image too small.\n"
            f"  Payload : {total_bits} bits ({len(payload)} bytes)\n"
            f"  Capacity: {max_bits} bits ({max_bits // 8} bytes)\n"
            f"  Need at least {required_px} pixels."
        )

    # --- LSB Embedding ---
    pixels    = image.load()  # fast pixel accessor
    bit_index = 0             # position in payload_bits

    for y in range(height):
        for x in range(width):
            if bit_index >= total_bits:
                break  # done — all payload bits written

            r, g, b = pixels[x, y]

            # Plant one payload bit into each channel (R then G then B)
            if bit_index < total_bits:
                r = _embed_bit_in_channel(r, payload_bits[bit_index])
                bit_index += 1
            if bit_index < total_bits:
                g = _embed_bit_in_channel(g, payload_bits[bit_index])
                bit_index += 1
            if bit_index < total_bits:
                b = _embed_bit_in_channel(b, payload_bits[bit_index])
                bit_index += 1

            pixels[x, y] = (r, g, b)

        if bit_index >= total_bits:
            break

    # PNG guarantees lossless round-trips; JPEG would corrupt LSBs
    image.save(output_image_path, format="PNG", optimize=False)

    pct = bit_index / max_bits * 100
    print(f"[OK] Encoded {len(payload)} bytes into '{output_image_path}'")
    print(f"     Capacity used: {pct:.2f}%  ({bit_index}/{max_bits} bits)")


# --- CLI entry-point ---
if __name__ == "__main__":
    import argparse, sys

    parser = argparse.ArgumentParser(
        description="Encode encrypted data into an image via LSB steganography."
    )
    parser.add_argument("input_image",  help="Cover image path")
    parser.add_argument("output_image", help="Output PNG path")
    parser.add_argument("passphrase",   help="Encryption passphrase")
    parser.add_argument("--text", required=True, help="Text/JSON to hide")
    args = parser.parse_args()

    try:
        encode_data_to_image(args.input_image, args.text, args.passphrase, args.output_image)
    except (ValueError, IOError) as exc:
        print(f"[ERROR] {exc}", file=sys.stderr)
        sys.exit(1)
