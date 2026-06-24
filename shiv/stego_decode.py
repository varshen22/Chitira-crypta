import sys
import struct
from PIL import Image
from Crypto.Cipher import AES
from Crypto.Protocol.KDF import PBKDF2
from Crypto.Hash import SHA256, HMAC

# --- Constants (Must perfectly match Logesh's encoder) ---
MAGIC_BYTES    = b"STEG"
PBKDF2_ITERS   = 600_000
SALT_SIZE      = 16
NONCE_SIZE     = 12
TAG_SIZE       = 16
KEY_SIZE       = 32
LEN_FIELD_SIZE = 4

def _derive_key(passphrase: str, salt: bytes) -> bytes:
    return PBKDF2(
        password=passphrase.encode("utf-8"),
        salt=salt,
        dkLen=KEY_SIZE,
        count=PBKDF2_ITERS,
        prf=lambda p, s: HMAC.new(p, s, SHA256).digest(),
    )

def _bit_generator(image):
    width, height = image.size
    pixels = image.load()
    for y in range(height):
        for x in range(width):
            r, g, b = pixels[x, y]
            yield r & 1
            yield g & 1
            yield b & 1

def _read_bytes(bit_gen, num_bytes: int) -> bytes:
    out = bytearray(num_bytes)
    for i in range(num_bytes):
        val = 0
        for _ in range(8):
            val = (val << 1) | next(bit_gen)
        out[i] = val
    return bytes(out)

def decode_data_from_image(input_image_path: str, passphrase: str) -> str:
    try:
        image = Image.open(input_image_path).convert("RGB")
    except Exception as e:
        raise IOError(f"Could not load image '{input_image_path}': {e}")

    bit_gen = _bit_generator(image)

    try:
        magic = _read_bytes(bit_gen, 4)
        if magic != MAGIC_BYTES:
            raise ValueError("No valid steganography payload found! (Missing 'STEG' header)")

        salt  = _read_bytes(bit_gen, SALT_SIZE)
        nonce = _read_bytes(bit_gen, NONCE_SIZE)
        tag   = _read_bytes(bit_gen, TAG_SIZE)
        
        len_bytes = _read_bytes(bit_gen, LEN_FIELD_SIZE)
        ciphertext_len = struct.unpack(">I", len_bytes)[0]
        ciphertext = _read_bytes(bit_gen, ciphertext_len)

    except StopIteration:
        raise ValueError("Reached end of image pixels before payload was fully read. Image is corrupted.")

    try:
        key = _derive_key(passphrase, salt)
        cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
        plaintext = cipher.decrypt_and_verify(ciphertext, tag)
        return plaintext.decode("utf-8")
    except ValueError:
        raise ValueError("Decryption failed! Incorrect passphrase or corrupted image data.")