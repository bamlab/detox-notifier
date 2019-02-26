# Detox Notifier

This project goal is to send notifications via pushbullet whenever a detox test fails on the detox CI. It'll run on the same server that run the CI.

## Prerequisites

* docker

## Installation

* `docker-compose up`

## Usage

At the end of every batch of detox test, POST your results on the following endpoint `localhost:6767/api/results/<project_name>` with the following format
```
[
    {
        "name": "Test 1",
        "fail": false
    },
    {
        "name": "Test 2",
        "fail": false
    },
    {
        "name": "Test 3",
        "fail": true
    }
]
```

## Disclaimer

This project is a work in progress and could go through heavy changes in the next weeks.
