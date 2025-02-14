const { useState } = React;
const { createRoot } = ReactDOM;

// Initialize PDF.js worker
const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

function TaxSummaryApp() {
    const [file, setFile] = useState(null);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileUpload = (event) => {
        const uploadedFile = event.target.files[0];
        setFile(uploadedFile);
    };

    const analyzeTaxReturn = async () => {
        if (!file) return;

        setLoading(true);
        try {
            const fileReader = new FileReader();
            fileReader.onload = async function() {
                const pdfData = new Uint8Array(this.result);
                
                try {
                    // Use pdf.js to extract text
                    const loadingTask = pdfjsLib.getDocument({data: pdfData});
                    const pdf = await loadingTask.promise;
                    
                    let fullText = '';
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        const pageText = textContent.items.map(item => item.str).join(' ');
                        fullText += pageText + '\n';
                    }

                    console.log('Extracted text:', fullText); // Debug log

                    // Using allorigins as a CORS proxy
                    const proxyUrl = 'https://api.allorigins.win/raw?url=';
                    const targetUrl = encodeURIComponent('https://api.anthropic.com/v1/messages');
                    
                    const response = await fetch(`${proxyUrl}${targetUrl}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': CONFIG.CLAUDE_API_KEY,
                            'anthropic-version': '2023-06-01'
                        },
                        body: JSON.stringify({
                            model: 'claude-3-sonnet-20240229',
                            max_tokens: 1024,
                            messages: [{
                                role: 'user',
                                content: `Please analyze this tax return and provide a 2-3 paragraph summary. 
                                        Focus on adjusted gross income, total tax paid (state and federal), 
                                        and compare to previous year if available. Use positive language when 
                                        describing changes. Here's the tax return text: ${fullText}`
                            }]
                        })
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const result = await response.json();
                    console.log('API response:', result);
                    setSummary(result.content[0].text);
                } catch (error) {
                    console.error('Error:', error);
                    setSummary('Error analyzing tax return: ' + error.message);
                }
            };
            
            fileReader.readAsArrayBuffer(file);
        } catch (error) {
            console.error('Error:', error);
            setSummary('Error analyzing tax return. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1>Tax Return Summary</h1>
            <div className="upload-area">
                <input 
                    type="file" 
                    accept=".pdf" 
                    onChange={handleFileUpload}
                    style={{marginBottom: '1rem'}}
                />
                <br />
                <button 
                    className="button" 
                    onClick={analyzeTaxReturn}
                    disabled={!file || loading}
                >
                    Analyze Tax Return
                </button>
            </div>

            {loading && (
                <div className="loading">
                    Analyzing your tax return...
                </div>
            )}

            {summary && (
                <div className="summary">
                    <h2>Summary</h2>
                    <p>{summary}</p>
                </div>
            )}
        </div>
    );
}

// Update to use createRoot instead of ReactDOM.render
const root = createRoot(document.getElementById('root'));
root.render(<TaxSummaryApp />); 