# Tax Return Summary Generator

A web application that uses AI to generate human-friendly summaries of tax returns. The application analyzes various tax return forms including 1040, 1041, 1120, 1120S, 1065s, and California state returns (100, 100S 565, 568, 540).

## Live Demo
Visit the application at: [YOUR-GITHUB-USERNAME.github.io/tax-summary](https://YOUR-GITHUB-USERNAME.github.io/tax-summary)

## Features

- PDF tax return upload
- AI-powered analysis using Claude API
- Focuses on key metrics:
  - Adjusted Gross Income
  - Total Tax Paid (State and Federal)
  - Year-over-year comparisons
- Positive language in summaries

## Usage

1. Visit the application URL
2. Enter your Claude API key when prompted
3. Upload your tax return PDF
4. Click "Analyze Tax Return"
5. View your AI-generated summary

## Security Notes

- Your API key is never stored
- Tax return data is processed in your browser
- No data is stored on any server

## Technical Stack

- HTML5
- CSS3
- React.js
- PDF.js
- Claude API

## Local Development

1. Clone this repository
2. Copy config.example.js to config.js
3. Open index.html in your browser
4. Enter your Claude API key when prompted (it will be stored in your browser)

## License

[MIT License](LICENSE) 