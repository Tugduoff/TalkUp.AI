FROM python:3.10-slim
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
#RUN chmod +x setup_stt.sh
CMD ["python", "main.py"]
