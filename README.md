# Loan App
A simple Node.js application for managing loans, repayments

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [API Collection](#api-collection)

## Features

- User registration and authentication
- Loan creation and approval
- Repayment management
- API for retrieving user loans

## Prerequisites

- Node.js (v18+)
- MySQL (v5.7)
- Docker

## Installation

1. Clone the repository:
```bash
   git clone https://github.com/aeon-ns/LoanApp.git
   cd LoanApp
```

2. Install dependencies:
```bash
    npm install
```

3. Start application services (mysql)
```bash
   docker-compose up 
```

2. Setup DB (Migrations & Seeding):
```bash
    npm run setup
```

## Usage

To start Application Server
```bash
    npm start
```

## Testing
```bash
    npm run test
```

## API Collection

`
https://api.postman.com/collections/1550847-109d0796-bc9b-4ca6-adee-601ac6de1697?access_key=PMAT-01HHKY8NN56TBZ7RJRM2EYAPG3
`