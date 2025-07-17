FROM python:3.10-slim
WORKDIR /app
RUN apt-get update && apt-get install -y libportaudio2
COPY . .
RUN pip install -r requirements.txt
#RUN chmod +x setup_stt.sh #Currently not needed, but can be used if you have the language model folder
CMD ["python", "main.py"]
