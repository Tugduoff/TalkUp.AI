# syntax=docker/dockerfile:1.4
FROM python:3.10-slim

RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
	   build-essential \
	   pkg-config \
	   libasound2-dev \
	   libsndfile1 \
	   ffmpeg \
	&& rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt /app/requirements.txt

RUN --mount=type=cache,target=/root/.cache/pip \
	pip install --no-cache-dir torch==2.0.0 torchaudio==2.0.1 -f https://download.pytorch.org/whl/cpu/torch_stable.html && \
	pip install --no-cache-dir --prefer-binary -r /app/requirements.txt
COPY . /app

CMD ["python", "main.py"]
