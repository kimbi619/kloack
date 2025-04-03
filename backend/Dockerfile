FROM python:3.10.12-slim-bullseye

WORKDIR /app

ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends gcc


COPY requirements/ requirements/

RUN pip install --no-cache-dir -r requirements/local_requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "run.py", "runserver", "0.0.0.0:8000"]
