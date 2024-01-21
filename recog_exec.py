import matplotlib.pyplot as plt
import numpy as np
from ultralytics import YOLO
import cv2
import sys
import easyocr
import base64

with open("./server/uploads/image_base64.txt", "r") as f:
    im_b64 = f.read()
im_bytes = base64.b64decode(im_b64)
im_arr = np.frombuffer(im_bytes, dtype=np.uint8)  # im_arr is one-dim Numpy array
img = cv2.imdecode(im_arr, flags=cv2.IMREAD_COLOR)
lpd = YOLO('best.pt')
license_plates = lpd(img)[0]
for license_plate in license_plates.boxes.data.tolist():
    x1, y1, x2, y2, score, class_id = license_plate
    license_plate_crop = img[int(y1):int(y2), int(x1): int(x2), :]

reader = easyocr.Reader(['en'], gpu=False)
result = reader.readtext(license_plate_crop)
print(result[0][1])

